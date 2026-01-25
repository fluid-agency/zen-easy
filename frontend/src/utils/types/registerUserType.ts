
export type TUserRegistration = {
  name: string;
  profileImage?: FileList;
  nid?: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
  };
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  dateOfBirth: Date | null;
  gender: "Male" | "Female" | "";
  nationality: string;
  occupation: string;
  socialMedia: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  };
};
