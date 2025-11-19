import React, { useState, useEffect } from "react";
import API from "../api/api";
import toast from "react-hot-toast";
import { Calendar, Users, Eye, Edit, Trash2, Download } from "lucide-react";
import EditFreelancerModal from "../components/EditFreelancerModal";

interface Application {
  _id: string;
  clientName: string;
  contactNumber: string;
  officialEmail: string;
  requirements: string;
  resume: string;
  message: string;
  status: string;
  appliedAt: string;
  user: {
    name: string;
    email: string;
    profilePhoto?: string;
  };
}

interface Freelancer {
  _id: string;
  name: string;
  qualification: string;
  contact: string;
  email: string;
  location: string;
  expiryDate: string;
  services: any[];
  pricing: {
    min: number;
    max: number;
  };
  termsAccepted?: boolean;
}

const FreelancerDashboard: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [freelancer, setFreelancer] = useState<Freelancer | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"applications" | "profile">("applications");
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchFreelancerData();
  }, []);

  const fetchFreelancerData = async () => {
    try {
      // Get current user's freelancer profile
      const freelancerRes = await API.get("/freelancers/me");
      setFreelancer(freelancerRes.data);

      // Get applications for this freelancer
      if (freelancerRes.data) {
        const applicationsRes = await API.get(`/freelancers/${freelancerRes.data._id}/applications`);
        setApplications(applicationsRes.data);
      }
    } catch (err: any) {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (applicationId: string, status: string) => {
    try {
      await API.put(`/freelancers/applications/${applicationId}/status`, { status });
      toast.success("Application status updated");
      fetchFreelancerData();
    } catch (err: any) {
      toast.error("Failed to update status");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'applied': return 'bg-blue-100 text-blue-800';
      case 'reviewed': return 'bg-yellow-100 text-yellow-800';
      case 'shortlisted': return 'bg-green-100 text-green-800';
      case 'hired': return 'bg-purple-100 text-purple-800';
      case 'accepted': return 'bg-cyan-100 text-cyan-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Freelancer Dashboard</h1>
          {freelancer && (
            <div className="flex items-center gap-4 text-gray-600">
              <span className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                {freelancer.name}
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Expires: {formatDate(freelancer.expiryDate)}
              </span>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab("applications")}
                className={`px-6 py-3 text-sm font-medium border-b-2 ${
                  activeTab === "applications"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Applications ({applications.length})
              </button>
              <button
                onClick={() => setActiveTab("profile")}
                className={`px-6 py-3 text-sm font-medium border-b-2 ${
                  activeTab === "profile"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Profile Management
              </button>
            </nav>
          </div>
        </div>

        {/* Applications Tab */}
        {activeTab === "applications" && (
          <div className="space-y-6">
            {applications.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
                <p className="text-gray-500">Applications for your services will appear here.</p>
              </div>
            ) : (
              applications.map((application) => (
                <div key={application._id} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{application.clientName}</h3>
                      <p className="text-gray-600">{application.officialEmail}</p>
                      <p className="text-gray-600">{application.contactNumber}</p>
                      <p className="text-sm text-gray-500 mt-1">Applied on {formatDate(application.appliedAt)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                      </span>
                      <select
                        value={application.status}
                        onChange={(e) => updateApplicationStatus(application._id, e.target.value)}
                        className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                      >
                        <option value="applied">Applied</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="hired">Hired</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Requirements</h4>
                      <p className="text-gray-700 text-sm leading-relaxed">{application.requirements}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Additional Message</h4>
                      <p className="text-gray-700 text-sm">{application.message || "No additional message"}</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <a
                      href={application.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      View Resume
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === "profile" && freelancer && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">Profile Management</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Basic Information</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <p className="text-gray-900">{freelancer.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Qualification</label>
                    <p className="text-gray-900">{freelancer.qualification}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Contact</label>
                    <p className="text-gray-900">{freelancer.contact}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="text-gray-900">{freelancer.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Location</label>
                    <p className="text-gray-900">{freelancer.location}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-3">Service Details</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Pricing Range</label>
                    <p className="text-gray-900">₹{freelancer.pricing.min} - ₹{freelancer.pricing.max}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                    <p className="text-gray-900">{formatDate(freelancer.expiryDate)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Terms Accepted</label>
                    <p className="text-gray-900">{freelancer.termsAccepted ? "Yes" : "No"}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Services Offered</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {freelancer.services.map((service, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          {service.title}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={() => setShowEditModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Edit Profile
              </button>
            </div>
          </div>
        )}

        {showEditModal && freelancer && (
          <EditFreelancerModal
            freelancerId={freelancer._id}
            onClose={() => setShowEditModal(false)}
            onUpdated={fetchFreelancerData}
          />
        )}
      </div>
    </div>
  );
};

export default FreelancerDashboard;