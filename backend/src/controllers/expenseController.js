const asyncHandler = require('express-async-handler');
const Expense = require('../models/Expense');

// @desc    Get all expenses
// @route   GET /api/expenses
// @access  Accountant, Admin
const getExpenses = asyncHandler(async (req, res) => {
  const { category, startDate, endDate } = req.query;
  let query = {};
  if (category) query.category = category;
  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) query.date.$lte = new Date(endDate);
  }

  const expenses = await Expense.find(query)
    .populate('recordedBy', 'name')
    .sort({ date: -1 });
  res.json({ success: true, data: expenses });
});

// @desc    Create expense
// @route   POST /api/expenses
// @access  Accountant, Admin
const createExpense = asyncHandler(async (req, res) => {
  req.body.recordedBy = req.user._id;
  const expense = await Expense.create(req.body);
  res.status(201).json({ success: true, data: expense });
});

// @desc    Update expense
// @route   PUT /api/expenses/:id
// @access  Accountant, Admin
const updateExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, {
    new: true, runValidators: true,
  });
  if (!expense) { res.status(404); throw new Error('Expense not found'); }
  res.json({ success: true, data: expense });
});

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Admin
const deleteExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findByIdAndDelete(req.params.id);
  if (!expense) { res.status(404); throw new Error('Expense not found'); }
  res.json({ success: true, message: 'Expense deleted' });
});

module.exports = { getExpenses, createExpense, updateExpense, deleteExpense };
