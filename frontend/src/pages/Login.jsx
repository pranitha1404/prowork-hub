import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Demo credentials
const VALID_EMAIL = "admin@proworkhub.com";
const VALID_PASSWORD = "Admin@123";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (email === VALID_EMAIL && password === VALID_PASSWORD) {
      // store a simple flag in localStorage
      localStorage.setItem("prowork_auth", email);
      navigate("/dashboard");
    } else {
      setError("Invalid credentials. Try again.");
    }
  };

  return (
    <div style={outer}>
      <form style={card} onSubmit={handleSubmit}>
        <h2 style={{ marginBottom: "10px" }}>ProWork Hub – Login</h2>
        <p style={{ fontSize: "12px", marginBottom: "15px" }}>
          Demo credentials: <b>{VALID_EMAIL}</b> / <b>{VALID_PASSWORD}</b>
        </p>

        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={input}
        />

        {error && <p style={{ color: "red", fontSize: "12px" }}>{error}</p>}

        <button type="submit" style={button}>
          Login
        </button>
      </form>
    </div>
  );
}

const outer = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#f5f5f5",
};

const card = {
  background: "#fff",
  padding: "30px",
  borderRadius: "10px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  width: "320px",
  display: "flex",
  flexDirection: "column",
};

const input = {
  marginBottom: "10px",
  padding: "8px",
  borderRadius: "5px",
  border: "1px solid #ccc",
};

const button = {
  marginTop: "5px",
  padding: "8px",
  borderRadius: "5px",
  border: "none",
  background: "#001f3f",
  color: "#fff",
  cursor: "pointer",
};
