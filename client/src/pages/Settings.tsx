import { useEffect, useState } from "react";
import API from "@/api/api";
import { motion } from "framer-motion";
import { Camera, Trash2, Save, Building2, User, Shield } from "lucide-react";

const Settings = () => {
    const [user, setUser] = useState<any>(null);
    const [company, setCompany] = useState<any>(null);
    const [form, setForm] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Load user + company info
    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const userRes = await API.get("/users/me");
                setUser(userRes.data);
                setForm(userRes.data);
                if (userRes.data.role === "company_admin") {
                    const compRes = await API.get("/companies/me");
                    setCompany(compRes.data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            if (user.role === "company_admin") {
                await API.put("/companies/me", company);
            } else {
                await API.put("/users/me", form);
            }
            alert("Profile updated successfully!");
        } catch (err) {
            alert("Failed to update profile.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete your account?")) return;
        try {
            await API.delete("/users/me");
            alert("Account deleted successfully.");
            localStorage.removeItem("token");
            window.location.href = "/";
        } catch {
            alert("Failed to delete account.");
        }
    };

    if (loading) return <div className="p-6 text-gray-500">Loading...</div>;

    const isCompanyAdmin = user?.role === "company_admin";
    const isAdmin = user?.role === "admin";

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8 border"
            >
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        {isAdmin ? <Shield className="w-6 h-6 text-blue-600" /> :
                            isCompanyAdmin ? <Building2 className="w-6 h-6 text-blue-600" /> :
                                <User className="w-6 h-6 text-blue-600" />}
                        Account Settings
                    </h1>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2 shadow"
                    >
                        <Save className="w-4 h-4" />
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>

                {/* Profile Photo */}
                <div className="flex items-center gap-6 mb-8">
                    <img
                        src={user?.profilePhoto || "https://via.placeholder.com/80"}
                        alt="Profile"
                        className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                    />
                    <button className="px-3 py-2 border rounded-md flex items-center gap-2">
                        <Camera className="w-4 h-4" />
                        Change Photo
                    </button>
                </div>

                {/* User Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-sm text-gray-600">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={form.name || ""}
                            onChange={handleChange}
                            className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="text-sm text-gray-600">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email || ""}
                            onChange={handleChange}
                            disabled
                            className="w-full border rounded-md p-2 bg-gray-50"
                        />
                    </div>
                    {!isAdmin && (
                        <>
                            <div>
                                <label className="text-sm text-gray-600">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="••••••••"
                                    onChange={handleChange}
                                    className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">Location</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={form.location || ""}
                                    onChange={handleChange}
                                    className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </>
                    )}
                </div>

                {/* Company Info Section */}
                {isCompanyAdmin && company && (
                    <div className="mt-10 border-t pt-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Company Info</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-sm text-gray-600">Company Name</label>
                                <input
                                    type="text"
                                    value={company.name}
                                    onChange={(e) => setCompany({ ...company, name: e.target.value })}
                                    className="w-full border rounded-md p-2"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">Domain</label>
                                <input
                                    type="text"
                                    value={company.domain}
                                    onChange={(e) => setCompany({ ...company, domain: e.target.value })}
                                    className="w-full border rounded-md p-2"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-sm text-gray-600">Description</label>
                                <textarea
                                    value={company.description}
                                    onChange={(e) => setCompany({ ...company, description: e.target.value })}
                                    className="w-full border rounded-md p-2"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Delete Section */}
                {!isAdmin && (
                    <div className="mt-10 border-t pt-6">
                        <h2 className="text-lg font-semibold  mb-3 text-red-600">Danger Zone</h2>
                        <button
                            onClick={handleDelete}
                            className="px-5 py-2 border border-red-500 text-red-600 rounded-md hover:bg-red-50 flex items-center gap-2"
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete My Account
                        </button>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default Settings;
