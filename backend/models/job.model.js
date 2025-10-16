import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    location: String,
    salary: { type: String },
    employmentType: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Internship"],
    },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
    status: {
      type: String,
      enum: ["open", "closed", "pending"],
      default: "open",
    },
    expiresAt: { type: Date },
    isExpired: { type: Boolean, default: false },
  },
  { timestamps: true }
);

jobSchema.pre("save", function (next) {
  if (!this.expiresAt) {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 30);
    this.expiresAt = expiry;
  }
  next();
});

export default mongoose.model("Job", jobSchema);
