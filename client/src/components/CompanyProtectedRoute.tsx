// src/components/CompanyProtectedRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useCompany } from "../contexts/CompanyContext";

const CompanyProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
    const { token } = useCompany();
    if (!token) return <Navigate to="/company/login" replace />;
    return children;
};

export default CompanyProtectedRoute;
