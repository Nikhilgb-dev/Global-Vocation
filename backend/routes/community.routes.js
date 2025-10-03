import express from "express";
import {
  createCommunity,
  getCommunities,
  getCommunityById,
  updateCommunity,
  deleteCommunity,
} from "../controllers/community.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { upload } from "../utils/cloudinary.util.js";

const router = express.Router();

router.post("/", protect, upload.single("coverImage"), createCommunity);
router.get("/", getCommunities);
router.get("/:id", getCommunityById);
router.put("/:id", protect, updateCommunity);
router.delete("/:id", protect, deleteCommunity);

export default router;
