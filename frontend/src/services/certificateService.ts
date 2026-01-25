
import { serverBaseUrl } from "../utils/baseUrl";

export const uploadCertificate = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("certificate", file);

  const res = await serverBaseUrl.post(
    "/image/upload-certificate",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );

  return res.data.data.url;
};
