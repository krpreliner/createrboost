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
  }
  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// @desc    Get user profile and membership
// @route   GET /api/user/profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get the user's membership details
    const membership = await Membership.findOne({ user: req.user._id, status: 'active' })
      .sort({ endDate: -1 });

    res.json({
      user,
      membership: membership || null
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
