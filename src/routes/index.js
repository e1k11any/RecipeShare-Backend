// This is the main router file.
// It will import and "use" all other sub-routers

const express = require('express');
const router = express.Router();

// --- Health Check for API ---
router.get('/', (req, res) => {
  res.json({ message: 'Welcome to the RecipeShare API v1' });
});

module.exports = router;
