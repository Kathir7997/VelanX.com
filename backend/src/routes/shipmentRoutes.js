const express = require('express');
const router = express.Router();
const {
  createShipment, getShipments, getShipment, trackShipment,
  updateShipmentStatus, assignDriver, uploadProof, confirmDelivery, deleteShipment,
} = require('../controllers/shipmentController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

// Public route
router.get('/track/:trackingNumber', trackShipment);

// Protected routes
router.use(protect);
router.get('/', getShipments);
router.post('/', authorize('customer'), upload.array('images', 5), createShipment);
router.get('/:id', getShipment);
router.put('/:id/status', authorize('driver', 'warehouse_manager', 'general_manager', 'admin'), updateShipmentStatus);
router.put('/:id/assign-driver', authorize('general_manager', 'admin'), assignDriver);
router.put('/:id/upload-proof', authorize('driver', 'warehouse_manager'), upload.single('proof'), uploadProof);
router.post('/:id/confirm-delivery', authorize('customer'), confirmDelivery);
router.delete('/:id', authorize('admin'), deleteShipment);

module.exports = router;
