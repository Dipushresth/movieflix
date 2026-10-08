import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useMovie } from "../hooks/useMovies";
import { useCategories } from "../hooks/useCategories";
import "../assets/css/modal.css";

function MovieDetails({ currentUser }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showVideo, setShowVideo] = useState(false);

  const {
    data: movieResponse,
    error: movieError,
    isLoading: movieLoading,
  } = useMovie(id);

  const {
    data: categoriesResponse,
    error: categoriesError,
    isLoading: categoriesLoading,
  } = useCategories();

  const movie = movieResponse?.data || null;
  const categories = categoriesResponse?.data || [];
  const loading = movieLoading || categoriesLoading;
  const error = movieError
    ? "Failed to Load movie"
    : categoriesError
      ? "Failed to Load categories"
      : "";

  const getCategoryName = (categoryId) => {
    const category = categories.find((category) => category.id === categoryId);
    return category?.name;
  };

  const handleWatchNow = () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    setShowVideo(true);
  };

  if (loading) {
    return <div className="movie-details-state">Loading movie...</div>;
  }

  if (error) {
    return (
      <div className="movie-details-state">
        <h2>{error}</h2>

        <button onClick={() => navigate("/movies")}>Back to Movies</button>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="movie-details-state">
        <h2>Movie not found</h2>

        <button onClick={() => navigate("/movies")}>Back to Movies</button>
      </div>
    );
  }

  return (
    <>
      <div className="movie-details-page">
        <div className="movie-details-container">
          <button className="back-button" onClick={() => navigate("/movies")}>
            ← Back to Movies
          </button>

          <div className="movie-details-card">
            <div className="movie-details-poster">
              <img src={movie.image} alt={movie.title} />
            </div>

            <div className="movie-details-content">
              <p className="movie-details-label">MOVIE DETAILS</p>

              <h1>{movie.title}</h1>

              <div className="movie-details-meta">
                <span>{movie.year}</span>

                <span>•</span>

                <span className="movie-details-rating">★ {movie.rating}</span>
              </div>

              <p className="movie-details-description">
                {movie.description || "No description available."}
              </p>

              <div className="movie-details-categories">
                {movie.categoryIds?.map((categoryId) => {
                  const categoryName = getCategoryName(categoryId);

                  if (!categoryName) return null;

                  return <span key={categoryId}>{categoryName}</span>;
                })}
              </div>

              <div className="movie-details-actions">
                <button
                  className="btn watch-now-button"
                  onClick={handleWatchNow}
                >
                  ▶ Watch Now
                </button>

                {currentUser?.role === "ADMIN" && (
                  <button
                    className="edit-movie-button"
                    onClick={() => navigate(`/movies/${movie.id}/edit`)}
                  >
                    {" "}
                    Edit Movie{" "}
                  </button>
                )}

                <button
                  className="back-movies-button"
                  onClick={() => navigate("/movies")}
                >
                  Browse Movies
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showVideo && currentUser && (
        <div className="video-modal" onClick={() => setShowVideo(false)}>
          <div
            className="video-modal-content"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="video-close-button"
              onClick={() => setShowVideo(false)}
            >
              ✕
            </button>

            <iframe
              width="100%"
              height="500"
              src="https://www.youtube.com/embed/6ZfuNTqbHE8?si=nAZLGCNgz3uykjmF"
              title={`${movie.title} Video`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </>
  );
}

export default MovieDetails;
