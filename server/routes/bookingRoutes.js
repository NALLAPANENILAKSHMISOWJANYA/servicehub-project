import express from 'express';
import { createBooking, getCustomerBookings, getVendorBookings, updateBookingStatus } from '../controllers/bookingController.js';
import { protect, vendor } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, createBooking);
router.route('/mybookings').get(protect, getCustomerBookings);
router.route('/vendor').get(protect, vendor, getVendorBookings);
router.route('/:id/status').put(protect, vendor, updateBookingStatus);

export default router;
