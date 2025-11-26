const Employee = require("../models/Employee");

// GET /api/employees
exports.getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: "Error fetching employees", error: err.message });
  }
};

// GET /api/employees/:id
exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    res.json(employee);
  } catch (err) {
    res.status(500).json({ message: "Error fetching employee", error: err.message });
  }
};

// POST /api/employees
exports.createEmployee = async (req, res) => {
  try {
    const { name, email, role, department } = req.body;
    const employee = new Employee({ name, email, role, department });
    const saved = await employee.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: "Error creating employee", error: err.message });
  }
};

// PUT /api/employees/:id
exports.updateEmployee = async (req, res) => {
  try {
    const { name, email, role, department } = req.body;
    const updated = await Employee.findByIdAndUpdate(
      req.params.id,
      { name, email, role, department },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: "Employee not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: "Error updating employee", error: err.message });
  }
};

// DELETE /api/employees/:id
exports.deleteEmployee = async (req, res) => {
  try {
    const deleted = await Employee.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Employee not found" });
    res.json({ message: "Employee deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting employee", error: err.message });
  }
};
