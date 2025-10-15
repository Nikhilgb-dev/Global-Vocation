// controllers/companyAuth.controller.js
import User from "../models/user.model.js";
import Company from "../models/company.model.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.util.js";

export const companyLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    if (user.role !== "company_admin")
      return res
        .status(403)
        .json({ message: "Account is not a company admin" });

    const company = user.company ? await Company.findById(user.company) : null;

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      company,
      token: generateToken(user._id, user.role),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
