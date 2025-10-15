// src/pages/CompanyDashboard.tsx
import React, { useEffect, useState } from "react";
import API from "@/api/api";
import { useCompany } from "../contexts/CompanyContext";

type DashboardData = {
    employeesCount: number;
    totalJobs: number;
    openJobs: number;
    totalApplicants: number;
    totalHired: number;
    recentJobs?: any[];
    recentApplications?: any[];
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
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const res = await API.get("/companies/me/dashboard");
                setData(res.data);
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
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                <StatCard title="Employees" value={data.employeesCount} />
                <StatCard title="Jobs Posted" value={data.totalJobs} />
                <StatCard title="Open Jobs" value={data.openJobs} />
                <StatCard title="Applicants" value={data.totalApplicants} />
                <StatCard title="Total Hired" value={data.totalHired} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-white border rounded p-4 shadow-sm">
                    <h3 className="font-semibold mb-3">Recent Jobs</h3>
                    {data.recentJobs && data.recentJobs.length ? (
                        <ul className="space-y-2">
                            {data.recentJobs.map((r) => (
                                <li key={r._id} className="text-sm text-gray-700">
                                    <div className="font-medium">{r.title}</div>
                                    <div className="text-xs text-gray-500">Posted {new Date(r.createdAt).toLocaleDateString()}</div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="text-sm text-gray-500">No recent jobs</div>
                    )}
                </div>

                <div className="bg-white border rounded p-4 shadow-sm">
                    <h3 className="font-semibold mb-3">Recent Applicants</h3>
                    {data.recentApplications && data.recentApplications.length ? (
                        <ul className="space-y-2">
                            {data.recentApplications.map((a) => (
                                <li key={a._id} className="text-sm text-gray-700">
                                    <div className="font-medium">{a.user?.name}</div>
                                    <div className="text-xs text-gray-500">{a.job?.title} • {new Date(a.createdAt).toLocaleDateString()}</div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="text-sm text-gray-500">No recent applicants</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CompanyDashboard;
