import express from 'express';
import User from '../models/User.js';
import Service from '../models/Service.js';
import Booking from '../models/Booking.js';
import servicesData from '../data/services.js';

const router = express.Router();

// One-time seed route — protected by a secret key
// Call: GET /api/seed?secret=SEED_SECRET_2024
router.get('/', async (req, res) => {
  const { secret } = req.query;
  const SEED_SECRET = process.env.SEED_SECRET || 'SEED_SECRET_2024';

  if (secret !== SEED_SECRET) {
    return res.status(403).json({ message: 'Forbidden: invalid seed secret' });
  }

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
      address: '123 Vendor Street',
    });

    await User.create({
      name: 'Test Customer',
      phone: '2222222222',
      firebaseUid: 'test_customer_123',
      role: 'customer',
    });

    await User.create({
      name: 'System Admin',
      email: 'admin@servicehub.com',
      phone: '9999999999',
      password: 'adminpassword',
      role: 'admin',
    });

    const sampleServices = servicesData.map((service) => ({
      ...service,
      vendorId: adminVendor._id,
    }));

    const insertedServices = await Service.insertMany(sampleServices);

    const customer = await User.findOne({ role: 'customer' });

    await Booking.create([
      {
        customerId: customer._id,
        vendorId: adminVendor._id,
        serviceId: insertedServices[0]._id,
        bookingDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        status: 'Completed',
        totalAmount: insertedServices[0].price,
        address: '456 Customer Ave, Tech City',
      },
      {
        customerId: customer._id,
        vendorId: adminVendor._id,
        serviceId: insertedServices[1]._id,
        bookingDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        status: 'Accepted',
        totalAmount: insertedServices[1].price,
        address: '456 Customer Ave, Tech City',
      },
    ]);

    res.json({
      message: '✅ Database seeded successfully!',
      credentials: {
        vendor: { email: 'vendor@test.com', password: 'password123' },
        admin: { email: 'admin@servicehub.com', password: 'adminpassword' },
      },
    });
  } catch (error) {
    res.status(500).json({ message: `Seeding failed: ${error.message}` });
  }
});

export default router;
