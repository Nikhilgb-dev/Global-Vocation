import React, { useState } from "react";
import API from "@/api/api";
import { toast } from "react-hot-toast";

interface Props {
    id: string;
    currentStatus: string;
    isAdmin?: boolean;
    onUpdated?: () => void;
}

const statuses = [
    "applied",
    "reviewed",
    "interview",
    "offer",
    "hired",
    "rejected",
];

const ApplicationStatusDropdown: React.FC<Props> = ({
    id,
    currentStatus,
    isAdmin = false,
    onUpdated,
}) => {
    const [status, setStatus] = useState(currentStatus);
    const [loading, setLoading] = useState(false);

    // Sync internal state when parent-provided status changes
    React.useEffect(() => {
        setStatus(currentStatus);
    }, [currentStatus]);

    const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value;
        setStatus(newStatus);
        setLoading(true);
        try {
            const endpoint = isAdmin
                ? `/admin/applications/${id}/status`
                : `/companies/me/applicants/${id}/status`;

            await API.put(endpoint, { status: newStatus });
            toast.success("Status updated");
            onUpdated?.();
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to update");
        } finally {
            setLoading(false);
        }
    };

    return (
        <select
            value={status}
            onChange={handleChange}
            disabled={loading}
            className="border rounded-md text-sm px-2 py-1 focus:ring-blue-500 focus:border-blue-500"
        >
            {statuses.map((s) => (
                <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
            ))}
        </select>
    );
};

export default ApplicationStatusDropdown;
