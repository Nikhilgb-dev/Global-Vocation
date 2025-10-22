import React from "react";
import { X, MapPin, Mail, Phone, Star } from "lucide-react";

interface FreelancerProfileModalProps {
    freelancer: any;
    onClose: () => void;
}

const FreelancerProfileModal: React.FC<FreelancerProfileModalProps> = ({
    freelancer,
    onClose,
}) => {
    if (!freelancer) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-y-auto max-h-[90vh] relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 rounded-full p-2"
                >
                    <X className="w-5 h-5 text-gray-600" />
                </button>

                {/* Header Section */}
                <div className="flex flex-col md:flex-row items-center gap-6 p-6 border-b">
                    <img
                        src={freelancer.photo}
                        alt={freelancer.name}
                        className="w-32 h-32 rounded-full object-cover border-4 border-blue-100"
                    />
                    <div className="text-center md:text-left">
                        <h2 className="text-2xl font-bold text-gray-800">{freelancer.name}</h2>
                        <p className="text-gray-600">{freelancer.qualification}</p>
                        <div className="flex flex-wrap gap-3 text-gray-600 mt-3 justify-center md:justify-start">
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-blue-600" /> {freelancer.location}
                            </div>
                            <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-blue-600" /> {freelancer.email}
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-blue-600" /> {freelancer.contact}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Preferences */}
                    {freelancer.preferences?.length > 0 && (
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-2">Preferences</h3>
                            <div className="flex flex-wrap gap-2">
                                {freelancer.preferences.map((pref: string) => (
                                    <span
                                        key={pref}
                                        className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full"
                                    >
                                        {pref}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* About & Description */}
                    <div>
                        <h3 className="font-semibold text-gray-800 mb-2">
                            Description of Work
                        </h3>
                        <p className="text-gray-700 leading-relaxed">
                            {freelancer.descriptionOfWork}
                        </p>
                    </div>

                    {freelancer.aboutFreelancer && (
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-2">About</h3>
                            <p className="text-gray-700 leading-relaxed">
                                {freelancer.aboutFreelancer}
                            </p>
                        </div>
                    )}

                    {/* Services */}
                    {freelancer.services?.length > 0 && (
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-3">Services & Add-ons</h3>
                            <div className="grid gap-4">
                                {freelancer.services.map((srv: any, idx: number) => (
                                    <div
                                        key={idx}
                                        className="border border-gray-200 rounded-xl p-4 bg-gray-50"
                                    >
                                        <h4 className="font-semibold text-blue-700 text-lg mb-1">
                                            {srv.title}
                                        </h4>
                                        <p className="text-gray-600 mb-2">{srv.description}</p>
                                        {srv.link && (
                                            <a
                                                href={srv.link}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-blue-600 text-sm hover:underline"
                                            >
                                                🔗 {srv.link}
                                            </a>
                                        )}
                                        {srv.achievements?.length > 0 && (
                                            <ul className="list-disc pl-5 text-gray-600 mt-2">
                                                {srv.achievements.map((a: string, i: number) => (
                                                    <li key={i}>{a}</li>
                                                ))}
                                            </ul>
                                        )}
                                        {srv.otherDetails && (
                                            <p className="text-gray-600 mt-2 text-sm italic">
                                                {srv.otherDetails}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Pricing */}
                    <div>
                        <h3 className="font-semibold text-gray-800 mb-2">Pricing</h3>
                        <p className="text-gray-700">
                            💰 From{" "}
                            <span className="font-bold text-green-600">
                                ₹{freelancer.pricing.min}
                            </span>{" "}
                            to{" "}
                            <span className="font-bold text-green-600">
                                ₹{freelancer.pricing.max}
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FreelancerProfileModal;
