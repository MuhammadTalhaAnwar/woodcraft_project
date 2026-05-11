import User from '../models/User.js';
import Order from '../models/Order.js';

// get list of all employees (excludes password field)
const getEmployees = async (req, res) => {
  try {
    const employees = await User.find({ role: 'employee' }).select('-password');
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// register a new employee account (admin only)
const registerEmployee = async (req, res) => {
  const { name, email, password, hourlyRate } = req.body;

  try {
    // check if email is already taken
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: 'employee',
      hourlyRate: hourlyRate || 0,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        hourlyRate: user.hourlyRate
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// returns all orders assigned to the logged-in employee
const getMyTasks = async (req, res) => {
  try {
    const orders = await Order.find({ 'employees.employeeId': req.user._id })
      .populate('customer', 'name phone address');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// delete an employee account
const deleteEmployee = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user && user.role === 'employee') {
      await user.deleteOne();
      res.json({ message: 'Employee removed successfully' });
    } else {
      res.status(404).json({ message: 'Employee not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getEmployees, registerEmployee, getMyTasks, deleteEmployee };
