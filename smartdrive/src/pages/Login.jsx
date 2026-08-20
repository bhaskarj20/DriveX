function Login({ onLogin }) {
  return (
    <div className="login-page">
      <div className="login-card">
        <h1>🚗 SmartDrive</h1>

        <h2>Welcome Back</h2>

        <p>Login to access your vehicle safety dashboard.</p>

        <input
          type="email"
          placeholder="Email"
        />

        <input
          type="password"
          placeholder="Password"
        />

        <button
          className="primary-button"
          onClick={onLogin}
        >
          Login
        </button>
      </div>
    </div>
  );
}

export default Login;