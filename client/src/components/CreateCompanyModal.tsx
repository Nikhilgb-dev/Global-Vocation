import React from "react";
import CompanyForm from "./CompanyForm";

interface Props {
    onClose: () => void;
    onCreated: () => void;
}

export default function CreateCompanyModal({ onClose, onCreated }: Props) {
    return (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                >
                    ✕
                </button>
                <h2 className="text-xl font-semibold mb-4">Add New Company</h2>
                <CompanyForm mode="admin" onSuccess={onCreated} />
            </div>
        </div>
    );
}
