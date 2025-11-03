const Recipe = require('../models/Recipe.model');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

/**
 * @desc    Create a new recipe
 * @route   POST /api/recipes
 * @access  Private
 */
const createRecipe = asyncHandler(async (req, res, next) => {
  const { title, description, prepTime, cookTime, ingredients, instructions } =
    req.body;

  // Basic validation (express-validator can be added later)
  if (
    !title ||
    !description ||
    !prepTime ||
    !cookTime ||
    !ingredients ||
    !instructions
  ) {
    return next(new AppError('Please provide all required fields', 400));
  }

  // The 'protect' middleware gives us req.user
  const author = req.user._id;

  const recipe = await Recipe.create({
    title,
    description,
    prepTime,
    cookTime,
    ingredients,
    instructions,
    author,
  });

  res.status(201).json({
    status: 'success',
    data: {
      recipe,
    },
  });
});

/**
 * @desc    Get all recipes
 * @route   GET /api/recipes
 * @access  Public
 */
const getAllRecipes = asyncHandler(async (req, res, next) => {
  // We use .populate() to replace the 'author' ID with the user's document
  // We only select the 'username' field from the populated author
  const recipes = await Recipe.find()
    .populate('author', 'username')
    .sort({ createdAt: -1 });

  res.status(200).json({
    status: 'success',
    results: recipes.length,
    data: {
      recipes,
    },
  });
});

/**
 * @desc    Get a single recipe by its ID
 * @route   GET /api/recipes/:id
 * @access  Public
 */
const getRecipeById = asyncHandler(async (req, res, next) => {
  const recipe = await Recipe.findById(req.params.id).populate(
    'author',
    'username',
  );

  if (!recipe) {
    // Our global error handler will catch Mongoose 'CastError'
    // but this is a good explicit check.
    return next(new AppError('No recipe found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      recipe,
    },
  });
});

/**
 * @desc    Update an existing recipe
 * @route   PUT /api/recipes/:id
 * @access  Private
 */
const updateRecipe = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { title, description, prepTime, cookTime, ingredients, instructions } =
    req.body;

  // 1. Find the recipe by its ID
  const recipe = await Recipe.findById(id);

  // 2. Check if the recipe exists
  if (!recipe) {
    return next(new AppError('No recipe found with that ID', 404));
  }

  // 3. --- AUTHORIZATION CHECK ---
  // Check if the logged-in user (req.user) is the author
  // We must convert the ObjectId to a string for comparison
  if (recipe.author.toString() !== req.user._id.toString()) {
    return next(
      new AppError('You are not authorized to edit this recipe', 403), // 403 Forbidden
    );
  }

  // 4. If checks pass, update the recipe
  // We use findByIdAndUpdate which is more efficient
  const updatedRecipe = await Recipe.findByIdAndUpdate(
    id,
    {
      title,
      description,
      prepTime,
      cookTime,
      ingredients,
      instructions,
    },
    {
      new: true, // This option returns the modified document
      runValidators: true, // This runs our Mongoose model validators
    },
  ).populate('author', 'username'); // Re-populate the author

  res.status(200).json({
    status: 'success',
    data: {
      recipe: updatedRecipe,
    },
  });
});

/**
 * @desc    Delete a recipe
 * @route   DELETE /api/recipes/:id
 * @access  Private
 */
const deleteRecipe = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  // 1. Find the recipe by its ID
  const recipe = await Recipe.findById(id);

  // 2. Check if the recipe exists
  if (!recipe) {
    return next(new AppError('No recipe found with that ID', 404));
  }

  // 3. --- AUTHORIZATION CHECK ---
  if (recipe.author.toString() !== req.user._id.toString()) {
    return next(
      new AppError('You are not authorized to delete this recipe', 403), // 403 Forbidden
    );
  }

  // 4. If checks pass, delete the recipe
  await recipe.deleteOne(); // Use .deleteOne() on the document

  res.status(204).json({
    // 204 No Content (standard for successful delete)
    status: 'success',
    data: null,
  });
});

module.exports = {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
};
