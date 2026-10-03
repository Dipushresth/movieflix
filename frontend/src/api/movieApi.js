import apiClient from "./client";

export const getMovies = () => {
  return apiClient("/movies");
};

export const getMovie = (id) => {
  return apiClient(`/movies/${id}`);
};

export const createMovie = (movieData) => {
  return apiClient("/movies", {
    method: "POST",
    body: JSON.stringify(movieData),
  });
};
export const updateMovie = (id, movieData) => {
  return apiClient(`/movies/${id}`, {
    method: "PUT",
    body: JSON.stringify(movieData),
  });
};

export const deleteMovie = (id) => {
  return apiClient(`/movies/${id}`, {
    method: "DELETE",
  });
};
