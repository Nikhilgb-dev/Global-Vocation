// /src/components/CompanyLayout.tsx
import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useCompany } from "../contexts/CompanyContext";

const navItems = [
    { path: "/company/dashboard", label: "Dashboard", icon: "ri-dashboard-line" },
    { path: "/company/profile", label: "Profile", icon: "ri-building-4-line" },
    { path: "/company/jobs", label: "Jobs", icon: "ri-briefcase-line" },
    { path: "/company/employees", label: "Employees", icon: "ri-team-line" },
    { path: "/company/applicants", label: "Applicants", icon: "ri-user-search-line" },
];

const CompanyLayout: React.FC = () => {
    const { company, logout } = useCompany();
    const navigate = useNavigate();

    const doLogout = () => {
        logout();
        navigate("/company/login");
    };

    return (
        <div className="min-h-screen flex bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 p-4 flex flex-col justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg">
                            {company?.name?.charAt(0).toUpperCase() || "C"}
                        </div>
                        <div>
                            <div className="font-semibold text-gray-800">{company?.name}</div>
                            <div className="text-xs text-gray-500">Company Admin</div>
                        </div>
                    </div>

                    <nav className="space-y-1">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium ${isActive
                                        ? "bg-blue-100 text-blue-700"
                                        : "text-gray-700 hover:bg-gray-100"
                                    }`
                                }
                            >
                                <i className={`${item.icon} text-lg`}></i>
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6">
                <Outlet />
            </main>
        </div>
    );
};

export default CompanyLayout;
