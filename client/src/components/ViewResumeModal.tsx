import React from "react";

interface Props {
    resumeUrl: string;
    onClose: () => void;
}

const ViewResumeModal: React.FC<Props> = ({ resumeUrl, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-4 relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
                >
                    ✕
                </button>
                <h3 className="text-lg font-semibold mb-3">Resume Preview</h3>
                <iframe
                    src={resumeUrl}
                    className="w-full h-[80vh] border rounded-md"
                    title="Resume"
                />
            </div>
        </div>
    );
};

export default ViewResumeModal;
