import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    link: { type: String },
    achievements: [{ type: String }],
    otherDetails: { type: String },
  },
  { _id: false }
);

const freelancerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    qualification: { type: String, required: true },
    contact: { type: String, required: true },
    email: { type: String, required: true },
    location: { type: String, required: true },

    preferences: [
      {
        type: String,
        enum: ["Remote", "On-site", "Contract", "Agreement", "MOU"],
      },
    ],

    descriptionOfWork: {
      type: String,
    },

    aboutFreelancer: {
      type: String,
    },

    photo: { type: String },

    services: [serviceSchema],

    pricing: {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    expiryDate: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    },
  },
  { timestamps: true }
);

export default mongoose.model("Freelancer", freelancerSchema);
