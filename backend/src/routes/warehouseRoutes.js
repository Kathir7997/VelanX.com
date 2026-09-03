const express = require('express');
const router = express.Router();
const {
  getWarehouses, getWarehouse, createWarehouse, updateWarehouse,
  receiveShipment, dispatchShipment, getIncomingShipments, deleteWarehouse,
} = require('../controllers/warehouseController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);
router.get('/', authorize('admin', 'general_manager', 'warehouse_manager'), getWarehouses);
router.post('/', authorize('admin'), createWarehouse);
router.get('/:id', authorize('admin', 'general_manager', 'warehouse_manager'), getWarehouse);
router.put('/:id', authorize('admin', 'general_manager'), updateWarehouse);
router.get('/:id/incoming', authorize('admin', 'general_manager', 'warehouse_manager'), getIncomingShipments);
router.put('/:id/receive/:shipmentId', authorize('admin', 'warehouse_manager'), receiveShipment);
router.put('/:id/dispatch/:shipmentId', authorize('admin', 'warehouse_manager'), dispatchShipment);
router.delete('/:id', authorize('admin'), deleteWarehouse);

module.exports = router;
