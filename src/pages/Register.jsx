import { useState } from "react";

function Register({ onRegister, onLogin, onBack }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed.");
        return;
      }

      console.log("Registered user:", data.user);

      onRegister();
    } catch (error) {
      console.error("Registration request failed:", error);
      setError("Unable to connect to the server.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-layout">

        {/* ================= LEFT PANEL ================= */}

        <div className="login-showcase">
          <div className="login-brand">
            <div className="login-brand-icon">🚗</div>

            <div>
              <h1>DriveX</h1>
              <span>Driver Safety System</span>
            </div>
          </div>

          <div className="login-showcase-content">
            <p className="login-label">
              INTELLIGENT VEHICLE SAFETY
            </p>

            <h2>
              Drive smarter.
              <br />
              Stay safer.
            </h2>

            <p>
              Create your DriveX account and access
              intelligent vehicle and driver safety
              monitoring.
            </p>

            <div className="login-safety-list">
              <div>
                <span>📷</span>

                <div>
                  <strong>Driver Monitoring</strong>
                  <p>
                    Detect drowsiness and distraction.
                  </p>
                </div>
              </div>

              <div>
                <span>📊</span>

                <div>
                  <strong>
                    Real-Time Risk Intelligence
                  </strong>

                  <p>
                    Combine multiple safety signals.
                  </p>
                </div>
              </div>

              <div>
                <span>🚨</span>

                <div>
                  <strong>Emergency Detection</strong>

                  <p>
                    Respond when critical conditions occur.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="login-showcase-footer">
            <span>●</span>
            DriveX Safety Platform
          </div>
        </div>

        {/* ================= REGISTER PANEL ================= */}

        <div className="login-form-panel">
          <div className="login-card">

            <button
  type="button"
  onClick={onBack}
  className="auth-back-button"
>
  <span className="auth-back-icon">←</span>
  <span>Home</span>
</button>

            <div className="login-card-header">
              <span className="login-card-icon">
                👤
              </span>

              <div>
                <p>GET STARTED</p>
                <h2>Create your DriveX account</h2>
              </div>
            </div>

            <p className="login-description">
              Create an account to access your vehicle
              and driver safety dashboard.
            </p>

            <form onSubmit={handleSubmit}>

              <div className="login-field">
                <label>Full Name</label>

                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                />
              </div>

              <div className="login-field">
                <label>Email Address</label>

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                />
              </div>

              <div className="login-field">
                <label>Password</label>

                <div className="password-wrapper">
                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowPassword(
                        (prev) => !prev
                      )
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              {error && (
                <p className="login-error">
                  ⚠️ {error}
                </p>
              )}

              <button
                type="submit"
                className="login-submit-button"
              >
                Create Account
                <span>→</span>
              </button>

            </form>

            <div className="register-login-prompt">
              <span>Already have an account?</span>

              <button
                type="button"
                onClick={onLogin}
                className="register-login-button"
              >
                Sign in
              </button>
            </div>

            <p className="login-footer-text">
              DriveX • Intelligent Vehicle Safety
            </p>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Register;
