import { useState } from "react";

const VALID_EMAIL = "admin@proworkhub.com";
const VALID_PASSWORD = "Admin@123";

export default function Login({ onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (email === VALID_EMAIL && password === VALID_PASSWORD) {
      setError("");
      onSuccess(); // tell App: login success
    } else {
      setError("Invalid email or password.");
    }
  };

  return (
    <div style={outer}>
      <form style={card} onSubmit={handleSubmit}>
        <h2 style={{ marginBottom: "10px" }}>ProWork Hub – Login</h2>

        <p style={{ fontSize: "13px", marginBottom: "15px" }}>
          Demo credentials:&nbsp;
          <b>{VALID_EMAIL}</b> / <b>{VALID_PASSWORD}</b>
        </p>

        <input
          type="email"
          placeholder="Email"
          style={input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          style={input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <p style={{ color: "red", fontSize: "12px", marginBottom: "5px" }}>
            {error}
          </p>
        )}

        <button type="submit" style={primaryBtn}>
          Login
        </button>

        <p style={{ fontSize: "11px", marginTop: "10px", color: "#555" }}>
          (For now, signup & Google login are not real – use the demo admin
          credentials above.)
        </p>
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
  marginBottom: "8px",
  padding: "8px",
  borderRadius: "5px",
  border: "1px solid #ccc",
};

const primaryBtn = {
  padding: "8px",
  borderRadius: "5px",
  border: "none",
  background: "#001f3f",
  color: "#fff",
  cursor: "pointer",
  marginTop: "4px",
};
