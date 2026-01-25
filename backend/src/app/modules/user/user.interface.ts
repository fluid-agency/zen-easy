export type TUser = {
  name: string;
  profileImage?: string;
  nid?: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
  };
  phoneNumber:string;
  whatsapp?: string;
  email: string;
  dateOfBirth: Date;
  gender: "Male" | "Female";
  nationality: string;
  occupation?: string;
  professionalProfiles?: string[];
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  };
  rentPosts?: string[];
  otp?:string;
  isVerified?:boolean;
  status?:'active' | 'inactive';
};
