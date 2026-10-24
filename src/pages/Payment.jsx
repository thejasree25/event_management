
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CheckCircle, CreditCard, XCircle } from "lucide-react";

import { makeDemoPayment } from "../api/events.js";
import Notice from "../components/Notice.jsx";

export default function Payment() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function payNow() {
    const registrationId = Number(bookingId);

    if (!Number.isInteger(registrationId) || registrationId <= 0) {
      setError("Invalid booking ID. Please create your booking again.");
      return;
    }

    setBusy(true);
    setError("");

    try {
      const { data } = await makeDemoPayment({
        registrationId,
        simulateSuccess: true,
      });

      if (String(data?.status).toUpperCase() !== "SUCCESS") {
        throw new Error("The payment was not confirmed by the backend.");
      }

      navigate("/payment-result", {
        replace: true,
        state: {
          success: true,
          payment: data,
          bookingId: registrationId,
        },
      });
    } catch (err) {
      console.error("Payment failed:", err.response?.data || err);

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Unable to process the demo payment."
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="page-section container">
      <div className="booking-panel">
        <span className="eyebrow">SECURE CHECKOUT</span>
        <h1>Complete your booking</h1>

        <p>Booking reference: #{bookingId}</p>

        {error && <Notice type="error" message={error} />}

        <button
          type="button"
          className="btn btn-primary btn-full"
          disabled={busy}
          onClick={payNow}
        >
          <CreditCard size={18} />
          {busy ? "Processing..." : "Pay Now"}
        </button>

        <p className="small-note">
          This is a simulated payment. No real money will be charged.
        </p>

        <Link className="btn btn-full" to="/events">
          Back to events
        </Link>
      </div>
    </section>
  );
}
