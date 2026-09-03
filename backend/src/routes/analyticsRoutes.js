const express = require('express');
const router = express.Router();
const {
  getRevenueAnalytics, getShipmentAnalytics, getDriverAnalytics,
  getDashboardSummary, getExpenseAnalytics,
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);
router.get('/dashboard', authorize('admin', 'owner', 'general_manager'), getDashboardSummary);
router.get('/revenue', authorize('admin', 'owner', 'accountant', 'general_manager'), getRevenueAnalytics);
router.get('/shipments', authorize('admin', 'owner', 'general_manager'), getShipmentAnalytics);
router.get('/drivers', authorize('admin', 'owner', 'general_manager'), getDriverAnalytics);
router.get('/expenses', authorize('admin', 'owner', 'accountant'), getExpenseAnalytics);

module.exports = router;
