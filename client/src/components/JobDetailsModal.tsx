import React from "react";

interface Props {
    job: any;
    onClose: () => void;
}

const JobDetailsModal: React.FC<Props> = ({ job, onClose }) => {
    if (!job) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
                >
                    ✕
                </button>

                <div className="flex items-center gap-4 mb-4">
                    {job.company?.logo ? (
                        <img
                            src={job.company.logo}
                            alt={job.company.name}
                            className="w-12 h-12 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-12 h-12 bg-blue-100 text-blue-700 flex items-center justify-center rounded-full font-bold">
                            {job.company?.name?.charAt(0) || "C"}
                        </div>
                    )}
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">{job.title}</h2>
                        <p className="text-gray-500 text-sm">{job.company?.name}</p>
                    </div>
                </div>

                <div className="text-gray-700 text-sm space-y-2">
                    <p><strong>Location:</strong> {job.location || "Not specified"}</p>
                    <p><strong>Employment Type:</strong> {job.employmentType}</p>
                    {job.salary && <p><strong>Salary:</strong> {job.salary}</p>}
                </div>

                <div className="mt-4 border-t pt-4 text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                    {job.description || "No description available."}
                </div>
            </div>
        </div>
    );
};

export default JobDetailsModal;
