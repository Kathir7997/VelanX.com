const asyncHandler = require('express-async-handler');
const Driver = require('../models/Driver');
const User = require('../models/User');
const Shipment = require('../models/Shipment');

// @desc    Get all drivers
// @route   GET /api/drivers
// @access  Admin, General Manager
const getDrivers = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;
  let query = {};
  if (status) query.status = status;

  const skip = (page - 1) * limit;
  const total = await Driver.countDocuments(query);
  const drivers = await Driver.find(query)
    .populate('user', 'name email phone profileImage')
    .populate('assignedVehicle', 'vehicleNumber vehicleType')
    .skip(skip)
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  res.json({ success: true, count: drivers.length, total, data: drivers });
});

// @desc    Get single driver
// @route   GET /api/drivers/:id
// @access  Admin, General Manager
const getDriver = asyncHandler(async (req, res) => {
  const driver = await Driver.findById(req.params.id)
    .populate('user', 'name email phone profileImage')
    .populate('assignedVehicle');

  if (!driver) { res.status(404); throw new Error('Driver not found'); }
  res.json({ success: true, data: driver });
});

// @desc    Get driver profile (own)
// @route   GET /api/drivers/profile
// @access  Driver
const getDriverProfile = asyncHandler(async (req, res) => {
  const driver = await Driver.findOne({ user: req.user._id })
    .populate('user', 'name email phone profileImage')
    .populate('assignedVehicle');
  if (!driver) { res.status(404); throw new Error('Driver profile not found'); }
  res.json({ success: true, data: driver });
});

// @desc    Create driver profile
// @route   POST /api/drivers
// @access  Admin
const createDriver = asyncHandler(async (req, res) => {
  const { userId, licenseNumber, experience } = req.body;
  const user = await User.findById(userId);
  if (!user) { res.status(404); throw new Error('User not found'); }

  // Update user role to driver
  user.role = 'driver';
  await user.save();

  const driver = await Driver.create({ user: userId, licenseNumber, experience });
  const populated = await driver.populate('user', 'name email phone');
  res.status(201).json({ success: true, data: populated });
});

// @desc    Update driver status
// @route   PUT /api/drivers/status
// @access  Driver
const updateStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const driver = await Driver.findOneAndUpdate(
    { user: req.user._id },
    { status },
    { new: true, runValidators: true }
  ).populate('user', 'name email phone');

  if (!driver) { res.status(404); throw new Error('Driver profile not found'); }
  res.json({ success: true, data: driver });
});

// @desc    Get driver assignments
// @route   GET /api/drivers/assignments
// @access  Driver
const getDriverAssignments = asyncHandler(async (req, res) => {
  const driver = await Driver.findOne({ user: req.user._id });
  if (!driver) { res.status(404); throw new Error('Driver profile not found'); }

  const assignments = await Shipment.find({
    assignedDriver: driver._id,
    status: { $nin: ['delivery_confirmed', 'cancelled'] },
  })
    .populate('customer', 'name phone')
    .sort({ createdAt: -1 });

  res.json({ success: true, data: assignments });
});

// @desc    Update driver (admin)
// @route   PUT /api/drivers/:id
// @access  Admin
const updateDriver = asyncHandler(async (req, res) => {
  const driver = await Driver.findByIdAndUpdate(req.params.id, req.body, {
    new: true, runValidators: true,
  }).populate('user', 'name email phone');
  if (!driver) { res.status(404); throw new Error('Driver not found'); }
  res.json({ success: true, data: driver });
});

// @desc    Delete driver
// @route   DELETE /api/drivers/:id
// @access  Admin
const deleteDriver = asyncHandler(async (req, res) => {
  const driver = await Driver.findByIdAndDelete(req.params.id);
  if (!driver) { res.status(404); throw new Error('Driver not found'); }
  res.json({ success: true, message: 'Driver deleted' });
});

module.exports = { getDrivers, getDriver, getDriverProfile, createDriver, updateStatus, getDriverAssignments, updateDriver, deleteDriver };
