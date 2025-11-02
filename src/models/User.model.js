const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters long'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please fill a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false, // --- IMPORTANT ---
      // This will prevent the password from being returned in queries
      // by default. We must explicitly ask for it when we need to validate.
    },
  },
  {
    // --- Options ---
    // This adds `createdAt` and `updatedAt` timestamps automatically.
    timestamps: true,
  },
);

// --- Mongoose Middleware ("hook") ---
// This function will run "pre" (before) a document is 'save'd.
// We use it to hash the password before it's stored.
UserSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // Generate a "salt" - a random string to add to the password
    const salt = await bcrypt.genSalt(10);
    // Hash the password with the salt
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// --- Mongoose Model Method ---
// We can add custom methods to our models.
// This one will compare a candidate password to the user's stored (hashed) password.
UserSchema.methods.comparePassword = async function (candidatePassword) {
  // 'this.password' is the hashed password from the database.
  // We need to re-enable 'select: false' to access it here.
  return await bcrypt.compare(candidatePassword, this.password);
};

// Create and export the model
const User = mongoose.model('User', UserSchema);
module.exports = User;
