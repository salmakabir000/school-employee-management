import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["Admin", "Manager", "Employee"], default: "Employee" },

  // Employee-specific fields
  name: String,
  employeeId: String,
  departmentCategory: String,
  schoolDepartment: String,
  position: String,
  contact: String,
  startDate: Date,
});




export default mongoose.model("User", userSchema);