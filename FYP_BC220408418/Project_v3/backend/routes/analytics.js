import express from 'express';
const router = express.Router();
import { getAnalytics } from '../controllers/analyticsController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.get('/', protect, admin, getAnalytics);

export default router;
