import API from "./api";

export type JobPayload = {
  title: string;
  description?: string;
  location?: string;
  employmentType?: string;
  salaryRange?: string;
  responsibilities?: string;
  qualifications?: string;
  status?: "open" | "closed";
};

export const fetchCompanyJobs = (page = 1, limit = 20, q?: string) =>
  API.get("/companies/me/jobs", { params: { page, limit, q } });

export const createCompanyJob = (payload: JobPayload) =>
  API.post("/companies/me/jobs", payload);

export const updateCompanyJob = (id: string, payload: Partial<JobPayload>) =>
  API.put(`/companies/me/jobs/${id}`, payload);

export const deleteCompanyJob = (id: string) =>
  API.delete(`/companies/me/jobs/${id}`);
