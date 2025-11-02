import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA4dA6_9hu9utHPS1WObW3WmsZRYnKViJs",
  authDomain: "reviews-app-25.firebaseapp.com",
  projectId: "reviews-app-25",
  storageBucket: "reviews-app-25.firebasestorage.app",
  messagingSenderId: "836324826089",
  appId: "1:836324826089:web:7f5f8627e748e863df4978",
  measurementId: "G-NY9LTV49RV"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;