const dotenv = require('dotenv');
dotenv.config(); // Load .env variables into process.env

const app = require('./app'); // Our configured Express app
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 5001; // Fallback port

const startServer = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () => {
      console.log(`Server is listening on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
