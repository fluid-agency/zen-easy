import { useState } from "react";
import Cookies from "js-cookie";
import { serverBaseUrl } from "../utils/baseUrl"; 


import { uploadServiceImage } from "../services/imageUploadService";


export function useOfferService() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const selfId = Cookies.get("zenEasySelfId");

  const offerService = async (id:string , formData : any) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (!selfId) {
      setError("User not authenticated. Please log in.");
      setLoading(false);
      return;
    }

    try {
      let coverImageUrl: string | undefined;

      // ------------------cover image ------------------
      if (formData.coverImageFile && formData.coverImageFile.length > 0) {
        const file = formData.coverImageFile[0];
        coverImageUrl = await uploadServiceImage(file);
        if (!coverImageUrl) {
          throw new Error("Failed to upload cover image.");
        }
      }

      //service areas from dynamic fields
      const finalServiceAreas = formData.serviceAreas
        .map((item:any) => item.value.trim())
        .filter((area:any) => area.length > 0);

      //  final data object 
      const finalServiceData = {
        provider: selfId,
        category: formData.category,
        contactNumber: formData.contactNumber,
        addressLine: formData.addressLine,
        serviceArea: finalServiceAreas,
        description: formData.description,
        minimumPrice: formData.priceRange.min,
        maximumPrice: formData.priceRange.max,
        availableDays: formData.dayOfWeek,
        availableTime: formData.availableTimes,
        coverImage: coverImageUrl,
        status: 'active', 
        ratings: [], 
        certificate:formData.certificate,
      };

     //------------------ data post -----------------------
      // Example: await serverBaseUrl.post("/professional-service/create", finalServiceData);
      console.log("Sending final service data to backend:", finalServiceData);
      await serverBaseUrl.post(`/profession/create-profile/${id}` , finalServiceData);
      setSuccess(true);
    } catch (err: any) {
      console.error("Error in useOfferService:", err);
      setError(err.message || "An error occurred while publishing the service.");
    } finally {
      setLoading(false);
    }
  };

  return { offerService, loading, error, success };
}