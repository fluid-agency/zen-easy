import { serverBaseUrl } from "../utils/baseUrl";
import type { TProfessionalService } from "../utils/types/profServiceTypes";

const getAdminToken = () => {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith("admin_token="))
    ?.split("=")[1];
};

const getAuthHeader = () => {
  const token = getAdminToken();
  return {
    Authorization: `${token}`,
    "Content-Type": "application/json",
  };
};

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
  const res = await serverBaseUrl.get("/admin/all-prof-services", {
    headers: getAuthHeader(),
  });
  return res.data.data;
};

export const updateProfService = async (
  id: string,
  payload: Partial<TProfessionalService>
): Promise<TProfessionalService> => {
  const res = await serverBaseUrl.patch(
    `/admin/service-profile/${id}`,
    payload,
    {
      headers: getAuthHeader(),
    }
  );
  return res.data.data;
};


export const deleteProfService = async (
  id: string
) => {
  const res = await serverBaseUrl.delete(`/admin/service-profile/${id}`, {
    headers: getAuthHeader(),
  });
  return res.data.data;
}

/* ---------------- USER SERVICES ---------------- */
export const getAllUsers = async () => {
  const res = await serverBaseUrl.get("/admin/users", {
    headers: getAuthHeader(),
  });
  return res.data.data;
};

export const getUserById = async (id: string) => {
  const res = await serverBaseUrl.get(`/user/find-info/${id}`, {
    headers: getAuthHeader(),
  });
  return res.data.data;
};

export const updateUserById = async (id: string, payload: any) => {
  const res = await serverBaseUrl.patch(
    `/admin/users/update-details/${id}`,
    payload,
    {
      headers: getAuthHeader(),
    }
  );
  return res.data.data;
};

export const deleteUserById = async (id: string) => {
  const res = await serverBaseUrl.delete(`/admin/users/${id}`, {
    headers: getAuthHeader(),
  });
  return res.data.data;
};

/* ---------------- RENT SERVICES ---------------- */
export const getAllRents = async () => {
  const res = await serverBaseUrl.get("/admin/rents", {
    headers: getAuthHeader(),
  });
  return res.data.data;
};

export const getRentById = async (id: string) => {
  const res = await serverBaseUrl.get(`/rent/view-details/${id}`, {
    headers: getAuthHeader(),
  });
  return res.data.data;
};

export const updateRentById = async (id: string, payload: any) => {
  const res = await serverBaseUrl.patch(
    `/rent/update/${id}`,
    { rentPostData: payload },
    {
      headers: getAuthHeader(),
    }
  );
  return res.data.data;
};

export const updateRentStatus = async (id: string, status: string) => {
  const res = await serverBaseUrl.patch(
    `/rent/update-status/${id}`,
    { rentPostStatus: status },
    {
      headers: getAuthHeader(),
    }
  );
  return res.data.data;
};

export const deleteRentById = async (id: string) => {
  const res = await serverBaseUrl.delete(`/admin/rents/${id}`, {
    headers: getAuthHeader(),
  });
  return res.data.data;
};