const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// @desc    Get all users
// @route   GET /api/users
// @access  Admin
const getUsers = asyncHandler(async (req, res) => {
  const { role, isActive, page = 1, limit = 10, search } = req.query;
  let query = {};
  if (role) query.role = role;
  if (isActive !== undefined) query.isActive = isActive === 'true';
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (page - 1) * limit;
  const total = await User.countDocuments(query);
  const users = await User.find(query).skip(skip).limit(Number(limit)).sort({ createdAt: -1 });
  res.json({ success: true, count: users.length, total, data: users });
});

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Admin
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) { res.status(404); throw new Error('User not found'); }
  res.json({ success: true, data: user });
});

// @desc    Create user
// @route   POST /api/users
// @access  Admin, Owner
const createUser = asyncHandler(async (req, res) => {
  const { role } = req.body;

  // Enforce hierarchy
  if (req.user.role === 'admin') {
    if (role === 'admin' || role === 'owner') {
      res.status(403);
      throw new Error('Admins cannot create other admins or owners');
    }
  } else if (req.user.role === 'owner') {
    if (role === 'owner') {
      res.status(403);
      throw new Error('Cannot create another owner');
    }
  }

  const user = await User.create(req.body);
  res.status(201).json({ success: true, data: user });
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Admin, Owner
const updateUser = asyncHandler(async (req, res) => {
  const { password, role, ...updateData } = req.body; // Don't allow password change here

  const targetUser = await User.findById(req.params.id);
  if (!targetUser) { res.status(404); throw new Error('User not found'); }

  // Enforce hierarchy
  if (req.user.role === 'admin' && (targetUser.role === 'admin' || targetUser.role === 'owner')) {
    res.status(403);
    throw new Error('Admins cannot modify other admins or owners');
  }

  // Update logic
  if (role && req.user.role === 'admin' && (role === 'admin' || role === 'owner')) {
    res.status(403);
    throw new Error('Admins cannot upgrade a user to admin or owner');
  } else if (role) {
    updateData.role = role;
  }

  const user = await User.findByIdAndUpdate(req.params.id, updateData, {
    new: true, runValidators: true,
  });
  
  res.json({ success: true, data: user });
});

// @desc    Toggle user active status
// @route   PUT /api/users/:id/toggle-status
// @access  Admin, Owner
const toggleUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) { res.status(404); throw new Error('User not found'); }

  if (req.user.role === 'admin' && (user.role === 'admin' || user.role === 'owner')) {
    res.status(403);
    throw new Error('Admins cannot toggle status of other admins or owners');
  }

  user.isActive = !user.isActive;
  await user.save();
  res.json({ success: true, data: user, message: `User ${user.isActive ? 'activated' : 'deactivated'}` });
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Admin, Owner
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) { res.status(404); throw new Error('User not found'); }

  if (req.user.role === 'admin' && (user.role === 'admin' || user.role === 'owner')) {
    res.status(403);
    throw new Error('Admins cannot delete other admins or owners');
  }

  if (req.user.role === 'owner' && user.role === 'owner') {
    res.status(403);
    throw new Error('Cannot delete owner');
  }

  await user.deleteOne();
  res.json({ success: true, message: 'User deleted' });
});

module.exports = { getUsers, getUser, createUser, updateUser, toggleUserStatus, deleteUser };
