const jwt = require('jsonwebtoken');

/**
 * Generates a JSON Web Token (JWT) for a given user ID.
 * @param {string} userId - The user's MongoDB ObjectId.
 * @returns {string} - The generated JWT.
 */
const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables.');
  }

  return jwt.sign(
    { id: userId }, // Payload
    process.env.JWT_SECRET, // Secret
    { expiresIn: '30d' }, // Options
  );
};

module.exports = generateToken;
