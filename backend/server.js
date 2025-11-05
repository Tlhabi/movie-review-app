const express = require('express');
const cors = require('cors');
require('dotenv').config();
const admin = require('firebase-admin');

// Import your routes
const authRoutes = require('./routes/auth');
const reviewRoutes = require('./routes/reviews');
const movieRoutes = require('./routes/movies');

const app = express();
const PORT = process.env.PORT || 5000;

// ------------------ Middleware ------------------
// Temporary: allow all origins to ensure Render port detection
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
next();
});

// ------------------ Routes ------------------
app.use('/api/auth', authRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/movies', movieRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
res.json({ status: 'OK', message: 'Movie Review API is running', timestamp: new Date().toISOString() });
});

// Root route for Render port detection
app.get('/', (req, res) => res.status(200).send('OK'));

// 404 handler
app.use((req, res) => res.status(404).json({ error: 'Endpoint not found' }));

// Error handler
app.use((err, req, res, next) => {
console.error('Server error:', err);
res.status(500).json({ error: 'Internal server error', message: err.message });
});

// ------------------ Start server ------------------
app.listen(PORT, '0.0.0.0', () => {
console.log(`🚀 Backend server running on port ${PORT}`);

// Initialize Firebase after server is listening
try {
const serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
console.log('✅ Firebase Admin initialized successfully');
} catch (err) {
console.error('❌ Firebase initialization failed:', err);
}
});

// Heartbeat to keep Render process alive
setInterval(() => console.log('⏱️ Server heartbeat: still running...'), 10000);
