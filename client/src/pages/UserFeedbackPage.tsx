import React, { useEffect, useState } from "react";
import API from "../api/api";
import { motion } from "framer-motion";
import FeedbackModal from "../components/FeedbackModal";
import { Star } from "lucide-react";

interface Feedback {
    _id: string;
    message: string;
    rating?: number;
    reply?: string;
    repliedAt?: string;
    targetType: "platform" | "company";
    targetId?: { name?: string };
    createdAt: string;
}

const UserFeedbackPage: React.FC = () => {
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [showModal, setShowModal] = useState(false);

    const fetchFeedbacks = async () => {
        try {
            const res = await API.get("/feedbacks/my");
            setFeedbacks(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">My Feedback 💬</h1>
                    <button
                        onClick={() => setShowModal(true)}
                        className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Add Feedback
                    </button>
                </div>

                {feedbacks.length === 0 ? (
                    <p className="text-gray-500 text-center py-10">
                        You haven’t shared any feedback yet.
                    </p>
                ) : (
                    <div className="space-y-4">
                        {feedbacks.map((f) => (
                            <motion.div
                                key={f._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white border border-gray-100 shadow-sm rounded-lg p-5"
                            >
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold text-gray-800">
                                        {f.targetType === "company"
                                            ? f.targetId?.name || "Company"
                                            : "Platform Feedback"}
                                    </h3>
                                    {f.rating && (
                                        <div className="flex gap-1 text-yellow-500">
                                            {Array.from({ length: f.rating }).map((_, i) => (
                                                <Star key={i} className="w-4 h-4 fill-yellow-400" />
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <p className="text-gray-700 mt-2">{f.message}</p>

                                {f.reply && (
                                    <div className="mt-3 text-sm bg-blue-50 text-blue-700 p-3 rounded-lg border border-blue-100">
                                        <strong>Admin Reply:</strong> {f.reply}
                                        <div className="text-xs text-gray-500 mt-1">
                                            {new Date(f.repliedAt!).toLocaleDateString()}
                                        </div>
                                    </div>
                                )}

                                <div className="text-xs text-gray-400 mt-2">
                                    {new Date(f.createdAt).toLocaleDateString()}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {showModal && (
                <FeedbackModal
                    onClose={() => setShowModal(false)}
                    onSubmitted={fetchFeedbacks}
                    targetType="platform"
                />
            )}
        </div>
    );
};

export default UserFeedbackPage;
