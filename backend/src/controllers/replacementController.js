const asyncHandler = require('express-async-handler');
const ReplacementRequest = require('../models/ReplacementRequest');
const Driver = require('../models/Driver');
const Vehicle = require('../models/Vehicle');
const Shipment = require('../models/Shipment');

// @desc    Create replacement request
// @route   POST /api/replacements
// @access  Private (Driver/Manager)
const createReplacementRequest = asyncHandler(async (req, res) => {
  const { type, shipment, reason, notes, location } = req.body;

  let originalDriver, originalVehicle;

  // Assuming driver is making request
  if (req.user.role === 'driver') {
    const driver = await Driver.findOne({ user: req.user._id });
    if (!driver) throw new Error('Driver profile not found');
    originalDriver = driver._id;
    originalVehicle = driver.assignedVehicle;
  } else {
    originalDriver = req.body.originalDriver;
    originalVehicle = req.body.originalVehicle;
  }

  const request = await ReplacementRequest.create({
    type,
    shipment,
    originalDriver,
    originalVehicle,
    reason,
    notes,
    location,
    requestedBy: req.user._id,
    status: 'pending'
  });

  res.status(201).json(request);
});

// @desc    Get all replacement requests
// @route   GET /api/replacements
// @access  Private (Manager/Admin/Owner)
const getReplacementRequests = asyncHandler(async (req, res) => {
  const requests = await ReplacementRequest.find()
    .populate({ path: 'originalDriver', populate: { path: 'user', select: 'name email phone' } })
    .populate({ path: 'replacementDriver', populate: { path: 'user', select: 'name email phone' } })
    .populate('originalVehicle')
    .populate('replacementVehicle')
    .populate('shipment')
    .populate('requestedBy', 'name role')
    .sort('-createdAt');

  res.json(requests);
});

// @desc    Update/Approve replacement request
// @route   PUT /api/replacements/:id
// @access  Private (Manager/Admin)
const updateReplacementRequest = asyncHandler(async (req, res) => {
  const { status, replacementDriver, replacementVehicle } = req.body;
  
  const request = await ReplacementRequest.findById(req.params.id);
  if (!request) {
    res.status(404);
    throw new Error('Replacement request not found');
  }

  request.status = status;
  if (replacementDriver) request.replacementDriver = replacementDriver;
  if (replacementVehicle) request.replacementVehicle = replacementVehicle;
  request.approvedBy = req.user._id;

  await request.save();

  // If approved and it's linked to a shipment, reassign
  if (status === 'approved' && request.shipment) {
    const shipment = await Shipment.findById(request.shipment);
    if (shipment) {
      if (request.type === 'driver' && replacementDriver) {
        shipment.assignedDriver = replacementDriver;
      }
      if (request.type === 'vehicle' && replacementVehicle) {
        shipment.assignedVehicle = replacementVehicle;
      }
      await shipment.save();
    }
  }

  res.json(request);
});

module.exports = {
  createReplacementRequest,
  getReplacementRequests,
  updateReplacementRequest
};
