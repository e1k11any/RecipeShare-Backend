// This file defines and configures our Express application.
// It sets up middleware and mounts our routes.
// It is separate from server.js to allow for easier testing.

const express = require('express');
const cors = require('cors');
const apiRoutes = require('./src/routes'); // Our main API router
const errorHandler = require('./src/middleware/errorHandler');
const AppError = require('./src/utils/AppError');
const app = express();

// --- Core Middleware ---

// This allows your React app (running on a different port) to make requests
app.use(cors());

// This parses incoming requests with JSON payloads
app.use(express.json());

// This parses incoming requests with URL-encoded payloads
app.use(express.urlencoded({ extended: true }));

// --- API Routes ---
app.use('/api', apiRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

// --- 404 Not Found Handler ---
// This middleware will run for any request that doesn't
// match a route defined above.
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// --- Global Error Handler ---
// This is our *final* middleware. All errors get passed to this.
app.use(errorHandler);

module.exports = app;
