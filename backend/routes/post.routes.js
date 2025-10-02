import express from "express";
import {
  createPost,
  getFeedPosts,
  toggleLike,
  addComment,
  sharePost,
} from "../controllers/post.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Feed (get public + following posts)
router.get("/", protect, getFeedPosts);

// Create post
router.post("/", protect, createPost);

// Like/unlike post
router.post("/:id/like", protect, toggleLike);

// Comment on post
router.post("/:id/comment", protect, addComment);

// Share post
router.post("/:id/share", protect, sharePost);

export default router;
