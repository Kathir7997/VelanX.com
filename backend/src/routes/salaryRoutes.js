const express = require('express');
const router = express.Router();
const { getSalaries, createSalary, updateSalary, markPaid, deleteSalary } = require('../controllers/salaryController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);
router.get('/', authorize('admin', 'accountant'), getSalaries);
router.post('/', authorize('admin', 'accountant'), createSalary);
router.put('/:id', authorize('admin', 'accountant'), updateSalary);
router.put('/:id/pay', authorize('admin'), markPaid);
router.delete('/:id', authorize('admin'), deleteSalary);

module.exports = router;
