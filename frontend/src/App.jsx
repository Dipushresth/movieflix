import { Routes, Route } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import AddMovie from "./pages/AddMovie";
import MovieList from "./pages/MovieList";
import MovieDetails from "./pages/MovieDetails";
import EditMovie from "./pages/EditMovie";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/add-movie" element={<AddMovie />} />
      <Route path="/movies" element={<MovieList />} />
      <Route path="/movies/:id" element={<MovieDetails />} />
      <Route path="/movies/:id/edit" element={<EditMovie />} />
    </Routes>
  );
}

export default App;
