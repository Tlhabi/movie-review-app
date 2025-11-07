const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const reviewRoutes = require('./routes/reviews');
const movieRoutes = require('./routes/movies');

const app = express();

// ✅ Use Render’s assigned port if available, otherwise default to 5000
const PORT = process.env.PORT || 5000;

// ✅ Enable CORS for both local and deployed frontends
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://reviews-app-25.web.app',
    'https://reviews-app-25.firebaseapp.com'
  ],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Request logging middleware (keeps track of all requests)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ✅ Main API routes
app.use('/api/auth', authRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/movies', movieRoutes);

// ✅ Health check endpoint (important for Render uptime checks)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Movie Review API is running',
    timestamp: new Date().toISOString()
  });
});

// ✅ Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Movie Review Backend API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      reviews: '/api/reviews',
      movies: '/api/movies',
      health: '/api/health'
    }
  });
});

// ✅ 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// ✅ Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// ✅ Start server — this is the critical part for Render
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Backend server successfully running on port ${PORT}`);
  console.log(`📡 API endpoints available at /api`);
  console.log(`🌐 Server is listening on 0.0.0.0:${PORT}`);
});

// ✅ Keep process alive signal for Render
process.on('SIGTERM', () => {
  console.log('🛑 Render instance shutting down gracefully.');
  process.exit(0);
});
