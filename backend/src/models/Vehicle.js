const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema(
  {
    vehicleNumber: {
      type: String,
      required: [true, 'Vehicle number is required'],
      unique: true,
      uppercase: true,
    },
    vehicleType: {
      type: String,
      enum: ['mini_truck', 'truck', 'lorry', 'container', 'van', 'bike'],
      required: true,
    },
    brand: String,
    model: String,
    year: Number,
    capacity: {
      type: Number, // in tons
      required: true,
    },
    status: {
      type: String,
      enum: ['available', 'in_use', 'maintenance', 'inactive'],
      default: 'available',
    },
    maintenanceStatus: {
      type: String,
      enum: ['good', 'needs_service', 'in_service'],
      default: 'good',
    },
    assignedDriver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Driver',
    },
    lastMaintenanceDate: Date,
    nextMaintenanceDate: Date,
    fuelType: {
      type: String,
      enum: ['diesel', 'petrol', 'electric', 'cng'],
      default: 'diesel',
    },
    image: String,
    insuranceExpiry: Date,
    pucExpiry: Date,
    registrationExpiry: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Vehicle', vehicleSchema);
