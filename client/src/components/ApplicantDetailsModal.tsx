import React from "react";
import { X } from "lucide-react";

interface ExperienceItem {
    companyName?: string;
    jobTitle?: string;
    startDate?: string;
    endDate?: string;
    currentlyWorking?: boolean;
    description?: string;
}

interface EducationItem {
    school?: string;
    degree?: string;
    fieldOfStudy?: string;
    startDate?: string;
    endDate?: string;
}

interface ProjectItem {
    name?: string;
    link?: string;
    description?: string;
    startDate?: string;
    endDate?: string;
}

interface ContactInfo {
    name?: string;
    email?: string;
    phone?: string;
    altPhone?: string;
}

interface ExperienceData {
    isFresher: boolean;
    years?: number;
    history?: ExperienceItem[];
}

interface Applicant {
    _id: string;
    user?: {
        name?: string;
        email?: string;
        profilePhoto?: string;
    };
    job?: {
        title?: string;
    };
    resume?: string;
    coverLetter?: string;
    contact?: ContactInfo;
    experience?: ExperienceData;
    education?: EducationItem[];
    project?: ProjectItem[];
    createdAt?: string;
}

interface ApplicantDetailsModalProps {
    applicant: Applicant | null;
    onClose: () => void;
}

const ApplicantDetailsModal: React.FC<ApplicantDetailsModalProps> = ({
    applicant,
    onClose,
}) => {
    if (!applicant) return null;

    const {
        user,
        resume,
        coverLetter,
        contact,
        experience,
        education,
        project,
    } = applicant;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-4xl shadow-xl overflow-y-auto max-h-[90vh]">
                {/* Header */}
                <div className="flex justify-between items-center border-b p-5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-2xl">
                    <h2 className="text-xl font-bold">
                        Applicant Details – {user?.name || contact?.name}
                    </h2>
                    <button
                        onClick={onClose}
                        className="hover:bg-white/20 p-2 rounded-full transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-8">
                    {/* Contact Info */}
                    <section>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            Contact Information
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 text-sm">
                            <p>
                                <strong>Email:</strong> {contact?.email || user?.email}
                            </p>
                            <p>
                                <strong>Phone:</strong> {contact?.phone}
                            </p>
                            <p>
                                <strong>WhatsApp:</strong> {contact?.altPhone || "—"}
                            </p>
                        </div>
                    </section>

                    {/* Cover Letter */}
                    {coverLetter && (
                        <section>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                Cover Letter
                            </h3>
                            <p className="text-gray-700 whitespace-pre-wrap bg-gray-50 border rounded-lg p-3">
                                {coverLetter}
                            </p>
                        </section>
                    )}

                    {/* Experience */}
                    <section>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            Experience
                        </h3>
                        {experience?.isFresher ? (
                            <p className="text-gray-600">Fresher (No prior experience)</p>
                        ) : experience?.history && experience.history.length > 0 ? (
                            <div className="space-y-4">
                                {experience.history.map((exp, idx) => (
                                    <div
                                        key={idx}
                                        className="border border-gray-200 p-4 rounded-lg bg-gray-50"
                                    >
                                        <p className="font-semibold text-gray-800">
                                            {exp.jobTitle}
                                        </p>
                                        <p className="text-sm text-gray-600">{exp.companyName}</p>
                                        <p className="text-xs text-gray-500">
                                            {exp.startDate
                                                ? new Date(exp.startDate).toLocaleDateString()
                                                : ""}{" "}
                                            -{" "}
                                            {exp.currentlyWorking
                                                ? "Present"
                                                : exp.endDate
                                                    ? new Date(exp.endDate).toLocaleDateString()
                                                    : ""}
                                        </p>
                                        {exp.description && (
                                            <p className="mt-2 text-gray-700 text-sm">
                                                {exp.description}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">No experience data available.</p>
                        )}
                    </section>

                    {/* Education */}
                    <section>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            Education
                        </h3>
                        {education && education.length > 0 ? (
                            <div className="space-y-4">
                                {education.map((edu, idx) => (
                                    <div
                                        key={idx}
                                        className="border border-gray-200 p-4 rounded-lg bg-gray-50"
                                    >
                                        <p className="font-semibold text-gray-800">
                                            {edu.degree} – {edu.fieldOfStudy}
                                        </p>
                                        <p className="text-sm text-gray-600">{edu.school}</p>
                                        <p className="text-xs text-gray-500">
                                            {edu.startDate
                                                ? new Date(edu.startDate).toLocaleDateString()
                                                : ""}{" "}
                                            -{" "}
                                            {edu.endDate
                                                ? new Date(edu.endDate).toLocaleDateString()
                                                : ""}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">No education data provided.</p>
                        )}
                    </section>

                    {/* Projects */}
                    <section>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            Projects
                        </h3>
                        {project && project.length > 0 ? (
                            <div className="space-y-4">
                                {project.map((p, idx) => (
                                    <div
                                        key={idx}
                                        className="border border-gray-200 p-4 rounded-lg bg-gray-50"
                                    >
                                        <p className="font-semibold text-gray-800">{p.name}</p>
                                        {p.link && (
                                            <a
                                                href={p.link}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-blue-600 text-sm underline"
                                            >
                                                {p.link}
                                            </a>
                                        )}
                                        <p className="text-xs text-gray-500">
                                            {p.startDate
                                                ? new Date(p.startDate).toLocaleDateString()
                                                : ""}{" "}
                                            -{" "}
                                            {p.endDate
                                                ? new Date(p.endDate).toLocaleDateString()
                                                : ""}
                                        </p>
                                        {p.description && (
                                            <p className="mt-2 text-gray-700 text-sm">
                                                {p.description}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">No projects listed.</p>
                        )}
                    </section>

                    {/* Resume */}
                    {resume && (
                        <section>
                            <a
                                href={resume}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                                View Resume
                            </a>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ApplicantDetailsModal;
