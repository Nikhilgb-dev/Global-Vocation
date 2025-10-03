import React, { useState, useEffect } from "react";
import API from "../api/api";
import { toast } from "react-hot-toast";

interface EditJobModalProps {
  jobId: string;
  onClose: () => void;
  onJobUpdated: () => void;
}

const EditJobModal: React.FC<EditJobModalProps> = ({ jobId, onClose, onJobUpdated }) => {
  const [form, setForm] = useState({ title: "", description: "", location: "", salary: "", employmentType: "Full-time" });

  useEffect(() => {
    API.get(`/jobs/${jobId}`).then((res) => {
      setForm(res.data);
    });
  }, [jobId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await API.put(`/jobs/${jobId}`, form);
      toast.success("Job updated successfully!");
      onJobUpdated();
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update job");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit Job</h2>
        <form onSubmit={handleSubmit}>
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
          <div className="flex justify-end gap-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Update Job
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditJobModal;