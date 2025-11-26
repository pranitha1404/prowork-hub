import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router-dom";

import Login from "./pages/Login";
import Employees from "./pages/Employees";
import Tasks from "./pages/Tasks";
import Dashboard from "./pages/Dashboard";
import TaskBoard from "./pages/TaskBoard";

// simple protected route wrapper
function ProtectedRoute({ children }) {
  const isAuthed = !!localStorage.getItem("prowork_auth");
  return isAuthed ? children : <Navigate to="/login" replace />;
}

function Navbar() {
  const isAuthed = !!localStorage.getItem("prowork_auth");

  const logout = () => {
    localStorage.removeItem("prowork_auth");
    window.location.href = "/login";
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
        {/* public */}
        <Route path="/login" element={<Login />} />

        {/* protected routes */}
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

        {/* default: go to dashboard if logged in, else login */}
        <Route
          path="*"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
