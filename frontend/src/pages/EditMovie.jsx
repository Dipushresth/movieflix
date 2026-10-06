import { useNavigate, useParams } from "react-router-dom";
import MovieForm from "../components/MovieForm";
import { useMovie, useUpdateMovie } from "../hooks/useMovies";
import { useCategories } from "../hooks/useCategories";

function EditMovie() {
  const { id } = useParams();
  const navigate = useNavigate();

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
    <MovieForm
      mode="edit"
      initialData={movie}
      categories={categories}
      onSubmit={handleSubmit}
      loading={saving}
      error={error}
    />
  );
}

export default EditMovie;
