import { toast } from "react-hot-toast";
import React, { useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

const Signup = () => {
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
    if (e.target.files) {
      setProfilePhoto(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("password", form.password);
      formData.append("headline", form.headline);
      formData.append("description", form.description);
      formData.append("location", form.location);
      formData.append("website", form.website);
      formData.append("skills", form.skills);
      formData.append("socialLinks[linkedin]", form.linkedin);
      formData.append("socialLinks[github]", form.github);
      formData.append("socialLinks[twitter]", form.twitter);
      if (profilePhoto) {
        formData.append("profilePhoto", profilePhoto);
      }

      const { data } = await API.post("/auth/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      localStorage.setItem("token", data.token);
      navigate("/");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">Signup</h2>
      <input type="text" name="name" placeholder="Full Name" value={form.name} onChange={handleChange} className="w-full mb-2 p-2 border" />
      <div className="mb-2">
        <label htmlFor="profilePhoto" className="block text-sm font-medium text-gray-700">Profile Photo (optional)</label>
        <input type="file" name="profilePhoto" id="profilePhoto" onChange={handleFileChange} className="w-full p-2 border" />
      </div>
      <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} className="w-full mb-2 p-2 border" />
      <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} className="w-full mb-2 p-2 border" />
      <input type="text" name="headline" placeholder="Headline (e.g. Full Stack Dev)" value={form.headline} onChange={handleChange} className="w-full mb-2 p-2 border" />
      <textarea name="description" placeholder="About you" value={form.description} onChange={handleChange} className="w-full mb-2 p-2 border" />
      <input type="text" name="location" placeholder="Location" value={form.location} onChange={handleChange} className="w-full mb-2 p-2 border" />
      <input type="text" name="website" placeholder="Personal Website" value={form.website} onChange={handleChange} className="w-full mb-2 p-2 border" />
      <input type="text" name="skills" placeholder="Skills (comma separated)" value={form.skills} onChange={handleChange} className="w-full mb-2 p-2 border" />

      <h3 className="font-semibold mt-4">Social Links</h3>
      <input type="text" name="linkedin" placeholder="LinkedIn" value={form.linkedin} onChange={handleChange} className="w-full mb-2 p-2 border" />
      <input type="text" name="github" placeholder="GitHub" value={form.github} onChange={handleChange} className="w-full mb-2 p-2 border" />
      <input type="text" name="twitter" placeholder="Twitter" value={form.twitter} onChange={handleChange} className="w-full mb-2 p-2 border" />

      <button type="submit" className="bg-blue-600 text-white w-full p-2">Signup</button>
    </form>
  );
};

export default Signup;
