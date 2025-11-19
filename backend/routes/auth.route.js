import express from "express";
import { login, register, forgotPassword } from "../controllers/auth.controller.js";
import { upload } from "../utils/cloudinary.util.js";

const router = express.Router();

// Public routes
router.post("/register", upload.single("profilePhoto"), register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);

export default router;
