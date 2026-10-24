
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  CalendarDays,
  MapPin,
  Ticket,
  Minus,
  Plus,
} from "lucide-react";

import { getEvent, createBooking } from "../api/events.js";
import { useAuth } from "../context/AuthContext.jsx";
import { formatDate } from "../components/EventCard.jsx";
import Notice from "../components/Notice.jsx";

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [event, setEvent] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError("");
    setEvent(null);

    getEvent(id)
      .then(({ data }) => {
        if (!cancelled) {
          setEvent(data);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err.response?.data?.message ||
              err.response?.data?.error ||
              "Unable to load the event. Please check your backend."
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  async function book() {
    setError("");

    if (!user) {
      navigate("/login", {
        state: { from: `/events/${id}` },
      });
      return;
    }

    const userId = Number(user.id ?? user.userId);
    const eventId = Number(event?.id ?? event?.eventId);
    const ticketQuantity = Number(quantity);
    const availableSeats = Number(
      event?.availableSeats ?? event?.totalSeats
    );
    const price = Number(event?.ticketPrice ?? event?.price);

    if (!Number.isInteger(userId) || userId <= 0) {
      setError("Your user ID is missing. Please log out and sign in again.");
      return;
    }

    if (!Number.isInteger(eventId) || eventId <= 0) {
      setError("The event ID is invalid. Please reload the event.");
      return;
    }

    if (
      !Number.isInteger(ticketQuantity) ||
      ticketQuantity < 1 ||
      ticketQuantity > 10
    ) {
      setError("Please select between 1 and 10 tickets.");
      return;
    }

    if (!Number.isFinite(price) || price < 0) {
      setError("This event has an invalid ticket price.");
      return;
    }

    if (
      Number.isFinite(availableSeats) &&
      ticketQuantity > availableSeats
    ) {
      setError(`Only ${availableSeats} tickets are available.`);
      return;
    }

    setBusy(true);

    try {
      const response = await createBooking({
        userId,
        eventId,
        quantity: ticketQuantity,
      });

      const booking = response.data;
      const bookingId = booking?.id ?? booking?.registrationId;

      if (!bookingId) {
        console.error("Unexpected booking response:", booking);
        throw new Error(
          "The backend did not return a booking ID."
        );
      }

      navigate(`/payment/${bookingId}`, {
        state: {
          event,
          quantity: ticketQuantity,
          booking,
        },
      });
    } catch (err) {
      console.error("Booking status:", err.response?.status);
      console.error("Booking response:", err.response?.data);
      console.error("Booking request:", {
        userId,
        eventId,
        quantity: ticketQuantity,
      });

      const responseData = err.response?.data;

      const message =
        responseData?.message ||
        responseData?.error ||
        (typeof responseData === "string" ? responseData : null) ||
        err.message ||
        "Unable to create your booking. Please try again.";

      setError(message);
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <section className="page-section container loading-state">
        Loading event...
      </section>
    );
  }

  if (!event) {
    return (
      <section className="page-section container">
        <Notice
          type="error"
          message={error || "Event not found."}
        />
        <Link className="btn btn-primary" to="/events">
          Back to events
        </Link>
      </section>
    );
  }

  const price = Number(event.ticketPrice ?? event.price ?? 0);
  const date = event.eventDate ?? event.date;

  return (
    <section className="page-section container details-layout">
      <div className="details-main">
        {event.imageUrl || event.image ? (
          <img
            className="details-image"
            src={event.imageUrl || event.image}
            alt={event.title || "Event"}
          />
        ) : (
          <div className="details-image image-fallback">
            <CalendarDays size={55} />
          </div>
        )}

        <span className="eyebrow">EVENT DETAILS</span>

        <h1>{event.title || "Untitled event"}</h1>

        <p className="details-description">
          {event.description ||
            "Discover this event and join the experience."}
        </p>

        <div className="details-info">
          <span>
            <CalendarDays size={18} />
            {date ? formatDate(date) : "Date to be announced"}
          </span>

          <span>
            <MapPin size={18} />
            {event.location ||
              event.venue?.location ||
              "Location to be announced"}
          </span>
        </div>
      </div>

      <aside className="booking-panel">
        <span className="eyebrow">RESERVE YOUR PLACE</span>

        <h2>Book tickets</h2>

        <div className="ticket-price-large">
          ₹{Number.isFinite(price) ? price.toLocaleString("en-IN") : "0"}
          <small> / ticket</small>
        </div>

        <label htmlFor="ticket-quantity">Tickets</label>

        <div className="quantity-control">
          <button
            type="button"
            aria-label="Decrease quantity"
            disabled={quantity <= 1 || busy}
            onClick={() =>
              setQuantity((current) => Math.max(1, current - 1))
            }
          >
            <Minus size={16} />
          </button>

          <strong id="ticket-quantity">{quantity}</strong>

          <button
            type="button"
            aria-label="Increase quantity"
            disabled={
              quantity >= 10 ||
              busy ||
              (Number.isFinite(Number(event.availableSeats)) &&
                quantity >= Number(event.availableSeats))
            }
            onClick={() =>
              setQuantity((current) => Math.min(10, current + 1))
            }
          >
            <Plus size={16} />
          </button>
        </div>

        <div className="booking-total">
          <span>Total</span>
          <strong>
            ₹{(Math.max(0, price) * quantity).toLocaleString("en-IN")}
          </strong>
        </div>

        {error && (
          <Notice
            type="error"
            message={error}
            onClose={() => setError("")}
          />
        )}

        <button
          type="button"
          className="btn btn-primary btn-full"
          disabled={busy || !Number.isFinite(price) || price < 0}
          onClick={book}
        >
          <Ticket size={17} />
          {busy ? "Booking..." : "Continue to booking"}
        </button>

        <p className="small-note">
          Demo booking flow. Payment is simulated and no real charge is made.
        </p>
      </aside>
    </section>
  );
}
