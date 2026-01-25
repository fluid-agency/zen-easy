import { serverBaseUrl } from "../utils/baseUrl";



// profile info
export const getUserProfileDetails = async (id:string) => {
  try {
    const response = await serverBaseUrl.get(
      `/user/find-info/${id}`
    );
    return { success: response?.data?.success, res: response?.data?.data };
  } catch (error) {
    console.log(error);
    return { success: false, res: [] };
  }
};
