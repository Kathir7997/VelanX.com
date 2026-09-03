const mongoose = require('mongoose');

const warehouseSchema = new mongoose.Schema(
  {
    warehouseName: {
      type: String,
      required: [true, 'Warehouse name is required'],
      trim: true,
    },
    warehouseCode: {
      type: String,
      unique: true,
      uppercase: true,
    },
    location: {
      street: String,
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: String,
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    capacity: {
      type: Number, // in cubic meters or units
      required: true,
    },
    currentLoad: {
      type: Number,
      default: 0,
    },
    warehouseType: {
      type: String,
      enum: ['origin', 'destination', 'transit', 'general'],
      default: 'general',
    },
    status: {
      type: String,
      enum: ['active', 'full', 'maintenance', 'inactive'],
      default: 'active',
    },
    contactPhone: String,
    operatingHours: {
      open: String,
      close: String,
    },
    image: String,
  },
  { timestamps: true }
);

warehouseSchema.pre('save', function (next) {
  if (!this.warehouseCode) {
    const code = this.warehouseName.substring(0, 3).toUpperCase();
    const random = Math.floor(Math.random() * 900 + 100);
    this.warehouseCode = `WH-${code}-${random}`;
  }
  next();
});

module.exports = mongoose.model('Warehouse', warehouseSchema);
