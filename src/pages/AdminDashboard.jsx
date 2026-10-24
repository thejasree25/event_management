
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  Users,
  Ticket,
  IndianRupee,
  RefreshCw,
  Search,
  Download,
  TrendingUp,
  ClipboardList,
  CreditCard,
  CheckCircle2,
  Clock,
  XCircle,
  ArrowUpRight,
  MapPin,
  Filter,
  Activity,
  Eye,
  BarChart3,
  PieChart,
  CircleDollarSign,
  UsersRound,
  Gauge,
  ChartNoAxesCombined,
  CalendarCheck,
} from "lucide-react";

import {
  getAdminDashboard,
  getAdminEvents,
  getAdminUsers,
  getAdminBookings,
} from "../api/admin.js";

export default function AdminDashboard() {
  const [dashboard, setDashboard] = useState({});
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [eventSearch, setEventSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [bookingStatus, setBookingStatus] = useState("ALL");
  const [activeTab, setActiveTab] = useState("bookings");

  const loadDashboard = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const results = await Promise.allSettled([
        getAdminDashboard(),
        getAdminEvents(),
        getAdminUsers(),
        getAdminBookings(),
      ]);

      const [dashboardResult, eventsResult, usersResult, bookingsResult] =
        results;

      const extractArray = (result) => {
        if (result.status !== "fulfilled") return null;

        const data = result.value?.data ?? result.value;

        if (Array.isArray(data)) return data;
        if (Array.isArray(data?.content)) return data.content;
        if (Array.isArray(data?.data)) return data.data;

        return [];
      };

      if (dashboardResult.status === "fulfilled") {
        const data =
          dashboardResult.value?.data ?? dashboardResult.value;

        setDashboard(data && typeof data === "object" ? data : {});
      }

      const eventData = extractArray(eventsResult);
      const userData = extractArray(usersResult);
      const bookingData = extractArray(bookingsResult);

      if (eventData !== null) setEvents(eventData);
      if (userData !== null) setUsers(userData);
      if (bookingData !== null) setBookings(bookingData);

      if (results.every((result) => result.status === "rejected")) {
        setError(
          "Unable to load dashboard data. Check your backend server and API URLs."
        );
      } else if (results.some((result) => result.status === "rejected")) {
        setError(
          "Some dashboard data could not be loaded. Check the corresponding backend API."
        );
      }
    } catch {
      setError("Something went wrong while loading the dashboard.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const getBookingStatus = (booking) =>
    String(
      booking.status ??
        booking.bookingStatus ??
        booking.paymentStatus ??
        "PENDING"
    ).toUpperCase();

  const getUserName = (booking) =>
    booking.user?.name ??
    booking.userName ??
    booking.user?.email ??
    "Unknown User";

  const getEventName = (booking) =>
    booking.event?.title ??
    booking.event?.name ??
    booking.eventTitle ??
    "Unknown Event";

  const statusStyle = (status) => {
    const value = String(status ?? "").toUpperCase();

    if (
      ["CONFIRMED", "APPROVED", "PAID", "SUCCESS", "COMPLETED"].includes(value)
    ) {
      return "bg-emerald-100 text-emerald-800";
    }

    if (["PENDING", "PROCESSING"].includes(value)) {
      return "bg-amber-100 text-amber-800";
    }

    if (["CANCELLED", "FAILED", "REJECTED"].includes(value)) {
      return "bg-rose-100 text-rose-700";
    }

    return "bg-gray-100 text-gray-700";
  };

  const formatCurrency = (amount) =>
    `₹${Number(amount ?? 0).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;

  const filteredEvents = useMemo(
    () =>
      events.filter((event) =>
        [
          event.title,
          event.name,
          event.location,
          typeof event.category === "object"
            ? event.category?.name
            : event.category,
        ]
          .join(" ")
          .toLowerCase()
          .includes(eventSearch.toLowerCase().trim())
      ),
    [events, eventSearch]
  );

  const filteredUsers = useMemo(
    () =>
      users.filter((user) =>
        [user.name, user.email, user.role]
          .join(" ")
          .toLowerCase()
          .includes(userSearch.toLowerCase().trim())
      ),
    [users, userSearch]
  );

  const filteredBookings = useMemo(
    () =>
      bookings.filter((booking) => {
        const matchesSearch = [
          booking.id,
          booking.registrationId,
          getUserName(booking),
          booking.user?.email,
          getEventName(booking),
          getBookingStatus(booking),
        ]
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase().trim());

        const matchesStatus =
          bookingStatus === "ALL" ||
          getBookingStatus(booking) === bookingStatus;

        return matchesSearch && matchesStatus;
      }),
    [bookings, search, bookingStatus]
  );

  const confirmedBookings = bookings.filter((booking) =>
    ["CONFIRMED", "APPROVED", "PAID", "SUCCESS", "COMPLETED"].includes(
      getBookingStatus(booking)
    )
  ).length;

  const pendingBookings = bookings.filter((booking) =>
    ["PENDING", "PROCESSING"].includes(getBookingStatus(booking))
  ).length;

  const cancelledBookings = bookings.filter((booking) =>
    ["CANCELLED", "REJECTED", "FAILED"].includes(getBookingStatus(booking))
  ).length;

  // Analytics calculations
  const totalEventSeats = events.reduce(
    (sum, event) => sum + Math.max(0, Number(event.totalSeats ?? 0)),
    0
  );

  const availableEventSeats = events.reduce(
    (sum, event) =>
      sum +
      Math.max(
        0,
        Number(event.availableSeats ?? event.totalSeats ?? 0)
      ),
    0
  );

  const bookedSeats = Math.max(
    0,
    totalEventSeats - availableEventSeats
  );

  const occupancyRate =
    totalEventSeats > 0
      ? Math.min(
          100,
          Math.round((bookedSeats / totalEventSeats) * 100)
        )
      : 0;

  const bookingStatusAnalytics = [
    {
      label: "Confirmed",
      count: confirmedBookings,
      color: "bg-emerald-500",
      textColor: "text-emerald-700",
    },
    {
      label: "Pending",
      count: pendingBookings,
      color: "bg-amber-400",
      textColor: "text-amber-700",
    },
    {
      label: "Cancelled / Failed",
      count: cancelledBookings,
      color: "bg-rose-500",
      textColor: "text-rose-700",
    },
  ];

  const totalTrackedBookings = bookingStatusAnalytics.reduce(
    (sum, item) => sum + item.count,
    0
  );

  const eventPerformance = events
    .map((event) => {
      const eventId = event.id ?? event.eventId;

      const relatedBookings = bookings.filter((booking) => {
        const bookingEventId =
          booking.event?.id ??
          booking.eventId ??
          booking.event?.eventId;

        return (
          eventId != null &&
          bookingEventId != null &&
          String(eventId) === String(bookingEventId)
        );
      }).length;

      return {
        id: eventId,
        title: event.title ?? event.name ?? "Untitled Event",
        location: event.location ?? "Location unavailable",
        bookings: relatedBookings,
      };
    })
    .sort((a, b) => b.bookings - a.bookings)
    .slice(0, 5);

  const maximumEventBookings = Math.max(
    1,
    ...eventPerformance.map((event) => event.bookings)
  );

  const publishedEvents = events.filter((event) =>
    ["PUBLISHED", "ACTIVE", "UPCOMING"].includes(
      String(event.status ?? "").toUpperCase()
    )
  ).length;

  const stats = [
    {
      title: "Total Events",
      value: dashboard.totalEvents ?? events.length,
      icon: CalendarDays,
      color: "bg-emerald-100 text-emerald-800",
      detail: "Events in the system",
    },
    {
      title: "Total Users",
      value: dashboard.totalUsers ?? users.length,
      icon: Users,
      color: "bg-amber-100 text-amber-800",
      detail: "Registered accounts",
    },
    {
      title: "Total Bookings",
      value: dashboard.totalBookings ?? bookings.length,
      icon: Ticket,
      color: "bg-lime-100 text-lime-800",
      detail: "All event bookings",
    },
    {
      title: "Total Revenue",
      value: formatCurrency(dashboard.totalRevenue ?? 0),
      icon: IndianRupee,
      color: "bg-emerald-100 text-emerald-800",
      detail: "Revenue reported by API",
    },
  ];

  const exportCSV = (type) => {
    let headers = [];
    let rows = [];

    if (type === "events") {
      headers = ["Event ID", "Title", "Location", "Date", "Price"];

      rows = filteredEvents.map((event) => [
        event.id ?? event.eventId ?? "",
        event.title ?? event.name ?? "",
        event.location ?? "",
        event.eventDate ?? "",
        event.ticketPrice ?? event.price ?? 0,
      ]);
    } else if (type === "users") {
      headers = ["User ID", "Name", "Email", "Role"];

      rows = filteredUsers.map((user) => [
        user.id ?? user.userId ?? "",
        user.name ?? "",
        user.email ?? "",
        user.role ?? "USER",
      ]);
    } else {
      headers = ["Booking ID", "User", "Email", "Event", "Status"];

      rows = filteredBookings.map((booking) => [
        booking.id ?? booking.registrationId ?? "",
        getUserName(booking),
        booking.user?.email ?? "",
        getEventName(booking),
        getBookingStatus(booking),
      ]);
    }

    const escapeCSV = (value) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;

    const content = [headers, ...rows]
      .map((row) => row.map(escapeCSV).join(","))
      .join("\r\n");

    const blob = new Blob(["\uFEFF" + content], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `eventsphere-${type}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7faf6]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-800" />
          <p className="font-semibold text-emerald-950">
            Loading EventSphere dashboard...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7faf6] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* Header */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-green-900 to-emerald-800 p-6 text-white shadow-xl sm:p-9">
          <div className="pointer-events-none absolute -right-12 -top-16 h-56 w-56 rounded-full bg-amber-300/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 right-1/3 h-48 w-48 rounded-full bg-emerald-300/10 blur-3xl" />

          <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-amber-300">
                <Activity size={16} />
                EventSphere Administration
              </div>

              <h1 className="text-3xl font-extrabold sm:text-4xl">
                Admin Dashboard
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-green-100/80 sm:text-base">
                Manage events, monitor users, track bookings, and understand
                your platform performance.
              </p>

              <p className="mt-4 text-sm text-green-100/70">
                Dashboard overview ·{" "}
                {new Date().toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>

            <button
              type="button"
              onClick={() => loadDashboard(true)}
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-bold transition hover:bg-white/20 disabled:cursor-wait disabled:opacity-70 lg:self-center"
            >
              <RefreshCw
                size={17}
                className={refreshing ? "animate-spin" : ""}
              />
              {refreshing ? "Refreshing..." : "Refresh Data"}
            </button>
          </div>
        </section>

        {error && (
          <div className="flex flex-col justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-800 sm:flex-row sm:items-center">
            <div>
              <p className="font-bold">Dashboard data could not be fully loaded</p>
              <p className="mt-1 text-sm">{error}</p>
            </div>

            <button
              onClick={() => loadDashboard(true)}
              className="rounded-xl bg-red-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-red-800"
            >
              Retry
            </button>
          </div>
        )}

        {/* Main statistics */}
        <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map(({ title, value, icon: Icon, color, detail }) => (
            <article
              key={title}
              className="group rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-gray-500">
                    {title}
                  </p>

                  <h2 className="mt-3 break-words text-2xl font-extrabold text-emerald-950 sm:text-3xl">
                    {value}
                  </h2>
                </div>

                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${color} transition group-hover:scale-110`}
                >
                  <Icon size={24} />
                </div>
              </div>

              <div className="mt-5 flex items-center gap-2 border-t border-gray-100 pt-4 text-xs text-gray-500">
                <TrendingUp size={15} className="text-emerald-700" />
                {detail}
              </div>
            </article>
          ))}
        </section>

        {/* Booking overview */}
        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            {
              title: "Confirmed Bookings",
              value: confirmedBookings,
              icon: CheckCircle2,
              style: "bg-emerald-100 text-emerald-800",
              border: "border-emerald-100",
            },
            {
              title: "Pending Bookings",
              value: pendingBookings,
              icon: Clock,
              style: "bg-amber-100 text-amber-800",
              border: "border-amber-100",
            },
            {
              title: "Cancelled / Failed",
              value: cancelledBookings,
              icon: XCircle,
              style: "bg-rose-100 text-rose-700",
              border: "border-rose-100",
            },
          ].map(({ title, value, icon: Icon, style, border }) => (
            <article
              key={title}
              className={`flex items-center gap-4 rounded-2xl border ${border} bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md`}
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${style}`}
              >
                <Icon size={24} />
              </div>

              <div>
                <p className="text-sm text-gray-500">{title}</p>
                <h3 className="mt-1 text-2xl font-extrabold text-emerald-950">
                  {value}
                </h3>
              </div>
            </article>
          ))}
        </section>

        {/* Advanced analytics */}
        <section className="space-y-5">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-600">
                <ChartNoAxesCombined size={17} />
                Performance Insights
              </div>

              <h2 className="text-2xl font-extrabold text-emerald-950">
                Analytics Overview
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Explore booking status, seat utilization, and event popularity.
              </p>
            </div>

            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-100 bg-white px-4 py-2 text-xs font-bold text-emerald-800">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Based on loaded API data
            </span>
          </div>

          {/* Analytics cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <article className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-gray-500">
                    Booking Success
                  </p>

                  <h3 className="mt-3 text-3xl font-extrabold text-emerald-950">
                    {bookings.length
                      ? `${Math.round(
                          (confirmedBookings / bookings.length) * 100
                        )}%`
                      : "0%"}
                  </h3>
                </div>

                <div className="rounded-xl bg-emerald-100 p-3 text-emerald-800">
                  <Gauge size={23} />
                </div>
              </div>

              <p className="mt-3 text-xs text-gray-500">
                Confirmed bookings compared with all bookings
              </p>
            </article>

            <article className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-gray-500">
                    Seat Occupancy
                  </p>

                  <h3 className="mt-3 text-3xl font-extrabold text-emerald-950">
                    {occupancyRate}%
                  </h3>
                </div>

                <div className="rounded-xl bg-amber-100 p-3 text-amber-800">
                  <UsersRound size={23} />
                </div>
              </div>

              <p className="mt-3 text-xs text-gray-500">
                {bookedSeats.toLocaleString("en-IN")} of{" "}
                {totalEventSeats.toLocaleString("en-IN")} seats marked as booked
              </p>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-amber-50">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 transition-all duration-700"
                  style={{ width: `${occupancyRate}%` }}
                />
              </div>
            </article>

            <article className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-gray-500">
                    Reported Revenue
                  </p>

                  <h3 className="mt-3 break-words text-2xl font-extrabold text-emerald-950">
                    {formatCurrency(dashboard.totalRevenue ?? 0)}
                  </h3>
                </div>

                <div className="rounded-xl bg-emerald-100 p-3 text-emerald-800">
                  <CircleDollarSign size={23} />
                </div>
              </div>

              <p className="mt-3 text-xs text-gray-500">
                Total reported by the dashboard API
              </p>
            </article>

            <article className="rounded-2xl border border-yellow-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-gray-500">
                    Active / Published
                  </p>

                  <h3 className="mt-3 text-3xl font-extrabold text-emerald-950">
                    {publishedEvents}
                  </h3>
                </div>

                <div className="rounded-xl bg-yellow-100 p-3 text-yellow-800">
                  <CalendarCheck size={23} />
                </div>
              </div>

              <p className="mt-3 text-xs text-gray-500">
                Out of {events.length} total events
              </p>
            </article>
          </div>

          {/* Chart panels */}
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            {/* Booking status chart */}
            <article className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-7">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-extrabold text-emerald-950">
                    Booking Status
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Distribution of recorded bookings
                  </p>
                </div>

                <div className="rounded-xl bg-emerald-50 p-3 text-emerald-800">
                  <PieChart size={22} />
                </div>
              </div>

              <div className="mt-7 space-y-6">
                {bookingStatusAnalytics.map((item) => {
                  const percentage =
                    totalTrackedBookings > 0
                      ? Math.round(
                          (item.count / totalTrackedBookings) * 100
                        )
                      : 0;

                  return (
                    <div key={item.label}>
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span
                            className={`h-2.5 w-2.5 rounded-full ${item.color}`}
                          />
                          <span className="text-sm font-semibold text-gray-700">
                            {item.label}
                          </span>
                        </div>

                        <div className="text-right">
                          <span className="font-extrabold text-emerald-950">
                            {item.count}
                          </span>
                          <span className="ml-2 text-xs text-gray-500">
                            {percentage}%
                          </span>
                        </div>
                      </div>

                      <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className={`h-full rounded-full ${item.color} transition-all duration-700`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-7 flex items-center justify-between rounded-2xl bg-emerald-50 p-4">
                <div>
                  <p className="text-sm font-semibold text-emerald-900">
                    Total tracked bookings
                  </p>
                  <p className="mt-1 text-xs text-emerald-700">
                    Across the three displayed status groups
                  </p>
                </div>

                <span className="text-2xl font-extrabold text-emerald-950">
                  {totalTrackedBookings}
                </span>
              </div>
            </article>

            {/* Event performance chart */}
            <article className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-7">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-extrabold text-emerald-950">
                    Popular Events
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Events ranked by matching booking records
                  </p>
                </div>

                <div className="rounded-xl bg-amber-50 p-3 text-amber-700">
                  <BarChart3 size={22} />
                </div>
              </div>

              {eventPerformance.length > 0 ? (
                <div className="mt-7 space-y-5">
                  {eventPerformance.map((event, index) => {
                    const percentage = Math.round(
                      (event.bookings / maximumEventBookings) * 100
                    );

                    return (
                      <div key={event.id ?? `${event.title}-${index}`}>
                        <div className="mb-2 flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-gray-800">
                              {index + 1}. {event.title}
                            </p>

                            <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                              <MapPin size={12} />
                              <span className="truncate">
                                {event.location}
                              </span>
                            </p>
                          </div>

                          <span className="shrink-0 text-sm font-extrabold text-emerald-900">
                            {event.bookings}
                          </span>
                        </div>

                        <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${
                              index === 0
                                ? "bg-gradient-to-r from-emerald-700 to-emerald-500"
                                : index === 1
                                  ? "bg-gradient-to-r from-amber-500 to-yellow-400"
                                  : "bg-gradient-to-r from-emerald-400 to-lime-400"
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="mt-7 rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/50 px-4 py-10 text-center">
                  <Ticket
                    size={32}
                    className="mx-auto text-emerald-700"
                  />
                  <p className="mt-3 font-bold text-emerald-950">
                    No event performance data yet
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Events and matching booking records will appear here.
                  </p>
                </div>
              )}

              <p className="mt-6 text-xs leading-5 text-gray-400">
                Booking counts depend on the event ID being available in both
                the event and booking API responses.
              </p>
            </article>
          </div>
        </section>

        {/* Quick management */}
        <section>
          <div className="mb-4">
            <h2 className="text-xl font-extrabold text-emerald-950">
              Quick Management
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Navigate to frequently used administration pages.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              {
                title: "Manage Events",
                description: "Review and manage platform events.",
                icon: CalendarDays,
                path: "/manage-events",
              },
              {
                title: "Categories",
                description: "Open event category management.",
                icon: ClipboardList,
                path: "/admin/categories",
              },
              {
                title: "Registrations",
                description: "Review event registrations.",
                icon: Ticket,
                path: "/admin/registrations",
              },
              {
                title: "Payments",
                description: "Review payment records.",
                icon: CreditCard,
                path: "/admin/payments",
              },
            ].map(({ title, description, icon: Icon, path }) => (
              <Link
                key={title}
                to={path}
                className="group flex items-center justify-between gap-3 rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 transition group-hover:bg-amber-200">
                    <Icon size={22} />
                  </div>

                  <div>
                    <h3 className="font-bold text-emerald-950">{title}</h3>
                    <p className="mt-1 text-xs leading-5 text-gray-500">
                      {description}
                    </p>
                  </div>
                </div>

                <ArrowUpRight
                  size={18}
                  className="shrink-0 text-emerald-700 transition group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </Link>
            ))}
          </div>
        </section>

        {/* Platform activity tables */}
        <section className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:p-7">
            <div>
              <h2 className="text-xl font-extrabold text-emerald-950">
                Platform Activity
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Browse events, users, and recent bookings.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                { id: "bookings", label: "Bookings" },
                { id: "events", label: "Events" },
                { id: "users", label: "Users" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded-xl px-4 py-2.5 text-sm font-bold transition ${
                    activeTab === tab.id
                      ? "bg-emerald-900 text-white shadow"
                      : "bg-emerald-50 text-emerald-900 hover:bg-emerald-100"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Bookings */}
          {activeTab === "bookings" && (
            <>
              <div className="flex flex-col gap-3 p-5 sm:flex-row sm:flex-wrap sm:items-center">
                <div className="relative min-w-0 flex-1 sm:min-w-[220px]">
                  <Search
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-700"
                  />

                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search bookings..."
                    className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Filter size={17} className="text-emerald-800" />

                  <select
                    value={bookingStatus}
                    onChange={(event) => setBookingStatus(event.target.value)}
                    className="rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm outline-none focus:border-emerald-600"
                  >
                    <option value="ALL">All statuses</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="PENDING">Pending</option>
                    <option value="CANCELLED">Cancelled</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="FAILED">Failed</option>
                  </select>
                </div>

                <button
                  onClick={() => exportCSV("bookings")}
                  disabled={!filteredBookings.length}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-300 px-4 py-3 text-sm font-bold text-emerald-950 transition hover:bg-amber-200 disabled:opacity-50"
                >
                  <Download size={16} />
                  Export
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[750px] text-left">
                  <thead className="bg-emerald-50 text-xs uppercase tracking-wider text-emerald-900">
                    <tr>
                      <th className="px-6 py-4">Booking ID</th>
                      <th className="px-6 py-4">User</th>
                      <th className="px-6 py-4">Event</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {filteredBookings.map((booking, index) => (
                      <tr
                        key={booking.id ?? booking.registrationId ?? index}
                        className="transition hover:bg-emerald-50/60"
                      >
                        <td className="px-6 py-4 font-bold text-emerald-900">
                          #{booking.id ?? booking.registrationId ?? index + 1}
                        </td>

                        <td className="px-6 py-4">
                          <p className="font-semibold text-gray-900">
                            {getUserName(booking)}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            {booking.user?.email ?? booking.email ?? ""}
                          </p>
                        </td>

                        <td className="px-6 py-4">
                          <p className="font-medium text-gray-800">
                            {getEventName(booking)}
                          </p>
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`rounded-full px-3 py-1.5 text-xs font-bold ${statusStyle(getBookingStatus(booking))}`}
                          >
                            {getBookingStatus(booking)}
                          </span>
                        </td>
                      </tr>
                    ))}

                    {!filteredBookings.length && (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center">
                          <Ticket
                            size={30}
                            className="mx-auto text-emerald-700"
                          />
                          <p className="mt-3 font-bold text-gray-800">
                            No bookings found
                          </p>
                          <p className="mt-1 text-sm text-gray-500">
                            Try another search or status filter.
                          </p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="border-t border-gray-100 bg-gray-50 px-6 py-4 text-sm text-gray-500">
                Showing {filteredBookings.length} of {bookings.length} bookings
              </div>
            </>
          )}

          {/* Events */}
          {activeTab === "events" && (
            <>
              <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center">
                <div className="relative min-w-0 flex-1">
                  <Search
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-700"
                  />

                  <input
                    value={eventSearch}
                    onChange={(event) => setEventSearch(event.target.value)}
                    placeholder="Search event, location, category..."
                    className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                <button
                  onClick={() => exportCSV("events")}
                  disabled={!filteredEvents.length}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-300 px-4 py-3 text-sm font-bold text-emerald-950 hover:bg-amber-200 disabled:opacity-50"
                >
                  <Download size={16} />
                  Export Events
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[650px] text-left">
                  <thead className="bg-emerald-50 text-xs uppercase tracking-wider text-emerald-900">
                    <tr>
                      <th className="px-6 py-4">Event</th>
                      <th className="px-6 py-4">Location</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Price</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {filteredEvents.map((event, index) => (
                      <tr
                        key={event.id ?? event.eventId ?? index}
                        className="hover:bg-emerald-50/60"
                      >
                        <td className="px-6 py-4 font-semibold text-gray-900">
                          {event.title ?? event.name ?? "Untitled event"}
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-600">
                          <span className="inline-flex items-center gap-1.5">
                            <MapPin size={15} className="text-emerald-700" />
                            {event.location ?? "Not specified"}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-600">
                          {event.eventDate
                            ? String(event.eventDate).slice(0, 10)
                            : "Not specified"}
                        </td>

                        <td className="px-6 py-4 font-bold text-emerald-900">
                          {formatCurrency(event.ticketPrice ?? event.price ?? 0)}
                        </td>
                      </tr>
                    ))}

                    {!filteredEvents.length && (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-6 py-12 text-center text-gray-500"
                        >
                          No events match your search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="border-t border-gray-100 bg-gray-50 px-6 py-4 text-sm text-gray-500">
                Showing {filteredEvents.length} of {events.length} events
              </div>
            </>
          )}

          {/* Users */}
          {activeTab === "users" && (
            <>
              <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center">
                <div className="relative min-w-0 flex-1">
                  <Search
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-700"
                  />

                  <input
                    value={userSearch}
                    onChange={(event) => setUserSearch(event.target.value)}
                    placeholder="Search name, email, or role..."
                    className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                <button
                  onClick={() => exportCSV("users")}
                  disabled={!filteredUsers.length}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-300 px-4 py-3 text-sm font-bold text-emerald-950 hover:bg-amber-200 disabled:opacity-50"
                >
                  <Download size={16} />
                  Export Users
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px] text-left">
                  <thead className="bg-emerald-50 text-xs uppercase tracking-wider text-emerald-900">
                    <tr>
                      <th className="px-6 py-4">User</th>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-6 py-4">Role</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {filteredUsers.map((user, index) => (
                      <tr
                        key={user.id ?? user.userId ?? index}
                        className="hover:bg-emerald-50/60"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 font-bold text-emerald-900">
                              {String(user.name ?? "U")
                                .trim()
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <span className="font-semibold text-gray-900">
                              {user.name ?? "Unnamed user"}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-600">
                          {user.email ?? "—"}
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                              String(user.role ?? "USER").toUpperCase() === "ADMIN"
                                ? "bg-amber-100 text-amber-900"
                                : "bg-emerald-100 text-emerald-800"
                            }`}
                          >
                            {user.role ?? "USER"}
                          </span>
                        </td>
                      </tr>
                    ))}

                    {!filteredUsers.length && (
                      <tr>
                        <td
                          colSpan={3}
                          className="px-6 py-12 text-center text-gray-500"
                        >
                          No users match your search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="border-t border-gray-100 bg-gray-50 px-6 py-4 text-sm text-gray-500">
                Showing {filteredUsers.length} of {users.length} users
              </div>
            </>
          )}
        </section>

        {/* Bottom summary */}
        <section className="flex flex-col justify-between gap-4 rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
              <Activity size={22} />
            </div>

            <div>
              <h3 className="font-bold text-emerald-950">
                Platform overview
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Review current platform records and activity.
              </p>
            </div>
          </div>

          <Link
            to="/admin/registrations"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-800"
          >
            <Eye size={17} />
            View All Registrations
            <ArrowUpRight size={16} />
          </Link>
        </section>
      </div>
    </main>
  );
}
