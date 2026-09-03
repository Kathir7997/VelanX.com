const asyncHandler = require('express-async-handler');
const PODRecord = require('../models/PODRecord');
const Shipment = require('../models/Shipment');

// @desc    Create POD
// @route   POST /api/pods
// @access  Private/Driver
const createPOD = asyncHandler(async (req, res) => {
  const { shipmentId, productPhoto, receiverSignature, otpVerified, notes } = req.body;

  const shipment = await Shipment.findById(shipmentId);
  if (!shipment) {
    res.status(404);
    throw new Error('Shipment not found');
  }

  const existingPOD = await PODRecord.findOne({ shipment: shipmentId });
  if (existingPOD) {
    res.status(400);
    throw new Error('POD already exists for this shipment');
  }

  // Assuming req.user is populated and req.user has an associated Driver record.
  // But Driver model references User model.
  const Driver = require('../models/Driver');
  const driver = await Driver.findOne({ user: req.user._id });

  if (!driver) {
    res.status(404);
    throw new Error('Driver profile not found');
  }

  const pod = await PODRecord.create({
    shipment: shipmentId,
    driver: driver._id,
    productPhoto,
    receiverSignature,
    otpVerified,
    notes,
    status: 'completed',
  });

  shipment.status = 'delivered';
  shipment.actualDelivery = Date.now();
  await shipment.save();

  res.status(201).json(pod);
});

// @desc    Get PODs
// @route   GET /api/pods
// @access  Private
const getPODs = asyncHandler(async (req, res) => {
  let filter = {};
  if (req.user.role === 'driver') {
    const Driver = require('../models/Driver');
    const driver = await Driver.findOne({ user: req.user._id });
    if(driver) filter.driver = driver._id;
  }

  const pods = await PODRecord.find(filter)
    .populate('shipment')
    .populate({
      path: 'driver',
      populate: { path: 'user', select: 'name email' }
    })
    .sort('-createdAt');
    
  res.json(pods);
});

module.exports = {
  createPOD,
  getPODs,
};
