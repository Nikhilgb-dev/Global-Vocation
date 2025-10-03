import mongoose from "mongoose";

const communitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: String,
    coverImage: { type: String },
    rules: String,
    tags: [String],
    privacy: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export default mongoose.model("Community", communitySchema);
