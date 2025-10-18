import { useEffect, useState } from "react";
import API from "@/api/api";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Trash2, Eye } from "lucide-react";
import JobDetailsModal from "@/components/JobDetailsModal";
import FeedbackButton from "@/components/FeedbackButton";

const StatCard = ({ title, value }: { title: string; value: number }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <p className="text-sm text-gray-500">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
    </div>
);

const UserDashboard = () => {
    const [applications, setApplications] = useState<any[]>([]);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showNotifications, setShowNotifications] = useState(false);
    const [selectedJob, setSelectedJob] = useState<any | null>(null);

    const fetchApplications = async () => {
        const res = await API.get("/applications/me");
        setApplications(res.data.applications);
    };

    const fetchNotifications = async () => {
        const res = await API.get("/notifications");
        setNotifications(res.data);
        setUnreadCount(res.data.filter((n: any) => !n.isRead).length);
    };

    const withdrawApplication = async (id: string) => {
        if (!window.confirm("Withdraw this application?")) return;
        await API.delete(`/applications/${id}`);
        fetchApplications();
    };

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            await Promise.all([fetchApplications(), fetchNotifications()]);
            setLoading(false);
        };
        load();
    }, []);

    if (loading) return <div className="text-gray-500 p-6">Loading...</div>;

    const stats = {
        total: applications.length,
        hired: applications.filter((a) => a.status === "hired").length,
        interview: applications.filter((a) => a.status === "interview").length,
        rejected: applications.filter((a) => a.status === "rejected").length,
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Jobs Applied" value={stats.total} />
                <StatCard title="Interviews" value={stats.interview} />
                <StatCard title="Hired" value={stats.hired} />
                <StatCard title="Rejected" value={stats.rejected} />
            </div>

            {/* Applications */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold mb-4">My Applications</h2>
                {applications.length === 0 ? (
                    <div className="text-gray-500">You haven’t applied to any jobs yet.</div>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-gray-600 border-b">
                            <tr>
                                <th className="p-2 text-left">Job Title</th>
                                <th className="p-2 text-left">Company</th>
                                <th className="p-2 text-left">Status</th>
                                <th className="p-2 text-left">Applied On</th>
                                <th className="p-2 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applications.map((a) => (
                                <motion.tr
                                    key={a._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="border-b hover:bg-gray-50"
                                >
                                    <td className="p-2">{a.job?.title}</td>
                                    <td className="p-2">{a.job?.company?.name}</td>
                                    <td className="p-2 capitalize">
                                        {a.status === "hired" ? (
                                            <CheckCircle className="w-4 h-4 text-green-600 inline-block mr-1" />
                                        ) : a.status === "rejected" ? (
                                            <XCircle className="w-4 h-4 text-red-600 inline-block mr-1" />
                                        ) : null}
                                        {a.status}
                                    </td>
                                    <td className="p-2 text-gray-500">
                                        {new Date(a.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="p-2 text-right space-x-3">
                                        <button
                                            onClick={() => setSelectedJob(a.job)}
                                            className="text-blue-600 hover:underline text-sm"
                                        >
                                            <Eye className="w-4 h-4 inline-block mr-1" /> View
                                        </button>
                                        <button
                                            onClick={() => withdrawApplication(a._id)}
                                            className="text-red-600 hover:underline text-sm"
                                        >
                                            <Trash2 className="w-4 h-4 inline-block mr-1" /> Withdraw
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {selectedJob && (
                <JobDetailsModal job={selectedJob} onClose={() => setSelectedJob(null)} />
            )}

            <FeedbackButton targetType="platform" />


        </div>
    );
};

export default UserDashboard;
