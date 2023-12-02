// Import necessary modules
const express = require('express');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Create an instance of Express app
const app = express();

// Define middleware
app.use(express.json()); // Middleware to parse JSON bodies

// Define your routes (sample route)
app.get('/', (req, res) => {
  res.send('Hello, this is your backend API!');
});

// Define the port where the server will run
const PORT = process.env.PORT || 8080; // Use the defined port or default to 3000

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Follow this link http://127.0.0.1:${PORT}/`)
});
