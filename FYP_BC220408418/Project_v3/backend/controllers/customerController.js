import Customer from '../models/Customer.js';

// get all customers from the database
const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find({});
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// add a new customer record
const createCustomer = async (req, res) => {
  const { name, phone, address } = req.body;

  try {
    const customer = new Customer({
      name,
      phone,
      address,
    });

    const createdCustomer = await customer.save();
    res.status(201).json(createdCustomer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// update an existing customer's details
const updateCustomer = async (req, res) => {
  const { name, phone, address } = req.body;

  try {
    const customer = await Customer.findById(req.params.id);

    if (customer) {
      customer.name = name || customer.name;
      customer.phone = phone || customer.phone;
      customer.address = address || customer.address;

      const updatedCustomer = await customer.save();
      res.json(updatedCustomer);
    } else {
      res.status(404).json({ message: 'Customer not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// delete a customer by their id
const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (customer) {
      await customer.deleteOne();
      res.json({ message: 'Customer removed' });
    } else {
      res.status(404).json({ message: 'Customer not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getCustomers, createCustomer, updateCustomer, deleteCustomer };
