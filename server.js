// server.js
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "./models/User.js";
import employeeroute from "./src/services/employeeroute.js";

const app = express();
const PORT = process.env.PORT || 4000;
const SECRET = process.env.JWT_SECRET || "supersecretkey";

// Middleware
app.use(cors({
  origin: ["https://school-employee-management.vercel.app", "http://localhost:5173"],
  credentials: true,
}));

app.use(express.json());
app.use("/employees", employeeroute);

app.use((req, _res, next) => {
  console.log(`[${req.method}] ${req.originalUrl}`);
  next();
});

// ✅ MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/school-ems";

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once("open", () => {
  console.log("✅ Connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});
const leaveSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  startDate: Date,
  endDate: Date,
  reason: String,
  status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
});
const Leave = mongoose.model("Leave", leaveSchema);

// ✅ Middleware: Auth
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    console.log("❌ No Authorization header");
     return res.status(401).json({ message: "No token provided" });
     }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, SECRET);
    console.log("Decoded token:", decoded); 
    req.user = decoded;
    console.log("✅ req.user set:", req.user);
    next();
  } catch (err) {
    console.error("❌ Token error:", err.message);
    res.status(401).json({ message: "Invalid token" });
  }
}

// ✅ Middleware: Role-based
function authorize(roles = []) {
  return (req, res, next) => {
    console.log("User role from token:", req.user.role, "Allowed roles:", roles);
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: Insufficient rights" });
    }
    next();
  };
}

// ROUTES 
// Sanity check
app.get("/", (_req, res) => {
  res.send("API is working 🚀");
});

// User Register (Admin adds users)
app.post("/register", async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);
    const user = new User({ username, password: hashedPassword, role });
    await user.save();
    res.json({ message: "User registered successfully", user });
  } catch (err) {
    res.status(400).json({ message: "Error registering user", error: err.message });
  }
});

// Login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  console.log(user.role);
  if (!user) return res.status(401).json({ message: "User not found" });

  // Compare hashed password
  const isValid = bcrypt.compareSync(password, user.password);
  if (!isValid) return res.status(401).json({ message: "Invalid password" });

  const token = jwt.sign({ id: user._id, role: user.role.trim() }, SECRET, { expiresIn: "2h" });

  res.json({
    token,
    user: {
      id: user._id,
      username: user.username,
      role: user.role,
      name: user.name,
      employeeId: user.employeeId,
      departmentCategory: user.departmentCategory,
      schoolDepartment: user.schoolDepartment,
      position: user.position,
      contact: user.contact,
      startDate: user.startDate,
    },
  });
});

// Profile
app.get("/profile", authenticate, async (req, res) => {
  console.log("Authenticated user:", req.user);
  try {
    const user = await User.findById(req.user.id, "-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch profile", error: err.message });
  }
});


// Admin: Get all users
app.get("/admin/users", authenticate, authorize(["Admin"]), async (req, res) => {
  console.log("Authenticated user:", req.user);
  const users = await User.find({}, "username role");
  res.json(users);
});



// EMPLOYEE MANAGEMENT
// Get all employees
app.get("/employees", authenticate, async (req, res) => {
  console.log("Authenticated user:", req.user);
  try {
    const users = await User.find({}, "-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch employees", error: err.message });
  }
});

// Create new employee
app.post("/employees", authenticate, authorize(["Admin"]), async (req, res) => {
  console.log("Authenticated user:", req.user);
  try {
    const { name, departmentCategory, schoolDepartment, position, contact, startDate, employeeId } = req.body;
    const hashedPassword = bcrypt.hashSync("defaultpassword123", 8);

    const newEmployee = new User({
      username: employeeId,
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


// Update employee info (Admin only)
app.put("/employees/:id", authenticate, authorize(["Admin"]), async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: "Failed to update employee", error: err.message });
  }
});

// Delete employee (Admin only)
app.delete("/employees/:id", authenticate, authorize(["Admin"]), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Employee deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete employee", error: err.message });
  }
});



// LEAVE REQUESTS
// Employee: create leave
app.post("/leave", authenticate, authorize(["Employee"]), async (req, res) => {
  console.log("Authenticated user:", req.user);
  try {
    const { startDate, endDate, reason } = req.body;
    const leave = new Leave({
      employee: req.user.id,
      startDate,
      endDate,
      reason,
    });
    await leave.save();
    res.json({ message: "Leave request submitted", leave });
  } catch (err) {
    res.status(400).json({ message: "Error submitting leave", error: err.message });
  }
});

// Employee: view own leave
app.get("/leave/my", authenticate, async (req, res) => {
  console.log("Authenticated user:", req.user);
  const leaves = await Leave.find({ employee: req.user.id }).populate("employee", "username");
  res.json(leaves);
});

// Manager/Admin: view all leave
app.get("/leave", authenticate, authorize(["Manager", "Admin"]), async (req, res) => {
  console.log("Authenticated user:", req.user);
  const leaves = await Leave.find().populate("employee", "username _id role");
  res.json(leaves);
});

// Manager/Admin: approve/reject leave
app.put("/leave/:id", authenticate, authorize(["Manager", "Admin"]), async (req, res) => {
  console.log("Authenticated user:", req.user);
  try {
    const { status } = req.body;
    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    const leave = await Leave.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json({ message: "Leave status updated", leave });
  } catch (err) {
    res.status(400).json({ message: "Error updating leave", error: err.message });
  }
});


// DELETE /leave/:id
app.delete("/leave/:id", authenticate, async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({ message: "Leave not found" });
    }

    // Employees can only delete their own pending requests
    if (req.user.role === "Employee") {
      if (String(leave.employee) !== String(req.user.id)) {
        return res.status(403).json({ message: "Not authorized" });
      }
      if (leave.status !== "Pending") {
        return res.status(400).json({ message: "Only pending requests can be deleted" });
      }
    }

    await Leave.findByIdAndDelete(req.params.id);

    res.json({ message: "Leave deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// START SERVER
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
