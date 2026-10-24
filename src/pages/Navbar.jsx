
import { Link, NavLink, useNavigate } from "react-router-dom";
import { CalendarDays, LogOut, UserRound } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();

  const username = localStorage.getItem("username") || "Account";

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("user");
    navigate("/login");
  }

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand">
          <span className="brand-icon">
            <CalendarDays size={22} />
          </span>
          <span>Evently<span className="brand-dot">.</span></span>
        </Link>

        <nav className="nav-links">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/events">Explore Events</NavLink>
          <NavLink to="/venues">Venues</NavLink>
          <NavLink to="/my-bookings">My Bookings</NavLink>
          <NavLink to="/dashboard">Dashboard</NavLink>
        </nav>

        <div className="nav-actions">
          <span className="nav-user">
            <UserRound size={16} />
            {username}
          </span>

          <button
            type="button"
            className="btn btn-outline logout-btn"
            onClick={handleLogout}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
