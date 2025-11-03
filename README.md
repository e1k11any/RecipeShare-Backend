RecipeShare API (Backend)

This is the complete, production-ready backend for RecipeShare, a social platform for creating and discovering recipes.

This API is designed to be secure, scalable, and consumed by a modern frontend application (React). It is a feature-rich v1.0 product, not just a simple demo.

🚀 Core Features

This API was built using an iterative, feature-driven approach and includes a robust set of production-grade features.

Authentication & Security:

JWT (JSON Web Token): Full stateless authentication with register and login endpoints.

Password Hashing: Uses bcrypt.js to securely hash and compare user passwords.

HTTP Security Headers: Implements helmet to protect against common web vulnerabilities (XSS, clickjacking, etc.).

Rate Limiting: Uses express-rate-limit to prevent brute-force attacks and API spam.

Full-Fledged Recipe Management:

Full CRUD: Authenticated users can Create, Read, Update, and Delete recipes.

Authorization: Endpoints are secure. A user can only edit or delete their own recipes.

Scalability & Performance:

Pagination: The GET /api/recipes endpoint is fully paginated (?page=2&limit=10) to handle millions of records.

Full-Text Search: A high-performance GET /api/recipes/search endpoint using MongoDB's native $text indexes for fast, relevant results.

Cloud Storage: All images are handled with multer and uploaded directly to Cloudinary, keeping the server stateless and scalable.

Robust API Design:

Centralized Error Handling: A clean, global error-handling system that sends consistent JSON error responses.

Async/Await: Uses an asyncHandler wrapper to manage all asynchronous controller logic.

Data Validation: Implements express-validator for API request "at-the-door" validation and Mongoose schema validation for database "at-rest" integrity.

🛠 Tech Stack

Core: Node.js, Express.js

Database: MongoDB, Mongoose

Authentication: JSON Web Token (JWT), bcrypt.js

File Uploads: Cloudinary, Multer

Security: helmet, express-rate-limit

Validation: express-validator

Utilities: dotenv

🏁 Getting Started

To get a local copy up and running, follow these simple steps.

Prerequisites

Node.js (v18 or higher)

npm

A free MongoDB Atlas account

A free Cloudinary account

Installation

Clone the repo

git clone https://github.com/e1k11any/RecipeShare-Backend/
cd // project folder


Install NPM packages

npm install
