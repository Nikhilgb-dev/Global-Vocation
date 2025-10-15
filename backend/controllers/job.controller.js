import Job from "../models/job.model.js";
import Application from "../models/application.model.js";
import { uploadToCloudinary } from "../utils/cloudinary.util.js";

export const applyJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const { coverLetter, experience, contact } = req.body;

    const resumeUrl = req.file
      ? await uploadToCloudinary(req.file, "resumes")
      : null;
    if (!resumeUrl)
      return res.status(400).json({ message: "Resume file missing" });

    // check job exists
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    // prevent duplicate applications
    const existing = await Application.findOne({
      job: jobId,
      user: req.user._id,
    });
    if (existing) {
      return res
        .status(400)
        .json({ message: "You already applied for this job" });
    }

    // parse contact: can be JSON string or object, fallback to req.user values
    let contactData = null;
    if (contact) {
      try {
        contactData =
          typeof contact === "string" ? JSON.parse(contact) : contact;
      } catch (err) {
        // parse error — treat as missing and fallback
        contactData = null;
      }
    }

    // fallback to req.user profile if any contact fields not provided
    // prefer provided values; otherwise use req.user if available
    const finalContact = {
      name: (contactData && contactData.name) || req.user?.name || "",
      email: (contactData && contactData.email) || req.user?.email || "",
      phone:
        (contactData && contactData.phone) ||
        req.user?.phone ||
        contactData?.phone ||
        "",
      altPhone: (contactData && contactData.altPhone) || "",
    };

    // basic validation: ensure required contact fields present
    if (!finalContact.name || !finalContact.email || !finalContact.phone) {
      return res
        .status(400)
        .json({ message: "Contact name, email and phone are required" });
    }

    // handle experience (string or object)
    let experienceData = { isFresher: true, years: 0, history: [] };
    if (experience) {
      const exp =
        typeof experience === "string" ? JSON.parse(experience) : experience;
      experienceData.isFresher =
        exp.isFresher === true || exp.isFresher === "true";
      if (!experienceData.isFresher) {
        experienceData.years = exp.years ? Number(exp.years) : 0;
        experienceData.history = Array.isArray(exp.history)
          ? exp.history.map((item) => ({
              companyName: item.companyName || "",
              jobTitle: item.jobTitle || "",
              startDate: item.startDate || null,
              endDate: item.endDate || null,
              currentlyWorking: !!item.currentlyWorking,
              description: item.description || "",
            }))
          : [];
      }
    }

    // create application
    const application = await Application.create({
      job: jobId,
      user: req.user._id,
      company: job.company,
      resume: resumeUrl,
      coverLetter,
      contact: finalContact,
      experience: experienceData,
      status: "applied",
      timeline: { appliedAt: new Date() },
    });

    job.applicantsCount = (job.applicantsCount || 0) + 1;
    await job.save();

    return res.status(201).json({
      message: "Application submitted successfully",
      application,
    });
  } catch (err) {
    console.error("Apply Job Error:", err);
    return res.status(500).json({ message: err.message });
  }
};

/**
 * CREATE JOB
 */
export const createJob = async (req, res) => {
  try {
    const job = await Job.create({ ...req.body, postedBy: req.user._id });
    res.status(201).json(job);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * READ ALL JOBS
 */
export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate("postedBy", "name email");
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * READ SINGLE JOB BY ID
 */
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "postedBy",
      "name email"
    );
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * JOB CATEGORIES (group by employmentType)
 */
export const getJobCategories = async (req, res) => {
  try {
    const categories = await Job.aggregate([
      { $group: { _id: "$employmentType", count: { $sum: 1 } } },
      { $project: { name: "$_id", count: 1, _id: 0 } },
    ]);
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * UPDATE JOB
 */
export const updateJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * DELETE JOB
 */
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json({ message: "Job deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
