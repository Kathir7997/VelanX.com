const asyncHandler = require('express-async-handler');
const Shipment = require('../models/Shipment');
const Driver = require('../models/Driver');
const Vehicle = require('../models/Vehicle');
const Expense = require('../models/Expense');
const Salary = require('../models/Salary');
const User = require('../models/User');

// @desc    Revenue analytics
// @route   GET /api/analytics/revenue
// @access  Admin, Accountant, General Manager
const getRevenueAnalytics = asyncHandler(async (req, res) => {
  const { year = new Date().getFullYear() } = req.query;

  const monthlyRevenue = await Shipment.aggregate([
    {
      $match: {
        status: 'delivery_confirmed',
        createdAt: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$createdAt' },
        revenue: { $sum: '$pricing.total' },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const monthlyExpenses = await Expense.aggregate([
    {
      $match: {
        date: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$date' },
        expenses: { $sum: '$amount' },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const totalRevenue = monthlyRevenue.reduce((sum, m) => sum + m.revenue, 0);
  const totalExpenses = monthlyExpenses.reduce((sum, m) => sum + m.expenses, 0);

  // Format data for charts (all 12 months)
  const months = Array.from({ length: 12 }, (_, i) => {
    const rev = monthlyRevenue.find((m) => m._id === i + 1);
    const exp = monthlyExpenses.find((m) => m._id === i + 1);
    return {
      month: i + 1,
      revenue: rev ? rev.revenue : 0,
      expenses: exp ? exp.expenses : 0,
      profit: (rev ? rev.revenue : 0) - (exp ? exp.expenses : 0),
      shipments: rev ? rev.count : 0,
    };
  });

  res.json({
    success: true,
    data: {
      totalRevenue,
      totalExpenses,
      netProfit: totalRevenue - totalExpenses,
      months,
    },
  });
});

// @desc    Shipment analytics
// @route   GET /api/analytics/shipments
// @access  Admin, General Manager
const getShipmentAnalytics = asyncHandler(async (req, res) => {
  const [statusStats, typeStats, recentShipments, weeklyStats] = await Promise.all([
    Shipment.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
    Shipment.aggregate([
      { $group: { _id: '$shipmentType', count: { $sum: 1 } } },
    ]),
    Shipment.find().sort({ createdAt: -1 }).limit(5).populate('customer', 'name'),
    Shipment.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
      },
      {
        $group: {
          _id: { $dayOfWeek: '$createdAt' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
  ]);

  const totalShipments = await Shipment.countDocuments();
  const activeShipments = await Shipment.countDocuments({
    status: { $nin: ['delivery_confirmed', 'cancelled'] },
  });

  res.json({
    success: true,
    data: { totalShipments, activeShipments, statusStats, typeStats, recentShipments, weeklyStats },
  });
});

// @desc    Driver analytics
// @route   GET /api/analytics/drivers
// @access  Admin, General Manager
const getDriverAnalytics = asyncHandler(async (req, res) => {
  const [statusStats, topDrivers] = await Promise.all([
    Driver.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    Driver.find()
      .sort({ completedDeliveries: -1 })
      .limit(5)
      .populate('user', 'name profileImage'),
  ]);

  const totalDrivers = await Driver.countDocuments();
  const activeDrivers = await Driver.countDocuments({ status: { $ne: 'offline' } });

  res.json({
    success: true,
    data: { totalDrivers, activeDrivers, statusStats, topDrivers },
  });
});

// @desc    Dashboard summary
// @route   GET /api/analytics/dashboard
// @access  Admin, General Manager
const getDashboardSummary = asyncHandler(async (req, res) => {
  const [
    totalUsers, totalShipments, activeShipments, totalDrivers,
    totalVehicles, availableVehicles, totalRevenue,
  ] = await Promise.all([
    User.countDocuments(),
    Shipment.countDocuments(),
    Shipment.countDocuments({ status: { $nin: ['delivery_confirmed', 'cancelled'] } }),
    Driver.countDocuments(),
    Vehicle.countDocuments(),
    Vehicle.countDocuments({ status: 'available' }),
    Shipment.aggregate([
      { $match: { status: 'delivery_confirmed' } },
      { $group: { _id: null, total: { $sum: '$pricing.total' } } },
    ]),
  ]);

  res.json({
    success: true,
    data: {
      totalUsers,
      totalShipments,
      activeShipments,
      totalDrivers,
      totalVehicles,
      availableVehicles,
      totalRevenue: totalRevenue[0]?.total || 0,
    },
  });
});

// @desc    Expense analytics
// @route   GET /api/analytics/expenses
// @access  Admin, Accountant
const getExpenseAnalytics = asyncHandler(async (req, res) => {
  const categoryStats = await Expense.aggregate([
    { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
    { $sort: { total: -1 } },
  ]);

  res.json({ success: true, data: { categoryStats } });
});

module.exports = { getRevenueAnalytics, getShipmentAnalytics, getDriverAnalytics, getDashboardSummary, getExpenseAnalytics };
