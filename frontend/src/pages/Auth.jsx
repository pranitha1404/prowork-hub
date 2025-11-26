import { useState } from "react";
import { useNavigate } from "react-router-dom";

const DEMO_EMAIL = "admin@proworkhub.com";
const DEMO_PASSWORD = "Admin@123";

export default function Auth() {
  const [mode, setMode] = useState("login"); // "login" or "signup"
  const [name, setName] = useState("");
  const [email, setEmail] = useState(DEMO_EMAIL);
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    const savedUser = localStorage.getItem("prowork_user");
    const parsedUser = savedUser ? JSON.parse(savedUser) : null;

    const isDemo =
      email === DEMO_EMAIL && password === DEMO_PASSWORD;

    const isSignedUp =
      parsedUser &&
      parsedUser.email === email &&
      parsedUser.password === password;

    if (isDemo || isSignedUp) {
      const loggedUser = isDemo
        ? { name: "Admin User", email: DEMO_EMAIL }
        : { name: parsedUser.name, email: parsedUser.email };

      localStorage.setItem("prowork_auth", JSON.stringify(loggedUser));
      setError("");
      navigate("/dashboard");
    } else {
      setError("Invalid email or password.");
    }
  };

  const handleSignup = (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError("Please fill all fields.");
      return;
    }
    const newUser = { name, email, password };
    localStorage.setItem("prowork_user", JSON.stringify(newUser));
    localStorage.setItem(
      "prowork_auth",
      JSON.stringify({ name, email })
    );
    setError("");
    navigate("/dashboard");
  };

  const continueWithGoogle = () => {
    // DEMO only – no real Google OAuth
    const googleUser = {
      name: "Google User",
      email: "googleuser@gmail.com",
    };
    localStorage.setItem("prowork_auth", JSON.stringify(googleUser));
    navigate("/dashboard");
  };

  return (
    <div style={outer}>
      <div style={card}>
        <h2 style={{ marginBottom: "10px" }}>ProWork Hub</h2>
        <p style={{ fontSize: "13px", marginBottom: "15px" }}>
          {mode === "login"
            ? "Login to manage employees and tasks."
            : "Create an account (demo – saved in your browser)."}
        </p>

        <div style={tabs}>
          <button
            style={{
              ...tabBtn,
              borderBottom:
                mode === "login" ? "2px solid #001f3f" : "none",
            }}
            onClick={() => {
              setMode("login");
              setError("");
            }}
          >
            Login
          </button>
          <button
            style={{
              ...tabBtn,
              borderBottom:
                mode === "signup" ? "2px solid #001f3f" : "none",
            }}
            onClick={() => {
              setMode("signup");
              setError("");
            }}
          >
            Sign up
          </button>
        </div>

        {mode === "signup" && (
          <input
            style={input}
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}

        <input
          style={input}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          style={input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <p style={{ color: "red", fontSize: "12px" }}>{error}</p>
        )}

        {mode === "login" ? (
          <button style={primaryBtn} onClick={handleLogin}>
            Login
          </button>
        ) : (
          <button style={primaryBtn} onClick={handleSignup}>
            Create account
          </button>
        )}

        <div style={{ textAlign: "center", margin: "10px 0" }}>
          <span style={{ fontSize: "12px", color: "#666" }}>
            or continue with
          </span>
        </div>

        <button style={googleBtn} onClick={continueWithGoogle}>
          Continue with Google
        </button>

        <p style={{ fontSize: "11px", marginTop: "10px", color: "#555" }}>
          Demo login: <b>{DEMO_EMAIL}</b> / <b>{DEMO_PASSWORD}</b>
        </p>
      </div>
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
  width: "340px",
  display: "flex",
  flexDirection: "column",
};

const tabs = {
  display: "flex",
  marginBottom: "10px",
};

const tabBtn = {
  flex: 1,
  padding: "8px 0",
  background: "transparent",
  border: "none",
  cursor: "pointer",
  fontWeight: "bold",
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

const googleBtn = {
  padding: "8px",
  borderRadius: "5px",
  border: "1px solid #ccc",
  background: "#fff",
  cursor: "pointer",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontSize: "14px",
};
