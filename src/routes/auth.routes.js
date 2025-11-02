const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/auth.controller');
const {
  registerRules,
  loginRules,
  validate,
} = require('../middleware/authValidator');

// @route   POST /api/auth/register
router.post('/register', registerRules(), validate, registerUser);

// @route   POST /api/auth/login
router.post('/login', loginRules(), validate, loginUser);

module.exports = router;
