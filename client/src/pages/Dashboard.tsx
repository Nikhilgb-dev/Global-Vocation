import React, { useEffect, useState } from "react";
import API from "../api/api";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [communities, setCommunities] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    API.get("/users/me").then((res) => setUser(res.data)).catch(() => setUser(null));
  }, []);

  useEffect(() => {
    if (user?.role === "admin") {
      API.get("/jobs").then((res) => setJobs(res.data));
      API.get("/communities").then((res) => setCommunities(res.data));
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

  const handleEditJob = (jobId: string) => {
    // Navigate to edit job page
    window.location.href = `/jobs/${jobId}/edit`;
    if (window.confirm("Are you sure you want to edit this job?")) {
      API.put(`/jobs/${jobId}`).then(() => {
        setJobs(jobs.filter((job) => job._id !== jobId));
      });
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Welcome, {user.name}</h2>

      {user.role === "admin" && (
        <>
          {/* Admin Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Link to="/post-job" className="p-4 bg-blue-600 text-white rounded shadow hover:bg-blue-700">
              ➕ Post Job
            </Link>
            <Link to="/communities" className="p-4 bg-green-600 text-white rounded shadow hover:bg-green-700">
              ➕ Create Community
            </Link>
          </div>

          {/* Jobs Table */}
          <h3 className="text-xl font-semibold mb-2">Manage Jobs</h3>
          <div className="overflow-x-auto mb-6">
            <table className="min-w-full border text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border">Title</th>
                  <th className="px-4 py-2 border">Location</th>
                  <th className="px-4 py-2 border">Type</th>
                  <th className="px-4 py-2 border">Status</th>
                  <th className="px-4 py-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job._id}>
                    <td className="px-4 py-2 border">{job.title}</td>
                    <td className="px-4 py-2 border">{job.location}</td>
                    <td className="px-4 py-2 border">{job.employmentType}</td>
                    <td className="px-4 py-2 border">{job.status}</td>
                    <td className="px-4 py-2 border flex gap-2">
                      <button onClick={() => handleEditJob(job._id)} className="px-2 py-1 bg-yellow-500 text-white rounded">Edit</button>
                      <button className="px-2 py-1 bg-red-600 text-white rounded">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Communities Table */}
          <h3 className="text-xl font-semibold mb-2">Manage Communities</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border">Name</th>
                  <th className="px-4 py-2 border">Description</th>
                  <th className="px-4 py-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {communities.map((c) => (
                  <tr key={c._id}>
                    <td className="px-4 py-2 border">{c.name}</td>
                    <td className="px-4 py-2 border">{c.description}</td>
                    <td className="px-4 py-2 border flex gap-2">
                      <button className="px-2 py-1 bg-yellow-500 text-white rounded">Edit</button>
                      <button className="px-2 py-1 bg-red-600 text-white rounded">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
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
