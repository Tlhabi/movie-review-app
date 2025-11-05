# Movie Review Platform 🎬

A full-stack movie review application with React, Node.js, Express, and Firebase.

## 🌐 Live Demo
- **Frontend:** https://reviews-app-25.web.app
- **Backend API:** https://movie-review-backend-xxxx.onrender.com
- **GitHub:** https://github.com/YOUR_USERNAME/movie-review-app

## 🚀 Fully Deployed Application

The application is **fully deployed and functional**. No local setup required to use it!

- Frontend hosted on **Firebase Hosting**
- Backend API hosted on **Render.com**
- Database on **Firebase Firestore**

Just visit https://reviews-app-25.web.app and start reviewing movies!

## 🛠️ For Development (Optional)

If you want to run it locally:

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
npm install
npm start
```

## 🎯 Features
✅ User authentication  
✅ Browse 1000s of movies from TMDB  
✅ Create, edit, delete reviews  
✅ View reviews from all users  
✅ Personal review management  
✅ Fully responsive design  

## 🏗️ Architecture

**Frontend (React)** → **Backend (Node.js/Express)** → **Database (Firebase Firestore)**
                    ↓
              **TMDB API**

## 📋 Technology Stack

### Frontend
- React.js with Hooks
- React Router for navigation
- Bootstrap for styling
- Axios for API calls
- Firebase Authentication

### Backend
- Node.js & Express.js
- Firebase Admin SDK
- JWT middleware
- RESTful API design
- TMDB API integration

### Database & Hosting
- Firebase Firestore (Database)
- Firebase Hosting (Frontend)
- Render.com (Backend API)

## 🔐 Environment Variables

Backend environment variables are configured on Render.com:
- `PORT`
- `TMDB_API_KEY`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_SERVICE_ACCOUNT` (Service account JSON)

## 📊 API Endpoints

Base URL: `https://movie-review-backend-xxxx.onrender.com/api`

**Movies:**
- GET `/movies/trending` - Trending movies
- GET `/movies/popular` - Popular movies
- GET `/movies/search?query=` - Search movies
- GET `/movies/:id` - Movie details

**Reviews:**
- GET `/reviews/movie/:movieId` - All reviews for a movie
- GET `/reviews/user/:userId` - User's reviews
- POST `/reviews` - Create review (auth)
- PUT `/reviews/:id` - Update review (auth)
- DELETE `/reviews/:id` - Delete review (auth)

## 🎓 Assignment Requirements

✅ React frontend - **Deployed on Firebase**  
✅ Node.js backend - **Deployed on Render**  
✅ Firebase database - **Firestore Cloud**  
✅ 5+ pages - **6 pages total**  
✅ Bootstrap styling - **React-Bootstrap**  
✅ CRUD operations - **Full implementation**  
✅ External API - **TMDB integration**  
✅ GitHub repository - **Version controlled**  
✅ Firebase hosting - **Live deployment**  

## 👨‍💻 Author
[Your Name]

## 📄 License
Educational project