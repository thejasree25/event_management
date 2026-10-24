
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  MapPin,
  Ticket,
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
  RefreshCw,
  Users,
  Image as ImageIcon,
} from "lucide-react";

import {
  getEvents,
  addEvent,
  updateEvent,
  deleteEvent,
} from "../api/events.js";

import "../styles/events.css";

const EMPTY_FORM = {
  title: "",
  description: "",
  location: "",
  eventDate: "",
  ticketPrice: "0",
  totalSeats: "100",
  imageUrl: "",
  status: "ACTIVE",
};

const DEMO_EVENTS = [
  {
    id: "demo-tech",
    title: "Future of Technology Summit",
    description:
      "Meet technology innovators and explore the future of software, cloud computing, and digital transformation.",
    location: "Bengaluru",
    eventDate: "2027-01-20T10:00:00",
    ticketPrice: 499,
    totalSeats: 150,
    category: "Technology",
    status: "ACTIVE",
    imageUrl:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=85",
  },
  {
    id: "demo-workshop",
    title: "Creative Minds Workshop",
    description:
      "Build practical skills, exchange ideas, and collaborate with people who love learning and creating.",
    location: "Hyderabad",
    eventDate: "2027-02-15T09:30:00",
    ticketPrice: 299,
    totalSeats: 80,
    category: "Workshop",
    status: "ACTIVE",
    imageUrl:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1000&q=85",
  },
  {
    id: "demo-music",
    title: "Music Under The Stars",
    description:
      "Enjoy an unforgettable evening with live performances, great music, and an energetic crowd.",
    location: "Chennai",
    eventDate: "2027-03-08T18:00:00",
    ticketPrice: 799,
    totalSeats: 250,
    category: "Music",
    status: "ACTIVE",
    imageUrl:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1000&q=85",
  },
];

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1000&q=85";

const CATEGORY_IMAGES = {
  technology:
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=85",
  workshop:
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1000&q=85",
  music:
    "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1000&q=85",
  ai:
    "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1000&q=85",
  conference:
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1000&q=85",
};

function getEventId(event) {
  return event?.id ?? event?.eventId;
}

function getFallbackImage(event) {
  const text = `${event?.title || ""} ${
    event?.category || ""
  } ${event?.description || ""}`.toLowerCase();

  if (
    text.includes("artificial intelligence") ||
    text.includes("machine learning") ||
    /\bai\b/.test(text)
  ) {
    return CATEGORY_IMAGES.ai;
  }

  if (
    text.includes("music") ||
    text.includes("concert") ||
    text.includes("festival")
  ) {
    return CATEGORY_IMAGES.music;
  }

  if (
    text.includes("workshop") ||
    text.includes("training") ||
    text.includes("bootcamp")
  ) {
    return CATEGORY_IMAGES.workshop;
  }

  if (
    text.includes("technology") ||
    text.includes("developer") ||
    text.includes("coding") ||
    text.includes("java") ||
    text.includes("hackathon")
  ) {
    return CATEGORY_IMAGES.technology;
  }

  return CATEGORY_IMAGES.conference;
}

function getEventImage(event) {
  const value =
    event?.imageUrl || event?.imageURL || event?.image;

  if (
    typeof value === "string" &&
    /^https?:\/\//i.test(value.trim())
  ) {
    return value.trim();
  }

  return getFallbackImage(event);
}

function formatEventDate(value) {
  if (!value) return "Date to be announced";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date to be announced";
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function toDateTimeLocal(value) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  const localDate = new Date(
    date.getTime() - date.getTimezoneOffset() * 60000
  );

  return localDate.toISOString().slice(0, 16);
}

function normalizeEvent(event, index = 0) {
  return {
    ...event,
    id: getEventId(event) ?? `event-${index}`,
    title: event?.title || "Untitled Event",
    description: event?.description || "",
    location:
      event?.location ||
      event?.venue?.location ||
      event?.venue?.name ||
      "",
    eventDate: event?.eventDate || event?.date || "",
    ticketPrice: event?.ticketPrice ?? event?.price ?? 0,
    totalSeats: event?.totalSeats ?? event?.availableSeats ?? 0,
    imageUrl: getEventImage(event),
    status: event?.status || "ACTIVE",
  };
}

function extractEventList(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.events)) return data.events;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

function getErrorMessage(error) {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    "Something went wrong. Please try again."
  );
}

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [formError, setFormError] = useState("");

  const loadEvents = useCallback(async (showRefresh = false) => {
    if (showRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const response = await getEvents();
      const list = extractEventList(response?.data);

      setEvents(list.map(normalizeEvent));
    } catch (err) {
      console.error("Failed to load events:", err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const categories = useMemo(() => {
    const unique = [
      ...new Set(
        events
          .map((event) => event.category)
          .filter(
            (value) =>
              typeof value === "string" && value.trim()
          )
      ),
    ];

    return ["All", ...unique];
  }, [events]);

  const filteredEvents = useMemo(() => {
    const query = search.trim().toLowerCase();

    return events.filter((event) => {
      const matchesSearch = [
        event.title,
        event.description,
        event.location,
        event.category,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value).toLowerCase().includes(query)
        );

      const matchesCategory =
        category === "All" || event.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [events, search, category]);

  function openAddForm() {
    setEditingId(null);
    setForm({ ...EMPTY_FORM });
    setFormError("");
    setNotice("");
    setShowForm(true);
  }

  function openEditForm(event) {
    setEditingId(getEventId(event));
    setForm({
      title: event.title || "",
      description: event.description || "",
      location: event.location || "",
      eventDate: toDateTimeLocal(event.eventDate),
      ticketPrice: String(event.ticketPrice ?? 0),
      totalSeats: String(event.totalSeats ?? 100),
      imageUrl: event.imageUrl || "",
      status: event.status || "ACTIVE",
    });
    setFormError("");
    setNotice("");
    setShowForm(true);
  }

  function closeForm() {
    if (saving) return;

    setShowForm(false);
    setEditingId(null);
    setForm({ ...EMPTY_FORM });
    setFormError("");
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");
    setNotice("");

    if (
      !form.title.trim() ||
      !form.description.trim() ||
      !form.location.trim() ||
      !form.eventDate
    ) {
      setFormError(
        "Please fill in the event title, description, location, and date."
      );
      return;
    }

    const date = new Date(form.eventDate);
    const price = Number(form.ticketPrice);
    const seats = Number(form.totalSeats);

    if (Number.isNaN(date.getTime())) {
      setFormError("Please enter a valid event date.");
      return;
    }

    if (!Number.isFinite(price) || price < 0) {
      setFormError("Ticket price must be zero or greater.");
      return;
    }

    if (
      !Number.isInteger(seats) ||
      seats < 1
    ) {
      setFormError("Total seats must be at least 1.");
      return;
    }

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      location: form.location.trim(),
      eventDate: date.toISOString().slice(0, 19),
      ticketPrice: price,
      totalSeats: seats,
      imageUrl: form.imageUrl.trim() || getFallbackImage(form),
      status: form.status,
    };

    setSaving(true);

    try {
      if (editingId != null) {
        await updateEvent(editingId, payload);
        setNotice("Event updated successfully.");
      } else {
        await addEvent(payload);
        setNotice("Event added successfully.");
      }

      setShowForm(false);
      setEditingId(null);
      setForm({ ...EMPTY_FORM });

      await loadEvents(true);
    } catch (err) {
      console.error("Failed to save event:", err);
      setFormError(
        `${editingId != null ? "Update" : "Create"} failed: ${getErrorMessage(err)}`
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(event) {
    const id = getEventId(event);

    if (id == null || String(id).startsWith("demo-")) {
      setError(
        "This is a sample event and cannot be deleted from the backend."
      );
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${event.title}"?`
    );

    if (!confirmed) return;

    setDeletingId(id);
    setError("");
    setNotice("");

    try {
      await deleteEvent(id);
      setEvents((current) =>
        current.filter(
          (item) => String(getEventId(item)) !== String(id)
        )
      );
      setNotice("Event deleted successfully.");
    } catch (err) {
      console.error("Failed to delete event:", err);
      setError(`Delete failed: ${getErrorMessage(err)}`);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <main className="events-page">
      <section className="events-hero">
        <div className="events-hero-content">
          <span className="events-eyebrow">
            DISCOVER · CONNECT · EXPERIENCE
          </span>

          <h1>
            Find your next
            <span> great experience.</span>
          </h1>

          <p>
            Explore conferences, workshops, concerts, and
            opportunities to learn, connect, and create memories.
          </p>

          <div className="events-hero-actions">
            <a className="events-hero-button" href="#event-list">
              Explore events <ArrowRight size={17} />
            </a>

            <button
              type="button"
              className="events-add-hero-button"
              onClick={openAddForm}
            >
              <Plus size={17} /> Add an event
            </button>
          </div>

          <div className="events-hero-highlights">
            <span>
              <CalendarDays size={17} /> Upcoming experiences
            </span>
            <span>
              <Ticket size={17} /> Easy booking
            </span>
            <span>
              <Users size={17} /> Real connections
            </span>
          </div>
        </div>

        <div className="events-hero-art">
          <img
            src={DEFAULT_IMAGE}
            alt="People enjoying a live event"
            onError={(event) => {
              event.currentTarget.style.visibility = "hidden";
            }}
          />
          <div className="events-art-caption">
            <span className="events-art-dot" />
            <div>
              <strong>Make it memorable</strong>
              <span>Something exciting is waiting</span>
            </div>
          </div>
        </div>
      </section>

      <section className="events-container" id="event-list">
        <div className="events-heading">
          <div>
            <span className="events-eyebrow">
              YOUR NEXT EXPERIENCE
            </span>
            <h2>Explore events</h2>
            <p>Find something worth showing up for.</p>
          </div>

          <div className="events-heading-actions">
            <span className="events-count">
              {events.length}{" "}
              {events.length === 1 ? "event" : "events"}
            </span>

            <button
              type="button"
              className="events-refresh-button"
              onClick={() => loadEvents(true)}
              disabled={refreshing}
              aria-label="Refresh events"
            >
              <RefreshCw
                size={16}
                className={refreshing ? "events-spinning" : ""}
              />
              {refreshing ? "Refreshing" : "Refresh"}
            </button>
          </div>
        </div>

        <div className="events-toolbar">
          <label className="events-search">
            <Search size={19} />
            <input
              type="search"
              placeholder="Search by title, location, or description..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            {search && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setSearch("")}
              >
                <X size={16} />
              </button>
            )}
          </label>

          <label className="events-filter">
            <span>Category</span>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            className="events-add-button"
            onClick={openAddForm}
          >
            <Plus size={18} /> Add event
          </button>
        </div>

        {notice && (
          <div className="events-notice" role="status">
            <span>{notice}</span>
            <button
              type="button"
              onClick={() => setNotice("")}
              aria-label="Dismiss notification"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {error && (
          <div className="events-error" role="alert">
            <span>{error}</span>
            <button type="button" onClick={() => loadEvents(true)}>
              Try again
            </button>
          </div>
        )}

        {showForm && (
          <section className="events-form-panel" aria-labelledby="event-form-title">
            <div className="events-form-heading">
              <div>
                <span className="events-eyebrow">
                  EVENT MANAGEMENT
                </span>
                <h3 id="event-form-title">
                  {editingId != null ? "Edit event" : "Create a new event"}
                </h3>
                <p>
                  Enter the event details below. Changes are saved
                  to your backend.
                </p>
              </div>

              <button
                type="button"
                className="events-close-form"
                onClick={closeForm}
                disabled={saving}
                aria-label="Close form"
              >
                <X size={20} />
              </button>
            </div>

            <form className="events-form" onSubmit={handleSubmit}>
              <label>
                Event title *
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Java Developer Conference"
                  maxLength={150}
                  required
                />
              </label>

              <label>
                Location *
                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="e.g. Bengaluru"
                  required
                />
              </label>

              <label className="events-form-wide">
                Description *
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="What can attendees expect?"
                  rows={4}
                  required
                />
              </label>

              <label>
                Event date and time *
                <input
                  type="datetime-local"
                  name="eventDate"
                  value={form.eventDate}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Ticket price (₹)
                <input
                  type="number"
                  name="ticketPrice"
                  value={form.ticketPrice}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  required
                />
              </label>

              <label>
                Total seats
                <input
                  type="number"
                  name="totalSeats"
                  value={form.totalSeats}
                  onChange={handleChange}
                  min="1"
                  step="1"
                  required
                />
              </label>

              <label>
                Status
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option value="ACTIVE">Active</option>
                  <option value="UPCOMING">Upcoming</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </label>

              <label className="events-form-wide">
                Image URL (optional)
                <div className="events-image-input-wrap">
                  <ImageIcon size={18} />
                  <input
                    type="url"
                    name="imageUrl"
                    value={form.imageUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/event-image.jpg"
                  />
                </div>
                <small>
                  Leave blank to choose a default image based on the event.
                </small>
              </label>

              {form.imageUrl.trim() && (
                <div className="events-image-preview events-form-wide">
                  <img
                    src={form.imageUrl}
                    alt="Event preview"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                    onLoad={(event) => {
                      event.currentTarget.style.display = "block";
                    }}
                  />
                </div>
              )}

              {formError && (
                <p className="events-form-error events-form-wide" role="alert">
                  {formError}
                </p>
              )}

              <div className="events-form-actions events-form-wide">
                <button
                  type="button"
                  className="events-cancel-button"
                  onClick={closeForm}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="events-submit-button"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <RefreshCw size={17} className="events-spinning" />
                      Saving...
                    </>
                  ) : (
                    <>
                      {editingId != null ? "Save changes" : "Create event"}
                      <ArrowRight size={17} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>
        )}

        {loading ? (
          <div className="events-state">
            <RefreshCw size={28} className="events-spinning" />
            <h3>Loading events</h3>
            <p>Finding experiences for you...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="events-empty">
            <span className="events-empty-icon">
              <CalendarDays size={28} />
            </span>
            <h3>
              {events.length === 0
                ? "No events have been added yet"
                : "No matching events"}
            </h3>
            <p>
              {events.length === 0
                ? "Create your first event using the Add event button."
                : "Try another search term or change the category filter."}
            </p>
            {events.length === 0 ? (
              <button
                type="button"
                className="events-add-button"
                onClick={openAddForm}
              >
                <Plus size={18} /> Create first event
              </button>
            ) : (
              <button
                type="button"
                className="events-reset-button"
                onClick={() => {
                  setSearch("");
                  setCategory("All");
                }}
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="events-grid">
            {filteredEvents.map((event) => {
              const id = getEventId(event);
              const price = Number(event.ticketPrice) || 0;
              const seats =
                event.availableSeats ?? event.totalSeats;

              return (
                <article className="event-card" key={id}>
                  <div className="event-image-wrapper">
                    <img
                      className="event-image"
                      src={getEventImage(event)}
                      alt={event.title}
                      loading="lazy"
                      onError={(e) => {
                        const img = e.currentTarget;
                        const fallback = getFallbackImage(event);

                        if (img.dataset.fallbackApplied === "true") {
                          img.onerror = null;
                          img.src = DEFAULT_IMAGE;
                          return;
                        }

                        img.dataset.fallbackApplied = "true";
                        img.src = fallback;
                      }}
                    />

                    <span className="event-category">
                      {event.category || event.status || "FEATURED"}
                    </span>
                  </div>

                  <div className="event-card-content">
                    <div className="event-date-line">
                      <CalendarDays size={15} />
                      <span>{formatEventDate(event.eventDate)}</span>
                    </div>

                    <h3>{event.title}</h3>

                    <p className="event-description">
                      {event.description ||
                        "Join us for an exciting event and connect with others."}
                    </p>

                    <div className="event-info">
                      <div className="event-info-row">
                        <MapPin size={16} />
                        <span>{event.location}</span>
                      </div>

                      <div className="event-info-row">
                        <Users size={16} />
                        <span>
                          {seats == null
                            ? "Seat availability not provided"
                            : `${seats} seats`}
                        </span>
                      </div>
                    </div>

                    <div className="event-card-footer">
                      <div className="event-price">
                        <span>Ticket price</span>
                        <strong>
                          {price > 0
                            ? `₹${price.toLocaleString("en-IN")}`
                            : "Free"}
                        </strong>
                      </div>

                      <Link
                        className="event-view-button"
                        to={`/events/${encodeURIComponent(String(id))}`}
                      >
                        View event <ArrowRight size={16} />
                      </Link>
                    </div>

                    <div className="event-management-actions">
                      <button
                        type="button"
                        className="event-edit-button"
                        onClick={() => openEditForm(event)}
                      >
                        <Pencil size={15} /> Edit
                      </button>

                      <button
                        type="button"
                        className="event-delete-button"
                        onClick={() => handleDelete(event)}
                        disabled={deletingId === id}
                      >
                        <Trash2 size={15} />
                        {deletingId === id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
