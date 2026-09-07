import { useState } from "react";
import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  const [page, setPage] = useState("home");

  if (page === "login") {
    return (
      <Login onLogin={() => setPage("dashboard")} />
    );
  }

  if (page === "dashboard") {
    return <Dashboard />;
  }

  return <Home onLogin={() => setPage("login")} />;
}

export default App;