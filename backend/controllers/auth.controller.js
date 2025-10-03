import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.util.js";
import { uploadToCloudinary } from "../utils/cloudinary.util.js";

// ========== USER REGISTRATION ==========
export const register = async (req, res) => {
  try {
    const { name, email, password, headline, description, location, website, skills, socialLinks } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Handle profile photo upload
    let profilePhotoUrl = "";
    if (req.file) {
      profilePhotoUrl = await uploadToCloudinary(req.file.path);
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password: hashed,
      role: "user", // self-signup always defaults to normal user
      profilePhoto: profilePhotoUrl,
      headline,
      description,
      location,
      website,
      skills,
      socialLinks,
    });

    // Return user info + JWT
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ========== USER/ADMIN LOGIN ==========
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid email or password" });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
