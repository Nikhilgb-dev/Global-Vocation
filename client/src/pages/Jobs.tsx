import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";
import ApplyModal from "../components/ApplyModal";

const Jobs = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  const [search, setSearch] = useState("");

  useEffect(() => {
    API.get("/jobs").then((res) => setJobs(res.data));
  }, []);

  const handleApply = (jobId: string) => {
    setSelectedJobId(jobId);
    setShowModal(true);
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

      {showModal && selectedJobId && (
        <ApplyModal jobId={selectedJobId} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};

export default Jobs;
