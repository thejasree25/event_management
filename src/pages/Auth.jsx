import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import {
  CalendarDays,
  Sparkles,
  Eye,
  EyeOff,
  Mail,
  LockKeyhole,
  UserRound,
  Phone,
  ArrowRight,
} from "lucide-react";

import {
  loginUser,
  registerUser,
  googleLogin,
} from "../api/auth";

import { useAuth } from "../context/AuthContext";
import "./Auth.css";

export default function Auth({ mode = "login" }) {
  const isRegister = mode === "register";
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const finishLogin = (response) => {
    // Your backend returns UserResponse directly.
    const data =
      response?.data?.data ??
      response?.data ??
      response;

    if (!data?.email) {
      throw new Error(
        "Login succeeded, but the server did not return user details."
      );
    }

    login(data);
    setSuccess("Login successful! Welcome to EventSphere.");

    navigate("/profile", { replace: true });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (isRegister) {
        await registerUser({
          name: form.name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          password: form.password,
        });

        setSuccess(
          "Account created successfully! Please log in."
        );

        navigate("/login", { replace: true });
      } else {
        const response = await loginUser({
          email: form.email.trim(),
          password: form.password,
        });

        finishLogin(response);
      }
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError("");
    setSuccess("");

    const credential = credentialResponse?.credential;

    if (!credential) {
      setError("Google did not return a credential. Please try again.");
      return;
    }

    setLoading(true);

    try {
      // Send the actual ID token string, not an object.
      const response = await googleLogin(credential);

      finishLogin(response);
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Google login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-background auth-background-one" />
      <div className="auth-background auth-background-two" />

      <div className="auth-container">
        <section className="auth-info">
          <Link to="/" className="auth-brand">
            <span className="auth-brand-icon">
              <CalendarDays size={27} />
            </span>
            <span>
              Event<span className="auth-brand-highlight">Sphere</span>
            </span>
          </Link>

          <div className="auth-info-content">
            <span className="auth-eyebrow">
              <Sparkles size={15} />
              MAKE EVERY MOMENT COUNT
            </span>

            <h1>
              Your next
              <br />
              great experience
              <br />
              <span>starts here.</span>
            </h1>

            <p>
              Discover exciting events, connect with people, and create
              memories that last forever.
            </p>

            <div className="auth-feature-list">
              <div className="auth-feature">
                <span className="auth-feature-check">✓</span>
                Discover events you'll love
              </div>

              <div className="auth-feature">
                <span className="auth-feature-check">✓</span>
                Book your favorite experiences
              </div>

              <div className="auth-feature">
                <span className="auth-feature-check">✓</span>
                Keep all your bookings in one place
              </div>
            </div>
          </div>

          <p className="auth-info-footer">
            Your moments. Your people. Your experiences.
          </p>
        </section>

        <section className="auth-form-section">
          <div className="auth-form-card">
            <div className="auth-mobile-brand">
              <CalendarDays size={25} />
              <span>
                Event<span>Sphere</span>
              </span>
            </div>

            <div className="auth-heading">
              <span className="auth-small-label">
                {isRegister ? "JOIN OUR COMMUNITY" : "WELCOME BACK"}
              </span>

              <h2>
                {isRegister
                  ? "Create your account"
                  : "Welcome back!"}
              </h2>

              <p>
                {isRegister
                  ? "Sign up to start discovering amazing events."
                  : "Sign in to continue your journey."}
              </p>
            </div>

            {error && (
              <div className="auth-alert auth-error" role="alert">
                {error}
              </div>
            )}

            {success && (
              <div
                className="auth-alert auth-success"
                role="status"
              >
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              {isRegister && (
                <>
                  <div className="auth-field">
                    <label htmlFor="name">Full name</label>

                    <div className="auth-input-wrapper">
                      <UserRound size={18} />

                      <input
                        id="name"
                        type="text"
                        name="name"
                        placeholder="Enter your full name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        maxLength={100}
                      />
                    </div>
                  </div>

                  <div className="auth-field">
                    <label htmlFor="phone">Phone number</label>

                    <div className="auth-input-wrapper">
                      <Phone size={18} />

                      <input
                        id="phone"
                        type="tel"
                        name="phone"
                        placeholder="Enter your phone number"
                        value={form.phone}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="auth-field">
                <label htmlFor="email">Email address</label>

                <div className="auth-input-wrapper">
                  <Mail size={18} />

                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="auth-field">
                <label htmlFor="password">Password</label>

                <div className="auth-input-wrapper">
                  <LockKeyhole size={18} />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    autoComplete={
                      isRegister ? "new-password" : "current-password"
                    }
                  />

                  <button
                    type="button"
                    className="auth-password-toggle"
                    onClick={() => setShowPassword((current) => !current)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {!isRegister && (
                <div className="auth-forgot-row">
                  <span>Secure login</span>
                </div>
              )}

              <button
                type="submit"
                className="auth-submit-button"
                disabled={loading}
              >
                {loading
                  ? "Please wait..."
                  : isRegister
                    ? "Create account"
                    : "Sign in"}

                {!loading && <ArrowRight size={18} />}
              </button>
            </form>

            {!isRegister && (
              <>
                <div className="auth-divider">
                  <span />
                  <p>OR CONTINUE WITH</p>
                  <span />
                </div>

                <div className="auth-social-buttons">
                  <div className="auth-google-button">
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={() =>
                        setError(
                          "Google sign-in was unsuccessful. Please try again."
                        )
                      }
                      theme="outline"
                      shape="rectangular"
                      size="large"
                      text="continue_with"
                      width="320"
                      useOneTap={false}
                    />
                  </div>
                </div>
              </>
            )}

            <p className="auth-switch-text">
              {isRegister
                ? "Already have an account?"
                : "New to EventSphere?"}{" "}
              <Link to={isRegister ? "/login" : "/register"}>
                {isRegister ? "Sign in" : "Create an account"}
              </Link>
            </p>

            <p className="auth-terms">
              By continuing, you agree to our{" "}
              <Link to="/terms">Terms</Link> and{" "}
              <Link to="/privacy">Privacy Policy</Link>.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}