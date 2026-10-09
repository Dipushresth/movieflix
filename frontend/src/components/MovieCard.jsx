import { useState } from "react";
import { useNavigate } from "react-router-dom";

function MovieCard({ movie, isAdmin, onEdit, onDelete }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="movie-card">
      {/* Three-dot menu: admin only */}
      {isAdmin && (
        <div className="movie-menu">
          <button
            type="button"
            className="movie-menu-button"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((prev) => !prev);
            }}
            aria-label="Movie options"
            aria-expanded={menuOpen}
          >
            ⋮
          </button>

          {menuOpen && (
            <div className="movie-menu-dropdown">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(false);
                  onEdit(movie);
                }}
              >
                Edit
              </button>

              <button
                type="button"
                className="delete-option"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(false);
                  onDelete(movie.id);
                }}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      )}

      {/* Movie content */}
      <div
        className="movie-card-content"
        onClick={() => navigate(`/movies/${movie.id}`)}
      >
        <img src={movie.image} alt={movie.title} className="movie-card-image" />

        <div className="movie-card-info">
          <h3>{movie.title}</h3>
          <p>{movie.year}</p>
          <p>⭐ {movie.rating}</p>
        </div>
      </div>
    </div>
  );
}

export default MovieCard;
