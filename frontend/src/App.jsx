import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import AddMovie from "./pages/AddMovie";
import MovieList from "./pages/MovieList";
import MovieDetails from "./pages/MovieDetails";
import EditMovie from "./pages/EditMovie";
import { useAuthBootstrap } from "./hooks/useAuthBootstrap";

function App() {
  const { isInitializing, currentUser } = useAuthBootstrap();
  if (isInitializing) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/add-movie" element={<AddMovie />} />
        <Route
          path="/movies"
          element={<MovieList currentUser={currentUser} />}
        />
        <Route
          path="/movies/:id"
          element={<MovieDetails currentUser={currentUser} />}
        />
        <Route
          path="/movies/:id/edit"
          element={<EditMovie currentUser={currentUser} />}
        />
      </Routes>
    </>
  );
}

export default App;
