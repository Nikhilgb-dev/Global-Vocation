import Freelancer from "../models/freelancer.model.js";
import { uploadToCloudinary } from "../utils/cloudinary.util.js";

export const createFreelancer = async (req, res) => {
  try {
    const {
      name,
      qualification,
      contact,
      email,
      location,
      preferences,
      descriptionOfWork,
      aboutFreelancer,
      services,
      pricing,
    } = req.body;

    // ✅ Parse preferences properly
    const parsedPreferences = Array.isArray(preferences)
      ? preferences
      : JSON.parse(preferences || "[]");

    let photoUrl = null;
    if (req.file) {
      photoUrl = await uploadToCloudinary(req.file, "freelancers");
    }

    const freelancer = await Freelancer.create({
      name,
      qualification,
      contact,
      email,
      location,
      preferences: parsedPreferences, // ✅ FIXED HERE
      descriptionOfWork,
      aboutFreelancer,
      photo: photoUrl,
      services: JSON.parse(services || "[]"),
      pricing: JSON.parse(pricing),
      createdBy: req.user._id,
    });

    res
      .status(201)
      .json({ message: "Freelancer added successfully", freelancer });
  } catch (err) {
    console.error("❌ Error creating freelancer:", err);
    res.status(500).json({ message: err.message });
  }
};

export const getAllFreelancers = async (req, res) => {
  try {
    const freelancers = await Freelancer.find().sort({ createdAt: -1 });
    res.json(freelancers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getFreelancerById = async (req, res) => {
  try {
    const freelancer = await Freelancer.findById(req.params.id);
    if (!freelancer) return res.status(404).json({ message: "Not found" });
    res.json(freelancer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateFreelancer = async (req, res) => {
  try {
    const updates = req.body;
    if (req.file) {
      updates.photo = await uploadToCloudinary(req.file, "freelancers");
    }

    const freelancer = await Freelancer.findByIdAndUpdate(
      req.params.id,
      updates,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!freelancer)
      return res.status(404).json({ message: "Freelancer not found" });
    res.json({ message: "Freelancer updated successfully", freelancer });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteFreelancer = async (req, res) => {
  try {
    const freelancer = await Freelancer.findByIdAndDelete(req.params.id);
    if (!freelancer)
      return res.status(404).json({ message: "Freelancer not found" });
    res.json({ message: "Freelancer deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
