import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    resumeUrl: { type: String, required: true },
    coverLetter: { type: String },

    status: {
      type: String,
      enum: ["applied", "reviewed", "interview", "offer", "hired", "rejected"],
      default: "applied",
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

// Ensure one user can't apply to same job twice
applicationSchema.index({ job: 1, user: 1 }, { unique: true });

export default mongoose.model("Application", applicationSchema);
