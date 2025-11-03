const express = require('express');
const router = express.Router();
const { getMyRecipes } = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');

// @route   GET /api/users/my-recipes
// We protect it, so we know who 'me' is
router.get('/my-recipes', protect, getMyRecipes);

module.exports = router;
