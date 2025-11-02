import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Spinner } from 'react-bootstrap';
import MovieCard from '../components/MovieCard';
import { moviesAPI } from '../services/api';

export default function BrowseMovies() {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchPopularMovies();
  }, [currentPage]);

  const fetchPopularMovies = async () => {
    setLoading(true);
    try {
      const response = await moviesAPI.getPopular(currentPage);
      setMovies(response.data.results);
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
    setLoading(false);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchPopularMovies();
      return;
    }

    setLoading(true);
    try {
      const response = await moviesAPI.search(searchQuery);
      setMovies(response.data.results);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error searching movies:', error);
    }
    setLoading(false);
  };

  const handleNextPage = () => {
    setCurrentPage(prev => prev + 1);
    window.scrollTo(0, 0);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  return (
    <Container>
      <h1 className="mb-4">Browse Movies</h1>
      
      {/* Search Bar */}
      <Form onSubmit={handleSearch} className="mb-4">
        <Row>
          <Col md={10}>
            <Form.Control
              type="text"
              placeholder="Search for movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Col>
          <Col md={2}>
            <Button type="submit" className="w-100">Search</Button>
          </Col>
        </Row>
      </Form>

      {/* Loading Spinner */}
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <>
          {/* Movies Grid */}
          <Row>
            {movies.length > 0 ? (
              movies.map((movie) => (
                <Col key={movie.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                  <MovieCard movie={movie} />
                </Col>
              ))
            ) : (
              <Col>
                <p className="text-center text-muted">No movies found</p>
              </Col>
            )}
          </Row>

          {/* Pagination */}
          {movies.length > 0 && !searchQuery && (
            <div className="d-flex justify-content-center gap-3 my-4">
              <Button 
                variant="secondary" 
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="align-self-center">Page {currentPage}</span>
              <Button 
                variant="secondary" 
                onClick={handleNextPage}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </Container>
  );
}