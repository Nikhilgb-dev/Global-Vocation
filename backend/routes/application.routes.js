import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import Application from "../models/application.model.js";

const router = express.Router();

// GET applications by logged-in user
router.get("/me", protect, async (req, res) => {
  const apps = await Application.find({ user: req.user._id })
    .populate({
      path: "job",
      populate: { path: "company", select: "name logo" },
    })
    .sort({ createdAt: -1 });
  res.json({ applications: apps });
});

// DELETE (withdraw)
router.delete("/:id", protect, async (req, res) => {
  const app = await Application.findById(req.params.id);
  if (!app) return res.status(404).json({ message: "Application not found" });
  if (app.user.toString() !== req.user._id.toString())
    return res.status(403).json({ message: "Not authorized" });

  await app.deleteOne();
  res.json({ message: "Application withdrawn" });
});

export default router;
