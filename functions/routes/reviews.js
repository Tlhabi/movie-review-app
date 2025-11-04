const express = require("express");
const router = express.Router();
const {db} = require("../config/firebase");
const {verifyToken} = require("../middleware/authMiddleware");

// Get all reviews for a movie
router.get("/movie/:movieId", async (req, res) => {
  try {
    const {movieId} = req.params;

    console.log("Fetching reviews for movieId:", movieId);

    // Try without orderBy first to avoid index issues
    const reviewsSnapshot = await db.collection("reviews")
        .where("movieId", "==", movieId)
        .get();

    console.log("Found", reviewsSnapshot.size, "reviews for movie");

    const reviews = reviewsSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate().toISOString(),
      };
    });

    // Sort in memory instead of Firestore
    reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json(reviews);
  } catch (error) {
    console.error("Get reviews error:", error);
    res.status(500).json({error: "Failed to fetch reviews", details: error.message});
  }
});

// Get all reviews by a user
router.get("/user/:userId", async (req, res) => {
  try {
    const {userId} = req.params;

    console.log("Fetching reviews for userId:", userId);

    // Try without orderBy first to avoid index issues
    const reviewsSnapshot = await db.collection("reviews")
        .where("userId", "==", userId)
        .get();

    console.log("Found", reviewsSnapshot.size, "reviews for user");

    const reviews = reviewsSnapshot.docs.map((doc) => {
      const data = doc.data();
      console.log("Review data:", data);
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate().toISOString(),
      };
    });

    // Sort in memory instead of Firestore
    reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    console.log("Returning", reviews.length, "reviews");

    res.json(reviews);
  } catch (error) {
    console.error("Get user reviews error:", error);
    res.status(500).json({error: "Failed to fetch user reviews", details: error.message});
  }
});

// Create a new review (protected route)
router.post("/", verifyToken, async (req, res) => {
  try {
    const {movieId, movieTitle, rating, reviewText} = req.body;
    const userId = req.user.uid;
    const userEmail = req.user.email;

    console.log("Creating review - User:", userId, userEmail);
    console.log("Review data:", {movieId, movieTitle, rating, reviewText});

    // Validation
    if (!movieId || !movieTitle || !rating || !reviewText) {
      console.log("Validation failed: Missing fields");
      return res.status(400).json({error: "All fields are required"});
    }

    if (rating < 1 || rating > 5) {
      console.log("Validation failed: Invalid rating");
      return res.status(400).json({error: "Rating must be between 1 and 5"});
    }

    if (reviewText.trim().length < 10) {
      console.log("Validation failed: Review too short");
      return res.status(400).json({error: "Review must be at least 10 characters"});
    }

    // Create review document
    const reviewData = {
      movieId: String(movieId),
      movieTitle: String(movieTitle),
      userId: String(userId),
      userEmail: String(userEmail),
      rating: Number(rating),
      reviewText: reviewText.trim(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    console.log("Saving review to Firestore:", reviewData);

    const docRef = await db.collection("reviews").add(reviewData);

    console.log("Review saved successfully with ID:", docRef.id);

    res.status(201).json({
      message: "Review created successfully",
      reviewId: docRef.id,
      ...reviewData,
      createdAt: reviewData.createdAt.toISOString(),
      updatedAt: reviewData.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error("Create review error:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({error: "Failed to create review", details: error.message});
  }
});

// Update a review (protected route)
router.put("/:reviewId", verifyToken, async (req, res) => {
  try {
    const {reviewId} = req.params;
    const {rating, reviewText} = req.body;
    const userId = req.user.uid;

    console.log("Updating review:", reviewId, "by user:", userId);

    // Get existing review
    const reviewDoc = await db.collection("reviews").doc(reviewId).get();

    if (!reviewDoc.exists) {
      console.log("Review not found:", reviewId);
      return res.status(404).json({error: "Review not found"});
    }

    // Check ownership
    if (reviewDoc.data().userId !== userId) {
      console.log("Unauthorized update attempt");
      return res.status(403).json({error: "Not authorized to update this review"});
    }

    // Validation
    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({error: "Rating must be between 1 and 5"});
    }

    if (reviewText && reviewText.trim().length < 10) {
      return res.status(400).json({error: "Review must be at least 10 characters"});
    }

    // Update review
    const updateData = {
      updatedAt: new Date(),
    };

    if (rating) updateData.rating = Number(rating);
    if (reviewText) updateData.reviewText = reviewText.trim();

    await db.collection("reviews").doc(reviewId).update(updateData);

    console.log("Review updated successfully");

    res.json({
      message: "Review updated successfully",
      reviewId,
      ...updateData,
      updatedAt: updateData.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error("Update review error:", error);
    res.status(500).json({error: "Failed to update review", details: error.message});
  }
});

// Delete a review (protected route)
router.delete("/:reviewId", verifyToken, async (req, res) => {
  try {
    const {reviewId} = req.params;
    const userId = req.user.uid;

    console.log("Deleting review:", reviewId, "by user:", userId);

    // Get existing review
    const reviewDoc = await db.collection("reviews").doc(reviewId).get();

    if (!reviewDoc.exists) {
      console.log("Review not found:", reviewId);
      return res.status(404).json({error: "Review not found"});
    }

    // Check ownership
    if (reviewDoc.data().userId !== userId) {
      console.log("Unauthorized delete attempt");
      return res.status(403).json({error: "Not authorized to delete this review"});
    }

    // Delete review
    await db.collection("reviews").doc(reviewId).delete();

    console.log("Review deleted successfully");

    res.json({message: "Review deleted successfully"});
  } catch (error) {
    console.error("Delete review error:", error);
    res.status(500).json({error: "Failed to delete review", details: error.message});
  }
});

// Get review statistics for a movie
router.get("/stats/:movieId", async (req, res) => {
  try {
    const {movieId} = req.params;

    console.log("Fetching stats for movieId:", movieId);

    const reviewsSnapshot = await db.collection("reviews")
        .where("movieId", "==", movieId)
        .get();

    if (reviewsSnapshot.empty) {
      return res.json({
        totalReviews: 0,
        averageRating: 0,
        ratingDistribution: {1: 0, 2: 0, 3: 0, 4: 0, 5: 0},
      });
    }

    let totalRating = 0;
    const ratingDistribution = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0};

    reviewsSnapshot.docs.forEach((doc) => {
      const rating = doc.data().rating;
      totalRating += rating;
      ratingDistribution[rating]++;
    });

    const totalReviews = reviewsSnapshot.size;
    const averageRating = (totalRating / totalReviews).toFixed(1);

    res.json({
      totalReviews,
      averageRating: parseFloat(averageRating),
      ratingDistribution,
    });
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({error: "Failed to fetch statistics", details: error.message});
  }
});

module.exports = router;
