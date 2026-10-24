
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  Sparkles,
  Ticket,
  Users,
} from "lucide-react";

import EventCard from "../components/EventCard.jsx";
import { getEvents } from "../api/events.js";
import { getBuiltInEventImage } from "../utils/eventImages.js";

const fallbackEvents = [
  {
    id: "demo-1",
    title: "Future of Technology Summit",
    description:
      "Meet innovators and explore the future of technology, software, and digital transformation.",
    location: "Bengaluru",
    eventDate: "2027-01-20T10:00:00",
    ticketPrice: 499,
    category: "Technology",
  },
  {
    id: "demo-2",
    title: "AI and Machine Learning Workshop",
    description:
      "Discover artificial intelligence and explore machine learning applications.",
    location: "Chennai",
    eventDate: "2027-02-15T09:30:00",
    ticketPrice: 450,
    category: "AI Workshop",
  },
  {
    id: "demo-3",
    title: "Music Under the Stars",
    description:
      "Enjoy live music, incredible performances, and great company.",
    location: "Hyderabad",
    eventDate: "2027-03-08T18:00:00",
    ticketPrice: 799,
    category: "Music",
  },
];

function normalizeEvent(event, index) {
  const normalized = {
    ...event,
    id: event?.id ?? event?.eventId ?? `event-${index}`,
  };

  return {
    ...normalized,
    imageUrl: getBuiltInEventImage(normalized),
  };
}

export default function Home() {
  const [events, setEvents] = useState(() =>
    fallbackEvents.map(normalizeEvent)
  );

  useEffect(() => {
    let active = true;

    async function loadEvents() {
      try {
        const response = await getEvents();
        const data = response?.data;

        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.content)
            ? data.content
            : Array.isArray(data?.events)
              ? data.events
              : [];

        if (active && list.length > 0) {
          setEvents(list.slice(0, 3).map(normalizeEvent));
        }
      } catch (error) {
        console.error(
          "Could not load events from backend. Showing demo events.",
          error
        );
      }
    }

    loadEvents();

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="home-page">
      <section className="hero container">
        <div className="hero-copy">
          <span className="eyebrow">
            <Sparkles size={14} />
            YOUR NEXT GREAT EXPERIENCE
          </span>

          <h1>
            Make moments.
            <br />
            <span>Make memories.</span>
          </h1>

          <p>
            Discover conferences, workshops, concerts, and experiences
            that bring people together. Your next story starts here.
          </p>

          <div className="hero-buttons">
            <Link to="/events" className="btn btn-primary btn-large">
              Explore Events
              <ArrowRight size={17} />
            </Link>

            <Link to="/register" className="btn btn-outline btn-large">
              Join Evently
            </Link>
          </div>

          <div className="hero-stats">
            <div>
              <strong>
                <Ticket size={18} />
                Easy booking
              </strong>
              <span>Reserve in a few clicks</span>
            </div>

            <div>
              <strong>
                <Users size={18} />
                Great experiences
              </strong>
              <span>Find your community</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <img
            src={getBuiltInEventImage({
              title: "Unforgettable Live Experiences",
              category: "Music Festival",
            })}
            alt="Evently live event illustration"
          />

          <div className="hero-float">
            <span className="float-icon">
              <CalendarDays size={20} />
            </span>

            <span>
              <strong>Find your next moment</strong>
              <small>Events for every interest</small>
            </span>
          </div>

          <span className="hero-tag">MAKE IT MEMORABLE</span>
        </div>
      </section>

      <section className="featured-section">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">HANDPICKED FOR YOU</span>
              <h2>Featured events</h2>
              <p>Get inspired by what's coming up next.</p>
            </div>

            <Link to="/events" className="text-link">
              View all events
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="event-grid">
            {events.map((event, index) => (
              <EventCard
                key={event.id ?? event.eventId ?? index}
                event={normalizeEvent(event, index)}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section container">
        <div className="cta-symbol">
          <Sparkles size={25} />
        </div>

        <div className="cta-copy">
          <span className="eyebrow">YOUR NEXT CHAPTER</span>
          <h2>There's a moment waiting for you.</h2>
          <p>
            Explore events, reserve your place, and make it count.
          </p>
        </div>

        <Link to="/events" className="btn btn-primary">
          Find an event
          <ArrowRight size={16} />
        </Link>
      </section>
    </main>
  );
}
