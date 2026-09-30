import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MovieForm from "../components/MovieForm";

function EditMovie() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

        if (!categoriesResponse.ok) {
          setError("Failed to load categories");
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

  const handleSubmit = async (formData, setSuccess) => {
    setError("");
    setSaving(true);

    console.log("FORM DATA:", formData);
    console.log("MOVIE ID:", id);

    try {
      const response = await fetch(`http://localhost:3000/movies/${id}`, {
        method: "PATCH",
        body: formData,
      });

      console.log("PATCH STATUS:", response.status);

      const data = await response.json();

      console.log("PATCH RESPONSE:", data);

      if (!response.ok) {
        setError(data.message || "Failed to update movie");
        return;
      }

      setSuccess("Movie updated successfully!");

      setTimeout(() => {
        navigate(`/movies/${id}`);
      }, 1000);
    } catch (error) {
      console.log("PATCH ERROR:", error);
      setError(error.message);
    } finally {
      setSaving(false);
    }
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
