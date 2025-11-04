const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Initialize Firebase Admin SDK
admin.initializeApp();

const authRoutes = require("./routes/auth");
const reviewRoutes = require("./routes/reviews");
const movieRoutes = require("./routes/movies");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use("/auth", authRoutes); // remove /api prefix; handled via rewrites
app.use("/reviews", reviewRoutes);
app.use("/movies", movieRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Movie Review API is running",
    timestamp: new Date().toISOString(),
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Movie Review Backend API",
    version: "1.0.0",
    endpoints: {
      auth: "/auth",
      reviews: "/reviews",
      movies: "/movies",
      health: "/health",
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({error: "Endpoint not found"});
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({
    error: "Internal server error",
    message: err.message,
  });
});

// Export Express app as Firebase Function
exports.api = functions.https.onRequest(app);
