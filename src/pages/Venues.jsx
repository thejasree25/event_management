
import { useEffect, useState } from "react";
import { MapPin, Users, RefreshCw, Building2 } from "lucide-react";
import { getVenues } from "../api/venues.js";
import "../styles/venues.css";

export default function Venues() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadVenues() {
    try {
      setLoading(true);
      setError("");

      const response = await getVenues();
      const data = response.data;

      const venueList = Array.isArray(data)
        ? data
        : data?.content ?? data?.data ?? data?.venues ?? [];

      setVenues(venueList);
    } catch (err) {
      console.error("Failed to fetch venues:", err);

      setError(
        typeof err.response?.data?.message === "string"
          ? err.response.data.message
          : "Unable to load venues. Check whether the backend is running."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadVenues();
  }, []);

  return (
    <main className="venues-page">
      <section className="venues-hero">
        <div className="venues-hero-content">
          <span className="venues-eyebrow">
            DISCOVER YOUR PERFECT SPACE
          </span>

          <h1>Explore Event Venues</h1>

          <p>
            Discover spaces for conferences, workshops, celebrations,
            and unforgettable experiences.
          </p>

          <button
            type="button"
            className="venues-refresh-button"
            onClick={loadVenues}
            disabled={loading}
          >
            <RefreshCw size={16} />
            Refresh Venues
          </button>
        </div>
      </section>

      <section className="venues-container">
        <div className="venues-heading">
          <div>
            <span className="venues-eyebrow">FIND YOUR SPACE</span>
            <h2>Available Venues</h2>
            <p>Choose a venue that suits your event.</p>
          </div>

          <span className="venues-count">
            {venues.length}{" "}
            {venues.length === 1 ? "venue" : "venues"}
          </span>
        </div>

        {loading ? (
          <div className="venues-status">
            Loading venues...
          </div>
        ) : error ? (
          <div className="venues-error">
            <p>{error}</p>
            <button type="button" onClick={loadVenues}>
              Try Again
            </button>
          </div>
        ) : venues.length === 0 ? (
          <div className="venues-empty">
            <Building2 size={42} />
            <h3>No venues available yet</h3>
            <p>
              Add a venue through your backend API or Postman,
              then refresh this page.
            </p>
          </div>
        ) : (
          <div className="venues-grid">
            {venues.map((venue, index) => (
              <article
                className="venue-card"
                key={venue.id ?? venue.venueId ?? index}
              >
                <div className="venue-card-header">
                  <span className="venue-icon">
                    <Building2 size={27} />
                  </span>

                  <span className="venue-badge">
                    EVENT VENUE
                  </span>
                </div>

                <h3>{venue.name || "Unnamed Venue"}</h3>

                <p className="venue-address">
                  <MapPin size={17} />
                  {venue.address ||
                    venue.location ||
                    "Address not provided"}
                </p>

                <p className="venue-description">
                  {venue.description ||
                    "A space for your next event."}
                </p>

                <div className="venue-card-footer">
                  <span>
                    <Users size={17} />
                    Capacity
                  </span>

                  <strong>
                    {venue.capacity ?? "Not specified"}
                  </strong>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
