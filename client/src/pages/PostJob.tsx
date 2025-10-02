import React, { useState } from "react";
import API from "../api/api";

const PostJob = () => {
  const [form, setForm] = useState({ title: "", description: "", location: "", salary: "", employmentType: "Full-time" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await API.post("/jobs", form);
      alert("Job posted successfully!");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to post job");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Post a Job</h2>
      <input type="text" name="title" placeholder="Title" value={form.title} onChange={handleChange} className="w-full mb-2 p-2 border" />
      <input type="text" name="location" placeholder="Location" value={form.location} onChange={handleChange} className="w-full mb-2 p-2 border" />
      <input type="text" name="salary" placeholder="Salary" value={form.salary} onChange={handleChange} className="w-full mb-2 p-2 border" />
      <select name="employmentType" value={form.employmentType} onChange={handleChange} className="w-full mb-2 p-2 border">
        <option>Full-time</option>
        <option>Part-time</option>
        <option>Contract</option>
        <option>Internship</option>
      </select>
      <textarea name="description" placeholder="Job Description" value={form.description} onChange={handleChange} className="w-full mb-2 p-2 border" />
      <button type="submit" className="bg-blue-600 text-white w-full p-2">Post Job</button>
    </form>
  );
};

export default PostJob;
