import React, { useState } from "react";
import API from "../api/api";
import { toast } from "react-hot-toast";

interface Props {
    mode: "self" | "admin";
    onSuccess?: () => void;
}

const CompanyForm: React.FC<Props> = ({ mode, onSuccess }) => {
    const [step, setStep] = useState(1);

    const [form, setForm] = useState({
        name: "",
        domain: "",
        industry: "",
        size: "",
        type: "",
        address: "",
        tagline: "",
        description: "",
        email: "",
        contactNumber: "",
        password: "",
        authorizedSignatoryName: "",
        authorizedSignatoryDesignation: "",
    });

    const [logo, setLogo] = useState<File | null>(null);
    const [signature, setSignature] = useState<File | null>(null);
    const [verificationDocs, setVerificationDocs] = useState<FileList | null>(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleNext = () => setStep((prev) => Math.min(prev + 1, 4));
    const handleBack = () => setStep((prev) => Math.max(prev - 1, 1));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            const formData = new FormData();

            Object.entries(form).forEach(([key, value]) => formData.append(key, value));

            if (logo) formData.append("logo", logo);
            if (signature) formData.append("authorizedSignatory[signature]", signature);
            if (verificationDocs)
                Array.from(verificationDocs).forEach((file) =>
                    formData.append("verificationDocs", file)
                );

            console.log("mode", mode);
            const endpoint =
                mode === "admin" ? "/companies/admin/create" : "/companies/register";


            await API.post(endpoint, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            toast.success("✅ Company registered successfully!");

            if (onSuccess) {
                setTimeout(() => {
                    onSuccess();
                }, 800);
            }

            setForm({
                name: "",
                domain: "",
                industry: "",
                size: "",
                type: "",
                address: "",
                tagline: "",
                description: "",
                email: "",
                password: "",
                contactNumber: "",
                authorizedSignatoryName: "",
                authorizedSignatoryDesignation: "",
            });
            setLogo(null);
            setSignature(null);
            setVerificationDocs(null);
            setStep(1);
        } catch (err: any) {
            toast.error(err.response?.data?.message || "❌ Registration failed");
        } finally {
            setLoading(false);
        }
    };


    // 🟩 Step Progress Indicator
    const steps = ["Basic Info", "Details", "Signatory", "Uploads"];

    return (
        <div className="max-w-3xl mx-auto bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Company Registration
            </h2>
            <p className="text-sm text-gray-600 mb-6">
                Step {step} of 4 — {steps[step - 1]}
            </p>

            {/* Progress Bar */}
            <div className="flex mb-8">
                {steps.map((_, i) => (
                    <div
                        key={i}
                        className={`flex-1 h-2 rounded-full mx-1 transition-all ${i < step ? "bg-green-600" : "bg-gray-200"
                            }`}
                    />
                ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Step 1 — Basic Info */}
                {step === 1 && (
                    <div className="grid gap-4 animate-fadeIn">
                        <div className="grid sm:grid-cols-2 gap-3">
                            <input
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Company Name"
                                required
                                className="border rounded-md px-3 py-2 text-sm"
                            />
                            <input
                                name="domain"
                                value={form.domain}
                                onChange={handleChange}
                                placeholder="Company Domain / Website"
                                required
                                className="border rounded-md px-3 py-2 text-sm"
                            />
                        </div>

                        <div className="grid sm:grid-cols-2 gap-3">
                            <input
                                name="industry"
                                value={form.industry}
                                onChange={handleChange}
                                placeholder="Industry Type"
                                className="border rounded-md px-3 py-2 text-sm"
                            />
                            <input
                                name="size"
                                value={form.size}
                                onChange={handleChange}
                                placeholder="Company Size (e.g., 51–200)"
                                className="border rounded-md px-3 py-2 text-sm"
                            />
                        </div>

                        <input
                            name="type"
                            value={form.type}
                            onChange={handleChange}
                            placeholder="Company Type (Private / Public / Nonprofit)"
                            className="border rounded-md px-3 py-2 text-sm"
                        />
                    </div>
                )}

                {/* Step 2 — Details */}
                {step === 2 && (
                    <div className="grid gap-4 animate-fadeIn">
                        <textarea
                            name="address"
                            value={form.address}
                            onChange={handleChange}
                            placeholder="Registered Office Address"
                            className="border rounded-md px-3 py-2 text-sm"
                        />
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Company Description"
                            className="border rounded-md px-3 py-2 text-sm"
                        />
                        <input
                            name="tagline"
                            value={form.tagline}
                            onChange={handleChange}
                            placeholder="Company Tagline"
                            className="border rounded-md px-3 py-2 text-sm"
                        />
                        <div className="grid sm:grid-cols-2 gap-3">
                            <input
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="Official Business Email"
                                required
                                className="border rounded-md px-3 py-2 text-sm"
                            />
                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Set Company Account Password"
                                required
                                className="border rounded-md px-3 py-2 text-sm"
                            />
                            <input
                                name="contactNumber"
                                value={form.contactNumber}
                                onChange={handleChange}
                                placeholder="Contact Number"
                                className="border rounded-md px-3 py-2 text-sm"
                            />
                        </div>
                    </div>
                )}

                {/* Step 3 — Authorized Signatory */}
                {step === 3 && (
                    <div className="grid gap-4 animate-fadeIn">
                        <h3 className="font-semibold text-gray-800">Authorized Signatory</h3>
                        <div className="grid sm:grid-cols-2 gap-3">
                            <input
                                name="authorizedSignatoryName"
                                value={form.authorizedSignatoryName}
                                onChange={handleChange}
                                placeholder="Name"
                                className="border rounded-md px-3 py-2 text-sm"
                            />
                            <input
                                name="authorizedSignatoryDesignation"
                                value={form.authorizedSignatoryDesignation}
                                onChange={handleChange}
                                placeholder="Designation"
                                className="border rounded-md px-3 py-2 text-sm"
                            />
                        </div>
                        <div>
                            <label className="text-sm text-gray-700">
                                Digital Signature (optional)
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setSignature(e.target.files?.[0] || null)}
                                className="text-sm"
                            />
                        </div>
                    </div>
                )}

                {/* Step 4 — Uploads */}
                {step === 4 && (
                    <div className="grid gap-4 animate-fadeIn">
                        <div className="grid sm:grid-cols-2 gap-3">
                            <div>
                                <label className="text-sm text-gray-700">Company Logo</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setLogo(e.target.files?.[0] || null)}
                                    className="text-sm"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-gray-700">
                                    Verification Documents
                                </label>
                                <input
                                    type="file"
                                    multiple
                                    onChange={(e) => setVerificationDocs(e.target.files)}
                                    className="text-sm"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Buttons */}
                <div className="flex justify-between pt-4">
                    {step > 1 && (
                        <button
                            type="button"
                            onClick={handleBack}
                            className="px-5 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-medium"
                        >
                            Back
                        </button>
                    )}
                    {step < 4 && (
                        <button
                            type="button"
                            onClick={handleNext}
                            className="ml-auto px-5 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white text-sm font-medium"
                        >
                            Next
                        </button>
                    )}
                    {step === 4 && (
                        <button
                            type="submit"
                            disabled={loading}
                            className="ml-auto px-6 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 font-medium disabled:opacity-60"
                        >
                            {loading ? "Submitting..." : "Submit Registration"}
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default CompanyForm;
