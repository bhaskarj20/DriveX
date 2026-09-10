import { useState } from "react";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    // Demo credentials
    if (
      email === "demo@smartdrive.com" &&
      password === "smartdrive123"
    ) {
      onLogin();
    } else {
      setError("Invalid email or password.");
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
              Monitor your vehicle, understand driver
              behaviour, detect risks, and respond when
              safety matters most.
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
                  <strong>Real-Time Risk Intelligence</strong>
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

        {/* ================= LOGIN PANEL ================= */}

        <div className="login-form-panel">
          <div className="login-card">

            <div className="login-card-header">
              <span className="login-card-icon">
                🔐
              </span>

              <div>
                <p>WELCOME BACK</p>
                <h2>Sign in to DriveX</h2>
              </div>
            </div>

            <p className="login-description">
              Access your vehicle and driver safety
              dashboard.
            </p>

            <form onSubmit={handleSubmit}>

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
                    placeholder="Enter your password"
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
                Sign In
                <span>→</span>
              </button>
            </form>

            <div className="demo-login">
              <div className="demo-login-header">
                <span>🧪</span>
                <strong>Demo Access</strong>
              </div>

              <div className="demo-credentials">
                <div>
                  <span>Email</span>
                  <strong>
                    demo@smartdrive.com
                  </strong>
                </div>

                <div>
                  <span>Password</span>
                  <strong>
                    smartdrive123
                  </strong>
                </div>
              </div>
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

export default Login;