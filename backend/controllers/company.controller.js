import Company from "../models/company.model.js";
import User from "../models/user.model.js";
import { uploadToCloudinary } from "../utils/cloudinary.util.js";
import bcrypt from "bcryptjs";
import Application from "../models/application.model.js";
import Job from "../models/job.model.js";
import generateToken from "../utils/generateToken.util.js";

export const registerCompany = async (req, res) => {
  try {
    const {
      name,
      domain,
      industry,
      size,
      type,
      address,
      tagline,
      description,
      email,
      contactNumber,
      password,
      authorizedSignatory,
    } = req.body;

    // Check if company admin email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already in use" });

    // Upload logo if provided
    let logo = "";
    if (req.files?.logo && req.files.logo[0]) {
      logo = await uploadToCloudinary(req.files.logo[0], "company_logos");
    }

    // Upload verification docs if provided
    let verificationDocs = [];
    if (req.files?.verificationDocs && req.files.verificationDocs.length > 0) {
      for (const file of req.files.verificationDocs) {
        const uploaded = await uploadToCloudinary(file, "company_docs");
        verificationDocs.push(uploaded);
      }
    }

    // Create the company entry
    const company = await Company.create({
      name,
      domain,
      industry,
      size,
      type,
      address,
      tagline,
      description,
      email,
      contactNumber,
      authorizedSignatory: JSON.parse(authorizedSignatory || "{}"),
      logo,
      verificationDocs,
    });

    const hashedPassword = await bcrypt.hash(password, 10);
    const companyAdmin = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "company_admin",
      company: company._id,
    });

    // Link back to company
    company.admins.push(companyAdmin._id);
    await company.save();

    res.status(201).json({
      message: "Company registered successfully",
      company,
      companyAdmin: {
        _id: companyAdmin._id,
        email: companyAdmin.email,
        role: companyAdmin.role,
        token: generateToken(companyAdmin._id, companyAdmin.role),
      },
    });
  } catch (err) {
    console.error("Error in registerCompany:", err);
    res.status(400).json({ message: err.message });
  }
};

// ========== ADMIN REGISTRATION ==========
export const createCompanyByAdmin = async (req, res) => {
  try {
    const {
      name,
      domain,
      industry,
      size,
      type,
      address,
      tagline,
      description,
      email,
      password,
      contactNumber,
      authorizedSignatoryName,
      authorizedSignatoryDesignation,
    } = req.body;

    if (!name || !domain || !email || !password) {
      return res.status(400).json({
        message: "Name, domain, email, and password are required fields",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    let logo = "";
    if (req.files?.logo && req.files.logo[0]) {
      logo = await uploadToCloudinary(req.files.logo[0], "company_logos");
    }

    let verificationDocs = [];
    if (req.files?.verificationDocs && req.files.verificationDocs.length > 0) {
      for (const file of req.files.verificationDocs) {
        const uploaded = await uploadToCloudinary(file, "company_docs");
        verificationDocs.push(uploaded);
      }
    }

    let signature = "";
    if (req.files?.["authorizedSignatory[signature]"]?.[0]) {
      signature = await uploadToCloudinary(
        req.files["authorizedSignatory[signature]"][0],
        "signatures"
      );
    }

    const company = await Company.create({
      name,
      domain,
      industry,
      size,
      type,
      address,
      tagline,
      description,
      email,
      contactNumber,
      logo,
      verificationDocs,
      authorizedSignatory: {
        name: authorizedSignatoryName || "",
        designation: authorizedSignatoryDesignation || "",
        signature,
      },
    });

    const hashedPassword = await bcrypt.hash(password, 10);
    const companyAdmin = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "company_admin",
      company: company._id,
    });

    company.admins.push(companyAdmin._id);
    await company.save();

    res.status(201).json({
      message: "Company created successfully by admin",
      company,
      companyAdmin: {
        _id: companyAdmin._id,
        email: companyAdmin.email,
        role: companyAdmin.role,
      },
    });
  } catch (err) {
    console.error("Error in createCompanyByAdmin:", err);
    res.status(400).json({ message: err.message });
  }
};

export const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find().populate("admins", "name email");
    res.json(companies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ========== GET ONE ==========
export const getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id).populate(
      "admins",
      "name email"
    );
    if (!company) return res.status(404).json({ message: "Company not found" });
    res.json(company);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const verifyCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ message: "Company not found" });

    // Toggle verified status
    company.verified = !company.verified;
    await company.save();

    res.json(company);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete company
export const deleteCompany = async (req, res) => {
  try {
    const company = await Company.findByIdAndDelete(req.params.id);
    if (!company) return res.status(404).json({ message: "Company not found" });

    // OPTIONAL cleanup: if you want to unset the company ref on users:
    // await User.updateMany({ company: company._id }, { $unset: { company: "" } });
    // Optionally revert their role if required.

    res.json({ message: "Company deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteMyJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json({ message: "Job deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateMyJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMyCompanyProfile = async (req, res) => {
  try {
    if (!req.user.company)
      return res
        .status(400)
        .json({ message: "No company linked to this account" });

    const company = await Company.findById(req.user.company).populate(
      "admins",
      "name email"
    );
    if (!company) return res.status(404).json({ message: "Company not found" });
    res.json(company);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET /api/companies/me/jobs
 * List jobs posted by this company (paginated)
 */
export const getMyJobs = async (req, res) => {
  try {
    const companyId = req.user.company;
    const page = parseInt(req.query.page || "1");
    const limit = parseInt(req.query.limit || "20");
    const skip = (page - 1) * limit;

    const [total, jobs] = await Promise.all([
      Job.countDocuments({ company: companyId }),
      Job.find({ company: companyId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("postedBy", "name email"),
    ]);

    res.json({ total, page, limit, jobs });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * POST /api/companies/me/jobs
 * Create a job owned by this company (company isolation)
 */
export const createJobForCompany = async (req, res) => {
  try {
    if (!req.user.company)
      return res
        .status(400)
        .json({ message: "No company linked to this account" });
    const payload = {
      ...req.body,
      postedBy: req.user._id,
      company: req.user.company,
    };
    const job = await Job.create(payload);
    res.status(201).json(job);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * GET /api/companies/me/employees
 * List users who belong to this company (company can manage employees)
 */
export const getMyEmployees = async (req, res) => {
  try {
    const companyId = req.user.company;
    const employees = await User.find({ company: companyId }).select(
      "-password"
    );
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * PUT /api/companies/me/employees/:id/fire
 * Fire (remove company association) an employee or update their role/status
 */
export const fireEmployee = async (req, res) => {
  try {
    const companyId = req.user.company;
    const employeeId = req.params.id;

    const employee = await User.findById(employeeId);
    if (!employee)
      return res.status(404).json({ message: "Employee not found" });

    // safety: ensure the employee belongs to this company
    if (
      !employee.company ||
      employee.company.toString() !== companyId.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to modify this employee" });
    }

    // Remove company association and optionally demote role to 'user'
    employee.company = undefined;
    employee.role = "user";
    await employee.save();

    res.json({ message: "Employee fired/removed from company", employee });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET /api/companies/me/applicants
 * List applications for all jobs belonging to this company (paginated)
 */
export const getCompanyApplicants = async (req, res) => {
  try {
    const companyId = req.user.company;
    const page = parseInt(req.query.page || "1");
    const limit = parseInt(req.query.limit || "20");
    const skip = (page - 1) * limit;

    // Find job IDs for this company
    const jobs = await Job.find({ company: companyId }).select("_id");
    const jobIds = jobs.map((j) => j._id);

    const total = await Application.countDocuments({ job: { $in: jobIds } });

    const applications = await Application.find({ job: { $in: jobIds } })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "name email profilePhoto headline location")
      .populate("job", "title");

    res.json({ total, page, limit, applications });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET /api/companies/me/dashboard
 * Summary stats for the company's dashboard
 */
export const getCompanyDashboard = async (req, res) => {
  try {
    const companyId = req.user.company;

    // number of employees
    const employeesCount = await User.countDocuments({ company: companyId });

    // total jobs created
    const totalJobs = await Job.countDocuments({ company: companyId });

    // open jobs
    const openJobs = await Job.countDocuments({
      company: companyId,
      status: "open",
    });

    // total applicants across company jobs
    const jobs = await Job.find({ company: companyId }).select("_id");
    const jobIds = jobs.map((j) => j._id);
    const totalApplicants = await Application.countDocuments({
      job: { $in: jobIds },
    });

    // total hired (applications with status "hired")
    const totalHired = await Application.countDocuments({
      job: { $in: jobIds },
      status: "hired",
    });

    res.json({
      employeesCount,
      totalJobs,
      openJobs,
      totalApplicants,
      totalHired,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
