import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  CalendarDays,
  MapPin,
  Heart,
  Ticket,
} from "lucide-react";
import { getBuiltInEventImage } from "../utils/eventImages.js";

function formatDate(value) {
  if (!value) return "Date to be announced";

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "Date to be announced"
    : date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
}

export default function EventCard({ event = {} }) {
  const [isFavorite, setIsFavorite] = useState(false);

  const title = event.title || "Untitled Event";
  const id = event.id ?? event.eventId;
  const image = getBuiltInEventImage(event);

  const amount = Number(event.ticketPrice ?? event.price ?? 0);
  const isFree = Number.isFinite(amount) && amount <= 0;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-yellow-100 bg-white shadow-[0_8px_30px_rgba(161,98,7,0.07)] transition-all duration-300 hover:-translate-y-2 hover:border-yellow-300 hover:shadow-[0_20px_45px_rgba(161,98,7,0.16)]">
      {/* Event Image */}
      <div className="relative h-56 overflow-hidden bg-gradient-to-br from-yellow-50 via-white to-amber-100">
        <img
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          src={image}
          alt={`${title} artwork`}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />

        {/* Image Overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />

        {/* Category */}
        <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/95 px-4 py-2 text-xs font-bold tracking-wide text-amber-700 shadow-sm backdrop-blur">
          <span className="h-2 w-2 rounded-full bg-yellow-400" />
          {event.category?.name || event.category || "Featured Event"}
        </span>

        {/* Favorite Button */}
        <button
          type="button"
          className={`absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 ${
            isFavorite
              ? "scale-110 border-rose-200 bg-rose-50 text-rose-500"
              : "border-white/80 bg-white/95 text-gray-600 hover:scale-110 hover:bg-yellow-50 hover:text-amber-600"
          }`}
          onClick={() => setIsFavorite((previous) => !previous)}
          aria-label={isFavorite ? "Remove favorite" : "Add favorite"}
          aria-pressed={isFavorite}
        >
          <Heart
            size={19}
            fill={isFavorite ? "currentColor" : "none"}
          />
        </button>

        {/* Price Badge */}
        <div className="absolute bottom-4 right-4 rounded-xl border border-white/70 bg-white/95 px-4 py-2 shadow-lg backdrop-blur">
          <span className="text-xs font-medium text-gray-500">
            Ticket price
          </span>
          <p className="text-lg font-extrabold text-amber-600">
            {isFree
              ? "Free"
              : Number.isFinite(amount)
                ? `₹${amount.toLocaleString("en-IN")}`
                : "Price unavailable"}
          </p>
        </div>
      </div>

      {/* Event Content */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {/* Date */}
        <div className="mb-4 flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-yellow-50 text-amber-600">
            <CalendarDays size={18} />
          </span>

          <span className="text-sm font-semibold text-gray-600">
            {formatDate(event.eventDate || event.date)}
          </span>
        </div>

        {/* Title */}
        <h3 className="mb-3 line-clamp-2 text-xl font-extrabold leading-snug text-gray-900 transition-colors duration-300 group-hover:text-amber-700">
          {title}
        </h3>

        {/* Description */}
        <p className="mb-5 line-clamp-3 text-sm leading-6 text-gray-500">
          {event.description || "Discover an exciting event and create unforgettable memories."}
        </p>

        {/* Location */}
        <div className="mb-5 flex items-start gap-2 border-b border-yellow-100 pb-5">
          <MapPin
            size={18}
            className="mt-0.5 shrink-0 text-amber-500"
          />

          <span className="line-clamp-2 text-sm font-medium text-gray-600">
            {event.location || "Location to be announced"}
          </span>
        </div>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between gap-3">
          <div>
            <p className="mb-1 text-xs font-medium uppercase tracking-wider text-gray-400">
              Available seats
            </p>

            <div className="flex items-center gap-2">
              <Ticket size={17} className="text-amber-500" />
              <span className="text-sm font-bold text-gray-700">
                {event.availableSeats ?? event.totalSeats ?? "N/A"}
              </span>
            </div>
          </div>

          <Link
            to={id != null ? `/events/${id}` : "/events"}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 px-4 py-3 text-sm font-bold text-white shadow-md shadow-amber-200/60 transition-all duration-300 hover:-translate-y-0.5 hover:from-amber-500 hover:to-yellow-500 hover:shadow-lg hover:shadow-amber-300/50 focus:outline-none focus:ring-4 focus:ring-yellow-200"
          >
            View Details
            <ArrowUpRight
              size={17}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>
      </div>
    </article>
  );
}