const admin = require('firebase-admin');
require('dotenv').config();

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  try {
    let serviceAccount;
    
    // Check if we have the service account in environment variable (Render)
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      console.log('Using Firebase credentials from environment variable');
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    } else {
      // Fallback to file for local development
      console.log('Using Firebase credentials from file');
      const path = require('path');
      const serviceAccountPath = path.join(__dirname, '../serviceAccountKey.json');
      serviceAccount = require(serviceAccountPath);
    }
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: 'reviews-app-25'
    });
    
    console.log('✅ Firebase Admin initialized successfully');
  } catch (error) {
    console.error('❌ Firebase Admin initialization error:', error.message);
    console.error('Full error:', error);
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