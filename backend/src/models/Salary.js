const mongoose = require('mongoose');

const salarySchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    role: {
      type: String,
      enum: ['driver', 'warehouse_manager', 'accountant', 'general_manager'],
      required: true,
    },
    basicSalary: {
      type: Number,
      required: true,
    },
    allowances: {
      fuel: { type: Number, default: 0 },
      travel: { type: Number, default: 0 },
      other: { type: Number, default: 0 },
    },
    deductions: {
      tax: { type: Number, default: 0 },
      pf: { type: Number, default: 0 },
      other: { type: Number, default: 0 },
    },
    netSalary: {
      type: Number,
    },
    month: {
      type: Number, // 1-12
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'partial'],
      default: 'pending',
    },
    paidAt: Date,
    remarks: String,
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

// Calculate net salary before save
salarySchema.pre('save', function (next) {
  const totalAllowances = Object.values(this.allowances).reduce((a, b) => a + b, 0);
  const totalDeductions = Object.values(this.deductions).reduce((a, b) => a + b, 0);
  this.netSalary = this.basicSalary + totalAllowances - totalDeductions;
  next();
});

module.exports = mongoose.model('Salary', salarySchema);
