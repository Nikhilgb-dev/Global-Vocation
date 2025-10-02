import express from "express";
import {
  getProfile,
  updateProfile,
  toggleFollow,
} from "../controllers/user.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { upload } from "../utils/cloudinary.util.js";

const router = express.Router();

// Self profile (CRUD-like for own account)
router.get("/me", protect, getProfile);
router.put("/me", protect, upload.single("profilePhoto"), updateProfile);

// Follow/unfollow other users
router.post("/:id/follow", protect, toggleFollow);

export default router;
