const express = require("express");
const router = express.Router();
const {auth} = require("../config/firebase");

// Register new user
router.post("/signup", async (req, res) => {
  try {
    const {email, password} = req.body;

    if (!email || !password) {
      return res.status(400).json({error: "Email and password required"});
    }

    if (password.length < 6) {
      return res.status(400).json({error: "Password must be at least 6 characters"});
    }

    // Create user in Firebase Auth
    const userRecord = await auth.createUser({
      email,
      password,
      emailVerified: false,
    });

    res.status(201).json({
      message: "User created successfully",
      userId: userRecord.uid,
      email: userRecord.email,
    });
  } catch (error) {
    console.error("Signup error:", error);

    if (error.code === "auth/email-already-exists") {
      return res.status(400).json({error: "Email already in use"});
    }

    res.status(500).json({error: "Failed to create user"});
  }
});

// Get user info
router.get("/user/:uid", async (req, res) => {
  try {
    const {uid} = req.params;
    const userRecord = await auth.getUser(uid);

    res.json({
      uid: userRecord.uid,
      email: userRecord.email,
      emailVerified: userRecord.emailVerified,
      createdAt: userRecord.metadata.creationTime,
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(404).json({error: "User not found"});
  }
});

// Delete user
router.delete("/user/:uid", async (req, res) => {
  try {
    const {uid} = req.params;
    await auth.deleteUser(uid);
    res.json({message: "User deleted successfully"});
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({error: "Failed to delete user"});
  }
});

module.exports = router;
