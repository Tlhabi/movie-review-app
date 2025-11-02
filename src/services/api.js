import axios from 'axios';
import { auth } from '../firebase';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
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
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Movies API
export const moviesAPI = {
  getTrending: () => api.get('/movies/trending'),
  getPopular: (page = 1) => api.get(`/movies/popular?page=${page}`),
  search: (query) => api.get(`/movies/search?query=${encodeURIComponent(query)}`),
  getDetails: (movieId) => api.get(`/movies/${movieId}`),
  getCredits: (movieId) => api.get(`/movies/${movieId}/credits`),
  getSimilar: (movieId) => api.get(`/movies/${movieId}/similar`)
};

// Reviews API
export const reviewsAPI = {
  getByMovie: (movieId) => api.get(`/reviews/movie/${movieId}`),
  getByUser: (userId) => api.get(`/reviews/user/${userId}`),
  create: (reviewData) => api.post('/reviews', reviewData),
  update: (reviewId, reviewData) => api.put(`/reviews/${reviewId}`, reviewData),
  delete: (reviewId) => api.delete(`/reviews/${reviewId}`),
  getStats: (movieId) => api.get(`/reviews/stats/${movieId}`)
};

// Auth API (optional - Firebase handles this on client)
export const authAPI = {
  getUserInfo: (uid) => api.get(`/auth/user/${uid}`),
  deleteUser: (uid) => api.delete(`/auth/user/${uid}`)
};

export default api;