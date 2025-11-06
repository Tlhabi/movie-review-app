import axios from 'axios';
import { auth } from '../firebase';

// For local development, use localhost
// For production, use your deployed backend URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    try {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    } catch (error) {
      console.error('Error getting auth token:', error);
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ERR_NETWORK') {
      console.error('Backend server is not running. Please start it with: cd backend && npm run dev');
    }
    return Promise.reject(error);
  }
);

// Movies API
export const moviesAPI = {
  getTrending: () => api.get('/api/movies/trending'),
  getPopular: (page = 1) => api.get(`/api/movies/popular?page=${page}`),
  search: (query) => api.get(`/api/movies/search?query=${encodeURIComponent(query)}`),
  getDetails: (movieId) => api.get(`/api/movies/${movieId}`),
  getCredits: (movieId) => api.get(`/api/movies/${movieId}/credits`),
  getSimilar: (movieId) => api.get(`/api/movies/${movieId}/similar`)
};

// Reviews API
export const reviewsAPI = {
  getByMovie: (movieId) => api.get(`/api/reviews/movie/${movieId}`),
  getByUser: (userId) => api.get(`/api/reviews/user/${userId}`),
  create: (reviewData) => api.post('/api/reviews', reviewData),
  update: (reviewId, reviewData) => api.put(`/api/reviews/${reviewId}`, reviewData),
  delete: (reviewId) => api.delete(`/api/reviews/${reviewId}`),
  getStats: (movieId) => api.get(`/api/reviews/stats/${movieId}`)
};

export default api;