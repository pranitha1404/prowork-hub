const express = require("express");
const router = express.Router();
const Leave = require("../models/Leave");
const auth = require("../middleware/authMiddleware");

// ➤ Apply for Leave (Employee)
router.post("/", auth, async (req, res) => {
  try {
    const leave = await Leave.create({
      employee: req.user.id,
      fromDate: req.body.fromDate,
      toDate: req.body.toDate,
      reason: req.body.reason
    });
    res.json(leave);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ➤ View personal leave requests
router.get("/my", auth, async (req, res) => {
  try {
    const leaves = await Leave.find({ employee: req.user.id }).populate("employee", "name");
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ➤ ADMIN — View all requests
router.get("/", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Admins only" });
    const leaves = await Leave.find().populate("employee", "name email");
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ➤ ADMIN — Approve / Reject Leave
router.put("/:id", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Admins only" });
    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(leave);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
