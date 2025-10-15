import { toast } from "react-hot-toast";
import React, { useState } from "react";
import API from "../api/api";
import { useNavigate, Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Signup = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    headline: "",
    description: "",
    location: "",
    website: "",
    skills: "",
    linkedin: "",
    github: "",
    twitter: "",
  });
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setProfilePhoto(e.target.files[0]);
  };

  const handleNext = () => {
    if (step === 1) {
      if (!form.name || !form.email || !form.password) {
        toast.error("Please fill in all required fields");
        return;
      }
    }
    setStep(step + 1);
  };

  const handleBack = () => setStep(step - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, value as string));
      if (profilePhoto) formData.append("profilePhoto", profilePhoto);

      const { data } = await API.post("/auth/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      localStorage.setItem("token", data.token);
      toast.success("Signup successful!");
      navigate("/");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Signup failed");
    }
  };

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-white to-blue-50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8 border"
      >
        <h2 className="text-2xl font-bold mb-2 text-center">Create your account</h2>
        <p className="text-gray-600 text-center mb-6">For job seekers and professionals</p>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between mb-2 text-sm text-gray-600">
            <span>Step {step} of {totalSteps}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-brand h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-lg mb-3">Basic Information</h3>
            <input
              type="text"
              name="name"
              placeholder="Full Name *"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
            <div>
              <label className="text-sm text-gray-700 block mb-1">Profile Photo</label>
              <input
                type="file"
                onChange={handleFileChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <input
              type="email"
              name="email"
              placeholder="Email *"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
            <input
              type="password"
              name="password"
              placeholder="Password *"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
        )}

        {/* Step 2: Professional Details */}
        {step === 2 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-lg mb-3">Professional Details</h3>
            <input
              type="text"
              name="headline"
              placeholder="Headline (e.g. Full Stack Dev)"
              value={form.headline}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            <textarea
              name="description"
              placeholder="About you"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={form.location}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="website"
              placeholder="Personal Website"
              value={form.website}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="skills"
              placeholder="Skills (comma separated)"
              value={form.skills}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
        )}

        {/* Step 3: Social Links */}
        {step === 3 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-lg mb-3">Social Links</h3>
            <p className="text-sm text-gray-600 mb-4">Connect your social profiles (optional)</p>
            <input
              type="text"
              name="linkedin"
              placeholder="LinkedIn"
              value={form.linkedin}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="github"
              placeholder="GitHub"
              value={form.github}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="twitter"
              placeholder="Twitter"
              value={form.twitter}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-3 mt-6">
          {step > 1 && (
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md font-medium hover:bg-gray-50 transition"
            >
              <ChevronLeft size={20} />
              Back
            </button>
          )}
          {step < totalSteps ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex-1 flex items-center justify-center gap-2 bg-brand text-white py-2 rounded-md font-medium hover:bg-brand-dark transition"
            >
              Next
              <ChevronRight size={20} />
            </button>
          ) : (
            <button
              type="submit"
              className="flex-1 bg-brand text-white py-2 rounded-md font-medium hover:bg-brand-dark transition"
            >
              Sign Up
            </button>
          )}
        </div>

        <p className="mt-6 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-brand font-medium hover:underline">
            Log in
          </Link>
        </p>

        <p className="mt-3 text-sm text-center text-gray-600">
          Are you a company?{" "}
          <Link to="/register-company" className="text-green-600 font-medium hover:underline">
            Register your company →
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
