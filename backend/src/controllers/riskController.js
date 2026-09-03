const asyncHandler = require('express-async-handler');
const RiskAlert = require('../models/RiskAlert');
const Driver = require('../models/Driver');
const Vehicle = require('../models/Vehicle');
const Warehouse = require('../models/Warehouse');

// @desc    Get all risk alerts
// @route   GET /api/risks
// @access  Private/Owner
const getRiskAlerts = asyncHandler(async (req, res) => {
  const alerts = await RiskAlert.find()
    .populate('referenceId')
    .sort('-createdAt');
  res.json(alerts);
});

// @desc    Generate/update risk alerts
// @route   POST /api/risks/generate
// @access  Private/Owner
const generateRiskAlerts = asyncHandler(async (req, res) => {
  // Clear old active alerts for fresh generation or update them. For simplicity, we just delete and recreate here
  await RiskAlert.deleteMany({ status: 'active' });

  const alerts = [];
  const now = new Date();
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(now.getDate() + 30);

  // 1. Driver License Expiry
  // Assume Driver model has a licenseExpiry field? It doesn't, but we can assume documents.license is tracked or we'll mock it if not present. Wait, Driver doesn't have expiry, Vehicle does.
  // Let's check Vehicle insurance
  const vehicles = await Vehicle.find({
    $or: [
      { insuranceExpiry: { $lt: thirtyDaysFromNow } },
      { pucExpiry: { $lt: thirtyDaysFromNow } },
      { registrationExpiry: { $lt: thirtyDaysFromNow } }
    ]
  });

  for (const v of vehicles) {
    if (v.insuranceExpiry && v.insuranceExpiry < thirtyDaysFromNow) {
      alerts.push({
        type: 'vehicle_insurance',
        referenceId: v._id,
        referenceModel: 'Vehicle',
        message: `Insurance for vehicle ${v.vehicleNumber} is expiring soon or expired.`,
        severity: v.insuranceExpiry < now ? 'critical' : 'high',
        dueDate: v.insuranceExpiry,
      });
    }
    if (v.pucExpiry && v.pucExpiry < thirtyDaysFromNow) {
       alerts.push({
        type: 'vehicle_fitness',
        referenceId: v._id,
        referenceModel: 'Vehicle',
        message: `PUC for vehicle ${v.vehicleNumber} is expiring soon or expired.`,
        severity: v.pucExpiry < now ? 'critical' : 'medium',
        dueDate: v.pucExpiry,
      });
    }
  }

  // 2. Warehouse overflow
  const warehouses = await Warehouse.find();
  for (const w of warehouses) {
    if (w.currentLoad > w.capacity * 0.9) {
      alerts.push({
        type: 'warehouse_overflow',
        referenceId: w._id,
        referenceModel: 'Warehouse',
        message: `Warehouse ${w.warehouseName} is at ${Math.round((w.currentLoad/w.capacity)*100)}% capacity.`,
        severity: w.currentLoad > w.capacity ? 'critical' : 'high',
      });
    }
  }

  // 3. Inactive drivers
  const inactiveDrivers = await Driver.find({ status: 'offline' });
  for (const d of inactiveDrivers) {
    alerts.push({
      type: 'inactive_driver',
      referenceId: d._id,
      referenceModel: 'Driver',
      message: `Driver with license ${d.licenseNumber} is currently offline.`,
      severity: 'low',
    });
  }

  if (alerts.length > 0) {
    await RiskAlert.insertMany(alerts);
  }

  res.json({ message: 'Risk alerts generated successfully', count: alerts.length });
});

// @desc    Update risk alert status
// @route   PUT /api/risks/:id/status
// @access  Private/Owner
const updateRiskAlertStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const alert = await RiskAlert.findById(req.params.id);

  if (!alert) {
    res.status(404);
    throw new Error('Alert not found');
  }

  alert.status = status;
  await alert.save();
  res.json(alert);
});

module.exports = {
  getRiskAlerts,
  generateRiskAlerts,
  updateRiskAlertStatus,
};
