const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Membership = require('../models/Membership');

const router = express.Router();

// Middleware to protect routes
const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Middleware for admin access
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
router.get('/stats', protect, admin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const activeMembers = await User.countDocuments({ membershipStatus: 'active' });
    
    // In a real app, calculate actual revenue from payments
    // Using dummy numbers for now since we skipped payment integration
    const revenue = activeMembers * 2500; 

    res.json({
      totalUsers,
      activeMembers,
      revenue,
      newSignupsToday: 5 // mock value
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all users
// @route   GET /api/admin/users
router.get('/users', protect, admin, async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Add a new member
// @route   POST /api/admin/users
router.post('/users', protect, admin, async (req, res) => {
  try {
    const { name, email, password, phone, planName } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      membershipStatus: 'active',
      role: 'user'
    });

    if (user) {
      // Calculate end date based on plan (default 1 year for simplicity here)
      const startDate = new Date();
      const endDate = new Date();
      endDate.setFullYear(startDate.getFullYear() + 1);

      await Membership.create({
        user: user._id,
        planName: planName || 'Basic Yearly',
        startDate,
        endDate,
        status: 'active'
      });

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        membershipStatus: user.membershipStatus,
        joiningDate: user.joiningDate
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update user membership status
// @route   PUT /api/admin/users/:id/membership
router.put('/users/:id/membership', protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (user) {
      user.membershipStatus = req.body.status || user.membershipStatus;
      const updatedUser = await user.save();
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
