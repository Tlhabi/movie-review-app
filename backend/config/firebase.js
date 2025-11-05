const admin = require('firebase-admin');
const path = require('path');
require('dotenv').config();

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  try {
    let serviceAccount;
    
    // Check if running on Render (cloud) or locally
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      // Parse JSON from environment variable (for Render)
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      console.log('Using Firebase credentials from environment variable');
    } else {
      // Load from file (for local development)
      const serviceAccountPath = path.join(__dirname, '../serviceAccountKey.json');
      serviceAccount = require(serviceAccountPath);
      console.log('Using Firebase credentials from file');
    }
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: 'reviews-app-25'
    });
    
    console.log('✅ Firebase Admin initialized successfully');
  } catch (error) {
    console.error('❌ Firebase Admin initialization error:', error.message);
    process.exit(1);
  }
}

const db = admin.firestore();
const auth = admin.auth();

// Set Firestore settings
db.settings({
  ignoreUndefinedProperties: true
});

console.log('✅ Firestore connected');

module.exports = { admin, db, auth };