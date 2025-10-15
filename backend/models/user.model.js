import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema(
  {
    company: String,
    position: String,
    startDate: Date,
    endDate: Date,
    description: String,
  },
  { _id: false }
);

const educationSchema = new mongoose.Schema(
  {
    school: String,
    degree: String,
    fieldOfStudy: String,
    startDate: Date,
    endDate: Date,
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: String,
    role: {
      type: String,
      enum: ["user", "company_admin", "admin", "employer"],
      default: "user",
    },

    profilePhoto: { type: String, default: "" },
    headline: { type: String, default: "" },
    description: { type: String, default: "" },
    skills: [String],

    experience: [experienceSchema],
    education: [educationSchema],

    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    location: { type: String, default: "" },
    website: { type: String, default: "" },
    socialLinks: {
      linkedin: { type: String, default: "" },
      github: { type: String, default: "" },
      twitter: { type: String, default: "" },
    },

    company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
