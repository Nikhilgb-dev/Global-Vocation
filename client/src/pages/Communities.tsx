import React, { useEffect, useState } from "react";
import API from "../api/api";
import { Link } from "react-router-dom";

const Communities = () => {
    const [communities, setCommunities] = useState<any[]>([]);
    const [form, setForm] = useState({ name: "", description: "" });

    // Fetch all communities
    const fetchCommunities = async () => {
        const { data } = await API.get("/communities");
        setCommunities(data);
    };

    useEffect(() => {
        fetchCommunities();
    }, []);

    // Create community
    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await API.post("/communities", form);
            setForm({ name: "", description: "" });
            fetchCommunities();
        } catch (err: any) {
            alert(err.response?.data?.message || "Failed to create community");
        }
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h2 className="text-2xl mb-4">Communities</h2>

            {/* Create Form */}
            <form onSubmit={handleCreate} className="mb-6">
                <input
                    className="w-full border p-2 mb-2"
                    placeholder="Community name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <textarea
                    className="w-full border p-2 mb-2"
                    placeholder="Description"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
                <button className="bg-blue-600 text-white w-full p-2">Create Community</button>
            </form>

            {/* List Communities */}
            {communities.map((c) => (
                <div key={c._id} className="border p-4 mb-2 rounded">
                    <h3 className="font-bold">{c.name}</h3>
                    <p>{c.description}</p>
                    <Link to={`/communities/${c._id}`} className="text-blue-600 underline">
                        View Details
                    </Link>
                </div>
            ))}
        </div>
    );
};

export default Communities;
