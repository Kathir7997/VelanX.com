const asyncHandler = require('express-async-handler');
const Vehicle = require('../models/Vehicle');
const Driver = require('../models/Driver');

// @desc    Get all vehicles
// @route   GET /api/vehicles
// @access  Admin, General Manager
const getVehicles = asyncHandler(async (req, res) => {
  const { status, vehicleType } = req.query;
  let query = {};
  if (status) query.status = status;
  if (vehicleType) query.vehicleType = vehicleType;

  const vehicles = await Vehicle.find(query)
    .populate({ path: 'assignedDriver', populate: { path: 'user', select: 'name phone' } })
    .sort({ createdAt: -1 });

  res.json({ success: true, count: vehicles.length, data: vehicles });
});

// @desc    Get single vehicle
// @route   GET /api/vehicles/:id
// @access  Admin, General Manager
const getVehicle = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id)
    .populate({ path: 'assignedDriver', populate: { path: 'user', select: 'name phone' } });
  if (!vehicle) { res.status(404); throw new Error('Vehicle not found'); }
  res.json({ success: true, data: vehicle });
});

// @desc    Create vehicle
// @route   POST /api/vehicles
// @access  Admin
const createVehicle = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.create(req.body);
  res.status(201).json({ success: true, data: vehicle });
});

// @desc    Update vehicle
// @route   PUT /api/vehicles/:id
// @access  Admin
const updateVehicle = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, {
    new: true, runValidators: true,
  });
  if (!vehicle) { res.status(404); throw new Error('Vehicle not found'); }
  res.json({ success: true, data: vehicle });
});

// @desc    Assign vehicle to driver
// @route   PUT /api/vehicles/:id/assign
// @access  Admin
const assignVehicle = asyncHandler(async (req, res) => {
  const { driverId } = req.body;
  const vehicle = await Vehicle.findById(req.params.id);
  if (!vehicle) { res.status(404); throw new Error('Vehicle not found'); }

  // Unassign previous driver
  if (vehicle.assignedDriver) {
    await Driver.findByIdAndUpdate(vehicle.assignedDriver, { assignedVehicle: null });
  }

  vehicle.assignedDriver = driverId;
  vehicle.status = driverId ? 'in_use' : 'available';
  await vehicle.save();

  if (driverId) {
    await Driver.findByIdAndUpdate(driverId, { assignedVehicle: vehicle._id });
  }

  res.json({ success: true, data: vehicle });
});

// @desc    Delete vehicle
// @route   DELETE /api/vehicles/:id
// @access  Admin
const deleteVehicle = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
  if (!vehicle) { res.status(404); throw new Error('Vehicle not found'); }
  res.json({ success: true, message: 'Vehicle deleted' });
});

module.exports = { getVehicles, getVehicle, createVehicle, updateVehicle, assignVehicle, deleteVehicle };
