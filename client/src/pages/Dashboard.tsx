import React, { useEffect, useState } from "react";
import API from "../api/api";
import { Link } from "react-router-dom";
import CreateCandidateModal from "../components/CreateCandidateModal";
import EditJobModal from "../components/EditJobModal";
import EditCommunityModal from "../components/EditCommunityModal";

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [communities, setCommunities] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [showCreateCandidateModal, setShowCreateCandidateModal] = useState(false);
  const [showEditJobModal, setShowEditJobModal] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [showEditCommunityModal, setShowEditCommunityModal] = useState(false);
  const [selectedCommunityId, setSelectedCommunityId] = useState<string | null>(null);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    API.get("/users/me").then((res) => setUser(res.data)).catch(() => setUser(null));
  }, []);

  const fetchUsers = () => {
    API.get("/admin/users").then((res) => setUsers(res.data));
  }

  useEffect(() => {
    if (user?.role === "admin") {
      API.get("/jobs").then((res) => setJobs(res.data));
      API.get("/communities").then((res) => setCommunities(res.data));
      fetchUsers();
    } else if (user?.role === "user") {
      API.get("/posts").then((res) => setPosts(res.data));
    }
  }, [user]);

  if (!user) return <p className="p-6">Loading dashboard...</p>;

  const handleDeleteJob = (jobId: string) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      API.delete(`/jobs/${jobId}`).then(() => {
        setJobs(jobs.filter((job) => job._id !== jobId));
      });
    }
  }

  const handleDeleteCommunity = (communityId: string) => {
    if (window.confirm("Are you sure you want to delete this community?")) {
      API.delete(`/communities/${communityId}`).then(() => {
        setCommunities(communities.filter((community) => community._id !== communityId));
      });
    }
  }

  const handleDeleteUser = (userId: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      API.delete(`/admin/users/${userId}`).then(() => {
        setUsers(users.filter((user) => user._id !== userId));
      });
    }
  }

  const handleEditJob = (jobId: string) => {
    setSelectedJobId(jobId);
    setShowEditJobModal(true);
  }

  const handleEditCommunity = (communityId: string) => {
    setSelectedCommunityId(communityId);
    setShowEditCommunityModal(true);
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Welcome, {user.name}</h2>

      {user.role === "admin" && (
        <>
          {/* Admin Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="p-6 bg-white border rounded-lg shadow">
              <h4 className="text-gray-500">Total Jobs</h4>
              <p className="text-3xl font-bold">{jobs.length}</p>
              <Link to="/post-job" className="text-blue-600 hover:underline mt-2 inline-block">Post a new job →</Link>
            </div>
            <div className="p-6 bg-white border rounded-lg shadow">
              <h4 className="text-gray-500">Total Communities</h4>
              <p className="text-3xl font-bold">{communities.length}</p>
              <Link to="/communities" className="text-green-600 hover:underline mt-2 inline-block">Manage communities →</Link>
            </div>
            <div className="p-6 bg-white border rounded-lg shadow">
              <h4 className="text-gray-500">Total Users</h4>
              <p className="text-3xl font-bold">{users.length}</p>
              <button onClick={() => setShowCreateCandidateModal(true)} className="text-purple-600 hover:underline mt-2 inline-block">Create a new user →</button>
            </div>
            <div>
              <Link
                to="/dashboard/applications"
                className={`flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 ${location.pathname === '/dashboard/applications' ? 'bg-gray-100' : ''
                  }`}
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span>Applications</span>
              </Link>
            </div>
          </div>

          {/* Jobs Table */}
          <div className="bg-white border rounded-lg shadow">
            <h3 className="text-xl font-semibold p-4 border-b">Manage Jobs</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {jobs.map((job) => (
                    <tr key={job._id}>
                      <td className="px-6 py-4 whitespace-nowrap">{job.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{job.location}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{job.employmentType}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{job.status}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button onClick={() => handleEditJob(job._id)} className="px-3 py-1 text-xs font-medium text-yellow-600 bg-yellow-100 rounded-full hover:bg-yellow-200">Edit</button>
                        <button onClick={() => handleDeleteJob(job._id)} className="ml-2 px-3 py-1 text-xs font-medium text-red-600 bg-red-100 rounded-full hover:bg-red-200">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Communities Table */}
          <div className="bg-white border rounded-lg shadow mt-6">
            <h3 className="text-xl font-semibold p-4 border-b">Manage Communities</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-right font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {communities.map((c) => (
                    <tr key={c._id}>
                      <td className="px-6 py-4 whitespace-nowrap">{c.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{c.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button className="px-3 py-1 text-xs font-medium text-yellow-600 bg-yellow-100 rounded-full hover:bg-yellow-200">Edit</button>
                        <button onClick={() => handleDeleteCommunity(c._id)} className="ml-2 px-3 py-1 text-xs font-medium text-red-600 bg-red-100 rounded-full hover:bg-red-200">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white border rounded-lg shadow mt-6">
            <h3 className="text-xl font-semibold p-4 border-b">Manage Users</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-right font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td className="px-6 py-4 whitespace-nowrap">{u.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{u.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{u.role}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button className="px-3 py-1 text-xs font-medium text-yellow-600 bg-yellow-100 rounded-full hover:bg-yellow-200">Edit</button>
                        <button onClick={() => handleDeleteUser(u._id)} className="ml-2 px-3 py-1 text-xs font-medium text-red-600 bg-red-100 rounded-full hover:bg-red-200">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {showCreateCandidateModal && (
        <CreateCandidateModal
          onClose={() => setShowCreateCandidateModal(false)}
          onCandidateCreated={fetchUsers}
        />
      )}

      {showEditJobModal && selectedJobId && (
        <EditJobModal
          jobId={selectedJobId}
          onClose={() => setShowEditJobModal(false)}
          onJobUpdated={() => {
            setShowEditJobModal(false);
            API.get("/jobs").then((res) => setJobs(res.data));
          }}
        />
      )}

      {/* 
      {user.role === "user" && (
        <>
          <h3 className="text-xl font-semibold mb-4">Community Posts</h3>
          {posts.map((post) => (
            <div key={post._id} className="border p-4 mb-4 rounded">
              <h4 className="font-bold">{post.author?.name}</h4>
              <p>{post.text}</p>
              <div className="flex gap-4 mt-2">
                <button onClick={() => API.post(`/posts/${post._id}/like`).then(() => API.get("/posts").then((res) => setPosts(res.data)))} className="text-blue-500">
                  👍 {post.likes?.length || 0}
                </button>
                <button onClick={() => API.post(`/posts/${post._id}/share`, { text: "Check this!" }).then(() => API.get("/posts").then((res) => setPosts(res.data)))} className="text-green-500">
                  🔄 {post.shares?.length || 0}
                </button>
              </div>
            </div>
          ))}
        </>
      )} */}
    </div>
  );
};

export default Dashboard;
