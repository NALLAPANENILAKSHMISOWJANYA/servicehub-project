import express from 'express';
import { verifyFirebaseOTP, getUserProfile, vendorLogin, vendorSignup, getAllUsers } from '../controllers/authController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/verify', verifyFirebaseOTP);
router.get('/profile', protect, getUserProfile);
router.post('/vendor/login', vendorLogin);
router.post('/vendor/signup', vendorSignup);
router.get('/users', protect, admin, getAllUsers);

export default router;
