import React from "react";
import AddFreelancer from "./AddFreelancer";


const FreelancerRegister: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-6">
            <div className="max-w-5xl w-full bg-white rounded-2xl shadow-xl p-8">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
                    Register as a Freelancer
                </h1>
                <AddFreelancer isPublic /> {/* ✅ Use the same component */}
            </div>
        </div>
    );
};

export default FreelancerRegister;
