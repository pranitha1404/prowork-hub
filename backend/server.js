const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const employeeRoutes = require("./routes/employeeRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

// Simple CORS (allow all origins in development)
app.use(cors());

// Body parser
app.use(express.json());

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "ProWork Hub API is running" });
});

// API routes
app.use("/api/employees", employeeRoutes);
app.use("/api/tasks", taskRoutes);

// MongoDB connection + server start
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });
app.use("/api/leaves", require("./routes/leaveRoutes"));

