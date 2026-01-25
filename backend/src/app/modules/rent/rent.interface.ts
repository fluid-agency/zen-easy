export type TRent = {
    category : "bachelor room"| "family room" | "flat" | "store" | "office" | "shopping mall";
    rentStartDate : Date;
    imageUrls?:string[];
    rentPaymentFrequency: "daily"| "monthly" | "quarterly" | "annualy";
    details:string;
    cost:number;
    addressLine:string;
    city:string;
    postalCode:number;
    contactInfo:string;
    status?:"Active" | "Booked";
    user:Object;
}