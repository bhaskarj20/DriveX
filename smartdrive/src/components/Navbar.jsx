import { useEffect, useState } from "react";

function Navbar() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("smartdrive-dark-mode") === "true";
  });

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    localStorage.setItem("smartdrive-dark-mode", darkMode);
  }, [darkMode]);

  return (
    <nav className="navbar">
      <h2>🚗 SmartDrive</h2>

      <div className="navbar-right">
        <span>Driver Safety System</span>

        <button
          className="theme-toggle"
          onClick={() => setDarkMode((prev) => !prev)}
          aria-label="Toggle dark mode"
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;