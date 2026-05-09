import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Auth user & get token (Login or Signup via Firebase OTP)
// @route   POST /api/auth/verify
// @access  Public
export const verifyFirebaseOTP = async (req, res) => {
  const { firebaseUid, phone, name, role } = req.body;

  try {
    let user = await User.findOne({ phone });

    if (user) {
      // Update firebaseUid if it changed (e.g., from seeder/mock to real)
      if (user.firebaseUid !== firebaseUid) {
        user.firebaseUid = firebaseUid;
        await user.save();
      }
    } else {
      // Create new user if not found
      user = await User.create({
        firebaseUid,
        phone,
        name: name || 'New User',
        role: role || 'customer'
      });
    }

    res.json({
      _id: user._id,
      name: user.name,
      phone: user.phone,
      role: user.role,
      firebaseUid: user.firebaseUid,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Register a new vendor
// @route   POST /api/auth/vendor/signup
// @access  Public
export const vendorSignup = async (req, res) => {
  const { name, email, phone, password, serviceCategory, address } = req.body;

  try {
    const userExists = await User.findOne({ $or: [{ email }, { phone }] });

    if (userExists) {
      return res.status(400).json({ message: 'Vendor already exists with this email or phone' });
    }

    const user = await User.create({
      name,
      email,
      phone,
      password,
      serviceCategory,
      address,
      role: 'vendor',
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        serviceCategory: user.serviceCategory,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid vendor data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth vendor & get token
// @route   POST /api/auth/vendor/login
// @access  Public
export const vendorLogin = async (req, res) => {
  const { emailOrPhone, password } = req.body;

  try {
    const user = await User.findOne({ 
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
      role: { $in: ['vendor', 'admin'] }
    });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        serviceCategory: user.serviceCategory,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials or not a vendor' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users (Admin only)
// @route   GET /api/auth/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
