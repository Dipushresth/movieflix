import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import Dropdown from "./Dropdown";
import { useLogout } from "../hooks/useLogout";
import "../assets/css/profile.css";

function ProfileDropdown({ user }) {
  const navigate = useNavigate();
  const logoutMutation = useLogout();
  const admin = user?.role === "ADMIN";

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("Logged out successfully!");
      },
      onError: (error) => {
        console.error("Logout failed:", error);
        toast.error(error.message || "Logout failed");
      },
    });
  };

  return (
    <Dropdown
      className="profile-container"
      trigger={
        <button
          type="button"
          className="profile-button"
          aria-label="Open profile menu"
        >
          <span className="profile-icon">👤</span>
        </button>
      }
    >
      <button
        type="button"
        className="profile-menu-item"
        onClick={() => navigate("/profile")}
      >
        <span>👤</span>
        <span>
          {user.name} {admin && `(admin)`}
        </span>
      </button>

      <button
        type="button"
        className="profile-menu-item"
        onClick={() => navigate("/settings")}
      >
        <span>⚙️</span>
        <span>Settings</span>
      </button>

      <button
        type="button"
        className="profile-menu-item profile-logout"
        onClick={handleLogout}
      >
        <span>↪</span>
        {logoutMutation.isPending ? "Logging out..." : "Logout"}
      </button>
    </Dropdown>
  );
}

export default ProfileDropdown;
