import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

export default function ReviewCard({ review, onEdit, onDelete }) {
  const { currentUser } = useAuth();
  const isOwner = currentUser && currentUser.uid === review.userId;

  const renderStars = (rating) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <Card className="mb-3 review-card">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div>
            <h6 className="mb-1">
              {review.userEmail}
              {isOwner && <span className="badge bg-primary ms-2" style={{ fontSize: '0.7rem' }}>You</span>}
            </h6>
            <div className="text-warning">
              {renderStars(review.rating)}
            </div>
          </div>
          <small className="text-muted">
            {review.createdAt && new Date(review.createdAt).toLocaleDateString()}
          </small>
        </div>
        <Card.Text>{review.reviewText}</Card.Text>
        {isOwner && (
          <div className="mt-2">
            <Button 
              variant="outline-primary" 
              size="sm" 
              onClick={() => onEdit(review)}
              className="me-2"
            >
              Edit
            </Button>
            <Button 
              variant="outline-danger" 
              size="sm" 
              onClick={() => onDelete(review.id)}
            >
              Delete
            </Button>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}