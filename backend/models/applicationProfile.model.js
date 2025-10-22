import mongoose from "mongoose";

const applicationProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      required: true,
    },

    contact: {
      name: String,
      email: String,
      phone: String,
      altPhone: String,
    },

    experience: {
      isFresher: { type: Boolean, default: true },
      years: { type: Number, default: 0 },
      history: [
        {
          companyName: String,
          jobTitle: String,
          startDate: Date,
          endDate: Date,
          currentlyWorking: Boolean,
          description: String,
        },
      ],
    },

    education: [
      {
        school: String,
        degree: String,
        fieldOfStudy: String,
        startDate: Date,
        endDate: Date,
      },
    ],

    projects: [
      {
        name: String,
        description: String,
        link: String,
        startDate: Date,
        endDate: Date,
      },
    ],

    resume: String,
    coverLetter: String,
  },
  { timestamps: true }
);

export default mongoose.model("ApplicationProfile", applicationProfileSchema);
