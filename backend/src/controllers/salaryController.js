const asyncHandler = require('express-async-handler');
const Salary = require('../models/Salary');

// @desc    Get all salary records
// @route   GET /api/salary
// @access  Accountant, Admin
const getSalaries = asyncHandler(async (req, res) => {
  const { month, year, role } = req.query;
  let query = {};
  if (month) query.month = Number(month);
  if (year) query.year = Number(year);
  if (role) query.role = role;

  const salaries = await Salary.find(query)
    .populate('employee', 'name email phone')
    .sort({ createdAt: -1 });
  res.json({ success: true, data: salaries });
});

// @desc    Create salary record
// @route   POST /api/salary
// @access  Accountant, Admin
const createSalary = asyncHandler(async (req, res) => {
  req.body.processedBy = req.user._id;
  const salary = await Salary.create(req.body);
  const populated = await salary.populate('employee', 'name email');
  res.status(201).json({ success: true, data: populated });
});

// @desc    Update salary record
// @route   PUT /api/salary/:id
// @access  Accountant, Admin
const updateSalary = asyncHandler(async (req, res) => {
  const salary = await Salary.findByIdAndUpdate(req.params.id, req.body, {
    new: true, runValidators: true,
  }).populate('employee', 'name email');
  if (!salary) { res.status(404); throw new Error('Salary record not found'); }
  res.json({ success: true, data: salary });
});

// @desc    Mark salary as paid
// @route   PUT /api/salary/:id/pay
// @access  Admin
const markPaid = asyncHandler(async (req, res) => {
  const salary = await Salary.findByIdAndUpdate(
    req.params.id,
    { paymentStatus: 'paid', paidAt: new Date() },
    { new: true }
  ).populate('employee', 'name email');
  if (!salary) { res.status(404); throw new Error('Salary record not found'); }
  res.json({ success: true, data: salary });
});

// @desc    Delete salary record
// @route   DELETE /api/salary/:id
// @access  Admin
const deleteSalary = asyncHandler(async (req, res) => {
  const salary = await Salary.findByIdAndDelete(req.params.id);
  if (!salary) { res.status(404); throw new Error('Salary record not found'); }
  res.json({ success: true, message: 'Salary record deleted' });
});

module.exports = { getSalaries, createSalary, updateSalary, markPaid, deleteSalary };
