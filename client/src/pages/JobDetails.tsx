import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/api";

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState<any>(null);

  useEffect(() => {
    API.get(`/jobs/${id}`).then((res) => setJob(res.data));
  }, [id]);

  if (!job) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">{job.title}</h2>
      <p>{job.description}</p>
      <p className="text-sm text-gray-500">{job.location} — {job.salary}</p>
    </div>
  );
};

export default JobDetails;
