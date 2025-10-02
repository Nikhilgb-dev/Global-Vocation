import express from "express";
import {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  applyJob,
  getJobCategories,
} from "../controllers/job.controller.js";

import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", protect, createJob);

router.post("/:id/apply", protect, applyJob);
router.get("/", getJobs);
router.get("/:id", getJobById);
router.get("/categories", getJobCategories);
router.put("/:id", protect, updateJob);
router.delete("/:id", protect, deleteJob);

export default router;
