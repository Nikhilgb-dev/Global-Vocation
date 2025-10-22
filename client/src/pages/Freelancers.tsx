import React, { useEffect, useState } from "react";
import API from "../api/api";
import { MapPin, Mail, Phone, Briefcase } from "lucide-react";
import toast from "react-hot-toast";

const Freelancers: React.FC = () => {
    const [freelancers, setFreelancers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedFreelancerId, setSelectedFreelancerId] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchFreelancers();
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
                                <img
                                    src={f.photo || "https://via.placeholder.com/300x200"}
                                    alt={f.name}
                                    className="w-full h-48 object-cover"
                                />

                                <div className="p-5">
                                    <h3 className="text-xl font-bold text-gray-800 mb-1">{f.name}</h3>
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
                                        ₹{f.priceMin} - ₹{f.priceMax}
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
        </div>
    );
};

export default Freelancers;
