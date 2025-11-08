import express from "express";
import multer from "multer";
import {
  createFreelancer,
  getAllFreelancers,
  getFreelancerById,
  updateFreelancer,
  deleteFreelancer,
  getMyFreelancerApplications,
  getFreelancerApplications,
  applyToFreelancer,
} from "../controllers/freelancer.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", protect, upload.single("photo"), createFreelancer);
router.post(
  "/register",
  upload.single("photo"),
  createFreelancer
);
router.get("/", getAllFreelancers);
router.post("/:id/apply", protect, upload.single("resume"), applyToFreelancer);
router.get("/:id/applications", protect, getFreelancerApplications);
router.get("/me/applications", protect, getMyFreelancerApplications);
router.get("/:id", getFreelancerById);
router.put("/:id", protect, upload.single("photo"), updateFreelancer);
router.delete("/:id", protect, deleteFreelancer);

export default router;
