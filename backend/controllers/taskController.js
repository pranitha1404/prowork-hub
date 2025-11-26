const Task = require("../models/Task");

// GET /api/tasks
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("assignedEmployee")
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching tasks", error: err.message });
  }
};

// GET /api/tasks/:id
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate(
      "assignedEmployee"
    );
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching task", error: err.message });
  }
};

// POST /api/tasks
exports.createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, assignedEmployee } =
      req.body;

    const task = new Task({
      title,
      description,
      status,
      priority,
      dueDate,
      assignedEmployee: assignedEmployee || null,
    });

    const saved = await task.save();
    res.status(201).json(saved);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Error creating task", error: err.message });
  }
};

// PUT /api/tasks/:id
exports.updateTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, assignedEmployee } =
      req.body;

    const updated = await Task.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        status,
        priority,
        dueDate,
        assignedEmployee: assignedEmployee || null,
      },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ message: "Task not found" });
    res.json(updated);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Error updating task", error: err.message });
  }
};

// DELETE /api/tasks/:id
exports.deleteTask = async (req, res) => {
  try {
    const deleted = await Task.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting task", error: err.message });
  }
};

// GET /api/tasks/employee/:employeeId
exports.getTasksByEmployee = async (req, res) => {
  try {
    const tasks = await Task.find({
      assignedEmployee: req.params.employeeId,
    }).populate("assignedEmployee");

    res.json(tasks);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching tasks for employee",
      error: err.message,
    });
  }
};
