import { Link } from "react-router-dom";
import { CalendarDays, Ticket, UserRound, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Dashboard() {
  const { user } = useAuth();
  return (
    <section className="page-section container">
      <div className="dashboard-welcome"><span className="eyebrow">YOUR EVENTLY SPACE</span><h1>Welcome, {user?.name || "Event Explorer"}!</h1><p>Manage your event journey from one place.</p></div>
      <div className="dashboard-grid">
        <article className="dashboard-card"><span className="dashboard-icon"><UserRound /></span><h3>Profile</h3><p>{user?.email || "Your account details"}</p><p>{user?.phone || "Keep your account information updated."}</p></article>
        <article className="dashboard-card"><span className="dashboard-icon"><Ticket /></span><h3>My bookings</h3><p>Review your reservations and booking details.</p><Link to="/my-bookings" className="text-link">View bookings <ArrowRight size={15} /></Link></article>
        <article className="dashboard-card"><span className="dashboard-icon"><CalendarDays /></span><h3>Discover events</h3><p>Find conferences, workshops, concerts, and more.</p><Link to="/events" className="text-link">Explore events <ArrowRight size={15} /></Link></article>
      </div>
    </section>
  );
}