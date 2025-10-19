import React, { useEffect, useState } from "react";
import API from "@/api/api";
import { useCompany } from "../contexts/CompanyContext";
import ApplicationStatusDropdown from "@/components/ApplicationStatusDropdown";
import ViewResumeModal from "@/components/ViewResumeModal";
import FeedbackButton from "@/components/FeedbackButton";
import ApplicantDetailsModal from "@/components/ApplicantDetailsModal";

type DashboardData = {
    employeesCount: number;
    totalJobs: number;
    openJobs: number;
    totalApplicants: number;
    totalHired: number;
    activeJobs: number;
    expiredJobs: number;
    pendingJobs: number;
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
    const [selectedApplicant, setSelectedApplicant] = useState<any | null>(null);
    const [companyJobs, setCompanyJobs] = useState<any[]>([]);
    const fetchDashboard = async () => {
        const res = await API.get("/companies/me/dashboard");
        setData(res.data);
    };

    const fetchApplicants = async () => {
        const res = await API.get("/companies/me/applicants");
        setApplicants(res.data.applications || []);
    };

    useEffect(() => {
        const loadData = async () => {
            const [dashboardRes, jobsRes] = await Promise.all([
                API.get("/companies/me/dashboard"),
                API.get("/companies/me/jobs"),
            ]);
            setData(dashboardRes.data);
            setCompanyJobs(jobsRes.data.jobs || []);
        };
        loadData();
    }, []);

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
                {/* <StatCard title="Open Jobs" value={data.openJobs} /> */}
                <StatCard title="Applicants" value={data.totalApplicants} />
                <StatCard title="Total Hired" value={data.totalHired} />
                <StatCard title="Active Jobs" value={data.activeJobs} />
                <StatCard title="Expired Jobs" value={data.expiredJobs} />
                <StatCard title="Pending Jobs" value={data.pendingJobs} />
            </div>

            <FeedbackButton targetType="platform" />


            {/* ====== JOB LIST WITH EXPIRY BADGES ====== */}
            <div className="bg-white border rounded-lg shadow-sm p-6 mt-8">
                <h2 className="text-lg font-semibold mb-4">My Job Listings</h2>

                {companyJobs.length === 0 ? (
                    <p className="text-gray-500">No jobs found.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm border-t">
                            <thead className="bg-gray-50 text-gray-600 border-b">
                                <tr>
                                    <th className="p-2 text-left">Title</th>
                                    <th className="p-2 text-left">Status</th>
                                    <th className="p-2 text-left">Expires On</th>
                                    <th className="p-2 text-left">Expiry State</th>
                                </tr>
                            </thead>
                            <tbody>
                                {companyJobs.map((job) => {
                                    const expDate = new Date(job.expiresAt);
                                    const daysLeft = Math.ceil(
                                        (expDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                                    );

                                    let badgeClass =
                                        "bg-green-50 text-green-700 ring-1 ring-green-600/20";
                                    let badgeText = "Active";

                                    if (daysLeft <= 0 || job.isExpired) {
                                        badgeClass = "bg-red-50 text-red-700 ring-1 ring-red-600/20";
                                        badgeText = "Expired";
                                    } else if (daysLeft <= 7) {
                                        badgeClass = "bg-yellow-50 text-yellow-700 ring-1 ring-yellow-600/20";
                                        badgeText = `Expiring Soon (${daysLeft}d)`;
                                    }

                                    return (
                                        <tr key={job._id} className="border-b hover:bg-gray-50">
                                            <td className="p-2 font-medium text-gray-900">{job.title}</td>
                                            <td className="p-2 capitalize text-gray-600">{job.status}</td>
                                            <td className="p-2 text-gray-600">
                                                {new Date(job.expiresAt).toLocaleDateString()}
                                            </td>
                                            <td className="p-2">
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${badgeClass}`}
                                                >
                                                    {badgeText}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
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
                                    <th className="p-2 text-left">Details</th>
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

                                        <td
                                            className="p-2 text-blue-600 hover:underline cursor-pointer"
                                            onClick={() => setSelectedApplicant(a)}
                                        >
                                            View Details
                                        </td>

                                        {selectedApplicant && (
                                            <ApplicantDetailsModal
                                                applicant={selectedApplicant}
                                                onClose={() => setSelectedApplicant(null)}
                                            />
                                        )}


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
