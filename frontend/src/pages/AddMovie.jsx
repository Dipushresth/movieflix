import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MovieForm from "../components/MovieForm";

function AddMovie() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("http://localhost:3000/categories");

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Failed to load categories");
          return;
        }

        setCategories(data.data);
      } catch (error) {
        console.log(error);
        setError("Unable to connect to server");
      }
    }

    fetchCategories();
  }, []);

  const handleSubmit = async (formData, setSuccess) => {
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/movies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to create movie");
        return;
      }

      setSuccess("Movie added successfully!");

      setTimeout(() => {
        navigate("/movies");
      }, 1000);
    } catch (error) {
      console.log(error);
      setError("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MovieForm
      mode="add"
      categories={categories}
      onSubmit={handleSubmit}
      loading={loading}
      error={error}
    />
  );
}

export default AddMovie;
