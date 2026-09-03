const mongoose = require('mongoose');

const replacementRequestSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['driver', 'vehicle'],
      required: true,
    },
    shipment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shipment',
    },
    originalDriver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Driver',
    },
    replacementDriver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Driver',
    },
    originalVehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
    },
    replacementVehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
    },
    reason: {
      type: String,
      enum: ['driver_offline', 'vehicle_breakdown', 'vehicle_maintenance', 'other'],
      required: true,
    },
    notes: String,
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'completed'],
      default: 'pending',
    },
    location: {
      lat: Number,
      lng: Number,
      address: String,
    },
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ReplacementRequest', replacementRequestSchema);
