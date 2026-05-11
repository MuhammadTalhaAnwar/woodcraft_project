import Order from '../models/Order.js';
import Material from '../models/Material.js';
import Invoice from '../models/Invoice.js';
import User from '../models/User.js';

// gathers all the data needed for the admin dashboard charts and stats
const getAnalytics = async (req, res) => {
  try {
    // revenue = total payments collected; expenses = total materials + labor costs
    const invoices = await Invoice.find({});
    const totalRevenue = invoices.reduce((acc, curr) => acc + curr.paidAmount, 0);

    const orders = await Order.find({});
    const totalExpenses = orders.reduce((acc, curr) => acc + curr.materialsCost + curr.laborCost, 0);

    // count how much of each material was used across all orders
    const materialsUsage = {};
    orders.forEach(order => {
      order.materials.forEach(item => {
        if (!materialsUsage[item.materialId]) {
          materialsUsage[item.materialId] = 0;
        }
        materialsUsage[item.materialId] += item.quantity;
      });
    });

    // map material IDs back to their names for the chart
    const materialDocs = await Material.find({});
    const mostUsedMaterials = Object.keys(materialsUsage).map(id => {
      const mat = materialDocs.find(m => m._id.toString() === id);
      return {
        name: mat ? mat.name : 'Unknown',
        quantityUsed: materialsUsage[id]
      };
    }).sort((a, b) => b.quantityUsed - a.quantityUsed).slice(0, 5);

    // count how many completed/delivered jobs each employee was part of
    const employeeDocs = await User.find({ role: 'employee' });
    const employeeProductivity = employeeDocs.map(emp => {
      let jobsCompleted = 0;
      orders.forEach(order => {
        if (order.status === 'Completed' || order.status === 'Delivered') {
          const isAssigned = order.employees.some(e => e.employeeId.toString() === emp._id.toString());
          if (isAssigned) jobsCompleted++;
        }
      });
      return {
        name: emp.name,
        jobsCompleted
      };
    });

    // calculate average completion time (in days)
    const completedOrders = orders.filter(o => o.status === 'Completed' || o.status === 'Delivered');
    let avgCompletionDays = 0;
    if (completedOrders.length > 0) {
      const totalTimeMs = completedOrders.reduce((acc, curr) => {
        return acc + (new Date(curr.updatedAt) - new Date(curr.createdAt));
      }, 0);
      // convert ms to days and round to 1 decimal
      avgCompletionDays = (totalTimeMs / completedOrders.length) / (1000 * 60 * 60 * 24);
      avgCompletionDays = Math.round(avgCompletionDays * 10) / 10;
    }

    res.json({
      revenueVsExpenses: [
        { name: 'Revenue', amount: totalRevenue },
        { name: 'Expenses', amount: totalExpenses }
      ],
      mostUsedMaterials,
      employeeProductivity,
      totalOrders: orders.length,
      pendingOrders: orders.filter(o => o.status === 'Pending').length,
      avgCompletionDays,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getAnalytics };
