import Freelancer from "../models/freelancer.model.js";
import { uploadToCloudinary } from "../utils/cloudinary.util.js";
import FreelancerApplication from "../models/freelancerApplication.model.js";
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

    // ✅ Parse safely
    const parsedPreferences = Array.isArray(preferences)
      ? preferences
      : JSON.parse(preferences || "[]");

    let photoUrl = null;
    if (req.file) {
      photoUrl = await uploadToCloudinary(req.file, "freelancers");
    }

    const freelancerData = {
      name,
      qualification,
      contact,
      email,
      location,
      preferences: parsedPreferences,
      descriptionOfWork,
      aboutFreelancer,
      photo: photoUrl,
      services: JSON.parse(services || "[]"),
      pricing: JSON.parse(pricing || "{}"),
      isActive: true,
    };

    // ✅ If logged in → mark createdBy
    if (req.user) {
      freelancerData.createdBy = req.user._id;
    }

    const freelancer = await Freelancer.create(freelancerData);

    res
      .status(201)
      .json({ message: "Freelancer added successfully", freelancer });
  } catch (err) {
    console.error("❌ Error creating freelancer:", err);
    res.status(500).json({ message: err.message });
  }
};

export const applyToFreelancer = async (req, res) => {
  try {
    const { id } = req.params; // freelancer ID
    const freelancer = await Freelancer.findById(id);
    if (!freelancer)
      return res.status(404).json({ message: "Freelancer not found" });

    // Parse form data
    const { contact, experience, education, project, coverLetter } = req.body;

    const parsedContact = JSON.parse(contact || "{}");
    const parsedExperience = JSON.parse(experience || "{}");
    const parsedEducation = JSON.parse(education || "[]");
    const parsedProject = JSON.parse(project || "[]");

    // Prevent duplicate application
    const existing = await Application.findOne({
      freelancer: id,
      user: req.user._id,
    });
    if (existing)
      return res
        .status(400)
        .json({ message: "Already applied for this freelancer" });

    // Upload resume if provided
    let resumeUrl = null;
    if (req.file) {
      resumeUrl = await uploadToCloudinary(req.file, "resumes");
    }

    const application = await Application.create({
      freelancer: id,
      user: req.user._id,
      resume: resumeUrl,
      coverLetter,
      contact: parsedContact,
      experience: parsedExperience,
      education: parsedEducation,
      project: parsedProject,
      status: "applied",
      isActive: true,
      timeline: { appliedAt: new Date() },
    });

    res.status(201).json({
      message: "Application submitted successfully",
      application,
    });
  } catch (err) {
    console.error("❌ Error applying to freelancer:", err);
    res.status(500).json({ message: err.message });
  }
};

// Get all applications for a freelancer (for company/freelancer owner)
export const getFreelancerApplications = async (req, res) => {
  try {
    const { id } = req.params; // freelancer ID
    const applications = await FreelancerApplication.find({ freelancer: id })
      .populate("user", "name email profilePhoto")
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all applications by the current user
export const getMyFreelancerApplications = async (req, res) => {
  try {
    const applications = await FreelancerApplication.find({
      user: req.user._id,
    })
      .populate("freelancer", "name qualification location photo")
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllFreelancers = async (req, res) => {
  try {
    const freelancers = await Freelancer.find().sort({ createdAt: -1 });

    let applied = [];
    if (req.user) {
      const userApps = await FreelancerApplication.find({
        user: req.user._id,
      }).select("freelancer");
      applied = userApps.map((a) => a.freelancer.toString());
    }

    const result = freelancers.map((f) => ({
      ...f.toObject(),
      hasApplied: applied.includes(f._id.toString()),
    }));

    res.json(result);
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
