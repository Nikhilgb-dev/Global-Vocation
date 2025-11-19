import mongoose from "mongoose";

const abuseReportSchema = new mongoose.Schema(
  {
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    reason: {
      type: String,
      enum: ["Spam", "Inappropriate Content", "Misleading Information", "Harassment", "Other"],
      required: true,
    },
    description: { type: String },
    status: {
      type: String,
      enum: ["pending", "reviewed", "resolved"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("AbuseReport", abuseReportSchema);