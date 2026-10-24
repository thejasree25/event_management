
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  CalendarDays,
  Menu,
  Ticket,
  LogOut,
  UserRound,
  X,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  function closeMenu() {
    setOpen(false);
  }

  function signOut() {
    logout();
    closeMenu();
    navigate("/");
  }

  return (
    <header className="navbar">
      <Link to="/" className="brand" onClick={closeMenu}>
        <span className="brand-mark">
          <CalendarDays size={20} />
        </span>
        <span>
          Evently<span className="brand-dot">.</span>
        </span>
      </Link>

      <button
        type="button"
        className="mobile-toggle"
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={open}
        onClick={() => setOpen((previous) => !previous)}
      >
        {open ? <X size={23} /> : <Menu size={23} />}
      </button>

      <nav className={`nav-links ${open ? "nav-links-open" : ""}`}>
        <NavLink to="/" end onClick={closeMenu}>
          Home
        </NavLink>

        <NavLink to="/events" onClick={closeMenu}>
          Explore Events
        </NavLink>

        {user && (
          <NavLink to="/my-bookings" onClick={closeMenu}>
            <Ticket size={16} />
            My Bookings
          </NavLink>
        )}

        {user && (
          <NavLink to="/dashboard" onClick={closeMenu}>
            Dashboard
          </NavLink>
        )}

        {user && (
          <NavLink to="/profile" onClick={closeMenu}>
            <UserRound size={17} />
            Profile
          </NavLink>
        )}
      </nav>

      <div className={`nav-actions ${open ? "nav-actions-open" : ""}`}>
        {user ? (
          <>
            <span className="user-greeting">
              <UserRound size={16} />
              {user.name || user.email || "Account"}
            </span>

            <button
              type="button"
              className="btn btn-outline btn-small"
              onClick={signOut}
            >
              <LogOut size={15} />
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              className="nav-login"
              to="/login"
              onClick={closeMenu}
            >
              Login
            </Link>

            <Link
              className="btn btn-primary btn-small"
              to="/register"
              onClick={closeMenu}
            >
              Get Started
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
