import { serverBaseUrl } from "../utils/baseUrl";

//generate otp
export const generateOTP = async (id: string) => {
  try {
    const response = await serverBaseUrl.patch(`/user/generate-otp/${id}`);
    console.log("Generate OTP Service Response:", response.data);
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to generate OTP.");
    }
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error(
      error.message || "Network error or unknown error during OTP generation."
    );
  }
};

//validate otp
export const validateOTP = async (id: string, OTP: string) => {
  try {
    const response = await serverBaseUrl.post(`/user/validate-otp/${id}`, {
      OTP,
    });
    console.log("Validate OTP Service Response:", response.data);
    if (!response.data.success) {
      throw new Error(response.data.message || "Invalid OTP.");
    }
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error(
      error.message || "Network error or unknown error during OTP validation."
    );
  }
};

//generate sign in token
export const generateSignInToken = async (id: string) => {
  try {
    const response = await serverBaseUrl.post(`/user/sign-in-token/${id}`);
    console.log("Generate Sign In Token Service Response:", response.data);
    if (!response.data.success) {
      throw new Error(
        response.data.message || "Failed to generate sign in token."
      );
    }
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error(
      error.message ||
        "Network error or unknown error during sign in token generation."
    );
  }
};
