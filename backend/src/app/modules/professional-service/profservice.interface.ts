export type TProfessinalService = {
    provider:string;
    category : "Maid" | "Home Shifter" | "Tutor" | "Electrician" | "IT Provider" | "Painter" | "Plumber";
    contactNumber:string;
    addressLine:string;
    serviceArea:string[];
    description:string;
    minimumPrice:number;
    maximumPrice:number;
    availableDays:string[];
    availableTime:"day" | "night" | "always";
    coverImage?:string;
    ratings?:TRating[];
    status?:'active' | 'inactive';
    certificate:string;
    isApproved: 'pending' | 'approved' | 'reject';
}



export type TRating = {
    client:string;
    rating:number;
    feedback:string;
}
