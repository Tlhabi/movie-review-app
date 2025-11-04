const express = require("express");
const router = express.Router();
const axios = require("axios");
require("dotenv").config();

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

// Get trending movies
router.get("/trending", async (req, res) => {
  try {
    const response = await axios.get(
        `${TMDB_BASE_URL}/trending/movie/week?api_key=${TMDB_API_KEY}`,
    );
    res.json(response.data);
  } catch (error) {
    console.error("Trending movies error:", error);
    res.status(500).json({error: "Failed to fetch trending movies"});
  }
});

// Get popular movies
router.get("/popular", async (req, res) => {
  try {
    const page = req.query.page || 1;
    const response = await axios.get(
        `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&page=${page}`,
    );
    res.json(response.data);
  } catch (error) {
    console.error("Popular movies error:", error);
    res.status(500).json({error: "Failed to fetch popular movies"});
  }
});

// Search movies
router.get("/search", async (req, res) => {
  try {
    const {query} = req.query;

    if (!query) {
      return res.status(400).json({error: "Search query is required"});
    }

    const response = await axios.get(
        `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`,
    );
    res.json(response.data);
  } catch (error) {
    console.error("Search movies error:", error);
    res.status(500).json({error: "Failed to search movies"});
  }
});

// Get movie details
router.get("/:movieId", async (req, res) => {
  try {
    const {movieId} = req.params;
    const response = await axios.get(
        `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}`,
    );
    res.json(response.data);
  } catch (error) {
    console.error("Movie details error:", error);

    if (error.response?.status === 404) {
      return res.status(404).json({error: "Movie not found"});
    }

    res.status(500).json({error: "Failed to fetch movie details"});
  }
});

// Get movie credits (cast & crew)
router.get("/:movieId/credits", async (req, res) => {
  try {
    const {movieId} = req.params;
    const response = await axios.get(
        `${TMDB_BASE_URL}/movie/${movieId}/credits?api_key=${TMDB_API_KEY}`,
    );
    res.json(response.data);
  } catch (error) {
    console.error("Movie credits error:", error);
    res.status(500).json({error: "Failed to fetch movie credits"});
  }
});

// Get similar movies
router.get("/:movieId/similar", async (req, res) => {
  try {
    const {movieId} = req.params;
    const response = await axios.get(
        `${TMDB_BASE_URL}/movie/${movieId}/similar?api_key=${TMDB_API_KEY}`,
    );
    res.json(response.data);
  } catch (error) {
    console.error("Similar movies error:", error);
    res.status(500).json({error: "Failed to fetch similar movies"});
  }
});

module.exports = router;
