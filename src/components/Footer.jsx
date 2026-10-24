import { Link } from "react-router-dom";
import {
  CalendarDays,
  MapPin,
  Mail,
  Phone,
  ArrowRight,
  Heart,
  Globe,
} from "lucide-react";

import "../styles/footer.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-glow footer-glow-one"></div>
      <div className="footer-glow footer-glow-two"></div>

      <div className="footer-container">
        <div className="footer-main">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <span className="footer-logo-icon">
                <CalendarDays size={25} />
              </span>
              <span>
                Event<span className="footer-logo-highlight">Sphere</span>
              </span>
            </Link>

            <p className="footer-description">
              Discover unforgettable experiences, explore exciting events,
              and create memories that last a lifetime.
            </p>

            <div className="footer-socials">
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
              >
                <Globe size={19} />
              </a>

              <a
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
              >
                <Globe size={19} />
              </a>

              <a
                href="https://github.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
              >
                <Globe size={19} />
              </a>
            </div>
          </div>

          <div className="footer-column">
            <h3>Explore</h3>
            <Link to="/">Home</Link>
            <Link to="/events">Browse Events</Link>
            <Link to="/venues">Venues</Link>
            <Link to="/bookings">My Bookings</Link>
          </div>

          <div className="footer-column">
            <h3>Your Account</h3>
            <Link to="/login">Sign In</Link>
            <Link to="/register">Create Account</Link>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/manage-events">Manage Events</Link>
          </div>

          <div className="footer-column footer-contact">
            <h3>Get in Touch</h3>

            <a href="mailto:support@eventsphere.com">
              <span className="footer-contact-icon">
                <Mail size={17} />
              </span>
              <span>support@eventsphere.com</span>
            </a>

            <a href="tel:+911234567890">
              <span className="footer-contact-icon">
                <Phone size={17} />
              </span>
              <span>+91 12345 67890</span>
            </a>

            <div className="footer-contact-location">
              <span className="footer-contact-icon">
                <MapPin size={17} />
              </span>
              <span>India</span>
            </div>
          </div>
        </div>

        <div className="footer-cta">
          <div>
            <span className="footer-cta-label">
              YOUR NEXT EXPERIENCE STARTS HERE
            </span>
            <h3>Make every moment an event.</h3>
            <p>Find something exciting happening around you.</p>
          </div>

          <Link to="/events" className="footer-cta-button">
            Explore Events
            <ArrowRight size={18} />
          </Link>
        </div>

        <div className="footer-bottom">
          <p>© {currentYear} EventSphere. All rights reserved.</p>

          <div className="footer-legal-links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
          </div>

          <p className="footer-made-with">
            Made with <Heart size={14} fill="currentColor" /> in India
          </p>
        </div>
      </div>
    </footer>
  );
}