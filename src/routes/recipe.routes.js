const express = require('express');
const router = express.Router();
const {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  searchRecipes,
} = require('../controllers/recipe.controller');
const { protect } = require('../middleware/auth.middleware');
const { apiLimiter } = require('../middleware/rateLimiter');
const upload = require('../middleware/upload');

router.use(apiLimiter);

// --- Public Routes ---
router.get('/', getAllRecipes);

// --- Search Route ---
// This MUST go before the '/:id' route
router.get('/search', searchRecipes);

router.get('/:id', getRecipeById);

// --- Private Routes (Protected) ---
router.post('/', protect, upload.single('image'), createRecipe);

// Update a recipe (needs to be protected)
router.put('/:id', protect, upload.single('image'), updateRecipe);

// Delete a recipe (needs to be protected)
router.delete('/:id', protect, deleteRecipe);

module.exports = router;
