import express from 'express';
const router = express.Router();
import { getOrders, createOrder, updateOrderStatus } from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/')
  .get(protect, admin, getOrders)
  .post(protect, admin, createOrder);

// Both Admin and Employees can update order status
router.put('/:id/status', protect, updateOrderStatus);

export default router;
