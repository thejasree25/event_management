
import { useEffect, useMemo, useState } from "react";
import {
  ClipboardList,
  Search,
  RefreshCw,
  Download,
  Users,
  CheckCircle2,
  Clock,
  XCircle,
  CreditCard,
  CalendarDays,
  ArrowUpDown,
  Filter,
} from "lucide-react";
import { getAdminRegistrations } from "../api/admin.js";

export default function AdminRegistrations() {
  const [registrations, setRegistrations] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [paymentFilter, setPaymentFilter] = useState("ALL");
  const [sortOrder, setSortOrder] = useState("DESC");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadRegistrations = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getAdminRegistrations();
      const data = response.data;
      setRegistrations(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load registrations. Please check the backend API."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRegistrations();
  }, []);

  const getStatus = (registration) =>
    String(
      registration.status ??
        registration.bookingStatus ??
        "PENDING"
    ).toUpperCase();

  const getPaymentStatus = (registration) =>
    String(
      registration.paymentStatus ??
        registration.payment?.status ??
        "UNKNOWN"
    ).toUpperCase();

  const getUserName = (registration) =>
    registration.user?.name ??
    registration.user?.email ??
    registration.userId ??
    "Unknown User";

  const getEventName = (registration) =>
    registration.event?.title ??
    registration.event?.name ??
    registration.eventId ??
    "Unknown Event";

  const statusColor = (status) => {
    if (["CONFIRMED", "APPROVED", "COMPLETED", "SUCCESS"].includes(status))
      return "bg-green-100 text-green-800";
    if (["PENDING", "PROCESSING"].includes(status))
      return "bg-amber-100 text-amber-800";
    if (["CANCELLED", "REJECTED", "FAILED"].includes(status))
      return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-700";
  };

  const filteredRegistrations = useMemo(() => {
    const result = registrations.filter((registration) => {
      const searchableText = [
        registration.id,
        getStatus(registration),
        getPaymentStatus(registration),
        getUserName(registration),
        registration.user?.email,
        getEventName(registration),
      ]
        .map((value) => String(value ?? ""))
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchableText.includes(
        search.toLowerCase().trim()
      );

      const matchesStatus =
        statusFilter === "ALL" ||
        getStatus(registration) === statusFilter;

      const matchesPayment =
        paymentFilter === "ALL" ||
        getPaymentStatus(registration) === paymentFilter;

      return matchesSearch && matchesStatus && matchesPayment;
    });

    return result.sort((a, b) => {
      const aId = Number(a.id) || 0;
      const bId = Number(b.id) || 0;
      return sortOrder === "DESC" ? bId - aId : aId - bId;
    });
  }, [registrations, search, statusFilter, paymentFilter, sortOrder]);

  const confirmedCount = registrations.filter((registration) =>
    ["CONFIRMED", "APPROVED", "COMPLETED"].includes(
      getStatus(registration)
    )
  ).length;

  const pendingCount = registrations.filter((registration) =>
    ["PENDING", "PROCESSING"].includes(getStatus(registration))
  ).length;

  const cancelledCount = registrations.filter((registration) =>
    ["CANCELLED", "REJECTED", "FAILED"].includes(
      getStatus(registration)
    )
  ).length;

  const paidCount = registrations.filter((registration) =>
    ["PAID", "SUCCESS", "COMPLETED"].includes(
      getPaymentStatus(registration)
    )
  ).length;

  const exportCSV = () => {
    const headers = [
      "Registration ID",
      "User",
      "Email",
      "Event",
      "Registration Status",
      "Payment Status",
    ];

    const rows = filteredRegistrations.map((registration) => [
      registration.id ?? "",
      getUserName(registration),
      registration.user?.email ?? "",
      getEventName(registration),
      getStatus(registration),
      getPaymentStatus(registration),
    ]);

    const escapeCSV = (value) =>
      `"${String(value).replace(/"/g, '""')}"`;

    const csvContent = [headers, ...rows]
      .map((row) => row.map(escapeCSV).join(","))
      .join("\r\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "eventsphere-registrations.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const stats = [
    {
      label: "Total Registrations",
      value: registrations.length,
      icon: ClipboardList,
      color: "bg-green-100 text-green-800",
    },
    {
      label: "Confirmed",
      value: confirmedCount,
      icon: CheckCircle2,
      color: "bg-emerald-100 text-emerald-800",
    },
    {
      label: "Pending",
      value: pendingCount,
      icon: Clock,
      color: "bg-amber-100 text-amber-800",
    },
    {
      label: "Cancelled / Failed",
      value: cancelledCount,
      icon: XCircle,
      color: "bg-red-100 text-red-700",
    },
    {
      label: "Paid Registrations",
      value: paidCount,
      icon: CreditCard,
      color: "bg-lime-100 text-lime-800",
    },
  ];

  return (
    <main className="min-h-screen bg-green-50/60 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <section className="flex flex-col justify-between gap-5 rounded-3xl bg-gradient-to-r from-green-950 via-green-900 to-green-800 p-6 text-white shadow-xl sm:p-9 lg:flex-row lg:items-center">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-300">
              <CalendarDays size={16} />
              EventSphere Administration
            </div>

            <h1 className="text-3xl font-extrabold sm:text-4xl">
              Registration Management
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-green-100/80 sm:text-base">
              Monitor registrations, review booking statuses, and track
              payments from one dashboard.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={loadRegistrations}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold transition hover:bg-white/20 disabled:opacity-60"
            >
              <RefreshCw
                size={17}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>

            <button
              onClick={exportCSV}
              disabled={filteredRegistrations.length === 0}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-300 px-4 py-3 text-sm font-bold text-green-950 shadow-lg transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Download size={17} />
              Export CSV
            </button>
          </div>
        </section>

        {/* Statistics */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="group rounded-2xl border border-green-100 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {stat.label}
                    </p>
                    <h2 className="mt-3 text-3xl font-extrabold text-green-950">
                      {stat.value}
                    </h2>
                  </div>

                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${stat.color} transition group-hover:scale-110`}
                  >
                    <Icon size={23} />
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        {/* Main panel */}
        <section className="overflow-hidden rounded-3xl border border-green-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 p-5 sm:p-7">
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
              <div>
                <h2 className="text-xl font-extrabold text-green-950 sm:text-2xl">
                  All Registrations
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Showing {filteredRegistrations.length} of{" "}
                  {registrations.length} registrations
                </p>
              </div>

              <div className="relative w-full lg:max-w-md">
                <Search
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-green-700"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search ID, user, email, event..."
                  className="w-full rounded-xl border border-green-100 bg-green-50/50 py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:bg-white focus:ring-4 focus:ring-green-100"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                <Filter size={17} className="text-green-700" />
                Filters
              </div>

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
              >
                <option value="ALL">All Registration Statuses</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="APPROVED">Approved</option>
                <option value="PENDING">Pending</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="REJECTED">Rejected</option>
                <option value="COMPLETED">Completed</option>
                <option value="FAILED">Failed</option>
              </select>

              <select
                value={paymentFilter}
                onChange={(event) => setPaymentFilter(event.target.value)}
                className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
              >
                <option value="ALL">All Payment Statuses</option>
                <option value="PAID">Paid</option>
                <option value="SUCCESS">Success</option>
                <option value="PENDING">Pending</option>
                <option value="FAILED">Failed</option>
                <option value="COMPLETED">Completed</option>
                <option value="UNPAID">Unpaid</option>
                <option value="UNKNOWN">Unknown</option>
              </select>

              <button
                onClick={() =>
                  setSortOrder((current) =>
                    current === "DESC" ? "ASC" : "DESC"
                  )
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:border-green-300 hover:bg-green-50"
              >
                <ArrowUpDown size={16} />
                ID: {sortOrder === "DESC" ? "Newest first" : "Oldest first"}
              </button>

              <button
                onClick={() => {
                  setSearch("");
                  setStatusFilter("ALL");
                  setPaymentFilter("ALL");
                  setSortOrder("DESC");
                }}
                className="rounded-xl px-4 py-3 text-sm font-semibold text-green-800 transition hover:bg-green-50"
              >
                Clear filters
              </button>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center gap-3 px-6 py-16">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-green-100 border-t-green-700" />
              <p className="text-sm font-medium text-gray-500">
                Loading registrations...
              </p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="m-5 rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
              <XCircle className="mx-auto text-red-600" size={32} />
              <p className="mt-3 font-semibold text-red-800">{error}</p>
              <button
                onClick={loadRegistrations}
                className="mt-4 rounded-xl bg-green-800 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-green-900"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Table */}
          {!loading && !error && (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] border-collapse text-left">
                <thead>
                  <tr className="bg-green-50 text-xs uppercase tracking-wider text-green-900">
                    <th className="px-6 py-4 font-bold">Registration ID</th>
                    <th className="px-6 py-4 font-bold">User Details</th>
                    <th className="px-6 py-4 font-bold">Event</th>
                    <th className="px-6 py-4 font-bold">Registration</th>
                    <th className="px-6 py-4 font-bold">Payment</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredRegistrations.map((registration) => {
                    const status = getStatus(registration);
                    const paymentStatus = getPaymentStatus(registration);

                    return (
                      <tr
                        key={registration.id}
                        className="transition hover:bg-green-50/60"
                      >
                        <td className="px-6 py-5">
                          <span className="inline-flex rounded-lg bg-green-100 px-3 py-1.5 text-sm font-bold text-green-900">
                            #{registration.id ?? "—"}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-900">
                              <Users size={18} />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">
                                {getUserName(registration)}
                              </p>
                              <p className="mt-1 text-xs text-gray-500">
                                {registration.user?.email ?? "No email available"}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <p className="max-w-[220px] truncate font-semibold text-gray-800">
                            {getEventName(registration)}
                          </p>
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold ${statusColor(status)}`}
                          >
                            {status}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold ${statusColor(paymentStatus)}`}
                          >
                            {paymentStatus === "UNKNOWN"
                              ? "Not available"
                              : paymentStatus}
                          </span>
                        </td>
                      </tr>
                    );
                  })}

                  {filteredRegistrations.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-16 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-green-800">
                          <ClipboardList size={27} />
                        </div>
                        <h3 className="mt-4 font-bold text-gray-900">
                          No registrations found
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Try changing your search or filters.
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer */}
          {!loading && !error && (
            <div className="flex flex-col justify-between gap-2 border-t border-gray-100 bg-gray-50/70 px-6 py-4 text-sm text-gray-500 sm:flex-row sm:items-center">
              <span>
                {filteredRegistrations.length} registration
                {filteredRegistrations.length === 1 ? "" : "s"} displayed
              </span>
              <span className="font-medium text-green-800">
                EventSphere Admin
              </span>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
