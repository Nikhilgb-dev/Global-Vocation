import Job from "../models/job.model.js";

export const expireOldJobs = async () => {
  const now = new Date();
  const expiredJobs = await Job.updateMany(
    { expiresAt: { $lt: now }, isExpired: false },
    { $set: { isExpired: true, status: "closed" } }
  );

  if (expiredJobs.modifiedCount > 0) {
    console.log(`🕒 ${expiredJobs.modifiedCount} jobs marked as expired`);
  }
};
