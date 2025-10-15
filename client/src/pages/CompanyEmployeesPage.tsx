import React, { useEffect, useState } from "react";
import API from "@/api/api";
import { toast } from "react-hot-toast";

interface Employee {
    _id: string;
    name: string;
    email: string;
    role: string;
    phone?: string;
    createdAt?: string;
}

const CompanyEmployeesPage: React.FC = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);

    const loadEmployees = async () => {
        try {
            const res = await API.get("/companies/me/employees");
            setEmployees(res.data);
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to load employees");
        } finally {
            setLoading(false);
        }
    };

    const fireEmployee = async (id: string) => {
        if (!window.confirm("Are you sure you want to fire this employee?")) return;
        try {
            await API.put(`/companies/me/employees/${id}/fire`);
            toast.success("Employee removed");
            loadEmployees();
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to fire employee");
        }
    };

    useEffect(() => {
        loadEmployees();
    }, []);

    if (loading) return <div>Loading employees...</div>;

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Employees ({employees.length})</h2>

            {employees.length === 0 ? (
                <div className="text-gray-500">No employees found.</div>
            ) : (
                <table className="w-full text-sm border-t">
                    <thead className="bg-gray-50 text-gray-600 border-b">
                        <tr>
                            <th className="p-2 text-left">Name</th>
                            <th className="p-2 text-left">Email</th>
                            <th className="p-2 text-left">Role</th>
                            <th className="p-2 text-left">Joined</th>
                            <th className="p-2 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map((e) => (
                            <tr key={e._id} className="border-b hover:bg-gray-50">
                                <td className="p-2">{e.name}</td>
                                <td className="p-2">{e.email}</td>
                                <td className="p-2 capitalize">{e.role}</td>
                                <td className="p-2 text-gray-500">
                                    {new Date(e.createdAt || "").toLocaleDateString()}
                                </td>
                                <td className="p-2 text-right">
                                    <button
                                        onClick={() => fireEmployee(e._id)}
                                        className="text-red-600 hover:underline text-sm"
                                    >
                                        Fire
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default CompanyEmployeesPage;
