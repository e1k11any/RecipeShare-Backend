const express = require('express');
const router = express.Router();
const {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
} = require('../controllers/recipe.controller');
const { protect } = require('../middleware/auth.middleware');

// --- Public Routes ---
router.get('/', getAllRecipes);
router.get('/:id', getRecipeById);

// --- Private Routes (Protected) ---
router.post('/', protect, createRecipe);

// Update a recipe (needs to be protected)
router.put('/:id', protect, updateRecipe);

// Delete a recipe (needs to be protected)
router.delete('/:id', protect, deleteRecipe);

module.exports = router;
