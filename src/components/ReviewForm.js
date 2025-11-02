import React, { useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

export default function ReviewForm({ onSubmit, initialData, onCancel }) {
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setRating(initialData.rating);
      setReviewText(initialData.reviewText);
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!reviewText.trim()) {
      setError('Please write a review');
      return;
    }

    if (reviewText.trim().length < 10) {
      setError('Review must be at least 10 characters');
      return;
    }

    onSubmit({ rating, reviewText: reviewText.trim() });
    
    if (!initialData) {
      setRating(5);
      setReviewText('');
    }
    setError('');
  };

  return (
    <Form onSubmit={handleSubmit} className="review-form">
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Form.Group className="mb-3">
        <Form.Label>Rating</Form.Label>
        <div className="d-flex align-items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => setRating(star)}
              style={{ 
                cursor: 'pointer', 
                fontSize: '2rem',
                color: star <= rating ? '#ffc107' : '#e4e5e9'
              }}
            >
              ⭐
            </span>
          ))}
          <span className="ms-3 text-muted">({rating}/5)</span>
        </div>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Your Review</Form.Label>
        <Form.Control
          as="textarea"
          rows={4}
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="Share your thoughts about this movie..."
        />
      </Form.Group>

      <div className="d-flex gap-2">
        <Button variant="primary" type="submit">
          {initialData ? 'Update Review' : 'Submit Review'}
        </Button>
        {initialData && onCancel && (
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </Form>
  );
}