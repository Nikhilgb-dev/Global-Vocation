import express from "express";
import {
  getProfile,
  updateProfile,
  toggleFollow,
  getMyProfile,
  updateMyProfile,
  deleteMyAccount,
} from "../controllers/user.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { upload } from "../utils/cloudinary.util.js";

const router = express.Router();

// Self profile (CRUD-like for own account)
router.get("/me", protect, getProfile);
router.get("/me", protect, getMyProfile);
router.put("/me", protect, upload.single("profilePhoto"), updateMyProfile);
router.delete("/me", protect, deleteMyAccount);
// Follow/unfollow other users
router.post("/:id/follow", protect, toggleFollow);

export default router;
