import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/");
  };

  const linkClass = ({ isActive }) => (isActive ? "active" : "");

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="brand" onClick={() => setOpen(false)}>
          <span className="brand-mark">Ani</span>blog
        </NavLink>

        <button
          className="nav-toggle"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label="Toggle navigation menu"
        >
          {open ? "Close" : "Menu"}
        </button>

        <nav className={`nav-links ${open ? "open" : ""}`}>
          <NavLink to="/" className={linkClass} onClick={() => setOpen(false)}>
            Catalog
          </NavLink>

          {isAuthenticated ? (
            <>
              <NavLink to="/dashboard" className={linkClass} onClick={() => setOpen(false)}>
                Dashboard
              </NavLink>
              <NavLink to="/watchlist" className={linkClass} onClick={() => setOpen(false)}>
                Watchlist
              </NavLink>
              <NavLink to="/reviews/mine" className={linkClass} onClick={() => setOpen(false)}>
                My Reviews
              </NavLink>
              {isAdmin && (
                <NavLink to="/admin/anime/new" className={linkClass} onClick={() => setOpen(false)}>
                  + Add Anime
                </NavLink>
              )}
              <NavLink to="/profile" className={linkClass} onClick={() => setOpen(false)}>
                Profile
              </NavLink>
              <span className="nav-user mono">@{user?.username}</span>
              <button onClick={handleLogout}>Log Out</button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClass} onClick={() => setOpen(false)}>
                Log In
              </NavLink>
              <NavLink to="/register" className={linkClass} onClick={() => setOpen(false)}>
                Sign Up
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
