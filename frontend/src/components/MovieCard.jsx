import { useState } from "react";
import { useNavigate } from "react-router-dom";

function MovieCard({ movie, getCategoryName, isAdmin, onDelete, onEdit }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuClick = (e) => {
    e.stopPropagation();
    setMenuOpen((prev) => !prev);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    setMenuOpen(false);
    onEdit?.(movie);
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    setMenuOpen(false);

    const confirmed = window.confirm(
      `Are you sure you want to delete "${movie.title}"?`,
    );

    if (!confirmed || !onDelete) return;

    try {
      await onDelete(movie.id);
    } catch {
      // MovieList handles the error notification.
    }
  };

  return (
    <article
      className="listing-movie-card"
      onClick={() => navigate(`/movies/${movie.id}`)}
    >
      <div className="listing-poster">
        <img src={movie.image} alt={movie.title} />

        {/* ADMIN-ONLY THREE-DOT MENU */}
        {isAdmin && (
          <div className="movie-menu">
            <button
              type="button"
              className="movie-menu-button"
              onClick={handleMenuClick}
              aria-label="Movie options"
              aria-expanded={menuOpen}
            >
              ⋮
            </button>

            {menuOpen && (
              <div
                className="movie-menu-dropdown"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  className="movie-edit-option"
                  onClick={handleEdit}
                >
                  ✏️ Edit
                </button>

                <button
                  type="button"
                  className="movie-delete-option"
                  onClick={handleDelete}
                >
                  🗑 Delete
                </button>
              </div>
            )}
          </div>
        )}

        {/* RATING */}
        <div className="listing-rating">
          <span>★</span>
          {movie.rating}
        </div>

        {/* OVERLAY */}
        <div className="poster-overlay">
          <span>View Details</span>
        </div>
      </div>

      <div className="listing-info">
        <h3>{movie.title}</h3>

        <div className="listing-meta">
          <span>{movie.year}</span>
          <span className="meta-dot">•</span>

          <span>
            {movie.categoryIds.length}{" "}
            {movie.categoryIds.length === 1 ? "category" : "categories"}
          </span>
        </div>

        <p>{movie.description || "No description available."}</p>

        <div className="listing-categories">
          {movie.categoryIds.slice(0, 2).map((categoryId) => {
            const categoryName = getCategoryName(categoryId);

            if (!categoryName) return null;

            return <span key={categoryId}>{categoryName}</span>;
          })}
        </div>
      </div>
    </article>
  );
}

export default MovieCard;
