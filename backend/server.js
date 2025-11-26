const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const employeeRoutes = require("./routes/employeeRoutes");
const taskRoutes = require("./routes/taskRoutes");
const leaveRoutes = require("./routes/leaveRoutes");

const app = express();

// CORS
app.use(cors());

// Body Parser
app.use(express.json());

// DEFAULT ROOT ROUTE (Fixes Cannot GET /)
app.get("/", (req, res) => {
  res.send("🚀 ProWork Hub Backend is Running Successfully!");
});

// Health Check Route
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "ProWork Hub API is running" });
});

// API ROUTES
app.use("/api/employees", employeeRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/leaves", leaveRoutes);

// DB + Server Start
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => console.error("❌ MongoDB connection error:", err.message));
