const express = require('express');
const router = express.Router();
const { createReplacementRequest, getReplacementRequests, updateReplacementRequest } = require('../controllers/replacementController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);

router.post('/', authorize('driver', 'general_manager', 'admin'), createReplacementRequest);
router.get('/', authorize('general_manager', 'admin', 'owner'), getReplacementRequests);
router.put('/:id', authorize('general_manager', 'admin'), updateReplacementRequest);

module.exports = router;
