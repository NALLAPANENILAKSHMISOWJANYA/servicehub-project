import mongoose from 'mongoose';
import dotenv from 'dotenv';
import servicesData from './data/services.js';
import User from './models/User.js';
import Service from './models/Service.js';
import Booking from './models/Booking.js';
import connectDB from './config/db.js';

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await Booking.deleteMany();
    await Service.deleteMany();
    await User.deleteMany();

    const adminVendor = await User.create({
      name: 'Admin Vendor',
      email: 'vendor@test.com',
      phone: '1111111111',
      password: 'password123',
      role: 'vendor',
      serviceCategory: 'Cleaning',
      address: '123 Vendor Street'
    });

    // Create Test Customer
    await User.create({
      name: 'Test Customer',
      phone: '2222222222',
      firebaseUid: 'test_customer_123',
      role: 'customer'
    });

    // Create Test Admin
    await User.create({
      name: 'System Admin',
      email: 'admin@servicehub.com',
      phone: '9999999999',
      password: 'adminpassword',
      role: 'admin'
    });

    const users = await User.find({});
    const vendorId = users.find(u => u.role === 'vendor')._id;

    const sampleServices = servicesData.map((service) => {
      return { ...service, vendorId: vendorId };
    });

    const insertedServices = await Service.insertMany(sampleServices);
    const customerId = users.find(u => u.role === 'customer')._id;

    // Create Sample Bookings for Test Customer
    await Booking.create([
      {
        customerId,
        vendorId,
        serviceId: insertedServices[0]._id,
        bookingDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        status: 'Completed',
        totalAmount: insertedServices[0].price,
        address: '456 Customer Ave, Tech City',
      },
      {
        customerId,
        vendorId,
        serviceId: insertedServices[1]._id,
        bookingDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        status: 'Accepted',
        totalAmount: insertedServices[1].price,
        address: '456 Customer Ave, Tech City',
      }
    ]);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  // destroyData();
} else {
  importData();
}
