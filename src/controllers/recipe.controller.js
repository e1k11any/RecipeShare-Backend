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

// /**
//  * @desc    Get all recipes
//  * @route   GET /api/recipes
//  * @access  Public
//  */
// const getAllRecipes = asyncHandler(async (req, res, next) => {
//   // We use .populate() to replace the 'author' ID with the user's document
//   // We only select the 'username' field from the populated author
//   const recipes = await Recipe.find()
//     .populate('author', 'username')
//     .sort({ createdAt: -1 });

//   res.status(200).json({
//     status: 'success',
//     results: recipes.length,
//     data: {
//       recipes,
//     },
//   });
// });

/**
 * @desc    Get all recipes with pagination
 * @route   GET /api/recipes
 * @access  Public
 */
const getAllRecipes = asyncHandler(async (req, res, next) => {
  // 1. Get pagination parameters from query string
  //    We use parseInt to convert string query params to numbers
  //    We set default values: page 1, limit 10
  const page = parseInt(req.query.page) || 1;

  // 2. Set a max limit (e.g., 50) to prevent abuse
  const defaultLimit = 10;
  const maxLimit = 50;
  const limit = Math.min(parseInt(req.query.limit) || defaultLimit, maxLimit);

  // 3. Calculate the number of documents to skip
  const skip = (page - 1) * limit;

  // 4. Get the total count of all recipes for pagination metadata
  //    We run this as a separate, fast query.
  const totalItems = await Recipe.countDocuments();

  // 5. Get the recipes for the current page
  const recipes = await Recipe.find()
    .populate('author', 'username') // Still populate the author
    .sort({ createdAt: -1 }) // Still sort by newest
    .skip(skip) // Apply the skip
    .limit(limit); // Apply the limit

  // 6. Calculate total pages
  const totalPages = Math.ceil(totalItems / limit);

  // 7. Send the new, detailed response
  res.status(200).json({
    status: 'success',
    results: recipes.length, // Number of items on this specific page
    data: {
      recipes,
    },
    // This new pagination object is for the frontend
    pagination: {
      currentPage: page,
      totalPages: totalPages,
      totalItems: totalItems,
      limit: limit,
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

/**
 * @desc    Search for recipes with pagination
 * @route   GET /api/recipes/search
 * @access  Public
 */
const searchRecipes = asyncHandler(async (req, res, next) => {
  const { q } = req.query;

  // 1. Check if a search query 'q' was provided
  if (!q) {
    return next(new AppError('Please provide a search term', 400));
  }

  // 2. Define the search query for MongoDB
  const searchQuery = { $text: { $search: q } };

  // 3. Apply pagination (re-using our logic from getAllRecipes)
  const page = parseInt(req.query.page) || 1;
  const defaultLimit = 10;
  const maxLimit = 50;
  const limit = Math.min(parseInt(req.query.limit) || defaultLimit, maxLimit);
  const skip = (page - 1) * limit;

  // 4. Get the total count *for the search results*
  const totalItems = await Recipe.countDocuments(searchQuery);

  // 5. Find the recipes
  const recipes = await Recipe.find(
    searchQuery,
    // --- Projection ---
    // We add a 'score' field, which is the "relevance"
    // calculated by MongoDB.
    { score: { $meta: 'textScore' } },
  )
    .populate('author', 'username')
    // --- Sort by Relevance ---
    // We sort the results by the 'score' field in descending order
    // to show the most relevant results first.
    .sort({ score: { $meta: 'textScore' } })
    .skip(skip)
    .limit(limit);

  // 6. Calculate total pages
  const totalPages = Math.ceil(totalItems / limit);

  // 7. Send the response
  res.status(200).json({
    status: 'success',
    results: recipes.length,
    data: {
      recipes,
    },
    pagination: {
      currentPage: page,
      totalPages: totalPages,
      totalItems: totalItems,
      limit: limit,
      query: q,
    },
  });
});

module.exports = {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  searchRecipes,
};
