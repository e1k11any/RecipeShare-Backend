const mongoose = require('mongoose');

/**
 * Connects to the MongoDB database.
 * @param {string} mongoURI - The MongoDB connection string.
 */
const connectDB = async (mongoURI) => {
  if (!mongoURI) {
    throw new Error('MONGO_URI is not defined in environment variables.');
  }

  try {
    const conn = await mongoose.connect(mongoURI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
