import { serverBaseUrl } from "../utils/baseUrl";
import type { TProfessionalService } from "../utils/types/profServiceTypes";

/* ---------------- AUTH ---------------- */
export const signInAdmin = async (email: string, password: string) => {
  const response = await serverBaseUrl.post("/admin/login", {
    email,
    password,
  });

  if (!response.data.success) {
    throw new Error(response.data.message || "Failed to login");
  }

  return response.data;
};

/* ---------------- PROFESSIONAL SERVICES ---------------- */
export const getAllProfServices = async (): Promise<TProfessionalService[]> => {
  const res = await serverBaseUrl.get("/admin/all-prof-services");
  return res.data.data;
};

export const updateProfService = async (
  id: string,
  payload: Partial<TProfessionalService>
): Promise<TProfessionalService> => {
  const res = await serverBaseUrl.patch(`/admin/service-profile/${id}`, payload);
  return res.data.data;
};

/* ---------------- USER SERVICES ---------------- */
export const getAllUsers = async () => {
  const res = await serverBaseUrl.get("/admin/users");
  return res.data.data;
};

export const getUserById = async (id: string) => {
  const res = await serverBaseUrl.get(`/user/find-info/${id}`);
  return res.data.data;
};

export const updateUserById = async (id: string, payload: any) => {
  const res = await serverBaseUrl.patch(`/admin/users/update-details/${id}`, payload);
  return res.data.data;
};

export const deleteUserById = async (id: string) => {
  const res = await serverBaseUrl.delete(`/admin/users/${id}`);
  return res.data.data;
};

/* ---------------- RENT SERVICES ---------------- */
export const getAllRents = async () => {
  const res = await serverBaseUrl.get("/admin/rents");
  return res.data.data;
};

export const getRentById = async (id: string) => {
  const res = await serverBaseUrl.get(`/rent/view-details/${id}`);
  return res.data.data;
};

export const updateRentById = async (id: string, payload: any) => {
  const res = await serverBaseUrl.patch(`/rent/update/${id}`, { rentPostData: payload });
  return res.data.data;
};

export const updateRentStatus = async (id: string, status: string) => {
  const res = await serverBaseUrl.patch(`/rent/update-status/${id}`, { rentPostStatus: status });
  return res.data.data;
};

export const deleteRentById = async (id: string) => {
  const res = await serverBaseUrl.delete(`/admin/rents/${id}`);
  return res.data.data;
};