import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import { moviesAPI } from '../services/api';

export default function Home() {
  const [trendingMovies, setTrendingMovies] = useState([]);

  useEffect(() => {
    fetchTrendingMovies();
  }, []);

  const fetchTrendingMovies = async () => {
    try {
      const response = await moviesAPI.getTrending();
      setTrendingMovies(response.data.results.slice(0, 6));
    } catch (error) {
      console.error('Error fetching trending movies:', error);
    }
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <div className="hero-section text-white py-5 mb-5">
        <Container>
          <Row className="align-items-center">
            <Col md={8}>
              <h1 className="display-3 fw-bold mb-3">Welcome to Cinema Diary</h1>
              <p className="lead mb-4">
                Discover movies, read reviews, and share your thoughts with the community.
                Your opinion matters!
              </p>
              <Link to="/browse">
                <Button variant="warning" size="lg" className="me-3">
                  Browse Movies
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="outline-light" size="lg">
                  Get Started
                </Button>
              </Link>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Trending Movies Section */}
      <Container>
        <h2 className="mb-4">Trending This Week</h2>
        <Row>
          {trendingMovies.map((movie) => (
            <Col key={movie.id} xs={12} sm={6} md={4} lg={2} className="mb-4">
              <MovieCard movie={movie} />
            </Col>
          ))}
        </Row>

        {/* Features Section */}
        <Row className="mt-5 py-5">
          <Col md={4} className="text-center mb-4">
            <div className="feature-icon mb-3">🎬</div>
            <h4>Discover Movies</h4>
            <p className="text-muted">
              Browse thousands of movies with detailed information from TMDB
            </p>
          </Col>
          <Col md={4} className="text-center mb-4">
            <div className="feature-icon mb-3">⭐</div>
            <h4>Rate & Review</h4>
            <p className="text-muted">
              Share your opinions and ratings with fellow movie enthusiasts
            </p>
          </Col>
          <Col md={4} className="text-center mb-4">
            <div className="feature-icon mb-3">👥</div>
            <h4>Join Community</h4>
            <p className="text-muted">
              Read what others think and engage in movie discussions
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  );
}