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
      <div className="login-card">
        <h1>🚗 SmartDrive</h1>

        <h2>Welcome Back</h2>

        <p>
          Login to access your vehicle safety dashboard.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          {error && (
            <p className="login-error">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="primary-button"
          >
            Login
          </button>
        </form>

        <div className="demo-login">
          <strong>Demo Login</strong>
          <span>demo@smartdrive.com</span>
          <span>smartdrive123</span>
        </div>
      </div>
    </div>
  );
}

export default Login;