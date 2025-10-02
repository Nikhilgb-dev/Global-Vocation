import Job from "../models/job.model.js";
import Application from "../models/application.model.js";

export const applyJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const { resumeUrl, coverLetter } = req.body;

    // check if job exists
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    // prevent duplicate applications
    const existing = await Application.findOne({
      job: jobId,
      user: req.user._id,
    });
    if (existing)
      return res
        .status(400)
        .json({ message: "You already applied for this job" });

    const application = await Application.create({
      job: jobId,
      user: req.user._id,
      resumeUrl,
      coverLetter,
      status: "applied",
    });

    // increase job applicant count
    job.applicantsCount = (job.applicantsCount || 0) + 1;
    await job.save();

    res.status(201).json(application);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE
export const createJob = async (req, res) => {
  try {
    const job = await Job.create({ ...req.body, postedBy: req.user._id });
    res.status(201).json(job);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// READ ALL
export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate("postedBy", "name email");
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// READ ONE
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

// UPDATE
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

// DELETE
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json({ message: "Job deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
