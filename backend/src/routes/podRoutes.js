const express = require('express');
const router = express.Router();
const { createPOD, getPODs } = require('../controllers/podController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);

router.post('/', authorize('driver'), createPOD);
router.get('/', authorize('driver', 'admin', 'owner', 'general_manager'), getPODs);

module.exports = router;
