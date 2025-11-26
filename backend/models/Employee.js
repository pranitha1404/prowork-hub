const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    role: {
      type: String,
      default: "Employee",
      trim: true,
    },
    department: {
      type: String,
      default: "General",
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Employee", employeeSchema);
