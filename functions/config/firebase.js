const admin = require("firebase-admin");
const path = require("path");
require("dotenv").config();

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  try {
    // Try to load service account key
    const serviceAccountPath = path.join(__dirname, "../serviceAccountKey.json");

    const serviceAccount = require(serviceAccountPath);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: "reviews-app-25",
    });

    console.log("✅ Firebase Admin initialized with service account");
  } catch (error) {
    console.error("❌ Firebase Admin initialization error:", error.message);
    console.error("Make sure serviceAccountKey.json exists in backend folder");
    process.exit(1);
  }
}

const db = admin.firestore();
const auth = admin.auth();

// Set Firestore settings
db.settings({
  ignoreUndefinedProperties: true,
});

console.log("✅ Firestore connected");

module.exports = {admin, db, auth};
