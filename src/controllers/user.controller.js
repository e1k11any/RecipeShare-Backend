const Recipe = require('../models/Recipe.model');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Get all recipes created by the current user
 * @route   GET /api/users/my-recipes
 * @access  Private
 */
const getMyRecipes = asyncHandler(async (req, res, next) => {
  // We have req.user from the 'protect' middleware
  const recipes = await Recipe.find({ author: req.user._id }).sort({
    createdAt: -1,
  });

  res.status(200).json({
    status: 'success',
    results: recipes.length,
    data: {
      recipes,
    },
  });
});

module.exports = {
  getMyRecipes,
};
