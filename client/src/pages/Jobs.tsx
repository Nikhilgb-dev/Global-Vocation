import React, { useEffect, useState } from "react";
import API from "../api/api";

const Jobs = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const fetchJobs = async () => {
    const { data } = await API.get("/jobs");
    setJobs(data);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleApply = async (jobId: string) => {
    try {
      await API.post(`/jobs/${jobId}/apply`, { resumeUrl: "https://myresume.pdf", coverLetter: "Excited to apply!" });
      alert("Applied successfully!");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to apply");
    }
  };

  const filtered = jobs.filter((j) =>
    j.title.toLowerCase().includes(search.toLowerCase()) ||
    j.description.toLowerCase().includes(search.toLowerCase()) ||
    j.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl mb-4">Available Jobs</h2>

      {/* Search bar */}
      <input
        type="text"
        placeholder="Search jobs..."
        className="w-full p-2 border mb-4"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filtered.map((job) => (
        <div key={job._id} className="border p-4 mb-4 rounded">
          <h3 className="font-bold text-lg">{job.title}</h3>
          <p>{job.description}</p>
          <p className="text-sm text-gray-500">{job.location} — {job.salary}</p>
          <button
            onClick={() => handleApply(job._id)}
            className="mt-2 bg-green-600 text-white px-4 py-2 rounded"
          >
            Apply
          </button>
        </div>
      ))}
    </div>
  );
};

export default Jobs;
