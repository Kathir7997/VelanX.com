const asyncHandler = require('express-async-handler');
const Warehouse = require('../models/Warehouse');
const Shipment = require('../models/Shipment');

// @desc    Get all warehouses
// @route   GET /api/warehouses
// @access  Admin, General Manager, Warehouse Manager
const getWarehouses = asyncHandler(async (req, res) => {
  const warehouses = await Warehouse.find()
    .populate('manager', 'name email phone')
    .sort({ createdAt: -1 });
  res.json({ success: true, count: warehouses.length, data: warehouses });
});

// @desc    Get single warehouse
// @route   GET /api/warehouses/:id
// @access  Admin, General Manager
const getWarehouse = asyncHandler(async (req, res) => {
  const warehouse = await Warehouse.findById(req.params.id)
    .populate('manager', 'name email phone');
  if (!warehouse) { res.status(404); throw new Error('Warehouse not found'); }
  res.json({ success: true, data: warehouse });
});

// @desc    Create warehouse
// @route   POST /api/warehouses
// @access  Admin
const createWarehouse = asyncHandler(async (req, res) => {
  const warehouse = await Warehouse.create(req.body);
  res.status(201).json({ success: true, data: warehouse });
});

// @desc    Update warehouse
// @route   PUT /api/warehouses/:id
// @access  Admin, General Manager
const updateWarehouse = asyncHandler(async (req, res) => {
  const warehouse = await Warehouse.findByIdAndUpdate(req.params.id, req.body, {
    new: true, runValidators: true,
  });
  if (!warehouse) { res.status(404); throw new Error('Warehouse not found'); }
  res.json({ success: true, data: warehouse });
});

// @desc    Receive shipment at warehouse
// @route   PUT /api/warehouses/:id/receive/:shipmentId
// @access  Warehouse Manager, Admin
const receiveShipment = asyncHandler(async (req, res) => {
  const shipment = await Shipment.findById(req.params.shipmentId);
  if (!shipment) { res.status(404); throw new Error('Shipment not found'); }

  const warehouse = await Warehouse.findById(req.params.id);
  if (!warehouse) { res.status(404); throw new Error('Warehouse not found'); }

  // Add warehouse history entry
  shipment.warehouseHistory.push({
    warehouse: warehouse._id,
    warehouseName: warehouse.warehouseName,
    arrivedAt: new Date(),
    status: 'received',
    handledBy: req.user._id,
  });

  // Update shipment status based on type
  if (shipment.shipmentType === 'interstate' && shipment.status === 'picked_up') {
    shipment.status = 'at_origin_warehouse';
  } else {
    shipment.status = 'at_destination_warehouse';
  }

  // Update warehouse load
  warehouse.currentLoad += shipment.materialWeight;
  await warehouse.save();
  await shipment.save();

  res.json({ success: true, data: shipment });
});

// @desc    Dispatch shipment from warehouse
// @route   PUT /api/warehouses/:id/dispatch/:shipmentId
// @access  Warehouse Manager, Admin
const dispatchShipment = asyncHandler(async (req, res) => {
  const shipment = await Shipment.findById(req.params.shipmentId);
  if (!shipment) { res.status(404); throw new Error('Shipment not found'); }

  const warehouse = await Warehouse.findById(req.params.id);
  if (!warehouse) { res.status(404); throw new Error('Warehouse not found'); }

  // Update last warehouse history entry
  const lastHistory = shipment.warehouseHistory[shipment.warehouseHistory.length - 1];
  if (lastHistory) {
    lastHistory.dispatchedAt = new Date();
    lastHistory.status = 'dispatched';
  }

  shipment.status = shipment.shipmentType === 'interstate' ? 'in_transit' : 'out_for_delivery';

  // Update warehouse load
  warehouse.currentLoad = Math.max(0, warehouse.currentLoad - shipment.materialWeight);
  await warehouse.save();
  await shipment.save();

  res.json({ success: true, data: shipment });
});

// @desc    Get incoming shipments for warehouse
// @route   GET /api/warehouses/:id/incoming
// @access  Warehouse Manager, Admin
const getIncomingShipments = asyncHandler(async (req, res) => {
  const shipments = await Shipment.find({
    status: { $in: ['driver_assigned', 'picked_up'] },
  })
    .populate('customer', 'name phone')
    .populate({ path: 'assignedDriver', populate: { path: 'user', select: 'name phone' } })
    .sort({ createdAt: -1 });

  res.json({ success: true, data: shipments });
});

// @desc    Delete warehouse
// @route   DELETE /api/warehouses/:id
// @access  Admin
const deleteWarehouse = asyncHandler(async (req, res) => {
  const warehouse = await Warehouse.findByIdAndDelete(req.params.id);
  if (!warehouse) { res.status(404); throw new Error('Warehouse not found'); }
  res.json({ success: true, message: 'Warehouse deleted' });
});

module.exports = { getWarehouses, getWarehouse, createWarehouse, updateWarehouse, receiveShipment, dispatchShipment, getIncomingShipments, deleteWarehouse };
