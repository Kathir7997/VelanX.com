const express = require('express');
const router = express.Router();
const {
  getDrivers, getDriver, getDriverProfile, createDriver,
  updateStatus, getDriverAssignments, updateDriver, deleteDriver,
} = require('../controllers/driverController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);
router.get('/', authorize('admin', 'owner', 'general_manager', 'accountant'), getDrivers);
router.post('/', authorize('admin', 'owner'), createDriver);
router.get('/profile', authorize('driver'), getDriverProfile);
router.get('/assignments', authorize('driver'), getDriverAssignments);
router.put('/status', authorize('driver'), updateStatus);
router.get('/:id', authorize('admin', 'owner', 'general_manager'), getDriver);
router.put('/:id', authorize('admin', 'owner'), updateDriver);
router.delete('/:id', authorize('admin', 'owner'), deleteDriver);

module.exports = router;
