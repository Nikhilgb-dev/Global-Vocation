import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protect = async (req, res, next) => {
  console.log("🟢 Headers received:", req.headers.authorization);

  let token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    console.log("❌ Token missing!");
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      console.log("❌ No user found for token");
      return res.status(404).json({ message: "User not found" });
    }
    req.user = user;
    console.log("✅ Authenticated:", user.email);
    next();
  } catch (err) {
    console.log("❌ JWT error:", err.message);
    res.status(401).json({ message: "Token invalid or expired" });
  }
};

export const companyAdminOnly = (req, res, next) => {
  if (req.user && req.user.role === "company_admin") next();
  else res.status(403).json({ message: "Company admins only" });
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") next();
  else res.status(403).json({ message: "Admins only" });
};
