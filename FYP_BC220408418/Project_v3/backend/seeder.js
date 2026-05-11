import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';

dotenv.config();
connectDB();

const importData = async () => {
  try {
    await User.deleteMany(); // Clear existing users

    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@woodcraft.com',
      password: 'password123',
      role: 'admin',
      hourlyRate: 0,
    });

    await adminUser.save();

    console.log('Data Imported - Admin user created!');
    process.exit();
  } catch (error) {
    console.error(`Error with data import: ${error.message}`);
    process.exit(1);
  }
};

importData();
