const express = require('express');
const router = express.Router();
const { getMyRecipes } = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');
const { apiLimiter } = require('../middleware/rateLimiter');

// @route   GET /api/users/my-recipes
// We protect it, so we know who 'me' is
router.get('/my-recipes', protect, getMyRecipes);

router.use(apiLimiter);

module.exports = router;
