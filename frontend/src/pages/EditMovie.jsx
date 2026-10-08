import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useMovie, useUpdateMovie } from "../hooks/useMovies";
import { useCategories } from "../hooks/useCategories";
import { useAuthBootstrap } from "../hooks/useAuthBootstrap";

import MovieForm from "../components/MovieForm";

function EditMovie({ currentUser }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showVideo, setShowVideo] = useState(false);
  const { user } = useAuthBootstrap();

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

  const updateMovieMutation = useUpdateMovie();
  const movie = movieResponse?.data || null;
  const categories = categoriesResponse?.data || [];
  const loading = movieLoading || categoriesLoading;
  const saving = updateMovieMutation.isPending;
  const error = movieError
    ? movieError.message || "Movie not found"
    : categoriesError
      ? categoriesError.message || "Failed to load categories"
      : updateMovieMutation.error
        ? updateMovieMutation.error.message || "Failed to update movie"
        : "";

  const handleSubmit = async (formData, setSuccess) => {
    updateMovieMutation.mutate(
      { id, formData },
      {
        onSuccess: () => {
          setSuccess("Movie updated successfully!");

          setTimeout(() => {
            navigate(`/movies/${id}`);
          }, 1000);
        },
      },
    );
  };

  const handleWatchNow = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    setShowVideo(true);
  };

  if (loading) {
    return (
      <div className="movies-state">
        <p>Loading movie...</p>
      </div>
    );
  }

  if (error && !movie) {
    return (
      <div className="movies-state error">
        <h3>{error}</h3>

        <button onClick={() => navigate("/movies")}>Back to Movies</button>
      </div>
    );
  }

  return (
    <>
      <MovieForm
        mode="edit"
        initialData={movie}
        categories={categories}
        onSubmit={handleSubmit}
        loading={saving}
        error={error}
      />

      {showVideo && (
        <div className="video-modal" onClick={() => setShowVideo(false)}>
          <div
            className="video-modal-content"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="video-close"
              onClick={() => setShowVideo(false)}
            >
              ✕
            </button>

            <iframe
              width="100%"
              height="500"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="Movie Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </>
  );
}

export default EditMovie;
