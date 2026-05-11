import mongoose from 'mongoose';

const orderSchema = mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  type: { type: String, required: true, enum: ['Furniture', 'Repair', 'Custom Design'] },
  status: { type: String, required: true, enum: ['Pending', 'In Progress', 'Completed', 'Delivered', 'Cancelled'], default: 'Pending' },
  materials: [
    {
      materialId: { type: mongoose.Schema.Types.ObjectId, ref: 'Material' },
      quantity: { type: Number, required: true }
    }
  ],
  employees: [
    {
      employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      hoursWorked: { type: Number, required: true, default: 0 },
      hourlyRate: { type: Number, required: true }
    }
  ],
  totalCost: { type: Number, required: true, default: 0 },
  materialsCost: { type: Number, required: true, default: 0 },
  laborCost: { type: Number, required: true, default: 0 }
}, {
  timestamps: true,
});

export default mongoose.model('Order', orderSchema);
