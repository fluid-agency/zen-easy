import { useState, useCallback, useMemo } from "react";
import { uploadServiceImage } from "../services/imageUploadService"; 
import { serverBaseUrl } from "../utils/baseUrl";
import Cookies from "js-cookie";

type EditServiceFormData = Omit<any, '_id' | 'provider' | 'minimumPrice' | 'maximumPrice' | 'availableDays' | 'availableTime' | 'coverImage' | 'ratings' | 'status' | 'createdAt' | 'updatedAt'> & {
    serviceAreas: { value: string }[]; 
    priceRange: {
        min: number;
        max: number;
    };
    dayOfWeek: string[]; 
    availableTimes: "day" | "night" | "always"; 
    coverImageFile?: FileList; 
    existingCoverImage?: string;
};

export function useEditService() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // Memoize token
    const token = useMemo(() => Cookies.get("zenEasySelfToken"), []);


    const processServiceAreas = useCallback((serviceAreas: { value: string }[]) => {
        return serviceAreas
            .map(item => item.value.trim())
            .filter(area => area.length > 0);
    }, []);

    //handle image upload
    const handleImageUpload = useCallback(async (
        coverImageFile?: FileList, 
        existingCoverImage?: string
    ): Promise<string | undefined> => {
        if (coverImageFile && coverImageFile.length > 0) {
            const file = coverImageFile[0];
            const uploadedUrl = await uploadServiceImage(file);
            if (!uploadedUrl) {
                throw new Error("Failed to upload new cover image.");
            }
            return uploadedUrl;
        }
 
        if (existingCoverImage === '') {
            return undefined;
        }
        
        return existingCoverImage;
    }, []);

    // Reset states helper
    const resetStates = useCallback(() => {
        setError(null);
        setSuccess(false);
    }, []);

    const updateService = useCallback(async (serviceId: string, formData: EditServiceFormData) => {
        // if no token
        if (!token) {
            window.location.href = "/auth/login";
            return;
        }

        setLoading(true);
        resetStates();

        try {
            // Process image upload and service areas
            const [coverImageUrl, finalServiceAreas] = await Promise.all([
                handleImageUpload(formData.coverImageFile, formData.existingCoverImage),
                Promise.resolve(processServiceAreas(formData.serviceAreas))
            ]);

            //  payload 
            const payload = {
                category: formData.category,
                status: formData.status,
                contactNumber: formData.contactNumber,
                addressLine: formData.addressLine,
                serviceArea: finalServiceAreas,
                description: formData.description,
                minimumPrice: formData.priceRange.min,
                maximumPrice: formData.priceRange.max,
                availableDays: formData.dayOfWeek,
                availableTime: formData.availableTimes,
                coverImage: coverImageUrl,
            };

            // Remove undefined values
            const cleanPayload = Object.fromEntries(
                Object.entries(payload).filter(([_, value]) => value !== undefined)
            );

            console.log("Updating service ID:", serviceId, "with data:", cleanPayload);
            
            const response = await serverBaseUrl.patch(
                `/profession/update-profile/${serviceId}`,
                cleanPayload,
                {
                    headers: {
                        Authorization: token,
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            if (response?.data?.success) {
                setSuccess(true);
                console.log('success: true');
            } else {
                throw new Error(response?.data?.message || "Update failed");
            }

        } catch (err: any) {
            console.error("Error updating service:", err);
            const errorMessage = err.response?.data?.message || err.message || "An error occurred while updating the service.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [token, handleImageUpload, processServiceAreas, resetStates]);

    return useMemo(() => ({
        updateService,
        loading,
        error,
        success
    }), [updateService, loading, error, success]);
}