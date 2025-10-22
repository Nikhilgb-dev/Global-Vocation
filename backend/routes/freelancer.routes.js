import express from "express";
import multer from "multer";
import {
  createFreelancer,
  getAllFreelancers,
  getFreelancerById,
  updateFreelancer,
  deleteFreelancer,
} from "../controllers/freelancer.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", protect, upload.single("photo"), createFreelancer);
router.get("/", getAllFreelancers);
router.get("/:id", getFreelancerById);
router.put("/:id", protect, upload.single("photo"), updateFreelancer);
router.delete("/:id", protect, deleteFreelancer);

export default router;
