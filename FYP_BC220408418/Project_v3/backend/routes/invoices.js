import express from 'express';
const router = express.Router();
import { getInvoices, updateInvoicePayment } from '../controllers/invoiceController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/')
  .get(protect, admin, getInvoices);

router.put('/:id/pay', protect, admin, updateInvoicePayment);

export default router;
