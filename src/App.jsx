
import { Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Home from "./pages/Home.jsx";
import Events from "./pages/Events.jsx";
import EventDetails from "./pages/EventDetails.jsx";
import Auth from "./pages/Auth.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import MyBookings from "./pages/MyBookings.jsx";
import Payment from "./pages/Payment.jsx";
import PaymentResult from "./pages/PaymentResult.jsx";
import NotFound from "./pages/NotFound.jsx";
import ManageEvents from "./pages/ManageEvents.jsx";
import Venues from "./pages/Venues.jsx";

import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminCategories from "./pages/AdminCategories.jsx";
import AdminRegistrations from "./pages/AdminRegistrations.jsx";
import AdminPayments from "./pages/AdminPayments.jsx";
import Profile from "./pages/Profile.jsx";

import "./styles/app.css";

export default function App() {
  return (
    <div className="app-shell">
      <Navbar />

      <main className="main-content">
        <Routes>
          {/* Home */}
          <Route path="/" element={<Home />} />

          {/* Events */}
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetails />} />

          {/* Login and registration, including Google sign-in */}
          <Route path="/login" element={<Auth mode="login" />} />
          <Route path="/register" element={<Auth mode="register" />} />

          {/* User dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* User bookings */}
          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            }
          />

          {/* Payments */}
          <Route
            path="/payment/:bookingId"
            element={
              <ProtectedRoute>
                <Payment />
              </ProtectedRoute>
            }
          />

          <Route
            path="/payment-result"
            element={
              <ProtectedRoute>
                <PaymentResult />
              </ProtectedRoute>
            }
          />

          {/* Event and venue management */}
          <Route
            path="/manage-events"
            element={<ManageEvents />}
          />

          <Route path="/venues" element={<Venues />} />

          {/* Admin */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/categories"
            element={
              <ProtectedRoute>
                <AdminCategories />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/registrations"
            element={
              <ProtectedRoute>
                <AdminRegistrations />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/payments"
            element={
              <ProtectedRoute>
                <AdminPayments />
              </ProtectedRoute>
            }
          />

          {/* Profile */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Unknown URL */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
