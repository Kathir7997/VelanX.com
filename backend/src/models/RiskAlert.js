const mongoose = require('mongoose');

const riskAlertSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['driver_license', 'vehicle_insurance', 'vehicle_fitness', 'vehicle_maintenance', 'warehouse_overflow', 'inactive_driver', 'other'],
      required: true,
    },
    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'referenceModel',
    },
    referenceModel: {
      type: String,
      required: true,
      enum: ['Driver', 'Vehicle', 'Warehouse'],
    },
    message: {
      type: String,
      required: true,
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['active', 'resolved', 'ignored'],
      default: 'active',
    },
    dueDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('RiskAlert', riskAlertSchema);
