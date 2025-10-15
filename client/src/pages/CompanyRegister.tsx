import CompanyForm from "../components/CompanyForm";

export default function CompanyRegister() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 py-10">
            <div className="container-xl max-w-3xl mx-auto">
                <CompanyForm mode="self" />
            </div>
        </div>
    );
}
