import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import MovieCard from "../components/MovieCard";

function MovieSection({ title, movies, onViewAll, getCategoryName }) {
  return (
    <section className="movie-section">
      <div className="section-header">
        <div>
          <p className="section-label">EXPLORE</p>
          <h2>{title}</h2>
        </div>

        <button className="view-all-button" onClick={onViewAll}>
          View All →
        </button>
      </div>

      {movies.length === 0 ? (
        <div className="movie-status">No movies found.</div>
      ) : (
        <div className="movie-grid">
          {movies.slice(0, 5).map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              getCategoryName={getCategoryName}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function Home() {
  const navigate = useNavigate();

  const [movies, setMovies] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const [moviesResponse, categoriesResponse] = await Promise.all([
          fetch("http://localhost:3000/movies"),
          fetch("http://localhost:3000/categories"),
        ]);

        const moviesData = await moviesResponse.json();
        const categoriesData = await categoriesResponse.json();

        if (!moviesResponse.ok) {
          setError("Failed to load movies");
          return;
        }

        if (!categoriesResponse.ok) {
          setError("Failed to load categories");
          return;
        }

        setMovies(moviesData.data);
        setCategories(categoriesData.data);
      } catch (error) {
        console.log(error);
        setError("Unable to connect to server");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const getCategoryName = (categoryId) => {
    const category = categories.find((category) => category.id === categoryId);

    return category?.name || "";
  };

  const getMoviesByCategory = (categoryName) => {
    const category = categories.find(
      (category) => category.name.toLowerCase() === categoryName.toLowerCase(),
    );

    if (!category) return [];

    return movies.filter((movie) => movie.categoryIds.includes(category.id));
  };

  const popularMovies = movies.slice(0, 10);

  const adventureMovies = getMoviesByCategory("Adventure");

  // Your database currently has "Thriler"
  const thrillerMovies = getMoviesByCategory("Thriler");

  const sciFiMovies = getMoviesByCategory("Sci-Fi");

  if (loading) {
    return (
      <div className="movie-home">
        <Navbar />

        <div className="movie-status">Loading movies...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="movie-home">
        <Navbar />

        <div className="movie-status error">{error}</div>
      </div>
    );
  }

  return (
    <div className="movie-home">
      <Navbar />

      {/* HERO */}
      <section className="hero-section">
        <div className="hero-background">
          <img
            src={
              movies[0]?.image ||
              "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba"
            }
            alt=""
          />
        </div>

        <div className="hero-overlay"></div>

        <div className="hero-text">
          <span className="hero-label">WELCOME TO MOVIEFLIX</span>

          <h1>
            Discover Your
            <br />
            <span>Next Movie.</span>
          </h1>

          <p className="hero-description">
            Explore a collection of movies, discover new favorites, and find
            something great to watch.
          </p>

          <div className="hero-buttons">
            <button
              className="watch-button"
              onClick={() => {
                if (movies.length > 0) {
                  navigate(`/movies/${movies[0].id}`);
                }
              }}
            >
              ▶ Watch Now
            </button>

            <button
              className="browse-button"
              onClick={() => navigate("/movies")}
            >
              Browse Movies
            </button>
          </div>
        </div>
      </section>

      {/* MOVIE SECTIONS */}
      <main className="movie-content">
        {/* Popular */}
        <section className="movie-section">
          <div className="section-header">
            <div>
              <p className="section-label">TRENDING</p>
              <h2>Popular Movies</h2>
            </div>

            <button
              className="view-all-button"
              onClick={() => navigate("/movies")}
            >
              View All →
            </button>
          </div>

          {popularMovies.length === 0 ? (
            <div className="movie-status">No movies found.</div>
          ) : (
            <div className="movie-grid">
              {popularMovies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  getCategoryName={getCategoryName}
                />
              ))}
            </div>
          )}
        </section>

        {/* Adventure */}
        <MovieSection
          title="Adventure"
          movies={adventureMovies}
          onViewAll={() => navigate("/movies")}
          getCategoryName={getCategoryName}
        />

        {/* Thriller */}
        <MovieSection
          title="Thriller"
          movies={thrillerMovies}
          onViewAll={() => navigate("/movies")}
          getCategoryName={getCategoryName}
        />

        {/* Sci-Fi */}
        <MovieSection
          title="Sci-Fi"
          movies={sciFiMovies}
          onViewAll={() => navigate("/movies")}
          getCategoryName={getCategoryName}
        />
      </main>
    </div>
  );
}

export default Home;
