import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function MovieCard({ movie }) {
  const imageUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Image';

  return (
    <Link to={`/movie/${movie.id}`} style={{ textDecoration: 'none' }}>
      <Card className="movie-card h-100">
        <Card.Img 
          variant="top" 
          src={imageUrl} 
          alt={movie.title}
          style={{ height: '350px', objectFit: 'cover' }}
        />
        <Card.Body>
          <Card.Title className="text-dark">{movie.title}</Card.Title>
          <div className="d-flex justify-content-between align-items-center">
            <span className="text-muted">
              {movie.release_date ? movie.release_date.substring(0, 4) : 'N/A'}
            </span>
            <span className="badge bg-warning text-dark">
              ⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
            </span>
          </div>
        </Card.Body>
      </Card>
    </Link>
  );
}