
import { useEffect, useState } from "react";
import { CalendarDays, MapPin, Ticket, XCircle } from "lucide-react";
import {
  cancelBooking,
  getBookings,
  getUserBookings,
} from "../api/bookings.js";
import { useAuth } from "../context/AuthContext.jsx";
import { formatDate } from "../components/EventCard.jsx";
import Notice from "../components/Notice.jsx";

export default function MyBookings() {
  const { user } = useAuth();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [cancellingId, setCancellingId] = useState(null);

  async function load() {
    setLoading(true);
    setError("");

    try {
      const userId = user?.id ?? user?.userId;

      const response = userId
        ? await getUserBookings(userId)
        : await getBookings();

      const data = response.data;

      setBookings(
        Array.isArray(data)
          ? data
          : data?.content || data?.registrations || []
      );
    } catch (err) {
      console.error("Error loading bookings:", err);
      setError(
        "Could not load bookings. Please check the backend registrations endpoint."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [user?.id, user?.userId]);

  async function handleCancel(id) {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    setError("");
    setMessage("");
    setCancellingId(id);

    try {
      await cancelBooking(id);
      setMessage("Booking cancelled successfully.");
      await load();
    } catch (err) {
      console.error("Error cancelling booking:", err);
      setError(
        "Cancellation failed. Please check the cancellation endpoint in your backend."
      );
    } finally {
      setCancellingId(null);
    }
  }

  return (
    <section className="page-section container">
      <div className="page-title">
        <span className="eyebrow">YOUR PLANS</span>
        <h1>My bookings</h1>
        <p>Review your event reservations.</p>
      </div>

      <Notice
        message={message}
        onClose={() => setMessage("")}
      />

      <Notice
        message={error}
        type="error"
        onClose={() => setError("")}
      />

      {loading ? (
        <div className="loading-state">Loading bookings...</div>
      ) : bookings.length > 0 ? (
        <div className="booking-list">
          {bookings.map((booking, index) => {
            const id = booking.id ?? booking.registrationId ?? index;
            const event = booking.event || {};
            const status =
              booking.status || booking.bookingStatus || "Booked";

            const eventDate =
              event.eventDate ||
              booking.eventDate ||
              booking.date;

            const location =
              event.location ||
              booking.location ||
              booking.venue?.location ||
              "Location to be announced";

            const isCancelled =
              String(status).toUpperCase() === "CANCELLED";

            return (
              <article className="booking-row" key={id}>
                <div className="booking-row-icon">
                  <Ticket size={24} />
                </div>

                <div className="booking-row-info">
                  <h3>
                    {event.title ||
                      booking.eventTitle ||
                      `Booking #${id}`}
                  </h3>

                  <p>
                    <CalendarDays size={14} />
                    {eventDate ? formatDate(eventDate) : "Date to be announced"}
                  </p>

                  <p>
                    <MapPin size={14} />
                    {location}
                  </p>
                </div>

                <div className="booking-row-status">
                  <span className="status-pill">{status}</span>
                  <small>Booking #{id}</small>
                </div>

                {!isCancelled && (
                  <button
                    type="button"
                    className="btn btn-outline btn-small"
                    onClick={() => handleCancel(id)}
                    disabled={cancellingId !== null}
                  >
                    <XCircle size={15} />
                    {cancellingId === id ? "Cancelling..." : "Cancel"}
                  </button>
                )}
              </article>
            );
          })}
        </div>
      ) : (
        <div className="empty-state">
          <Ticket size={35} />
          <h3>No bookings yet</h3>
          <p>Explore events and reserve your place.</p>
          <a className="btn btn-primary" href="/events">
            Explore events
          </a>
        </div>
      )}
    </section>
  );
}
