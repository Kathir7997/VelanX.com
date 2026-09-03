const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    licenseNumber: {
      type: String,
      required: [true, 'License number is required'],
      unique: true,
    },
    status: {
      type: String,
      enum: ['active', 'busy', 'offline'],
      default: 'offline',
    },
    assignedVehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
    },
    currentLocation: {
      lat: Number,
      lng: Number,
      updatedAt: Date,
    },
    completedDeliveries: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
    experience: {
      type: Number,
      default: 0, // years
    },
    joiningDate: {
      type: Date,
      default: Date.now,
    },
    documents: {
      license: String,
      idProof: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Driver', driverSchema);
