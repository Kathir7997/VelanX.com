const express = require('express');
const router = express.Router();
const { getRiskAlerts, generateRiskAlerts, updateRiskAlertStatus } = require('../controllers/riskController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);
router.use(authorize('owner'));

router.get('/', getRiskAlerts);
router.post('/generate', generateRiskAlerts);
router.put('/:id/status', updateRiskAlertStatus);

module.exports = router;
