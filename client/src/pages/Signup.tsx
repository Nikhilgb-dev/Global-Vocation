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

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Convert skills string into array
      const payload = {
        ...form,
        skills: form.skills.split(",").map((s) => s.trim()),
        socialLinks: {
          linkedin: form.linkedin,
          github: form.github,
          twitter: form.twitter,
        }
      };

      const { data } = await API.post("/auth/register", payload);
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (err: any) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">Signup</h2>
      <input type="text" name="name" placeholder="Full Name" value={form.name} onChange={handleChange} className="w-full mb-2 p-2 border" />
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
