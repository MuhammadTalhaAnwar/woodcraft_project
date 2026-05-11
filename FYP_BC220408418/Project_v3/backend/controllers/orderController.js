import Order from '../models/Order.js';
import Material from '../models/Material.js';
import Invoice from '../models/Invoice.js';
import User from '../models/User.js';

// get all orders with customer, material and employee details filled in
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('customer', 'name phone')
      .populate('materials.materialId', 'name unit')
      .populate('employees.employeeId', 'name');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// create a new order, deduct materials from stock, and calculate total cost
const createOrder = async (req, res) => {
  const { customer, type, materials, employees } = req.body;

  try {
    let materialsCost = 0;
    let laborCost = 0;

    if (!Array.isArray(materials) || materials.length === 0) {
      return res.status(400).json({ message: 'Materials are required' });
    }

    if (!Array.isArray(employees) || employees.length === 0) {
      return res.status(400).json({ message: 'Employees are required' });
    }

    const sanitizedMaterials = [];
    const materialDocs = await Material.find({
      _id: { $in: materials.map((item) => item.materialId) }
    });
    const materialMap = new Map(materialDocs.map((mat) => [mat._id.toString(), mat]));

    // loop through each material, check stock, deduct quantity, and add to cost
    for (const item of materials) {
      const material = materialMap.get(String(item.materialId));
      if (!material) {
        return res.status(400).json({ message: 'Invalid material selected' });
      }
      if (item.quantity <= 0) {
        return res.status(400).json({ message: 'Material quantity must be greater than zero' });
      }
      if (material.quantity < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${material.name}` });
      }
      materialsCost += material.pricePerUnit * item.quantity;
      sanitizedMaterials.push({ materialId: material._id, quantity: item.quantity });
    }

    const sanitizedEmployees = [];
    const employeeDocs = await User.find({
      _id: { $in: employees.map((emp) => emp.employeeId) },
      role: 'employee'
    });
    const employeeMap = new Map(employeeDocs.map((emp) => [emp._id.toString(), emp]));

    // labor cost = hours worked × hourly rate for each assigned employee
    for (const emp of employees) {
      const employee = employeeMap.get(String(emp.employeeId));
      if (!employee) {
        return res.status(400).json({ message: 'Invalid employee selected' });
      }
      if (emp.hoursWorked < 0) {
        return res.status(400).json({ message: 'Hours worked must be zero or greater' });
      }
      laborCost += emp.hoursWorked * employee.hourlyRate;
      sanitizedEmployees.push({
        employeeId: employee._id,
        hoursWorked: emp.hoursWorked,
        hourlyRate: employee.hourlyRate
      });
    }

    for (const material of materialMap.values()) {
      const item = materials.find((m) => String(m.materialId) === material._id.toString());
      material.quantity -= item.quantity;
      await material.save();
    }

    const totalCost = materialsCost + laborCost;

    const order = new Order({
      customer,
      type,
      materials: sanitizedMaterials,
      employees: sanitizedEmployees,
      materialsCost,
      laborCost,
      totalCost,
      status: 'Pending'
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// update the status of an order; if marked Completed, auto-generate invoice
const updateOrderStatus = async (req, res) => {
  const { status } = req.body;

  try {
    const allowedStatuses = ['Pending', 'In Progress', 'Completed', 'Delivered', 'Cancelled'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const order = await Order.findById(req.params.id);

    if (order) {
      const isAdmin = req.user?.role === 'admin';
      const isAssignedEmployee = order.employees.some((e) => e.employeeId.toString() === req.user?._id.toString());
      if (!isAdmin && !isAssignedEmployee) {
        return res.status(403).json({ message: 'Not authorized to update this order' });
      }

      if (status === 'Cancelled' && order.status !== 'Cancelled') {
        for (const item of order.materials) {
          const material = await Material.findById(item.materialId);
          if (material) {
            material.quantity += item.quantity;
            await material.save();
          }
        }
      }

      order.status = status;
      const updatedOrder = await order.save();

      // when an order is completed, create an invoice if one doesn't already exist
      if (status === 'Completed') {
        const invoiceExists = await Invoice.findOne({ order: order._id });
        if (!invoiceExists) {
          await Invoice.create({
            order: order._id,
            customer: order.customer,
            totalAmount: order.totalCost,
            paidAmount: 0,
            status: 'Unpaid'
          });
        }
      }

      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getOrders, createOrder, updateOrderStatus };
