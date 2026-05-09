import express from 'express';
import { getServices, getServiceById, createService, getVendorServices } from '../controllers/serviceController.js';
import { protect, adminOrVendor } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getServices).post(protect, adminOrVendor, createService);
router.route('/vendor').get(protect, adminOrVendor, getVendorServices);
router.route('/:id').get(getServiceById);

export default router;
