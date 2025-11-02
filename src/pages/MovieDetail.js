import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Badge, Spinner, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import ReviewCard from '../components/ReviewCard';
import ReviewForm from '../components/ReviewForm';
import { moviesAPI, reviewsAPI } from '../services/api';

export default function MovieDetail() {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingReview, setEditingReview] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchMovieDetails();
    fetchReviews();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchMovieDetails = async () => {
    try {
      const response = await moviesAPI.getDetails(id);
      setMovie(response.data);
    } catch (error) {
      console.error('Error fetching movie details:', error);
    }
    setLoading(false);
  };

  const fetchReviews = async () => {
    try {
      console.log('Fetching reviews for movie:', id);
      const response = await reviewsAPI.getByMovie(id);
      console.log('Reviews fetched:', response.data);
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      console.error('Error response:', error.response?.data);
    }
  };

  const handleSubmitReview = async (reviewData) => {
    if (!currentUser) {
      setMessage('Please log in to submit a review');
      return;
    }

    try {
      const payload = {
        movieId: id,
        movieTitle: movie.title,
        rating: reviewData.rating,
        reviewText: reviewData.reviewText
      };

      console.log('Submitting review:', payload);
      console.log('Current user:', currentUser.uid, currentUser.email);

      const response = await reviewsAPI.create(payload);
      console.log('Review created:', response.data);
      
      setMessage('Review submitted successfully!');
      fetchReviews(); // Refresh the reviews list
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error submitting review:', error);
      console.error('Error response:', error.response?.data);
      setMessage(error.response?.data?.error || 'Failed to submit review. Please try again.');
    }
  };

  const handleUpdateReview = async (reviewData) => {
    try {
      await reviewsAPI.update(editingReview.id, {
        rating: reviewData.rating,
        reviewText: reviewData.reviewText
      });
      
      setMessage('Review updated successfully!');
      setEditingReview(null);
      fetchReviews();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error updating review:', error);
      setMessage(error.response?.data?.error || 'Failed to update review. Please try again.');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await reviewsAPI.delete(reviewId);
        setMessage('Review deleted successfully!');
        fetchReviews();
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        console.error('Error deleting review:', error);
        setMessage(error.response?.data?.error || 'Failed to delete review. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" />
        <p className="mt-3">Loading movie details...</p>
      </Container>
    );
  }

  if (!movie) {
    return (
      <Container>
        <Alert variant="danger">Movie not found</Alert>
      </Container>
    );
  }

  const imageUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Image';

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : null;

  return (
    <div>
      {/* Movie Header with Backdrop */}
      {backdropUrl && (
        <div 
          className="movie-backdrop"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${backdropUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            padding: '60px 0',
            marginBottom: '30px'
          }}
        >
          <Container>
            <Row>
              <Col md={3}>
                <img 
                  src={imageUrl} 
                  alt={movie.title} 
                  className="img-fluid rounded shadow-lg"
                />
              </Col>
              <Col md={9} className="text-white">
                <h1 className="display-4 fw-bold">{movie.title}</h1>
                <p className="lead">{movie.tagline}</p>
                <div className="mb-3">
                  <Badge bg="warning" text="dark" className="me-2">
                    ⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
                  </Badge>
                  <Badge bg="secondary" className="me-2">
                    {movie.release_date ? movie.release_date.substring(0, 4) : 'N/A'}
                  </Badge>
                  <Badge bg="info">
                    {movie.runtime} min
                  </Badge>
                </div>
                <div className="mb-3">
                  {movie.genres && movie.genres.map(genre => (
                    <Badge key={genre.id} bg="dark" className="me-2">
                      {genre.name}
                    </Badge>
                  ))}
                </div>
                <p>{movie.overview}</p>
              </Col>
            </Row>
          </Container>
        </div>
      )}

      <Container>
        {/* Reviews Section */}
        <Row>
          <Col lg={8}>
            <h3 className="mb-4">User Reviews ({reviews.length})</h3>
            
            {message && <Alert variant="success">{message}</Alert>}
            
            {reviews.length > 0 ? (
              <div>
                {reviews.map((review) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    onEdit={setEditingReview}
                    onDelete={handleDeleteReview}
                  />
                ))}
              </div>
            ) : (
              <Alert variant="info">
                No reviews yet. Be the first to review this movie!
              </Alert>
            )}
          </Col>

          {/* Review Form */}
          <Col lg={4}>
            <div className="sticky-top" style={{ top: '20px' }}>
              <h4 className="mb-3">
                {editingReview ? 'Edit Your Review' : 'Write a Review'}
              </h4>
              {currentUser ? (
                <ReviewForm
                  onSubmit={editingReview ? handleUpdateReview : handleSubmitReview}
                  initialData={editingReview}
                  onCancel={() => setEditingReview(null)}
                />
              ) : (
                <Alert variant="warning">
                  Please log in to write a review
                </Alert>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}