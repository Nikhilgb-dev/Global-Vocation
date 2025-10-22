import React, { useState } from "react";
import API from "../api/api";
import toast from "react-hot-toast";

interface Service {
    title: string;
    description: string;
    link: string;
    achievements: string[];
    otherDetails: string;
}

const AddFreelancer: React.FC<{ onAdded?: () => void }> = ({ onAdded }) => {
    const [name, setName] = useState("");
    const [qualification, setQualification] = useState("");
    const [contact, setContact] = useState("");
    const [email, setEmail] = useState("");
    const [location, setLocation] = useState("");
    const [preferences, setPreferences] = useState<string[]>([]);
    const [descriptionOfWork, setDescriptionOfWork] = useState("");
    const [aboutFreelancer, setAboutFreelancer] = useState("");
    const [photo, setPhoto] = useState<File | null>(null);
    const [services, setServices] = useState<Service[]>([
        { title: "", description: "", link: "", achievements: [""], otherDetails: "" },
    ]);
    const [pricing, setPricing] = useState({ min: "", max: "" });
    const [loading, setLoading] = useState(false);

    const preferenceOptions = ["Remote", "On-site", "Contract", "Agreement", "MOU"];

    const togglePreference = (pref: string) => {
        setPreferences((prev) =>
            prev.includes(pref) ? prev.filter((p) => p !== pref) : [...prev, pref]
        );
    };

    const handleServiceChange = (index: number, field: keyof Service, value: any) => {
        const updated = [...services];
        (updated[index] as any)[field] = value;
        setServices(updated);
    };

    const addService = () => {
        setServices([...services, { title: "", description: "", link: "", achievements: [""], otherDetails: "" }]);
    };

    const removeService = (index: number) => {
        setServices(services.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !qualification || !email || !descriptionOfWork) {
            toast.error("Please fill all required fields");
            return;
        }

        // if (descriptionOfWork.length < 10 || descriptionOfWork.length > 25) {
        //     toast.error("Description of work must be between 100-250 words");
        //     return;
        // }

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("qualification", qualification);
            formData.append("contact", contact);
            formData.append("email", email);
            formData.append("location", location);
            formData.append("preferences", JSON.stringify(preferences));
            formData.append("descriptionOfWork", descriptionOfWork);
            formData.append("aboutFreelancer", aboutFreelancer);
            formData.append("pricing", JSON.stringify(pricing));
            formData.append("services", JSON.stringify(services));
            if (photo) formData.append("photo", photo);

            await API.post("/freelancers", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            toast.success("Freelancer added successfully!");
            onAdded?.();
            setName("");
            setQualification("");
            setContact("");
            setEmail("");
            setLocation("");
            setPreferences([]);
            setDescriptionOfWork("");
            setAboutFreelancer("");
            setPhoto(null);
            setServices([{ title: "", description: "", link: "", achievements: [""], otherDetails: "" }]);
            setPricing({ min: "", max: "" });
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to add freelancer");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white shadow-md rounded-2xl p-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Add Freelancer</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="input" />
                    <input type="text" value={qualification} onChange={(e) => setQualification(e.target.value)} placeholder="Qualification" className="input" />
                    <input type="text" value={contact} onChange={(e) => setContact(e.target.value)} placeholder="Contact" className="input" />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="input" />
                    <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" className="input" />
                </div>

                <div>
                    <label className="font-semibold block mb-2 text-gray-700">Preferences</label>
                    <div className="flex flex-wrap gap-3">
                        {preferenceOptions.map((pref) => (
                            <label key={pref} className={`px-3 py-1 border rounded-lg cursor-pointer ${preferences.includes(pref) ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}>
                                <input
                                    type="checkbox"
                                    checked={preferences.includes(pref)}
                                    onChange={() => togglePreference(pref)}
                                    className="hidden"
                                />
                                {pref}
                            </label>
                        ))}
                    </div>
                </div>

                <textarea
                    value={descriptionOfWork}
                    onChange={(e) => setDescriptionOfWork(e.target.value)}
                    placeholder="Description of your work (100-250 words)"
                    className="textarea"
                    rows={4}
                />

                <textarea
                    value={aboutFreelancer}
                    onChange={(e) => setAboutFreelancer(e.target.value)}
                    placeholder="About Freelancer"
                    className="textarea"
                    rows={3}
                />

                <div>
                    <label className="block mb-2 font-semibold text-gray-700">Upload Photo</label>
                    <input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files?.[0] || null)} />
                </div>

                <div>
                    <label className="block font-semibold text-gray-700 mb-3">Services & Add-ons</label>
                    {services.map((service, idx) => (
                        <div key={idx} className="border p-4 rounded-lg bg-gray-50 mb-3 space-y-2">
                            <input type="text" value={service.title} onChange={(e) => handleServiceChange(idx, "title", e.target.value)} placeholder="Service Title" className="input" />
                            <textarea value={service.description} onChange={(e) => handleServiceChange(idx, "description", e.target.value)} placeholder="Service Description" className="textarea" rows={3} />
                            <input type="text" value={service.link} onChange={(e) => handleServiceChange(idx, "link", e.target.value)} placeholder="Service Link" className="input" />
                            <textarea value={service.otherDetails} onChange={(e) => handleServiceChange(idx, "otherDetails", e.target.value)} placeholder="Other Details" className="textarea" rows={2} />
                            <button type="button" onClick={() => removeService(idx)} className="text-red-600 text-sm hover:underline">
                                Remove Service
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={addService} className="text-blue-600 hover:underline text-sm font-medium">
                        + Add Service
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    Min-Price
                    <input type="number" placeholder="Starting Price" value={pricing.min} onChange={(e) => setPricing({ ...pricing, min: e.target.value })} className="input" />
                    Max-Price
                    <input type="number" placeholder="Max Price" value={pricing.max} onChange={(e) => setPricing({ ...pricing, max: e.target.value })} className="input" />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-md"
                >
                    {loading ? "Submitting..." : "Submit Freelancer"}
                </button>
            </form>
        </div>
    );
};

export default AddFreelancer;
