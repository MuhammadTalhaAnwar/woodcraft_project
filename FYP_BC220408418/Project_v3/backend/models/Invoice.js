import mongoose from 'mongoose';

const invoiceSchema = mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  totalAmount: { type: Number, required: true },
  paidAmount: { type: Number, required: true, default: 0 },
  status: { type: String, required: true, enum: ['Paid', 'Partially Paid', 'Unpaid'], default: 'Unpaid' },
}, {
  timestamps: true,
});

export default mongoose.model('Invoice', invoiceSchema);
