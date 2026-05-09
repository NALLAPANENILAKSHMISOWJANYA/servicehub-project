import Booking from '../models/Booking.js';
import Service from '../models/Service.js';

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
export const createBooking = async (req, res) => {
  try {
    const { serviceId, bookingDate, address } = req.body;

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    const booking = new Booking({
      customerId: req.user._id,
      vendorId: service.vendorId,
      serviceId,
      bookingDate,
      totalAmount: service.price,
      address,
    });

    const createdBooking = await booking.save();
    res.status(201).json(createdBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get customer bookings
// @route   GET /api/bookings/mybookings
// @access  Private
export const getCustomerBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ customerId: req.user._id }).populate('serviceId', 'title image').populate('vendorId', 'name phone');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get vendor bookings
// @route   GET /api/bookings/vendor
// @access  Private/Vendor
export const getVendorBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ vendorId: req.user._id }).populate('serviceId', 'title image').populate('customerId', 'name phone');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private/Vendor
export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (booking) {
      // check if user is the vendor
      if (booking.vendorId.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized to update this booking' });
      }

      booking.status = status;
      const updatedBooking = await booking.save();
      res.json(updatedBooking);
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
