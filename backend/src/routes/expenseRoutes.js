const express = require('express');
const router = express.Router();
const { getExpenses, createExpense, updateExpense, deleteExpense } = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);
router.get('/', authorize('admin', 'accountant'), getExpenses);
router.post('/', authorize('admin', 'accountant'), createExpense);
router.put('/:id', authorize('admin', 'accountant'), updateExpense);
router.delete('/:id', authorize('admin'), deleteExpense);

module.exports = router;
