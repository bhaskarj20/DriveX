
import { useState } from "react";

import "./App.css";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

function App() {
  const [page, setPage] = useState(() => {
    const savedUser = localStorage.getItem("drivexUser");

    return savedUser ? "dashboard" : "home";
  });

  if (page === "login") {
    return (
      <Login
        onLogin={() => setPage("dashboard")}
        onRegister={() => setPage("register")}
        onBack={() => setPage("home")}
      />
    );
  }

  if (page === "register") {
    return (
      <Register
        onRegister={() => setPage("login")}
        onLogin={() => setPage("login")}
        onBack={() => setPage("home")}
      />
    );
  }

  if (page === "dashboard") {
  return (
    <Dashboard
      onLogout={() => {
        localStorage.removeItem("drivexUser");
        setPage("login");
      }}
    />
  );
}

  return (
    <Home
      onLogin={() => setPage("login")}
    />
  );
}

export default App;