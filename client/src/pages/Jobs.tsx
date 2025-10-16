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

  const filtered = jobs.filter((j) =>
    j.title.toLowerCase().includes(search.toLowerCase()) ||
    j.description.toLowerCase().includes(search.toLowerCase()) ||
    j.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      {/* Header Section */}
      <div className=" text-zinc-900 py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold mb-3">Discover Your Next Career</h1>
          <p className="text-zinc-950 text-lg">Explore opportunities that match your skills and passion</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search by title, description, or location..."
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all shadow-sm text-gray-700 placeholder-gray-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <strong>{filtered.length}</strong> {filtered.length === 1 ? 'job' : 'jobs'} found
            </span>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">Loading opportunities...</p>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Jobs Found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search criteria</p>
            {search && (
              <button
                onClick={() => setSearch("")}
                className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 font-medium transition-all"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-5">
            {filtered.map((job) => (
              <div
                key={job._id}
                onClick={() => {
                  setSelectedJob(job._id);
                  setShowDetails(true);
                }}
                className="cursor-pointer bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start gap-6">
                    <div className="flex-1">
                      {job.company && (
                        <div className="flex items-center gap-3 mb-3">
                          {job.company.logo ? (
                            <img
                              src={job.company.logo}
                              alt={job.company.name}
                              className="w-10 h-10 rounded-full object-cover ring-1 ring-gray-200"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-semibold">
                              {job.company?.name?.charAt(0)}
                            </div>
                          )}
                          <div>
                            <h4 className="font-semibold text-gray-800">{job.company.name}</h4>
                            <p className="text-xs text-gray-500">Posted by {job.postedBy?.name || "Company"}</p>
                          </div>
                        </div>
                      )}
                      {/* Job Title */}
                      <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-green-600 transition-colors">
                        {job.title}
                      </h3>

                      {/* Job Details Badges */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.location && (
                          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {job.location}
                          </span>
                        )}
                        {job.employmentType && (
                          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                            <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {job.employmentType}
                          </span>
                        )}
                        {job.salary && (
                          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                            <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {job.salary} LPA
                          </span>
                        )}
                      </div>

                      {/* Job Description */}
                      {job.description && (
                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-4">
                          {job.description}
                        </p>
                      )}

                      {/* Company Info */}
                      {job.company && (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          <span className="font-medium">{job.company.name || job.company}</span>
                        </div>
                      )}

                      {/* Posted Date */}
                      {job.createdAt && (
                        <div className="flex items-center gap-2 text-xs text-gray-400 mt-2">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Posted {new Date(job.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      )}

                      <div className="flex items-center gap-2 mt-2 text-xs">
                        {(() => {
                          let expDate = job.expiresAt ? new Date(job.expiresAt) : null;
                          if (!expDate || isNaN(expDate.getTime())) {
                            expDate = new Date(job.createdAt);
                            expDate.setDate(expDate.getDate() + 30);
                          }

                          const daysLeft = Math.ceil((expDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                          let badgeClass = "bg-green-100 text-green-700 ring-1 ring-green-600/20";
                          let badgeText = `Expires on ${expDate.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}`;

                          if (daysLeft <= 0) {
                            badgeClass = "bg-red-100 text-red-700 ring-1 ring-red-600/20";
                            badgeText = "Expired";
                          } else if (daysLeft <= 7) {
                            badgeClass = "bg-yellow-100 text-yellow-700 ring-1 ring-yellow-600/20";
                            badgeText = `Expiring Soon (${daysLeft}d)`;
                          }

                          return (
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${badgeClass}`}
                            >
                              <svg
                                className="w-3.5 h-3.5 mr-1.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              {badgeText}
                            </span>
                          );
                        })()}
                      </div>
                    </div>

                    {/* Apply Button */}
                    <div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApply(job._id);
                        }}
                        className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 shadow-md hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 font-semibold flex items-center gap-2 whitespace-nowrap"
                      >

                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Apply Now
                      </button>
                    </div>
                  </div>

                  {/* Applicants Count */}
                  {job.applicantsCount !== undefined && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        <span>
                          <strong>{job.applicantsCount}</strong> {job.applicantsCount === 1 ? 'applicant' : 'applicants'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Hover Effect Border */}
                <div className="h-1 bg-gradient-to-r from-green-600 to-green-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </div>
            ))}
          </div>

        )}
      </div>

      {/* Apply Modal */}
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
