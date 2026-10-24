
import { useEffect, useMemo, useState } from "react";
import { getAdminPayments } from "../api/admin.js";
import "../styles/admin-payments.css";

function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPayments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAdminPayments();
      const data = response.data;

      setPayments(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load payments. Check whether the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  const filteredPayments = useMemo(() => {
    const term = search.toLowerCase().trim();

    return payments.filter((payment) => {
      const registration = payment.registration || {};

      const values = [
        payment.id,
        payment.amount,
        payment.status,
        payment.paymentStatus,
        payment.paymentMethod,
        payment.method,
        payment.transactionId,
        payment.transactionID,
        registration.id,
        payment.registrationId,
        payment.user?.name,
        payment.user?.email,
      ];

      return values.some((value) =>
        String(value ?? "").toLowerCase().includes(term)
      );
    });
  }, [payments, search]);

  const getStatus = (payment) =>
    payment.status || payment.paymentStatus || "Pending";

  const getStatusClass = (status) => {
    const value = String(status).toLowerCase();

    if (
      value.includes("success") ||
      value.includes("paid") ||
      value.includes("completed")
    ) {
      return "payment-status-success";
    }

    if (
      value.includes("fail") ||
      value.includes("cancel") ||
      value.includes("refund")
    ) {
      return "payment-status-failed";
    }

    return "payment-status-pending";
  };

  const formatAmount = (amount) => {
    if (amount === null || amount === undefined || amount === "") {
      return "—";
    }

    const number = Number(amount);

    return Number.isFinite(number)
      ? `₹${number.toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`
      : String(amount);
  };

  const formatDate = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    return Number.isNaN(parsedDate.getTime())
      ? String(date)
      : parsedDate.toLocaleString("en-IN");
  };

  return (
    <main className="admin-payments-page">
      <section className="admin-payments-header">
        <div>
          <p className="admin-payments-eyebrow">ADMINISTRATION</p>
          <h1>Payments Management</h1>
          <p className="admin-payments-description">
            Review transactions and monitor payment statuses.
          </p>
        </div>

        <button
          className="admin-payments-refresh"
          onClick={loadPayments}
          disabled={loading}
        >
          {loading ? "Loading..." : "↻ Refresh"}
        </button>
      </section>

      <section className="admin-payments-summary">
        <article className="admin-payment-summary-card">
          <span>Total Transactions</span>
          <strong>{payments.length}</strong>
        </article>

        <article className="admin-payment-summary-card">
          <span>Successful Payments</span>
          <strong>
            {
              payments.filter((payment) =>
                ["success", "paid", "completed"].some((word) =>
                  String(getStatus(payment)).toLowerCase().includes(word)
                )
              ).length
            }
          </strong>
        </article>

        <article className="admin-payment-summary-card">
          <span>Pending Payments</span>
          <strong>
            {
              payments.filter((payment) =>
                String(getStatus(payment)).toLowerCase().includes("pending")
              ).length
            }
          </strong>
        </article>

        <article className="admin-payment-summary-card">
          <span>Failed Payments</span>
          <strong>
            {
              payments.filter((payment) =>
                ["fail", "cancel"].some((word) =>
                  String(getStatus(payment)).toLowerCase().includes(word)
                )
              ).length
            }
          </strong>
        </article>
      </section>

      <section className="admin-payments-table-card">
        <div className="admin-payments-table-header">
          <div>
            <h2>All Payments</h2>
            <p>{filteredPayments.length} transaction(s) found</p>
          </div>

          <input
            type="search"
            className="admin-payments-search"
            placeholder="Search payments..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        {error && (
          <div className="admin-payments-error">
            {error}
            <button onClick={loadPayments}>Try again</button>
          </div>
        )}

        {loading ? (
          <div className="admin-payments-message">
            Loading payments...
          </div>
        ) : !error && filteredPayments.length === 0 ? (
          <div className="admin-payments-message">
            {search
              ? "No payments match your search."
              : "No payment records found."}
          </div>
        ) : !error ? (
          <div className="admin-payments-table-wrapper">
            <table className="admin-payments-table">
              <thead>
                <tr>
                  <th>Payment ID</th>
                  <th>Transaction ID</th>
                  <th>Registration ID</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredPayments.map((payment, index) => {
                  const status = getStatus(payment);

                  return (
                    <tr key={payment.id ?? payment.paymentId ?? index}>
                      <td>
                        #{payment.id ?? payment.paymentId ?? "—"}
                      </td>

                      <td>
                        {payment.transactionId ||
                          payment.transactionID ||
                          "—"}
                      </td>

                      <td>
                        {payment.registration?.id ??
                          payment.registrationId ??
                          "—"}
                      </td>

                      <td className="admin-payment-amount">
                        {formatAmount(
                          payment.amount ??
                            payment.totalAmount ??
                            payment.price
                        )}
                      </td>

                      <td>
                        {payment.paymentMethod ||
                          payment.method ||
                          "—"}
                      </td>

                      <td>
                        {formatDate(
                          payment.paymentDate ||
                            payment.createdAt ||
                            payment.date
                        )}
                      </td>

                      <td>
                        <span
                          className={`admin-payment-status ${getStatusClass(
                            status
                          )}`}
                        >
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : null}
      </section>
    </main>
  );
}

export default AdminPayments;
