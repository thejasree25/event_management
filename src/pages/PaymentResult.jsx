
import { Link, useLocation } from "react-router-dom";
import { CheckCircle, XCircle } from "lucide-react";

export default function PaymentResult() {
  const { state } = useLocation();

  const success = state?.success === true;
  const payment = state?.payment;

  if (!success) {
    return (
      <section className="page-section container">
        <div className="booking-panel">
          <XCircle size={48} color="red" />
          <h1>Payment result unavailable</h1>
          <p>Please open your booking and check its payment status.</p>
          <Link className="btn btn-primary" to="/events">
            Browse events
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="page-section container">
      <div className="booking-panel">
        <CheckCircle size={48} color="green" />
        <h1>Payment Successful!</h1>
        <p>Your demo payment was confirmed.</p>

        <p>
          Booking ID: #{state.bookingId}
        </p>

        {payment?.transactionReference && (
          <p>
            Transaction reference: {payment.transactionReference}
          </p>
        )}

        <Link className="btn btn-primary btn-full" to="/events">
          Explore more events
        </Link>
      </div>
    </section>
  );
}
