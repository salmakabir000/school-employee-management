// src/middleware/auth.js
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "supersecretkey";

// Authenticate: verify token and attach user to request
export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token missing" });

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded; // decoded should have id, role
    next();
  } catch (err) {
    console.error("Auth verify error:", err.message);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

// Authorize: check if user role is allowed
export const authorize = (roles = []) => (req, res, next) => {
  if (!req.user) return res.status(403).json({ message: "No user info" });
  const userRole = (req.user.role || "").trim().toLowerCase();
  const allowed = roles.map(r => r.toLowerCase());

  console.log("Checking role:", userRole, "Allowed:", allowed);

  // if no roles required, allow everyone authenticated
  if (allowed.length === 0) return next();

  if (!allowed.includes(userRole)) {
    return res.status(403).json({ message: "Forbidden: Insufficient rights" });
  }
  next();
};
