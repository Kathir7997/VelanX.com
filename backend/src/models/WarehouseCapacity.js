const mongoose = require('mongoose');

const warehouseCapacitySchema = new mongoose.Schema(
  {
    warehouse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Warehouse',
      required: true,
    },
    totalCapacity: {
      type: Number,
      required: true,
    },
    currentLoad: {
      type: Number,
      required: true,
    },
    utilizationPercentage: {
      type: Number,
      required: true,
    },
    incomingShipmentsCount: {
      type: Number,
      default: 0,
    },
    outgoingShipmentsCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['normal', 'warning', 'critical', 'overflow'],
      default: 'normal',
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Optional: compound index to quickly find daily records per warehouse
warehouseCapacitySchema.index({ warehouse: 1, date: 1 });

module.exports = mongoose.model('WarehouseCapacity', warehouseCapacitySchema);
