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
    //   required: true,
    //   minlength: 100,
    //   maxlength: 250,
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
      required: true,
    },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Freelancer", freelancerSchema);
