import mongoose from 'mongoose';

const materialSchema = mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true }, // e.g., Wood, Nails, Polish, Paint, Tools
  quantity: { type: Number, required: true, default: 0 },
  unit: { type: String, required: true }, // e.g., boards, kg, liters, pcs
  pricePerUnit: { type: Number, required: true, default: 0 },
  lowStockThreshold: { type: Number, required: true, default: 10 },
  supplierName: { type: String, required: true },
  supplierContact: { type: String, required: true },
}, {
  timestamps: true,
});

export default mongoose.model('Material', materialSchema);
