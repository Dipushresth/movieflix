import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import MovieCard from "../components/MovieCard";
import { useMovies } from "../hooks/useMovies";
import { useCategories } from "../hooks/useCategories";

function MovieList({ currentUser }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortBy, setSortBy] = useState("year");
  const [sortOrder, setSortOrder] = useState("desc");
  const {
    data: moviesResponse,
    error: moviesError,
    isLoading: moviesLoading,
  } = useMovies();
  const {
    data: categoriesResponse,
    error: categoriesError,
    isLoading: categoriesLoading,
  } = useCategories();

  const categories = categoriesResponse?.data || [];
  const loading = moviesLoading || categoriesLoading;
  const error = moviesError
    ? "Failed to load movies"
    : categoriesError
      ? "Failed to load categories"
      : "";

  const canAddMovie =
    currentUser?.role === "ADMIN" || currentUser?.role === "STAFF";
  const getCategoryName = (categoryId) => {
    const category = categories.find((category) => category.id === categoryId);

    return category?.name || "";
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories((prev) => {
      if (prev.includes(categoryId)) {
        return prev.filter((id) => id !== categoryId);
      }
      return [...prev, categoryId];
    });
  };

  const filteredMovies = useMemo(() => {
    const movies = moviesResponse?.data || [];
    let result = [...movies];
    if (search.trim()) {
      const searchText = search.toLowerCase().trim();
      result = result.filter((movie) =>
        movie.title.toLowerCase().includes(searchText),
      );
    }

    if (selectedCategories.length > 0) {
      result = result.filter((movie) =>
        selectedCategories.some((categoryId) =>
          movie.categoryIds.includes(categoryId),
        ),
      );
    }

    result.sort((a, b) => {
      let valueA;
      let valueB;

      if (sortBy === "title") {
        valueA = a.title.toLowerCase();
        valueB = b.title.toLowerCase();
      } else if (sortBy === "rating") {
        valueA = Number(a.rating);
        valueB = Number(b.rating);
      } else {
        valueA = Number(a.year);
        valueB = Number(b.year);
      }

      if (sortOrder === "asc") {
        if (valueA < valueB) return -1;
        if (valueA > valueB) return 1;
        return 0;
      }

      if (valueA < valueB) return 1;
      if (valueA > valueB) return -1;

      return 0;
    });

    return result;
  }, [moviesResponse, search, selectedCategories, sortBy, sortOrder]);

  const clearFilters = () => {
    setSearch("");
    setSelectedCategories([]);
    setSortBy("year");
    setSortOrder("desc");
  };

  const hasFilters =
    search.trim() ||
    selectedCategories.length > 0 ||
    sortBy !== "year" ||
    sortOrder !== "desc";

  return (
    <div className="movies-page">
      <Navbar />

      <main className="movies-container">
        <section className="movies-header">
          <div>
            <p className="movies-label">MOVIE LIBRARY</p>

            <h1>Explore Movies</h1>

            <p className="movies-subtitle">
              Discover your favorite movies and find something new to watch.
            </p>
          </div>

          {canAddMovie && (
            <button
              className="movies-add-button"
              onClick={() => navigate("/add-movie")}
            >
              <span>＋</span>
              Add Movie
            </button>
          )}
        </section>

        {/* SEARCH */}
        <section className="movie-search-section">
          <div className="movie-search">
            <span className="search-icon">🔍</span>

            <input
              type="text"
              placeholder="Search movies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {search && (
              <button className="clear-search" onClick={() => setSearch("")}>
                ×
              </button>
            )}
          </div>
        </section>

        {/* MAIN FILTER + MOVIES LAYOUT */}
        <div className="movies-layout">
          <aside className="movies-sidebar">
            <div className="sidebar-header">
              <h3>Filter Movies</h3>

              {hasFilters && <button onClick={clearFilters}>Clear</button>}
            </div>

            {/* CATEGORIES */}
            <div className="sidebar-section">
              <h4>Categories</h4>

              <div className="category-checkboxes">
                {categories.map((category) => {
                  const selected = selectedCategories.includes(category.id);

                  return (
                    <label
                      key={category.id}
                      className={`category-checkbox ${
                        selected ? "selected" : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => handleCategoryChange(category.id)}
                      />

                      <span>{category.name}</span>
                    </label>
                  );
                })}
              </div>

              {categories.length === 0 && (
                <p className="no-categories">No categories available.</p>
              )}
            </div>

            {/* SORT */}
            <div className="sidebar-section">
              <h4>Sort By</h4>

              <select
                className="sidebar-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="year">Release Year</option>
                <option value="rating">Rating</option>
                <option value="title">Title</option>
              </select>
            </div>

            {/* SORT ORDER */}
            <div className="sidebar-section">
              <h4>Order</h4>
              <div className="sort-buttons">
                <button
                  className={sortOrder === "asc" ? "active" : ""}
                  onClick={() => setSortOrder("asc")}
                >
                  ↑ Ascending
                </button>

                <button
                  className={sortOrder === "desc" ? "active" : ""}
                  onClick={() => setSortOrder("desc")}
                >
                  ↓ Descending
                </button>
              </div>
            </div>

            {/* CLEAR */}
            <button
              className="sidebar-clear-button"
              onClick={clearFilters}
              disabled={!hasFilters}
            >
              Clear All Filters
            </button>
          </aside>

          {/* RIGHT SIDE - MOVIES */}
          <section className="movies-results">
            {/* RESULT BAR */}
            <div className="movies-result-bar">
              <div>
                <strong>{filteredMovies.length}</strong>{" "}
                {filteredMovies.length === 1 ? "movie" : "movies"} found
              </div>

              {selectedCategories.length > 0 && (
                <div className="active-category-filters">
                  {selectedCategories.map((categoryId) => {
                    const categoryName = getCategoryName(categoryId);

                    if (!categoryName) return null;

                    return (
                      <span className="active-filter" key={categoryId}>
                        {categoryName}

                        <button
                          onClick={() => handleCategoryChange(categoryId)}
                        >
                          ×
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}
            </div>

            {/* LOADING */}
            {loading && (
              <div className="movies-state">
                <div className="loading-spinner"></div>

                <p>Loading movies...</p>
              </div>
            )}

            {/* ERROR */}
            {error && (
              <div className="movies-state error">
                <div className="state-icon">⚠</div>

                <h3>Something went wrong</h3>

                <p>{error}</p>
              </div>
            )}

            {/* EMPTY */}
            {!loading && !error && filteredMovies.length === 0 && (
              <div className="movies-state">
                <div className="state-icon">🎬</div>

                <h3>No movies found</h3>

                <p>Try changing your search or category filters.</p>

                <button className="reset-button" onClick={clearFilters}>
                  Clear Filters
                </button>
              </div>
            )}

            {/* MOVIES */}
            {!loading && !error && filteredMovies.length > 0 && (
              <div className="movies-grid">
                {filteredMovies.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    getCategoryName={getCategoryName}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default MovieList;
