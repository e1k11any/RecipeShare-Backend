const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
} = require('../controllers/auth.controller');
const {
  registerRules,
  loginRules,
  validate,
} = require('../middleware/authValidator');
const { protect } = require('../middleware/auth.middleware');
const { authLimiter } = require('../middleware/rateLimiter');

// @route   POST /api/auth/register
router.post('/register', authLimiter, registerRules(), validate, registerUser);

// @route   POST /api/auth/login
router.post('/login', authLimiter, loginRules(), validate, loginUser);

// @route   GET /api/auth/me
router.get('/me', protect, getMe);
module.exports = router;
