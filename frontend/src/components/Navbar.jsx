import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    // Remove logged-in user
    localStorage.removeItem("user");

    // If you store a token separately, remove it too
    localStorage.removeItem("token");
    localStorage.removeItem("accessToken");

    // Close dropdown
    setProfileOpen(false);

    // Go to login
    navigate("/login");
  };

  return (
    <nav className="movie-navbar">
      {/* LOGO */}
      <Link to="/" className="movie-logo">
        MOVIEFLIX
      </Link>

      {/* NAV LINKS */}
      <div className="movie-nav-links">
        <Link to="/" className="movie-nav-link">
          Home
        </Link>

        <Link to="/movies" className="movie-nav-link">
          Movies
        </Link>

        <Link to="/add-movie" className="movie-nav-link">
          Add Movie
        </Link>

        {/* PROFILE */}
        <div className="profile-container">
          <button
            className="profile-button"
            onClick={() => setProfileOpen((prev) => !prev)}
            aria-label="Open profile menu"
          >
            {/* PROFILE ICON */}
            <span className="profile-icon">👤</span>
          </button>

          {/* DROPDOWN */}
          {profileOpen && (
            <div className="profile-dropdown">
              {/* PROFILE INFO */}
              <div className="profile-info">
                <div className="profile-avatar">👤</div>

                <div className="profile-details">
                  <strong>{user?.name || "User"}</strong>

                  <span>{user?.email || "No email"}</span>

                  {user?.role && <small>{user.role}</small>}
                </div>
              </div>

              {/* DIVIDER */}
              <div className="profile-divider"></div>

              {/* LOGOUT */}
              <button className="profile-logout" onClick={handleLogout}>
                <span>↪</span>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
