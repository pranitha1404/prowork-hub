import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router-dom";

import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Tasks from "./pages/Tasks";
import TaskBoard from "./pages/TaskBoard";

// simple calendar placeholder (so Calendar link works)
function Calendar() {
  return (
    <div style={{ padding: "30px" }}>
      <h1>Calendar</h1>
      <p>Calendar view coming soon.</p>
    </div>
  );
}

// protect routes
function ProtectedRoute({ children }) {
  const isAuthed = !!localStorage.getItem("prowork_auth");
  return isAuthed ? children : <Navigate to="/auth" replace />;
}

function Navbar() {
  const isAuthed = !!localStorage.getItem("prowork_auth");

  const logout = () => {
    localStorage.removeItem("prowork_auth");
    window.location.href = "/auth";
  };

  if (!isAuthed) return null;

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
        <button onClick={logout} style={logoutBtn}>
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
  borderRadius: "5px",
  border: "none",
  background: "#ff4d4d",
  color: "#fff",
  cursor: "pointer",
};

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* public auth page */}
        <Route path="/auth" element={<Auth />} />

        {/* protected pages */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employees"
          element={
            <ProtectedRoute>
              <Employees />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <Tasks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/task-board"
          element={
            <ProtectedRoute>
              <TaskBoard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/calendar"
          element={
            <ProtectedRoute>
              <Calendar />
            </ProtectedRoute>
          }
        />

        {/* default: go to auth */}
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
