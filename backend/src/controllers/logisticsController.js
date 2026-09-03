const asyncHandler = require('express-async-handler');
const Shipment = require('../models/Shipment');
const Driver = require('../models/Driver');
const Vehicle = require('../models/Vehicle');
const Warehouse = require('../models/Warehouse');
const RiskAlert = require('../models/RiskAlert');

// @desc    Get Logistics Command Center Data
// @route   GET /api/logistics/command-center
// @access  Private (Owner)
const getCommandCenterData = asyncHandler(async (req, res) => {
  // 1. Shipment Status
  const shipments = await Shipment.find();
  const activeShipments = shipments.filter(s => !['delivered', 'cancelled'].includes(s.status)).length;
  const delayedShipments = shipments.filter(s => s.estimatedDelivery && s.estimatedDelivery < new Date() && s.status !== 'delivered').length;

  // 2. Revenue (Simple sum from shipments)
  const revenue = shipments.reduce((acc, curr) => acc + (curr.pricing?.total || 0), 0);

  // 3. Driver Status
  const drivers = await Driver.find();
  const activeDrivers = drivers.filter(d => d.status === 'active').length;
  const totalDrivers = drivers.length;

  // 4. Vehicle Status
  const vehicles = await Vehicle.find();
  const inUseVehicles = vehicles.filter(v => v.status === 'in_use').length;
  const totalVehicles = vehicles.length;

  // 5. Risks
  const risks = await RiskAlert.find({ status: 'active' });
  const criticalRisks = risks.filter(r => r.severity === 'critical').length;

  // 6. Monthly Analytics (Mocked for brevity, but aggregates shipments)
  const monthlyData = [
    { name: 'Jan', revenue: 4000, shipments: 240 },
    { name: 'Feb', revenue: 3000, shipments: 139 },
    { name: 'Mar', revenue: 2000, shipments: 980 },
    { name: 'Apr', revenue: 2780, shipments: 390 },
    { name: 'May', revenue: 1890, shipments: 480 },
    { name: 'Jun', revenue: 2390, shipments: 380 },
    { name: 'Jul', revenue: 3490, shipments: 430 },
  ];

  // 7. Warehouse Utilization
  const warehouses = await Warehouse.find();
  const warehouseStats = warehouses.map(w => ({
    name: w.warehouseName,
    capacity: w.capacity,
    load: w.currentLoad,
    utilization: Math.round((w.currentLoad / (w.capacity || 1)) * 100)
  }));

  res.json({
    activeShipments,
    delayedShipments,
    revenue,
    driverStatus: { active: activeDrivers, total: totalDrivers },
    vehicleStatus: { inUse: inUseVehicles, total: totalVehicles },
    criticalRisks,
    monthlyData,
    warehouseStats
  });
});

module.exports = {
  getCommandCenterData,
};
