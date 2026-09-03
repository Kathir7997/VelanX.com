const express = require('express');
const router = express.Router();
const {
  getVehicles, getVehicle, createVehicle, updateVehicle, assignVehicle, deleteVehicle,
} = require('../controllers/vehicleController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);
router.get('/', authorize('admin', 'owner', 'general_manager', 'accountant'), getVehicles);
router.post('/', authorize('admin', 'owner'), createVehicle);
router.get('/:id', authorize('admin', 'owner', 'general_manager'), getVehicle);
router.put('/:id', authorize('admin', 'owner'), updateVehicle);
router.put('/:id/assign', authorize('admin', 'owner'), assignVehicle);
router.delete('/:id', authorize('admin', 'owner'), deleteVehicle);

module.exports = router;
