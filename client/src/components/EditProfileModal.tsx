import React from "react";
import CompanyForm from "./CompanyForm";

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    companyData: any;
    onSuccess: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
    isOpen,
    onClose,
    companyData,
    onSuccess,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Edit Company Details</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ✕
                    </button>
                </div>
                <CompanyForm
                    mode="edit"
                    initialData={companyData}
                    onSuccess={() => {
                        onSuccess();
                        onClose();
                    }}
                />
            </div>
        </div>
    );
};

export default EditProfileModal;