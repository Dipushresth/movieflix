import { useNavigate } from "react-router-dom";
import MovieForm from "../components/MovieForm";
import { useCategories } from "../hooks/useCategories";
import { useCreateMovie } from "../hooks/useMovies";

function AddMovie() {
  const navigate = useNavigate();

  const {
    data: categoriesResponse,
    error: categoriesError,
    isLoading: categoriesLoading,
  } = useCategories();
  const categories = categoriesResponse?.data || [];
  const loading = categoriesLoading;

  const moviesMutation = useCreateMovie();
  const handleSubmit = async (formData, setSuccess) => {
    moviesMutation.mutate(formData, {
      onSuccess: (data) => {
        setSuccess("Movie created successfully!");
        setTimeout(() => {
          navigate(`/movies/${data.data.id}`);
        }, 1000);
      },
      onError: (error) => {
        console.log("CREATE MOVIE ERROR:", error);
        console.log("ERROR MESSAGE:", error.message);
        console.log("ERROR OBJECT:", error);

        alert(error.message || "Failed to create movie");
      },
    });
  };
  if (loading) {
    return <p>Loading...</p>;
  }
  if (categoriesError) {
    return <p>Failed to load categories: {categoriesError.message}</p>;
  }

  return (
    <MovieForm
      mode="add"
      categories={categories}
      onSubmit={handleSubmit}
      loading={moviesMutation.isPending}
      error={moviesMutation.error?.message || ""}
    />
  );
}

export default AddMovie;
