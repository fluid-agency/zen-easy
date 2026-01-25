import { serverBaseUrl } from "../utils/baseUrl"; 
// ----------------service cover / image ----------------------------
export const uploadServiceImage = async (file: File): Promise<string | undefined> => {
  const formData = new FormData();
  formData.append("serviceImages", file); 

  try {
    const response = await serverBaseUrl.post(
      "/image/upload-services",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      }
    );

    if (response.data?.success && response.data?.data?.urls && response.data.data.urls.length > 0) {
      return response.data.data.urls[0]; 
    } else {
      console.error("Image upload failed or no URL returned:", response.data?.message || "Unknown error");
      return undefined;
    }
  } catch (error: any) {
    console.error("Error uploading service image:", error.response?.data?.message || error.message);
    return undefined;
  }
};

// -----------------rent / property image -------------------------------
export const uploadPropertyImages = async (files: File[]): Promise<string[] | undefined> => {
    if (files.length === 0) return [];

    const formData = new FormData();
    files.forEach(file => {
        formData.append("propertyImage", file); 
    });

    try {
        const response = await serverBaseUrl.post(
            "/image/upload-properties",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true,
            }
        );

        if (response.data?.success && response.data?.data?.urls) {
            return response.data.data.urls; 
        } else {
            console.error("Property images upload failed or no URLs returned:", response.data?.message || "Unknown error");
            return undefined;
        }
    } catch (error: any) {
        console.error("Error uploading property images:", error.response?.data?.message || error.message);
        return undefined;
    }
};



// -----------------user profile image upload-------------------------------
export const uploadProfileImage = async (file: File): Promise<string | undefined> => {
    const formData = new FormData();
    formData.append("profileImage", file); 

    try {
        const response = await serverBaseUrl.post(
            "/image/upload-profile", 
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true,
            }
        );

        if (response.data?.success && response.data?.data?.url) {
            return response.data.data.url; 
            console.error("Profile image upload failed or no URL returned:", response.data?.message || "Unknown error");
            return undefined;
        }
    } catch (error: any) {
        console.error("Error uploading profile image:", error.response?.data?.message || error.message);
        return undefined;
    }
};