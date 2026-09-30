import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const [movieResponse, categoriesResponse] = await Promise.all([
          fetch(`http://localhost:3000/movies/${id}`),
          fetch("http://localhost:3000/categories"),
        ]);

        const movieData = await movieResponse.json();
        const categoriesData = await categoriesResponse.json();

        if (!movieResponse.ok) {
          setError(movieData.message || "Movie not found");
          return;
        }

        setMovie(movieData.data);
        setCategories(categoriesData.data);
      } catch (error) {
        console.log(error);
        setError("Unable to connect to server");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  const getCategoryName = (categoryId) => {
    const category = categories.find((category) => category.id === categoryId);

    return category?.name;
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

  return (
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
              {movie.categoryIds.map((categoryId) => {
                const categoryName = getCategoryName(categoryId);

                if (!categoryName) return null;

                return <span key={categoryId}>{categoryName}</span>;
              })}
            </div>

            <div className="movie-details-actions">
              <button
                className="edit-movie-button"
                onClick={() => navigate(`/movies/${movie.id}/edit`)}
              >
                Edit Movie
              </button>

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
  );
}

export default MovieDetails;
