const mongoose = require('mongoose');

const podRecordSchema = new mongoose.Schema(
  {
    shipment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shipment',
      required: true,
      unique: true,
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Driver',
      required: true,
    },
    productPhoto: {
      type: String,
      required: [true, 'Product photo is required for POD'],
    },
    receiverPhoto: {
      type: String, // Optional, depending on privacy rules
    },
    receiverSignature: {
      type: String,
      required: [true, 'Receiver signature is required for POD'],
    },
    otpVerified: {
      type: Boolean,
      default: false,
    },
    deliveryReportPdf: {
      type: String, // URL to the generated PDF
    },
    deliveredAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'verified'],
      default: 'completed',
    },
    notes: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('PODRecord', podRecordSchema);
