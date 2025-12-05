import React, { useEffect, useState } from "react";
import API from "../api/api";
import { MapPin, Mail, Phone, Briefcase, Bookmark, Share2 } from "lucide-react";
import toast from "react-hot-toast";
import FreelancerApplyModal from "../components/FreelancerApplyModal";

const Freelancers: React.FC = () => {
    const [freelancers, setFreelancers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedFreelancerId, setSelectedFreelancerId] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [savedFreelancers, setSavedFreelancers] = useState<string[]>([]);

    useEffect(() => {
        fetchFreelancers();

        // Fetch user and saved freelancers
        const token = localStorage.getItem("token");
        if (token) {
            API.get("/users/me")
                .then((res) => {
                    setUser(res.data);
                    setSavedFreelancers(res.data.savedFreelancers?.map((f: any) => f._id || f) || []);
                })
                .catch(() => setUser(null));
        }
    }, []);

    const fetchFreelancers = async () => {
        try {
            const res = await API.get("/freelancers");
            console.log("Freelancers fetched successfully:", res.data);
            setFreelancers(res.data);
        } catch (err) {
            toast.error("Failed to load freelancers");
        } finally {
            setLoading(false);
        }
    };

    // const handleApply = async (id: string) => {
    //     try {
    //         await API.post(`/freelancers/${id}/apply`);
    //         toast.success("Applied successfully!");
    //     } catch (err: any) {
    //         toast.error(err.response?.data?.message || "Failed to apply");
    //     }
    // };

    const handleApply = (id: string) => {
        setSelectedFreelancerId(id);
        setShowModal(true);
    };

    const handleSave = async (freelancerId: string) => {
        if (!user) {
            toast.error("Please login to save freelancers");
            return;
        }
        try {
            if (savedFreelancers.includes(freelancerId)) {
                await API.delete(`/users/freelancers/${freelancerId}/save`);
                setSavedFreelancers(savedFreelancers.filter(id => id !== freelancerId));
                toast.success("Freelancer unsaved");
            } else {
                await API.post(`/users/freelancers/${freelancerId}/save`);
                setSavedFreelancers([...savedFreelancers, freelancerId]);
                toast.success("Freelancer saved");
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to save freelancer");
        }
    };

    const handleShare = (freelancer: any) => {
        const url = `${window.location.origin}/freelancers/${freelancer._id}`;
        const text = `Check out this freelancer: ${freelancer.name} - ${freelancer.qualification}`;

        if (navigator.share) {
            navigator.share({
                title: freelancer.name,
                text,
                url,
            });
        } else {
            navigator.clipboard.writeText(`${text} ${url}`);
            toast.success("Link copied to clipboard");
        }
    };


    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500 text-lg">
                Loading freelancers...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-50 py-10 px-6">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                    Explore Freelancers & Independent Services
                </h1>

                {freelancers.length === 0 ? (
                    <div className="bg-white p-8 rounded-2xl shadow text-center text-gray-500">
                        No freelance opportunities available right now.
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {freelancers.map((f) => (
                            console.log("Rendering freelancer:", f),
                            <div
                                key={f._id}
                                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
                            >
                                <div className="relative">
                                    <img
                                        src={f.photo || "https://via.placeholder.com/300x200"}
                                        alt={f.name}
                                        className="w-full h-48 object-cover"
                                    />

                                    {/* Save and Share Buttons - Top Right */}
                                    {user && (
                                        <div className="absolute top-4 right-4 flex gap-2">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleSave(f._id);
                                                }}
                                                className={`p-2 rounded-lg text-sm font-semibold transition-all ${
                                                    savedFreelancers.includes(f._id)
                                                        ? "bg-blue-600 text-white"
                                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                                }`}
                                                title={savedFreelancers.includes(f._id) ? "Unsave" : "Save"}
                                            >
                                                <Bookmark className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleShare(f);
                                                }}
                                                className="p-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-300 transition-all"
                                                title="Share"
                                            >
                                                <Share2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="p-5">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-xl font-bold text-gray-800">{f.name}</h3>
                                        {f.isVerified && (
                                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                Verified
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">{f.qualification}</p>

                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {f.preferences?.map((pref: string, idx: number) => (
                                            <span
                                                key={idx}
                                                className="text-xs px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200"
                                            >
                                                {pref}
                                            </span>
                                        ))}
                                    </div>

                                    <p className="text-gray-700 text-sm line-clamp-3 mb-4">
                                        {f.descriptionOfWork}
                                    </p>

                                    <div className="text-sm text-gray-600 space-y-1 mb-3">
                                        {f.location && (
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-indigo-500" /> {f.location}
                                            </div>
                                        )}
                                        {f.email && (
                                            <div className="flex items-center gap-2">
                                                <Mail className="w-4 h-4 text-indigo-500" /> {f.email}
                                            </div>
                                        )}
                                        {f.contact && (
                                            <div className="flex items-center gap-2">
                                                <Phone className="w-4 h-4 text-indigo-500" /> {f.contact}
                                            </div>
                                        )}
                                    </div>

                                    <div className="text-sm text-gray-700 mb-3">
                                        <span className="font-semibold text-indigo-700">Pricing:</span>{" "}
                                        {f.pricing?.min && f.pricing?.max ? (
                                            <>{f.pricing.min} - {f.pricing.max} LPA</>
                                        ) : (
                                            <span className="text-gray-500">Not specified</span>
                                        )}
                                    </div>



                                    {f.hasApplied ? (
                                        <button
                                            disabled
                                            className="w-full mt-2 py-2.5 bg-gray-300 text-gray-600 rounded-xl cursor-not-allowed font-medium"
                                        >
                                            Applied
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleApply(f._id)}
                                            className="w-full mt-2 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all font-medium shadow"
                                        >
                                            Apply for Service
                                        </button>
                                    )}

                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Apply Modal */}
            {showModal && selectedFreelancerId && (
                <FreelancerApplyModal
                    freelancerId={selectedFreelancerId}
                    freelancerName={freelancers.find(f => f._id === selectedFreelancerId)?.name || "Freelancer"}
                    onClose={() => setShowModal(false)}
                />
            )}
        </div>
    );
};

export default Freelancers;
