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
    body: movieData,
  });
};

export const updateMovie = ({ id, formData }) => {
  return apiClient(`/movies/${id}`, {
    method: "PUT",
    body: formData,
  });
};

// export const patchMovie = ({ id, formData }) => {
//   return apiClient(`/movies/${id}`, {
//     method: "PATCH",
//     body: formData,
//   });
// };

export const deleteMovie = (id) => {
  return apiClient(`/movies/${id}`, {
    method: "DELETE",
  });
};
