// This file defines and configures our Express application.
// It sets up middleware and mounts our routes.
// It is separate from server.js to allow for easier testing.

const express = require('express');
const cors = require('cors');
const apiRoutes = require('./src/routes'); // Our main API router

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

module.exports = app;
