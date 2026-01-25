import { useState } from "react";
import { uploadProfileImage,  } from "../services/imageUploadService";
import { serverBaseUrl } from "../utils/baseUrl";
import Cookies from "js-cookie";

type UpdateProfileFormData = Omit<any, 'profileImage' | 'address' | 'socialMedia' | 'professionalProfiles' | 'isVerified' | 'status' | 'createdAt' | 'updatedAt' | '_id'> & {
    profileImageFile?: FileList; 
    address: { 
        street: string;
        city: string;
        postalCode: string;
    };
    socialMedia: { 
        facebook?: string;
        instagram?: string;
        linkedin?: string;
    };
};

export function useUpdateProfile() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const token = Cookies.get("zenEasySelfToken");
    if(!token){
        window.location.href = "/auth/login";
    }

    const updateProfile = async (userId: string, formData: UpdateProfileFormData) => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            let uploadedProfileImageUrl: string | undefined = undefined;

            //------------------ profile image upload ----------------
            if (formData.profileImageFile && formData.profileImageFile.length > 0) {
                const file = formData.profileImageFile[0];
                uploadedProfileImageUrl = await uploadProfileImage(file);
                if (!uploadedProfileImageUrl) {
                    throw new Error(".");
                }
            }

            // ------------------ - - payload for backend ---------------- 
            const payload: Partial<any> = {
                name: formData.name,
                phoneNumber: formData.phoneNumber,
                email: formData.email, 
                dateOfBirth: formData.dateOfBirth,
                gender: formData.gender,
                nationality: formData.nationality,
                occupation: formData.occupation,
                address: {
                    street: formData.address.street,
                    city: formData.address.city,
                    postalCode: formData.address.postalCode,
                },
                socialMedia: {
                    facebook: formData.socialMedia.facebook,
                    instagram: formData.socialMedia.instagram,
                    linkedin: formData.socialMedia.linkedin,
                },

                ...(uploadedProfileImageUrl && { profileImage: uploadedProfileImageUrl }),
            };

            // ---------------- update request to backend-------------------
            const res = await serverBaseUrl.patch(`/user/update-details/${userId}`, 
                payload,
                {
                    headers: {
                        Authorization: `${token}`,
                    },
                }
            );
            if(res?.data?.success){
                setSuccess(true);
            }
        } catch (err: any) {
            console.error("Error updating profile:", err);
            setError(err.message || "An error occurred while updating profile.");
        } finally {
            setLoading(false);
        }
    };

    return { updateProfile, loading, error, success };
}