const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Recipe title is required'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [1000, 'Description cannot be more than 1000 characters'],
    },
    prepTime: {
      type: Number,
      required: [true, 'Prep time is required'],
      min: [0, 'Prep time cannot be negative'],
    },
    cookTime: {
      type: Number,
      required: [true, 'Cook time is required'],
      min: [0, 'Cook time cannot be negative'],
    },
    ingredients: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
    instructions: {
      type: String,
      required: [true, 'Instructions are required'],
    },
    // --- The Relationship ---
    // This establishes the link between a Recipe and its User (author).
    author: {
      // We are storing the author's User ID
      type: mongoose.Schema.Types.ObjectId,
      // We are referencing the 'User' model
      ref: 'User',
      required: true,
    },

    recipeImage: {
      type: String, // This will be the URL from Cloudinary
      default: 'https_placeholder_url', // Add a link to a default placeholder
    },
    recipeImageId: {
      type: String, // This is the public_id from Cloudinary
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  },
);

// --- Add Text Index ---
// This tells MongoDB to create a text index on the 'title' and 'description' fields
// This allows for efficient, full-text search.
RecipeSchema.index({
  title: 'text',
  description: 'text',
});

const Recipe = mongoose.model('Recipe', RecipeSchema);
module.exports = Recipe;
