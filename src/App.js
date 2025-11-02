import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import NavigationBar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import BrowseMovies from './pages/BrowseMovies';
import MovieDetail from './pages/MovieDetail';
import MyReviews from './pages/MyReviews';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <NavigationBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/browse" element={<BrowseMovies />} />
            <Route path="/movie/:id" element={<MovieDetail />} />
            <Route 
              path="/my-reviews" 
              element={
                <PrivateRoute>
                  <MyReviews />
                </PrivateRoute>
              } 
            />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;