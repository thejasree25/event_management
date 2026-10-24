
import { useEffect, useState } from "react";
import {
  getEvents,
  addEvent,
  deleteEvent,
} from "../api/events";
import "../styles/manage-events.css";
const emptyForm = {
  title: "",
  description: "",
  location: "",
  eventDate: "",
  ticketPrice: "",
  totalSeats: "",
  imageUrl: "",
  status: "ACTIVE",
};

export default function ManageEvents() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadEvents() {
    setLoading(true);
    setError("");

    try {
      const response = await getEvents();
      setEvents(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load events. Check the backend and API URL."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEvents();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    const seats = Number(form.totalSeats);
    const price = Number(form.ticketPrice);

    if (
      !form.title.trim() ||
      !form.location.trim() ||
      !form.eventDate ||
      !Number.isFinite(price) ||
      price < 0 ||
      !Number.isInteger(seats) ||
      seats < 1
    ) {
      setError("Enter a title, location, date, valid price and seat count.");
      setSaving(false);
      return;
    }

    const payload = {
      ...form,
      ticketPrice: price,
      totalSeats: seats,
      availableSeats: seats,
    };

    try {
      await addEvent(payload);
      setForm(emptyForm);
      setMessage("Event saved successfully.");
      await loadEvents();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not save the event. Check required fields and entity relationships."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this event?")) return;

    setError("");
    setMessage("");

    try {
      await deleteEvent(id);
      setMessage("Event deleted successfully.");
      await loadEvents();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not delete the event. It may have existing bookings."
      );
    }
  }

  return (
    <main className="manage-events">
      <h1>Manage Events</h1>
      <p>Add events to your Event Management System.</p>

      {error && <p role="alert" className="error">{error}</p>}
      {message && <p role="status" className="success">{message}</p>}

      <form onSubmit={handleSubmit} className="event-form">
        <label>
          Event title
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Description
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
          />
        </label>

        <label>
          Location
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Event date and time
          <input
            name="eventDate"
            type="datetime-local"
            value={form.eventDate}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Ticket price
          <input
            name="ticketPrice"
            type="number"
            min="0"
            step="0.01"
            value={form.ticketPrice}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Total seats
          <input
            name="totalSeats"
            type="number"
            min="1"
            step="1"
            value={form.totalSeats}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Image URL
          <input
            name="imageUrl"
            type="url"
            value={form.imageUrl}
            onChange={handleChange}
          />
        </label>

        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Add Event"}
        </button>
      </form>

      <section>
        <h2>Saved Events</h2>

        {loading && <p>Loading events...</p>}

        {!loading && events.length === 0 && (
          <p>No events found. Add your first event above.</p>
        )}

        <div className="event-grid">
          {events.map((event) => (
            <article className="event-card" key={event.id}>
              {event.imageUrl && (
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              )}

              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <p>Location: {event.location}</p>
              <p>Price: ₹{event.ticketPrice}</p>
              <p>Available seats: {event.availableSeats}</p>

              <button
                type="button"
                onClick={() => handleDelete(event.id)}
              >
                Delete
              </button>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
