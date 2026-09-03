const mongoose = require('mongoose');

const warehouseHistorySchema = new mongoose.Schema({
  warehouse: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse' },
  warehouseName: String,
  arrivedAt: Date,
  dispatchedAt: Date,
  status: {
    type: String,
    enum: ['received', 'in_transit', 'dispatched'],
    default: 'received',
  },
  proof: String,
  handledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const shipmentSchema = new mongoose.Schema(
  {
    trackingNumber: {
      type: String,
      unique: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    pickupAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    deliveryAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    materialName: {
      type: String,
      required: [true, 'Material name is required'],
    },
    materialWeight: {
      type: Number,
      required: [true, 'Material weight is required'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      default: 1,
    },
    images: [String],
    shipmentType: {
      type: String,
      enum: ['local', 'interstate'],
      default: 'local',
    },
    status: {
      type: String,
      enum: [
        'booking_created',
        'driver_assigned',
        'picked_up',
        'pickup_confirmed',
        'at_origin_warehouse',
        'in_transit',
        'at_destination_warehouse',
        'local_driver_assigned',
        'out_for_delivery',
        'delivered',
        'delivery_confirmed',
        'cancelled',
      ],
      default: 'booking_created',
    },
    assignedDriver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Driver',
    },
    assignedVehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
    },
    warehouseHistory: [warehouseHistorySchema],
    pickupProof: String,
    deliveryProof: String,
    deliveryOTP: String,
    deliveryOTPExpire: Date,
    estimatedDelivery: Date,
    actualDelivery: Date,
    pricing: {
      basePrice: { type: Number, default: 0 },
      weightCharge: { type: Number, default: 0 },
      distanceCharge: { type: Number, default: 0 },
      total: { type: Number, default: 0 },
    },
    receiverName: String,
    receiverPhone: String,
    specialInstructions: String,
    cancelReason: String,
  },
  { timestamps: true }
);

// Auto-generate tracking number
shipmentSchema.pre('save', async function () {
  if (!this.trackingNumber) {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.trackingNumber = `VLX-${timestamp}-${random}`;
  }
});

module.exports = mongoose.model('Shipment', shipmentSchema);
