import express from "express";
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  createJob,
  getAllJobs,
  updateJob,
  deleteJob,
  createCommunity,
  getAllCommunities,
  updateCommunity,
  deleteCommunity,
  createPost,
  getAllPosts,
  updatePost,
  deletePost,
} from "../controllers/admin.controller.js";
import { protect, adminOnly } from "../middlewares/auth.middleware.js";
import { upload } from "../utils/cloudinary.util.js";

const router = express.Router();

// USER CRUD
router.post("/users", protect, adminOnly, createUser);
router.get("/users", protect, adminOnly, getAllUsers);
router.get("/users/:id", protect, adminOnly, getUserById);
router.put(
  "/users/:id",
  protect,
  adminOnly,
  upload.single("profilePhoto"),
  updateUser
);
router.delete("/users/:id", protect, adminOnly, deleteUser);

// JOB CRUD
router.post("/jobs", protect, adminOnly, createJob);
router.get("/jobs", protect, adminOnly, getAllJobs);
router.put("/jobs/:id", protect, adminOnly, updateJob);
router.delete("/jobs/:id", protect, adminOnly, deleteJob);

// COMMUNITY CRUD
router.post("/communities", protect, adminOnly, createCommunity);
router.get("/communities", protect, adminOnly, getAllCommunities);
router.put("/communities/:id", protect, adminOnly, updateCommunity);
router.delete("/communities/:id", protect, adminOnly, deleteCommunity);

// POST CRUD
router.post("/posts", protect, adminOnly, createPost);
router.get("/posts", protect, adminOnly, getAllPosts);
router.put("/posts/:id", protect, adminOnly, updatePost);
router.delete("/posts/:id", protect, adminOnly, deletePost);

export default router;
