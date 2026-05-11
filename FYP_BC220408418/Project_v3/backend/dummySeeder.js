import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';
import Material from './models/Material.js';
import Customer from './models/Customer.js';
import Order from './models/Order.js';
import Invoice from './models/Invoice.js';

dotenv.config();
connectDB();

const importDummyData = async () => {
  try {
    // Clear all existing data to prevent duplicates
    await User.deleteMany();
    await Material.deleteMany();
    await Customer.deleteMany();
    await Order.deleteMany();
    await Invoice.deleteMany();

    // 1. Create Admin
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@woodcraft.com',
      password: 'password123',
      role: 'admin',
      hourlyRate: 0,
    });

    // 2. Create Employees
    const emp1 = await User.create({
      name: 'Ahmed Raza',
      email: 'ahmed@woodcraft.com',
      password: 'password123',
      role: 'employee',
      hourlyRate: 500,
    });
    
    const emp2 = await User.create({
      name: 'Usman Tariq',
      email: 'usman@woodcraft.com',
      password: 'password123',
      role: 'employee',
      hourlyRate: 450,
    });

    // 3. Create Materials
    const wood = await Material.create({
      name: 'Sheesham Wood Boards',
      category: 'Wood',
      quantity: 150,
      unit: 'sq ft',
      pricePerUnit: 1200,
      supplierName: 'Punjab Timber Market',
      supplierContact: '03001112222'
    });

    const screws = await Material.create({
      name: 'Steel Screws 2-inch',
      category: 'Hardware',
      quantity: 5000,
      unit: 'pieces',
      pricePerUnit: 5,
      supplierName: 'Lahore Hardware & Tools',
      supplierContact: '03003334444'
    });

    const varnish = await Material.create({
      name: 'Master Clear Varnish',
      category: 'Finish',
      quantity: 20,
      unit: 'liters',
      pricePerUnit: 2500,
      supplierName: 'Master Paints Supply',
      supplierContact: '03005556666'
    });

    // 4. Create Customers
    const customer1 = await Customer.create({
      name: 'Babar Azam',
      email: 'babar@example.com',
      phone: '03001234567',
      address: 'Gulberg III, Lahore'
    });

    // 5. Create an Order
    const order1 = await Order.create({
      customer: customer1._id,
      type: 'Furniture',
      status: 'Pending',
      materials: [
        { materialId: wood._id, quantity: 20 },
        { materialId: screws._id, quantity: 100 }
      ],
      employees: [
        { employeeId: emp1._id, hoursWorked: 0, hourlyRate: emp1.hourlyRate }
      ],
      totalCost: (20 * 1200) + (100 * 5),
      materialsCost: (20 * 1200) + (100 * 5),
      laborCost: 0
    });

    console.log('Dummy Data Imported Successfully! 🎉');
    console.log(`Admin Login -> Email: admin@woodcraft.com | Password: password123`);
    console.log(`Employee Login -> Email: ahmed@woodcraft.com | Password: password123`);
    process.exit();
  } catch (error) {
    console.error(`Error with dummy data import: ${error.message}`);
    process.exit(1);
  }
};

importDummyData();
