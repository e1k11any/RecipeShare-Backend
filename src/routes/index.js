// This is the main router file.
// It will import and "use" all other sub-routers

const express = require('express');
const router = express.Router();
const authRoutes = require('./auth.routes');
const recipeRoutes = require('./recipe.routes');
const userRoutes = require('./user.routes');

// --- Health Check for API ---
router.get('/', (req, res) => {
  res.json({ message: 'Welcome to the RecipeShare API v1' });
});

// --- Mount Sub-Routers ---
router.use('/auth', authRoutes);
router.use('/recipes', recipeRoutes);
router.use('/users', userRoutes);

module.exports = router;
