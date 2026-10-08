import { Link } from "react-router-dom";

import { useCurrentUser } from "../hooks/useCurrentUser";

import "../assets/css/navbar.css";
import ProfileDropdown from "./ProfileDropdown";

function Navbar() {
  const { data, isLoading } = useCurrentUser();
  const user = data?.data;

  if (isLoading) {
    return (
      <header className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-logo">
            MOVIEFLIX
          </Link>
        </div>
      </header>
    );
  }

  const isAuthenticated = !!user;

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          MOVIEFLIX
        </Link>

        {!isAuthenticated && (
          <nav className="navbar-menu">
            <Link to="/login" className="navbar-signin">
              Sign In
            </Link>
          </nav>
        )}

        {isAuthenticated && (
          <nav className="navbar-menu">
            <Link to="/" className="navbar-link">
              Home
            </Link>

            <Link to="/movies" className="navbar-link">
              Movies
            </Link>

            <Link to="/categories" className="navbar-link">
              Categories
            </Link>

            <ProfileDropdown user={user} />
          </nav>
        )}
      </div>
    </header>
  );
}

export default Navbar;
