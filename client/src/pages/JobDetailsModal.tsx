import { useEffect, useState } from "react";
import API from "../api/api";

interface JobDetailsModalProps {
    jobId: string;
    onClose: () => void;
}

interface JobDetailsModalProps {
    jobId: string;
    onClose: () => void;
    onApply: (jobId: string) => void;
}


const JobDetailsModal = ({ jobId, onClose }: JobDetailsModalProps) => {
    const [job, setJob] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        API.get(`/jobs/${jobId}`)
            .then((res) => {
                setJob(res.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [jobId]);

    if (!jobId) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center px-4 backdrop-blur-sm">
            <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl relative overflow-hidden animate-fadeIn max-h-[90vh] flex flex-col">
                {/* Header with Gradient */}
                <div className="bg-gradient-to-r from-green-600 to-green-700 px-8 py-6 relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {!loading && job && (
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-2 pr-12">
                                {job.title}
                            </h2>
                            <p className="text-green-100 text-sm">Job Details & Requirements</p>
                        </div>
                    )}
                </div>

                {loading ? (
                    <div className="p-16 text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
                        <p className="text-gray-600 text-lg">Loading job details...</p>
                    </div>
                ) : job ? (
                    <div className="flex-1 overflow-y-auto p-8">
                        {/* Quick Info Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            {job.company && (
                                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600 font-medium">Company</p>
                                            <p className="text-sm font-bold text-gray-800">{job.company.name || job.company}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {job.location && (
                                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600 font-medium">Location</p>
                                            <p className="text-sm font-bold text-gray-800">{job.location}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {job.employmentType && (
                                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600 font-medium">Type</p>
                                            <p className="text-sm font-bold text-gray-800">{job.employmentType}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Salary Section */}
                        {job.salary && (
                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-600 rounded-lg p-4 mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 font-medium">Salary Range</p>
                                        <p className="text-xl font-bold text-green-700">{job.salary}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Job Description */}
                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Job Description</h3>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                    {job.description || "No description provided."}
                                </p>
                            </div>
                        </div>

                        {/* Requirements Section (if available) */}
                        {job.requirements && (
                            <div className="mb-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800">Requirements</h3>
                                </div>
                                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                        {job.requirements}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Applicants Count */}
                        {job.applicantsCount !== undefined && (
                            <div className="bg-purple-50 rounded-xl p-4 mb-6 border border-purple-200">
                                <div className="flex items-center gap-3">
                                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                    <div>
                                        <p className="text-sm text-gray-600">Total Applicants</p>
                                        <p className="text-lg font-bold text-purple-700">
                                            {job.applicantsCount} {job.applicantsCount === 1 ? 'candidate' : 'candidates'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Posted By Info */}
                        {job.postedBy && (
                            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                        {job.postedBy.name?.charAt(0).toUpperCase() || "U"}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-600 mb-1">Posted by</p>
                                        <p className="font-bold text-gray-800 text-lg">{job.postedBy.name}</p>
                                        <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            {new Date(job.createdAt).toLocaleDateString("en-US", {
                                                month: "long",
                                                day: "numeric",
                                                year: "numeric",
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="p-16 text-center">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Job Not Found</h3>
                        <p className="text-gray-600">The job details could not be loaded.</p>
                    </div>
                )}

                {/* Footer */}
                {!loading && job && (
                    <div className="border-t bg-gray-50 px-8 py-4 flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-6 py-3 rounded-xl bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all font-medium"
                        >
                            Close
                        </button>
                        {/* <button
                            className="px-6 py-3 rounded-xl bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-xl transform hover:-translate-y-0.5 transition-all font-medium flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Apply Now
                        </button> */}
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobDetailsModal;
