import Job from "../models/job.model.js";
import Application from "../models/application.model.js";
import { uploadToCloudinary } from "../utils/cloudinary.util.js";
import ApplicationProfile from "../models/applicationProfile.model.js";
export const applyJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const { coverLetter, experience, contact } = req.body;

    const existingProfile = await ApplicationProfile.findOne({
      user: req.user._id,
    });

    // const resumeUrl = req.file
    //   ? await uploadToCloudinary(req.file, "resumes")
    //   : null;
    // if (!resumeUrl)
    //   return res.status(400).json({ message: "Resume file missing" })
    // ;

    let resumeUrl;
    if (req.file) {
      resumeUrl = await uploadToCloudinary(req.file, "resumes");
    } else if (existingProfile?.resume) {
      resumeUrl = existingProfile.resume;
    } else {
      return res.status(400).json({ message: "Resume file missing" });
    }

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
              startDate: item.startDate ? new Date(item.startDate) : null,
              endDate: item.endDate ? new Date(item.endDate) : null,
              currentlyWorking: !!item.currentlyWorking,
              description: item.description || "",
            }))
          : [];
      }
    }

    let educationData = [];
    if (req.body.education) {
      try {
        const parsedEdu =
          typeof req.body.education === "string"
            ? JSON.parse(req.body.education)
            : req.body.education;
        if (Array.isArray(parsedEdu)) {
          educationData = parsedEdu.map((e) => ({
            school: e.school || "",
            degree: e.degree || "",
            fieldOfStudy: e.fieldOfStudy || "",
            startDate: e.startDate ? new Date(e.startDate) : null,
            endDate: e.endDate ? new Date(e.endDate) : null,
          }));
        }
      } catch (err) {
        console.warn("Invalid education data:", err);
      }
    }

    let projectData = [];
    if (req.body.project) {
      try {
        const parsedProject =
          typeof req.body.project === "string"
            ? JSON.parse(req.body.project)
            : req.body.project;
        if (Array.isArray(parsedProject)) {
          projectData = parsedProject.map((p) => ({
            name: p.name || "",
            description: p.description || "",
            link: p.link || "",
            startDate: p.startDate ? new Date(p.startDate) : null,
            endDate: p.endDate ? new Date(p.endDate) : null,
          }));
        }
      } catch (err) {
        console.warn("Invalid project data:", err);
      }
    }

    await ApplicationProfile.findOneAndUpdate(
      { user: req.user._id },
      {
        user: req.user._id,
        contact: finalContact,
        experience: experienceData,
        education: educationData,
        projects: projectData,
        resume: resumeUrl,
        coverLetter,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // create application
    const application = await Application.create({
      job: jobId,
      user: req.user._id,
      company: job.company,
      resume: resumeUrl,
      coverLetter,
      contact: finalContact,
      experience: experienceData,
      education: educationData,
      project: projectData,
      status: "applied",
      timeline: { appliedAt: new Date() },
    });

    job.applicantsCount = (job.applicantsCount || 0) + 1;
    await job.save();

    console.log(
      "----------------Application submitted---------------------",
      application
    );

    return res.status(201).json({
      message: "Application submitted successfully",
      application,
    });
  } catch (err) {
    console.error("Apply Job Error:", err);
    return res.status(500).json({ message: err.message });
  }
};

export const getMyApplicationProfile = async (req, res) => {
  try {
    const profile = await ApplicationProfile.findOne({ user: req.user._id });
    if (!profile) return res.json(null);
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
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
    const now = new Date();
    let query = {
      $or: [{ isExpired: false }, { isExpired: { $exists: false } }],
      $or: [{ expiresAt: { $gte: now } }, { expiresAt: { $exists: false } }],
      status: "open",
    };

    if (req.user) {
      if (req.user.role === "admin") {
        query = {};
      } else if (req.user.role === "company_admin") {
        query = { company: req.user.company };
      }
    }

    const jobs = await Job.find(query)
      .sort({ createdAt: -1 })
      .populate("postedBy", "name email")
      .populate("company", "name logo");

    let appliedJobs = [];
    if (req.user && req.user._id) {
      const applications = await Application.find({
        user: req.user._id,
      }).select("job");
      appliedJobs = applications.map((a) => a.job.toString());
    }

    const jobsWithFlag = jobs.map((job) => ({
      ...job.toObject(),
      hasApplied: appliedJobs.includes(job._id.toString()),
    }));

    res.status(200).json(jobsWithFlag);
  } catch (err) {
    console.error("❌ Error in getJobs:", err);
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
