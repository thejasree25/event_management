
import { useState } from "react";
import {
  CalendarDays,
  MapPin,
  Heart,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

export function formatDate(value) {
  if (!value) return "Date to be announced";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date to be announced";
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function EventCard({ event }) {
  const [favorite, setFavorite] = useState(false);

  const id = event.id ?? event.eventId;

  const category =
    typeof event.category === "string"
      ? event.category
      : event.category?.name;

  const price = Number(event.ticketPrice ?? event.price ?? 0);

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-green-100 bg-white text-gray-800 shadow-lg shadow-green-900/5 transition-all duration-500 hover:-translate-y-2 hover:border-green-300 hover:shadow-xl hover:shadow-green-900/10">

      {/* Event Image */}
      <div className="relative h-56 overflow-hidden bg-green-50">
        {event.imageUrl || event.image ? (
          <img
            src={event.imageUrl || event.image}
            alt={event.title || "Event"}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-green-100 via-white to-amber-100">
            <CalendarDays
              size={58}
              strokeWidth={1.2}
              className="text-green-700"
            />
          </div>
        )}

        {/* Image Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-green-950/60 via-transparent to-black/10" />

        {/* Category */}
        <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-white/95 px-3 py-1.5 text-xs font-semibold tracking-wide text-green-800 shadow-sm backdrop-blur-md">
          <Sparkles size={13} className="text-amber-500" />
          {category || "Featured"}
        </span>

        {/* Favorite */}
        <button
          type="button"
          aria-label={favorite ? "Remove favorite" : "Add favorite"}
          aria-pressed={favorite}
          onClick={() => setFavorite((previous) => !previous)}
          className={`absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border shadow-sm backdrop-blur-md transition-all duration-300 ${
            favorite
              ? "border-amber-400 bg-amber-400 text-green-950"
              : "border-white/80 bg-white/95 text-green-800 hover:border-amber-400 hover:bg-amber-100"
          }`}
        >
          <Heart
            size={18}
            fill={favorite ? "currentColor" : "none"}
          />
        </button>

        {/* Date */}
        <div className="absolute bottom-4 left-4 flex items-center gap-2 text-sm font-semibold text-white">
          <CalendarDays size={16} className="text-amber-300" />
          {formatDate(event.eventDate || event.date)}
        </div>
      </div>

      {/* Event Details */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 text-xl font-bold leading-snug tracking-tight text-green-950 transition-colors duration-300 group-hover:text-green-700">
          {event.title || "Untitled event"}
        </h3>

        <p className="mt-3 line-clamp-2 min-h-12 text-sm leading-6 text-gray-600">
          {event.description ||
            "Join us for a memorable experience and make every moment count."}
        </p>

        {/* Location */}
        <div className="mt-4 flex items-start gap-2 rounded-xl bg-green-50 px-3 py-2.5 text-sm text-gray-700">
          <MapPin
            size={17}
            className="mt-0.5 shrink-0 text-green-700"
          />
          <span className="line-clamp-1">
            {event.location ||
              event.venue?.location ||
              "Location to be announced"}
          </span>
        </div>

        {/* Divider */}
        <div className="my-5 h-px bg-gradient-to-r from-green-300 via-amber-200 to-transparent" />

        {/* Price and Button */}
        <div className="mt-auto flex items-end justify-between gap-3">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-gray-500">
              Ticket price
            </p>

            <p className="text-2xl font-extrabold tracking-tight text-green-800">
              ₹{price.toLocaleString("en-IN")}
            </p>
          </div>

          <Link
            to={`/events/${id}`}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-green-700 px-4 py-3 text-sm font-bold text-white shadow-md shadow-green-900/10 transition-all duration-300 hover:scale-105 hover:bg-green-800 active:scale-95"
          >
            Explore
            <ArrowUpRight
              size={17}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>
      </div>

      {/* Bottom Accent */}
      <div className="h-1 w-0 bg-gradient-to-r from-green-700 via-green-400 to-amber-300 transition-all duration-500 group-hover:w-full" />
    </article>
  );
}
