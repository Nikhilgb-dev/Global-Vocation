import React, { useEffect, useState } from "react";
import API from "@/api/api";
import { useCompany } from "../contexts/CompanyContext";
import ApplicationStatusDropdown from "@/components/ApplicationStatusDropdown";
import ViewResumeModal from "@/components/ViewResumeModal";

type DashboardData = {
    employeesCount: number;
    totalJobs: number;
    openJobs: number;
    totalApplicants: number;
    totalHired: number;
};

const StatCard: React.FC<{ title: string; value: number }> = ({ title, value }) => (
    <div className="bg-white border rounded p-4 shadow-sm">
        <div className="text-sm text-gray-500">{title}</div>
        <div className="text-2xl font-bold text-gray-800">{value}</div>
    </div>
);

const CompanyDashboard: React.FC = () => {
    const { company } = useCompany();
    const [data, setData] = useState<DashboardData | null>(null);
    const [applicants, setApplicants] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [resumeUrl, setResumeUrl] = useState<string | null>(null);

    const fetchDashboard = async () => {
        const res = await API.get("/companies/me/dashboard");
        setData(res.data);
    };

    const fetchApplicants = async () => {
        const res = await API.get("/companies/me/applicants");
        setApplicants(res.data.applications || []);
    };

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                await Promise.all([fetchDashboard(), fetchApplicants()]);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (loading) return <div className="text-gray-500">Loading dashboard...</div>;
    if (!data) return <div className="text-red-500">Failed to load dashboard</div>;

    return (
        <div className="space-y-6">
            {/* ====== STAT CARDS ====== */}
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                <StatCard title="Employees" value={data.employeesCount} />
                <StatCard title="Jobs Posted" value={data.totalJobs} />
                <StatCard title="Open Jobs" value={data.openJobs} />
                <StatCard title="Applicants" value={data.totalApplicants} />
                <StatCard title="Total Hired" value={data.totalHired} />
            </div>

            {/* ====== APPLICANTS TABLE ====== */}
            <div className="bg-white border rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">Recent Applicants</h2>

                {applicants.length === 0 ? (
                    <div className="text-gray-500">No applicants yet.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm border-t">
                            <thead className="bg-gray-50 text-gray-600 border-b">
                                <tr>
                                    <th className="p-2 text-left">Candidate</th>
                                    <th className="p-2 text-left">Job Title</th>
                                    <th className="p-2 text-left">Status</th>
                                    <th className="p-2 text-left">Applied On</th>
                                    <th className="p-2 text-left">Resume</th>
                                </tr>
                            </thead>
                            <tbody>
                                {applicants.map((a) => (
                                    <tr key={a._id} className="border-b hover:bg-gray-50">
                                        <td className="p-2 flex items-center gap-3">
                                            {a.user?.profilePhoto ? (
                                                <img
                                                    src={a.user.profilePhoto}
                                                    alt={a.user.name}
                                                    className="w-9 h-9 rounded-full object-cover ring-1 ring-gray-200"
                                                />
                                            ) : (
                                                <div className="w-9 h-9 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                                                    {a.user?.name?.charAt(0)}
                                                </div>
                                            )}
                                            <div>
                                                <div className="font-medium text-gray-900">{a.user?.name}</div>
                                                <div className="text-xs text-gray-500">{a.user?.email}</div>
                                            </div>
                                        </td>
                                        <td className="p-2">{a.job?.title}</td>
                                        <td className="p-2">
                                            <ApplicationStatusDropdown
                                                id={a._id}
                                                currentStatus={a.status}
                                                onUpdated={fetchApplicants}
                                            />
                                        </td>
                                        <td className="p-2 text-gray-500">
                                            {new Date(a.createdAt).toLocaleDateString()}
                                        </td>
                                        <td
                                            className="p-2 text-blue-600 hover:underline cursor-pointer"
                                            onClick={() => setResumeUrl(a.resume)}
                                        >
                                            View Resume
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {resumeUrl && (
                <ViewResumeModal resumeUrl={resumeUrl} onClose={() => setResumeUrl(null)} />
            )}
        </div>
    );
};

export default CompanyDashboard;
