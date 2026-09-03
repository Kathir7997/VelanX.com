const express = require('express');
const router = express.Router();
const { getUsers, getUser, createUser, updateUser, toggleUserStatus, deleteUser } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);
router.get('/', authorize('admin', 'owner'), getUsers);
router.post('/', authorize('admin', 'owner'), createUser);
router.get('/:id', authorize('admin', 'owner'), getUser);
router.put('/:id', authorize('admin', 'owner'), updateUser);
router.put('/:id/toggle-status', authorize('admin', 'owner'), toggleUserStatus);
router.delete('/:id', authorize('admin', 'owner'), deleteUser);

module.exports = router;
