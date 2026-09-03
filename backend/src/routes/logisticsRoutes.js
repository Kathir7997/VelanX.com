const express = require('express');
const router = express.Router();
const { getCommandCenterData } = require('../controllers/logisticsController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);
router.use(authorize('owner', 'admin'));

router.get('/command-center', getCommandCenterData);

module.exports = router;
