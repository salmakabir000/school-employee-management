// src/services/employeeroute.js
import express from "express";
import User from "../../models/User.js";
import bcrypt from "bcryptjs";

// middleware imports from server.js (we’ll pass them here too)
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

// Create new employee (Admin only)
router.post("/", authenticate, authorize(["Admin"]), async (req, res) => {
  try {
    const { name, departmentCategory, schoolDepartment, position, contact, startDate, employeeId } = req.body;

    const hashedPassword = bcrypt.hashSync("defaultpassword123", 8);

    const newEmployee = new User({
      username: employeeId, // use employeeId as username
      password: hashedPassword,
      role: "Employee",
      name,
      departmentCategory,
      schoolDepartment,
      position,
      contact,
      startDate,
      employeeId,
    });

    await newEmployee.save();
    res.json(newEmployee);
  } catch (err) {
    res.status(400).json({ message: "Failed to add employee", error: err.message });
  }
});

// GET all employees
router.get("/employees", authenticate, authorize(), async (req, res) => {
  try {
    console.log("Authenticated user:", req.user); // debug
    const users = await User.find({}, "-password"); // exclude passwords
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch employees", error: err.message });
  }
});

// Update employee info (Admin only)
router.put("/:id", authenticate, authorize(["Admin"]), async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: "Failed to update employee", error: err.message });
  }
});

router.delete("/:id", authenticate, authorize(["Admin"]), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Employee deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete employee", error: err.message });
  }
});


// GET single employee
router.get("/:id", authenticate, authorize(["Admin","Manager","Employee"]), async (req, res) => {
  try {
    const employee = await User.findById(req.params.id, "-password"); // exclude password
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    res.json(employee);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch employee", error: err.message });
  }
});


// Delete employee (Admin only)
router.delete("/:id", authenticate, authorize(["Admin"]), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Employee deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete employee", error: err.message });
  }
});

export default router;
