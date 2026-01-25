import { useState } from "react";
import { serverBaseUrl } from "../utils/baseUrl"; 
import { uploadPropertyImages } from "../services/imageUploadService";
import { useNotification } from "../context/notification/NotificationContext";


type AddRentFormInput = {
  user: string | undefined; 
  category: string;
  cost: string; 
  rentPaymentFrequency: string;
  rentStartDate: string;
  contactInfo: string;
  addressLine: string;
  city: string;
  postalCode: string;
  details: string;
  selectedImages: File[]; 
};

export function useAddRent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const {showError } = useNotification();

  const addRentProperty = async (formData: AddRentFormInput) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const filteredImages = formData.selectedImages.filter(Boolean);
      if (filteredImages.length === 0) {
        throw new Error("At least one property image is required.");
      }

      //-------------- Upload property images ------------------
      const imageUrls = await uploadPropertyImages(filteredImages);
      if (!imageUrls || imageUrls.length === 0) {
        throw new Error("Failed to upload property images.");
      }

      //-----final data -------
      const finalPropertyData = {
        ...formData,
        cost: parseFloat(formData.cost), 
        imageUrls: imageUrls, 
      };

      delete (finalPropertyData as any).selectedImages;

      // ---------- final data post ------------------------
      console.log("Sending final property data to backend:", finalPropertyData);
      await serverBaseUrl.post('/rent/create' , finalPropertyData);
      setSuccess(true);
    } catch (err: any) {
      console.error("Error in useAddRent:", err);
      setError(err.message || "An error occurred while posting the ad.");
      showError(err.message || "Failed to post property ad. Please try again." , 1000); 
    } finally {
      setLoading(false);
    }
  };

  return { addRentProperty, loading, error, success };
}