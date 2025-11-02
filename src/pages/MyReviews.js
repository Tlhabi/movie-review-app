import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { reviewsAPI } from '../services/api';

export default function MyReviews() {
  const { currentUser } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchMyReviews();
  }, [currentUser]);

  const fetchMyReviews = async () => {
  if (!currentUser) return;

  console.log('Fetching reviews for user:', currentUser.uid); // DEBUG

  try {
    const response = await reviewsAPI.getByUser(currentUser.uid);
    console.log('Fetched reviews:', response.data); // DEBUG
    setReviews(response.data);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    console.error('Error response:', error.response?.data); // DEBUG
  }
  setLoading(false);
};

  const handleDelete = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await reviewsAPI.delete(reviewId);
        setMessage('Review deleted successfully!');
        fetchMyReviews();
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        console.error('Error deleting review:', error);
        setMessage(error.response?.data?.error || 'Failed to delete review. Please try again.');
      }
    }
  };

  const renderStars = (rating) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  if (loading) {
    return (
      <Container>
        <p className="text-center">Loading your reviews...</p>
      </Container>
    );
  }

  return (
    <Container>
      <h1 className="mb-4">My Reviews</h1>
      
      {message && <Alert variant="success">{message}</Alert>}

      {reviews.length > 0 ? (
        <Row>
          {reviews.map((review) => (
            <Col key={review.id} md={6} lg={4} className="mb-4">
              <Card className="h-100">
                <Card.Body>
                  <Card.Title>
                    <Link to={`/movie/${review.movieId}`} className="text-decoration-none">
                      {review.movieTitle}
                    </Link>
                  </Card.Title>
                  <div className="text-warning mb-2">
                    {renderStars(review.rating)}
                  </div>
                  <Card.Text className="text-muted small mb-2">
                    {review.createdAt && 
                      new Date(review.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                    }
                  </Card.Text>
                  <Card.Text>{review.reviewText}</Card.Text>
                  <div className="mt-3">
                    <Link to={`/movie/${review.movieId}`}>
                      <Button variant="outline-primary" size="sm" className="me-2">
                        View Movie
                      </Button>
                    </Link>
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={() => handleDelete(review.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Alert variant="info">
          You haven't written any reviews yet. 
          <Link to="/browse" className="alert-link"> Browse movies</Link> to get started!
        </Alert>
      )}
    </Container>
  );
}