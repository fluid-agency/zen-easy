import { useContext, useState, useCallback, useMemo } from "react";
import { AuthContext } from "../context/AuthContext";
import type { TUserRegistration } from "../utils/types/registerUserType";
import { serverBaseUrl } from "../utils/baseUrl";
import { format } from "date-fns";
import Cookies from "js-cookie";
import { generateSignInToken } from "../services/authServices";

//------------ Image optimization ---------
const compressImage = (file: File, quality: number = 0.7): Promise<File> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onerror = () => {
      reject(new Error("Failed to load image for compression"));
    };

    img.onload = () => {
      try {
        const maxWidth = 800;
        const maxHeight = 600;
        let { width, height } = img;

        //  aspect ratio 
        const aspectRatio = width / height;
        if (width > maxWidth) {
          width = maxWidth;
          height = width / aspectRatio;
        }
        if (height > maxHeight) {
          height = maxHeight;
          width = height * aspectRatio;
        }

        canvas.width = width;
        canvas.height = height;

        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(img.src);
            
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: "image/jpeg",
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          "image/jpeg",
          quality
        );
      } catch (error) {
        URL.revokeObjectURL(img.src);
        reject(error);
      }
    };

    img.src = URL.createObjectURL(file);
  });
};


class RegistrationController {
  private abortController: AbortController;
  
  constructor() {
    this.abortController = new AbortController();
  }

  get signal() {
    return this.abortController.signal;
  }

  abort() {
    this.abortController.abort();
  }

  reset() {
    this.abortController = new AbortController();
  }
}

export function useRegister() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [progress, setProgress] = useState<string>("");

  const controller = useMemo(() => new RegistrationController(), []);

  const authcontext = useContext(AuthContext);

  if (!authcontext) {
    throw new Error("Authentication context is not available.");
  }
  const { EmailPassSignUp } = authcontext;

  const resetStates = useCallback(() => {
    setError(null);
    setSuccess(false);
    setProgress("");
  }, []);

  const formatUserData = useCallback((form: TUserRegistration, email: string) => {
    const { profileImage, ...userDataForBackend } = form;
    
    return {
      ...userDataForBackend,
      dateOfBirth: userDataForBackend.dateOfBirth
        ? format(userDataForBackend.dateOfBirth, "yyyy-MM-dd")
        : null,
      email,
      phoneNumber: userDataForBackend.phoneNumber,
      nid: userDataForBackend.nid,
      gender: userDataForBackend.gender,
      nationality: userDataForBackend.nationality,
      occupation: userDataForBackend.occupation,
      address: {
        street: userDataForBackend.address.street,
        city: userDataForBackend.address.city,
        postalCode: userDataForBackend.address.postalCode,
      },
      socialMedia: userDataForBackend.socialMedia,
      profileImage: null as string | null,
    };
  }, []);

  const handleImageUpload = useCallback(async (profileImageFile: File): Promise<string> => {
    setProgress("Optimizing profile image...");
    const compressedFile = await compressImage(profileImageFile);
    
    if (controller.signal.aborted) {
      throw new Error("Registration cancelled");
    }

    setProgress("Uploading profile image...");
    const imageFormData = new FormData();
    imageFormData.append("profileImage", compressedFile);

    const imageUploadResponse = await serverBaseUrl.post(
      "/image/upload-profile",
      imageFormData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
        timeout: 30000,
        signal: controller.signal,
      }
    );

    if (!imageUploadResponse.data?.success || !imageUploadResponse.data?.data?.url) {
      throw new Error(
        imageUploadResponse.data?.message || "Profile image upload failed"
      );
    }

    return imageUploadResponse.data.data.url;
  }, [controller]);

  const createUserAccount = useCallback(async (userData: any): Promise<any> => {
    const userResponse = await serverBaseUrl.post(
      "/user/create-new",
      userData,
      {
        timeout: 15000,
        signal: controller.signal,
      }
    );

    if (!userResponse?.data?.success) {
      throw new Error(
        userResponse?.data?.message || "Failed to create user account"
      );
    }

    return userResponse.data.data;
  }, [controller]);

  const finalizeRegistration = useCallback(async (userId: string, token: string) => {
    //  cookies 
    const cookieOptions = { 
      expires: 14, 
      secure: window.location.protocol === 'https:',
      sameSite: 'lax' as const
    };
    
    Cookies.set("zenEasySelfToken", token, cookieOptions);
    Cookies.set("zenEasySelfId", userId, cookieOptions);
  }, []);

  const register = useCallback(async (form: TUserRegistration) => {
    // Reset controller 
    controller.reset();
    
    setLoading(true);
    resetStates();
    setProgress("Starting registration...");

    try {
      const { email, password, profileImage } = form;
      const profileImageFile = profileImage && profileImage.length > 0 ? profileImage[0] : null;

      // Validate required fields 
      if (!email || !password) {
        throw new Error("Email and password are required");
      }

      // ------------------ Firebase registration --------------
      setProgress("Creating account...");
      const authResponse = await EmailPassSignUp(email, password);

      if (controller.signal.aborted) {
        throw new Error("Registration cancelled");
      }

      if (!authResponse?.user) {
        throw new Error("Firebase registration failed. No user data received.");
      }

      // ------------ Prepare user data -----------------
      const baseUserData = formatUserData(form, email);
      let finalUserData = baseUserData;

      // ---------------Handle image upload (if exists) --------------
      if (profileImageFile) {
        try {
          const uploadedImageUrl = await handleImageUpload(profileImageFile);
          finalUserData = { ...baseUserData, profileImage: uploadedImageUrl };
        } catch (imageError) {
          console.warn("Image upload failed, continuing without profile image:", imageError);
          // Continue registration even if image upload fails
        }
      }

      if (controller.signal.aborted) {
        throw new Error("Registration cancelled");
      }

      // -------------Create user --------------
      setProgress("Saving your information...");
      const userData = await createUserAccount(finalUserData);

      if (controller.signal.aborted) {
        throw new Error("Registration cancelled");
      }

      // --------------------- Generate token----------------
      setProgress("Finalizing registration...");
      const tokenResponse = await generateSignInToken(userData._id);

      if (!tokenResponse?.data) {
        throw new Error("Failed to generate authentication token");
      }

      // -------------Set cookies--------------
      await finalizeRegistration(userData._id, tokenResponse.data);

      setProgress("Registration completed!");
      setSuccess(true);

    } catch (err: any) {
      console.error("Registration error:", err);

      if (err.name === 'AbortError' || err.message === 'Registration cancelled') {
        return;
      }

      let errorMessage = "An unknown error occurred during registration.";
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
      setProgress("");
    }
  }, [
    controller,
    resetStates,
    formatUserData,
    handleImageUpload,
    createUserAccount,
    finalizeRegistration,
    EmailPassSignUp
  ]);

  // Cleanup function 
  const cancelRegistration = useCallback(() => {
    controller.abort();
    setLoading(false);
    resetStates();
  }, [controller, resetStates]);

  // Memoized return object
  return useMemo(() => ({
    register,
    loading,
    error,
    success,
    progress,
    cancelRegistration
  }), [register, loading, error, success, progress, cancelRegistration]);
}