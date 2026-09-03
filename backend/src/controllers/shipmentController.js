const asyncHandler = require('express-async-handler');
const Shipment = require('../models/Shipment');
const Driver = require('../models/Driver');
const { uploadToCloudinary } = require('../middleware/uploadMiddleware');

// @desc    Create shipment
// @route   POST /api/shipments
// @access  Customer
const createShipment = asyncHandler(async (req, res) => {
  const {
    pickupAddress, deliveryAddress, materialName, materialWeight,
    quantity, shipmentType, receiverName, receiverPhone, specialInstructions,
  } = req.body;

  // Calculate pricing
  const basePrice = shipmentType === 'interstate' ? 500 : 200;
  const weightCharge = materialWeight * 10;
  const total = basePrice + weightCharge;

  const shipment = await Shipment.create({
    customer: req.user._id,
    pickupAddress: typeof pickupAddress === 'string' ? JSON.parse(pickupAddress) : pickupAddress,
    deliveryAddress: typeof deliveryAddress === 'string' ? JSON.parse(deliveryAddress) : deliveryAddress,
    materialName,
    materialWeight,
    quantity,
    shipmentType,
    receiverName,
    receiverPhone,
    specialInstructions,
    pricing: { basePrice, weightCharge, total },
  });

  // Upload images if provided
  if (req.files && req.files.length > 0) {
    const imageUrls = await Promise.all(
      req.files.map((file) =>
        uploadToCloudinary(file.buffer, 'shipments', `${shipment._id}-${Date.now()}`)
      )
    );
    shipment.images = imageUrls;
    await shipment.save();
  }

  res.status(201).json({ success: true, data: shipment });
});

// @desc    Get all shipments (role-based)
// @route   GET /api/shipments
// @access  Private
const getShipments = asyncHandler(async (req, res) => {
  let query = {};
  const { status, shipmentType, page = 1, limit = 10, search } = req.query;

  // Filter by role
  if (req.user.role === 'customer') {
    query.customer = req.user._id;
  } else if (req.user.role === 'driver') {
    const driver = await Driver.findOne({ user: req.user._id });
    if (driver) query.assignedDriver = driver._id;
  }

  if (status) query.status = status;
  if (shipmentType) query.shipmentType = shipmentType;
  if (search) {
    query.$or = [
      { trackingNumber: { $regex: search, $options: 'i' } },
      { materialName: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (page - 1) * limit;
  const total = await Shipment.countDocuments(query);
  const shipments = await Shipment.find(query)
    .populate('customer', 'name email phone')
    .populate({ path: 'assignedDriver', populate: { path: 'user', select: 'name phone' } })
    .populate('assignedVehicle', 'vehicleNumber vehicleType')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  res.json({
    success: true,
    count: shipments.length,
    total,
    pages: Math.ceil(total / limit),
    currentPage: Number(page),
    data: shipments,
  });
});

// @desc    Get single shipment
// @route   GET /api/shipments/:id
// @access  Private
const getShipment = asyncHandler(async (req, res) => {
  const shipment = await Shipment.findById(req.params.id)
    .populate('customer', 'name email phone')
    .populate({ path: 'assignedDriver', populate: { path: 'user', select: 'name phone profileImage' } })
    .populate('assignedVehicle')
    .populate('warehouseHistory.warehouse')
    .populate('warehouseHistory.handledBy', 'name');

  if (!shipment) {
    res.status(404);
    throw new Error('Shipment not found');
  }

  // Authorization check
  if (req.user.role === 'customer' && shipment.customer._id.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to view this shipment');
  }

  res.json({ success: true, data: shipment });
});

// @desc    Track shipment by tracking number (public)
// @route   GET /api/shipments/track/:trackingNumber
// @access  Public
const trackShipment = asyncHandler(async (req, res) => {
  const shipment = await Shipment.findOne({ trackingNumber: req.params.trackingNumber })
    .populate('customer', 'name')
    .populate({ path: 'assignedDriver', populate: { path: 'user', select: 'name phone' } })
    .select('-deliveryOTP');

  if (!shipment) {
    res.status(404);
    throw new Error('Shipment not found with this tracking number');
  }

  res.json({ success: true, data: shipment });
});

// @desc    Update shipment status
// @route   PUT /api/shipments/:id/status
// @access  Private (Driver, Warehouse, Admin)
const updateShipmentStatus = asyncHandler(async (req, res) => {
  const { status, reason } = req.body;
  const shipment = await Shipment.findById(req.params.id);

  if (!shipment) {
    res.status(404);
    throw new Error('Shipment not found');
  }

  shipment.status = status;
  if (status === 'delivered') {
    shipment.actualDelivery = new Date();
    // Generate OTP for confirmation
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    shipment.deliveryOTP = otp;
    shipment.deliveryOTPExpire = new Date(Date.now() + 30 * 60 * 1000);
  }
  if (status === 'cancelled') shipment.cancelReason = reason;

  await shipment.save();
  res.json({ success: true, data: shipment });
});

// @desc    Assign driver to shipment
// @route   PUT /api/shipments/:id/assign-driver
// @access  Admin, General Manager
const assignDriver = asyncHandler(async (req, res) => {
  const { driverId, vehicleId } = req.body;
  const shipment = await Shipment.findById(req.params.id);
  if (!shipment) { res.status(404); throw new Error('Shipment not found'); }

  const driver = await Driver.findById(driverId);
  if (!driver) { res.status(404); throw new Error('Driver not found'); }

  shipment.assignedDriver = driverId;
  if (vehicleId) shipment.assignedVehicle = vehicleId;
  shipment.status = 'driver_assigned';

  driver.status = 'busy';
  await driver.save();
  await shipment.save();

  const populated = await shipment.populate([
    { path: 'assignedDriver', populate: { path: 'user', select: 'name phone' } },
    { path: 'assignedVehicle', select: 'vehicleNumber vehicleType' },
  ]);

  res.json({ success: true, data: populated });
});

// @desc    Upload proof (pickup / delivery)
// @route   PUT /api/shipments/:id/upload-proof
// @access  Driver
const uploadProof = asyncHandler(async (req, res) => {
  const { proofType } = req.body; // 'pickup' or 'delivery'
  const shipment = await Shipment.findById(req.params.id);
  if (!shipment) { res.status(404); throw new Error('Shipment not found'); }

  if (!req.file) { res.status(400); throw new Error('No file uploaded'); }

  const imageUrl = await uploadToCloudinary(
    req.file.buffer,
    'proofs',
    `${shipment._id}-${proofType}-${Date.now()}`
  );

  if (proofType === 'pickup') {
    shipment.pickupProof = imageUrl;
    shipment.status = 'picked_up';
  } else {
    shipment.deliveryProof = imageUrl;
    shipment.status = 'out_for_delivery';
  }

  await shipment.save();
  res.json({ success: true, data: shipment });
});

// @desc    Confirm delivery with OTP
// @route   POST /api/shipments/:id/confirm-delivery
// @access  Customer
const confirmDelivery = asyncHandler(async (req, res) => {
  const { otp } = req.body;
  const shipment = await Shipment.findById(req.params.id);
  if (!shipment) { res.status(404); throw new Error('Shipment not found'); }

  if (shipment.deliveryOTP !== otp || shipment.deliveryOTPExpire < Date.now()) {
    res.status(400);
    throw new Error('Invalid or expired OTP');
  }

  shipment.status = 'delivery_confirmed';
  shipment.deliveryOTP = undefined;
  shipment.deliveryOTPExpire = undefined;

  // Increment driver completed deliveries
  if (shipment.assignedDriver) {
    await Driver.findByIdAndUpdate(shipment.assignedDriver, {
      $inc: { completedDeliveries: 1 },
      status: 'active',
    });
  }

  await shipment.save();
  res.json({ success: true, message: 'Delivery confirmed!', data: shipment });
});

// @desc    Delete shipment
// @route   DELETE /api/shipments/:id
// @access  Admin
const deleteShipment = asyncHandler(async (req, res) => {
  const shipment = await Shipment.findByIdAndDelete(req.params.id);
  if (!shipment) { res.status(404); throw new Error('Shipment not found'); }
  res.json({ success: true, message: 'Shipment deleted' });
});

module.exports = {
  createShipment, getShipments, getShipment, trackShipment,
  updateShipmentStatus, assignDriver, uploadProof, confirmDelivery, deleteShipment,
};
