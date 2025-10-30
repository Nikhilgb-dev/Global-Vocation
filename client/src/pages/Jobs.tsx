import { useEffect, useState } from "react";
import API from "../api/api";
import ApplyModal from "../components/ApplyModal";
import JobDetailsModal from "./JobDetailsModal";

const Jobs = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    API.get("/jobs")
      .then((res) => {
        setJobs(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleApply = (jobId: string) => {
    setSelectedJobId(jobId);
    setShowModal(true);
  };

  const filtered = jobs.filter(
    (j) =>
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.description.toLowerCase().includes(search.toLowerCase()) ||
      j.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      {/* Header */}
      <div className="text-zinc-900 py-10 px-4 sm:px-6 lg:px-8 text-center sm:text-left">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">
            Discover Your Next Career
          </h1>
          <p className="text-zinc-800 text-base sm:text-lg">
            Explore opportunities that match your skills and passion
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Search Bar */}
        <div className="mb-6 sm:mb-10">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search by title, description, or location..."
              className="w-full pl-12 pr-10 py-3 sm:py-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-gray-700 placeholder-gray-400 text-sm sm:text-base"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between text-xs sm:text-sm text-gray-600">
            <span className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <strong>{filtered.length}</strong>{" "}
              {filtered.length === 1 ? "job" : "jobs"} found
            </span>
          </div>
        </div>

        {/* Loading / Empty State */}
        {loading ? (
          <div className="flex items-center justify-center py-16 sm:py-24">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600 text-sm sm:text-lg">
                Loading opportunities...
              </p>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-8 sm:p-12 text-center border border-gray-100">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10 sm:w-12 sm:h-12 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
              No Jobs Found
            </h3>
            <p className="text-gray-600 mb-6 text-sm sm:text-base">
              Try adjusting your search criteria
            </p>
            {search && (
              <button
                onClick={() => setSearch("")}
                className="px-5 py-2 sm:px-6 sm:py-3 bg-green-600 text-white rounded-lg sm:rounded-xl hover:bg-green-700 font-medium transition-all text-sm sm:text-base"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          // Job Cards (Responsive Grid)
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
            {filtered.map((job) => (
              <div
                key={job._id}
                onClick={() => {
                  setSelectedJob(job._id);
                  setShowDetails(true);
                }}
                className="cursor-pointer bg-white rounded-xl sm:rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group flex flex-col justify-between"
              >
                <div className="p-5 sm:p-6 flex-1 flex flex-col">
                  {/* Company Info */}
                  {job.company && (
                    <div className="flex items-center gap-3 mb-3">
                      {job.company.logo ? (
                        <img
                          src={job.company.logo}
                          alt={job.company.name}
                          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover ring-1 ring-gray-200"
                        />
                      ) : (
                        <div className="w-9 h-9 sm:w-10 sm:h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-semibold">
                          {job.company?.name?.charAt(0)}
                        </div>
                      )}
                      <div>
                        <h4 className="font-semibold text-gray-800 text-sm sm:text-base">
                          {job.company.name}
                        </h4>
                        <p className="text-xs text-gray-500">
                          Posted by {job.postedBy?.name || "Company"}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Title */}
                  <h3 className="text-lg sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-3 group-hover:text-green-600 transition-colors line-clamp-1">
                    {job.title}
                  </h3>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mb-3 sm:mb-4">
                    {job.location && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-green-100 text-green-700">
                        📍 {job.location}
                      </span>
                    )}
                    {job.employmentType && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-blue-100 text-blue-700">
                        🕒 {job.employmentType}
                      </span>
                    )}
                    {job.salary && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-purple-100 text-purple-700">
                        ₹{job.salary} LPA
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed line-clamp-2 mb-3">
                    {job.description}
                  </p>

                  {/* Footer Info */}
                  <div className="mt-auto">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div className="flex flex-col text-xs text-gray-500">
                        <span>
                          Posted{" "}
                          {new Date(job.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                        {job.applicantsCount !== undefined && (
                          <span>
                            👥 {job.applicantsCount}{" "}
                            {job.applicantsCount === 1
                              ? "applicant"
                              : "applicants"}
                          </span>
                        )}
                      </div>

                      {/* Apply Button */}
                      {job.hasApplied ? (
                        <button
                          disabled
                          className="px-4 py-2 bg-gray-200 text-gray-500 rounded-lg text-sm font-semibold cursor-not-allowed flex items-center gap-1"
                        >
                          ✓ Applied
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApply(job._id);
                          }}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition-all"
                        >
                          Apply
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                <div className="h-1 bg-gradient-to-r from-green-600 to-green-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {showModal && selectedJobId && (
        <ApplyModal jobId={selectedJobId} onClose={() => setShowModal(false)} />
      )}
      {showDetails && selectedJob && (
        <JobDetailsModal
          jobId={selectedJob}
          onClose={() => setShowDetails(false)}
          onApply={(jobId: string) => {
            setShowDetails(false);
            handleApply(jobId);
          }}
        />
      )}
    </div>
  );
};

export default Jobs;
