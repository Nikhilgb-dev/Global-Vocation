import React, { useEffect, useState } from "react";
import API from "../api/api";
import { Trash2, Edit2, MapPin, Mail, Phone } from "lucide-react";
import AddFreelancer from "./AddFreelancer";
import EditFreelancerModal from "@/components/EditFreelancerModal";
import toast from "react-hot-toast";

const FreelancerList: React.FC = () => {
    const [freelancers, setFreelancers] = useState<any[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const fetchFreelancers = async () => {
        const res = await API.get("/freelancers");
        setFreelancers(res.data);
    };

    useEffect(() => {
        fetchFreelancers();
    }, []);

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this freelancer?")) return;
        await API.delete(`/freelancers/${id}`);
        toast.success("Freelancer deleted!");
        fetchFreelancers();
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Freelancers</h2>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    + Add Freelancer
                </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {freelancers.map((freelancer) => (
                    <div
                        key={freelancer._id}
                        className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition-all border border-gray-100"
                    >
                        <img
                            src={freelancer.photo}
                            alt={freelancer.name}
                            className="w-full h-40 object-cover rounded-xl mb-3"
                        />
                        <h3 className="text-lg font-bold text-gray-800">{freelancer.name}</h3>
                        <p className="text-sm text-gray-500 mb-2">{freelancer.qualification}</p>
                        <div className="text-sm text-gray-600 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-blue-600" /> {freelancer.location}
                        </div>
                        <div className="text-sm text-gray-600 flex items-center gap-2">
                            <Mail className="w-4 h-4 text-blue-600" /> {freelancer.email}
                        </div>
                        <div className="text-sm text-gray-600 flex items-center gap-2">
                            <Phone className="w-4 h-4 text-blue-600" /> {freelancer.contact}
                        </div>
                        <p className="mt-3 text-gray-700 line-clamp-3">{freelancer.descriptionOfWork}</p>

                        <div className="flex gap-2 mt-4">
                            <button
                                onClick={() => setEditingId(freelancer._id)}
                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 text-sm"
                            >
                                <Edit2 className="w-4 h-4" /> Edit
                            </button>
                            <button
                                onClick={() => handleDelete(freelancer._id)}
                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-sm"
                            >
                                <Trash2 className="w-4 h-4" /> Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-2xl max-w-3xl w-full shadow-2xl overflow-y-auto max-h-[90vh]">
                        <AddFreelancer
                            onAdded={() => {
                                fetchFreelancers();
                                setShowAddModal(false);
                            }}
                        />
                        <button
                            onClick={() => setShowAddModal(false)}
                            className="mt-4 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {editingId && (
                <EditFreelancerModal
                    freelancerId={editingId}
                    onClose={() => setEditingId(null)}
                    onUpdated={fetchFreelancers}
                />
            )}
        </div>
    );
};

export default FreelancerList;
