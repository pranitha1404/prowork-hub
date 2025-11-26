import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Tasks from "./pages/Tasks";
import TaskBoard from "./pages/TaskBoard";
import CalendarPage from "./pages/Calendar";
import Performance from "./pages/Performance"; // ⭐ new page

function Navbar({ onLogout }) {
  return (
    <nav style={nav}>
      <div style={{ fontWeight: "bold", color: "white" }}>ProWork Hub</div>
      <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        <Link style={link} to="/dashboard">
          Dashboard
        </Link>
        <Link style={link} to="/employees">
          Employees
        </Link>
        <Link style={link} to="/tasks">
          Tasks
        </Link>
        <Link style={link} to="/task-board">
          Task Board
        </Link>
        <Link style={link} to="/calendar">
          Calendar
        </Link>
        <Link style={link} to="/performance">
          Performance
        </Link>
        <button onClick={onLogout} style={logoutBtn}>
          Logout
        </button>
      </div>
    </nav>
  );
}

const nav = {
  background: "#001f3f",
  padding: "15px 40px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const link = {
  color: "white",
  textDecoration: "none",
};

const logoutBtn = {
  marginLeft: "10px",
  padding: "6px 10px",
  borderRadius: "4px",
  border: "none",
  background: "#ff4d4d",
  color: "#fff",
  cursor: "pointer",
};

function App() {
  const [isAuthed, setIsAuthed] = useState(false);

  const handleLoginSuccess = () => setIsAuthed(true);
  const handleLogout = () => setIsAuthed(false);

  return (
    <Router>
      {isAuthed ? (
        <>
          <Navbar onLogout={handleLogout} />
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/task-board" element={<TaskBoard />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/performance" element={<Performance />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </>
      ) : (
        <Routes>
          <Route
            path="/login"
            element={<Login onSuccess={handleLoginSuccess} />}
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
