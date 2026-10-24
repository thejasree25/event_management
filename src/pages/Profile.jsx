import { Link } from "react-router-dom";
import {
  UserRound,
  Mail,
  Phone,
  ShieldCheck,
  LogOut,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import "../styles/profile.css";

export default function Profile() {
  const { user, logout } = useAuth();

  if (!user?.email) {
    return (
      <main className="profile-page">
        <section className="profile-panel profile-message">
          <h2>Please sign in</h2>
          <p>Log in with Google to view your profile.</p>
          <Link to="/login">Go to login</Link>
        </section>
      </main>
    );
  }

  function handleLogout() {
    logout();
    window.location.replace("/login");
  }

  return (
    <main className="profile-page">
      <section className="profile-hero">
        <div className="profile-hero-inner">
          <span className="profile-eyebrow">YOUR ACCOUNT</span>
          <h1>My Profile</h1>
          <p>
            Welcome back, {user.name || user.email}!
            Your account details are shown below.
          </p>
        </div>
      </section>

      <section className="profile-layout">
        <aside className="profile-summary">
          <div className="profile-avatar">
            <UserRound size={42} />
          </div>

          <h2>{user.name || "EventSphere Member"}</h2>
          <p>{user.email}</p>

          <span className="profile-member-label">
            {user.role || "USER"}
          </span>
        </aside>

        <section className="profile-panel">
          <div className="profile-panel-heading">
            <div>
              <span className="profile-eyebrow">
                PERSONAL DETAILS
              </span>
              <h2>Account information</h2>
            </div>

            <ShieldCheck size={26} />
          </div>

          <div className="profile-field">
            <span>
              <UserRound size={16} /> Full name
            </span>
            <input
              value={user.name || ""}
              readOnly
              placeholder="Name not available"
            />
          </div>

          <div className="profile-field">
            <span>
              <Mail size={16} /> Email address
            </span>
            <input
              type="email"
              value={user.email}
              readOnly
            />
          </div>

          <div className="profile-field">
            <span>
              <Phone size={16} /> Phone number
            </span>
            <input
              value={user.phone || ""}
              readOnly
              placeholder="Not provided"
            />
          </div>

          <div className="profile-form-actions">
            <button
              type="button"
              className="profile-save-button"
              onClick={handleLogout}
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </section>
      </section>
    </main>
  );
}