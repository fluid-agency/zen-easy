import { useEffect, useState, useContext } from "react";
import { useForm, Controller } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import {useNavigate, Navigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Cookies from "js-cookie";

import { useUpdateProfile } from "../../hooks/useUpdateProfile";
import { getUserProfileDetails } from "../../services/userProfileServices";
import { AuthContext } from "../../context/AuthContext";
import { useNotification } from "../../context/notification/NotificationContext";

import "./EditProfile.scss";
import ProfileSkeleton from "../../components/ui/skeletons/general-profile/ProfileSkeleton";

export type TUserAddress = {
  street: string;
  city: string;
  postalCode: string;
  _id: string;
};

export type TUserSocialMedia = {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
};

export type TUserProfile = {
  _id: string;
  name: string;
  profileImage?: string;
  nid?: string;
  address: TUserAddress;
  phoneNumber: string;
  email: string;
  dateOfBirth: string;
  gender: "Male" | "Female";
  nationality: string;
  occupation?: string;
  professionalProfiles: string[];
  socialMedia?: TUserSocialMedia;
  isVerified: boolean;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
};

// Form data type for React Hook Form
type EditProfileFormData = Omit<
  TUserProfile,
  | "_id"
  | "profileImage"
  | "professionalProfiles"
  | "isVerified"
  | "status"
  | "createdAt"
  | "updatedAt"
> & {
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

const EditProfile = () => {
  const navigate = useNavigate();
  const selfId = Cookies.get("zenEasySelfId");
  const authContext = useContext(AuthContext);
  const { showSuccess, showError } = useNotification();

  const [initialProfileData, setInitialProfileData] =
    useState<TUserProfile | null>(null);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [errorInitial, setErrorInitial] = useState<string | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(
    null
  );

  const {
    updateProfile,
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = useUpdateProfile();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EditProfileFormData>({
    defaultValues: {
      address: { street: "", city: "", postalCode: "" },
      socialMedia: { facebook: "", instagram: "", linkedin: "" },
      gender: undefined,
      dateOfBirth: null as any,
    },
  });

  const watchedProfileImageFile = watch("profileImageFile");

  // ----------fetch current profile data ----------
  useEffect(() => {
    const fetchCurrentProfile = async () => {
      setLoadingInitial(true);
      setErrorInitial(null);
      try {
        const result = await getUserProfileDetails(selfId as string);
        console.log(result);
        if (result?.success && result.res) {
          console.log(result?.res);
          const profileData = result.res as TUserProfile;
          setInitialProfileData(profileData);

          // Pre-populate form fields
          Object.keys(profileData).forEach((key) => {
            const typedKey = key as keyof TUserProfile;
            if (typedKey === "address" && profileData.address) {
              setValue("address.street", profileData.address.street || "");
              setValue("address.city", profileData.address.city || "");
              setValue(
                "address.postalCode",
                profileData.address.postalCode || ""
              );
            } else if (typedKey === "socialMedia" && profileData.socialMedia) {
              setValue(
                "socialMedia.facebook",
                profileData.socialMedia.facebook || ""
              );
              setValue(
                "socialMedia.instagram",
                profileData.socialMedia.instagram || ""
              );
              setValue(
                "socialMedia.linkedin",
                profileData.socialMedia.linkedin || ""
              );
            } else if (typedKey === "dateOfBirth" && profileData.dateOfBirth) {
              setValue("dateOfBirth", new Date(profileData.dateOfBirth) as any);
            } else if (
              typedKey !== "profileImage" &&
              typedKey !== "professionalProfiles" &&
              typedKey !== "_id"
            ) {
              const value = profileData[typedKey];
              if (
                typeof value === "string" ||
                (typeof value === "object" && value !== null)
              ) {
                setValue(
                  typedKey as keyof EditProfileFormData,
                  value as any
                );
              }
            }
          });

          if (profileData.profileImage) {
            setProfileImagePreview(profileData.profileImage);
          }
        } else {
          setErrorInitial(
            typeof result?.res === "string"
              ? result.res
              : "Failed to load profile for editing."
          );
        }
      } catch (err: any) {
        console.error("Error fetching profile for edit:", err);
        setErrorInitial(err.message || "An unexpected error occurred.");
      } finally {
        setLoadingInitial(false);
      }
    };

    if (selfId) {
      fetchCurrentProfile();
    }
  }, [selfId, setValue]);

// ------------- image upload , preview handle ---------------
  useEffect(() => {
    if (watchedProfileImageFile && watchedProfileImageFile.length > 0) {
      const file = watchedProfileImageFile[0];
      if (file) {
        setProfileImagePreview(URL.createObjectURL(file));
      }
    } else if (initialProfileData && !initialProfileData.profileImage) {
      setProfileImagePreview(null);
    }
    return () => {
      if (profileImagePreview && profileImagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(profileImagePreview);
      }
    };
  }, [watchedProfileImageFile, initialProfileData]);

  useEffect(() => {
    if (successUpdate) {
      showSuccess("Profile updated successfully!" , 1000);
       navigate(`/main/profile/${selfId}`);
    }
    if (errorUpdate) {
      showError(errorUpdate);
    }
  }, [successUpdate, errorUpdate, navigate, selfId, showSuccess, showError]);


// ------------- form submission handler ---------------
  const onSubmit: SubmitHandler<EditProfileFormData> = async (data) => {
    if (!selfId) {
      showError("User ID is missing for update.");
      return;
    }
    await updateProfile(selfId, data);
  };

  if (!authContext) {
    return <Navigate to={"/auth/login"} />;
  }
  if (loadingInitial) {
    return <ProfileSkeleton />;
  }
  if (errorInitial) {
    return (
      <div className="edit-profile-container error-state">
        <p>Error: {errorInitial}</p>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }
  if (!initialProfileData) {
    return (
      <div className="edit-profile-container no-data-state">
        <p>Profile data not found for editing.</p>
      </div>
    );
  }

// ----------------------main edit container ----------------------
  return (
    <div className="edit-profile-container">
      <div className="edit-profile-header">
        <h1>Edit Your Profile</h1>
        <p>Update your personal details</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="edit-profile-form">
        <div className="form-grid">
          {/* Profile Image */}
          <div className="form-group full-width profile-image-upload">
            <label htmlFor="profileImageFile">Profile Image</label>
            <input
              id="profileImageFile"
              type="file"
              accept="image/*"
              {...register("profileImageFile")}
            />
            {profileImagePreview && (
              <div className="profile-image-preview">
                <img src={profileImagePreview} alt="Profile Preview" />
              </div>
            )}
            {errors.profileImageFile && (
              <span className="error-message">
                {errors.profileImageFile.message}
              </span>
            )}
          </div>

          {/* Name */}
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              {...register("name", { required: "Full name is required" })}
              className={errors.name ? "error" : ""}
            />
            {errors.name && (
              <span className="error-message">{errors.name.message}</span>
            )}
          </div>
          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              {...register("email", { required: "Email is required" })}
              readOnly
              className={errors.email ? "error" : ""}
            />
            {errors.email && (
              <span className="error-message">{errors.email.message}</span>
            )}
          </div>

          {/* Phone Number */}
          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              id="phoneNumber"
              type="tel"
              {...register("phoneNumber", {
                required: "Phone number is required",
              })}
              className={errors.phoneNumber ? "error" : ""}
            />
            {errors.phoneNumber && (
              <span className="error-message">
                {errors.phoneNumber.message}
              </span>
            )}
          </div>

          {/* Date of Birth */}
          <div className="form-group">
            <label htmlFor="dateOfBirth">Date of Birth</label>
            <Controller
              control={control}
              name="dateOfBirth"
              rules={{ required: "Date of Birth is required" }}
              render={({ field }) => (
                <DatePicker
                  id="dateOfBirth"
                  placeholderText="Select your Date of Birth"
                  maxDate={new Date()}
                  onChange={(date) => field.onChange(date)}
                  selected={field.value ? new Date(field.value) : null}
                  dateFormat="dd/MM/yyyy"
                  className={`date-picker-input ${
                    errors.dateOfBirth ? "error" : ""
                  }`}
                  peekNextMonth
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                />
              )}
            />
            {errors.dateOfBirth && (
              <span className="error-message">
                {errors.dateOfBirth.message}
              </span>
            )}
          </div>

          {/* Gender */}
          <div className="form-group">
            <label htmlFor="gender">Gender</label>
            <select
              id="gender"
              {...register("gender", { required: "Gender is required" })}
              className={errors.gender ? "error" : ""}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            {errors.gender && (
              <span className="error-message">{errors.gender.message}</span>
            )}
          </div>

          {/* Nationality */}
          <div className="form-group">
            <label htmlFor="nationality">Nationality</label>
            <input
              id="nationality"
              type="text"
              {...register("nationality", {
                required: "Nationality is required",
              })}
              className={errors.nationality ? "error" : ""}
            />
            {errors.nationality && (
              <span className="error-message">
                {errors.nationality.message}
              </span>
            )}
          </div>

          {/* Occupation */}
          <div className="form-group">
            <label htmlFor="occupation">Occupation</label>
            <input
              id="occupation"
              type="text"
              {...register("occupation")}
              placeholder="e.g., Engineer, Electrician..."
              className={errors.occupation ? "error" : ""}
            />
            {errors.occupation && (
              <span className="error-message">{errors.occupation.message}</span>
            )}
          </div>

          {/* NID */}
          <div className="form-group">
            <label htmlFor="nid">NID (Optional)</label>
            <input
              id="nid"
              type="text"
              {...register("nid")}
              placeholder="e.g., XXXXXXXXXXXX"
              className={errors.nid ? "error" : ""}
            />
            {errors.nid && (
              <span className="error-message">{errors.nid.message}</span>
            )}
          </div>

          {/* Address Fields */}
          <div className="form-group full-width">
            <h3>Address Details</h3>
          </div>
          <div className="form-group">
            <label htmlFor="street">Street Address</label>
            <input
              id="street"
              type="text"
              {...register("address.street", {
                required: "Street is required",
              })}
              className={errors.address?.street ? "error" : ""}
            />
            {errors.address?.street && (
              <span className="error-message">
                {errors.address.street.message}
              </span>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="city">City</label>
            <input
              id="city"
              type="text"
              {...register("address.city", { required: "City is required" })}
              className={errors.address?.city ? "error" : ""}
            />
            {errors.address?.city && (
              <span className="error-message">
                {errors.address.city.message}
              </span>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="postalCode">Postal Code</label>
            <input
              id="postalCode"
              type="text"
              {...register("address.postalCode", {
                required: "Postal code is required",
              })}
              className={errors.address?.postalCode ? "error" : ""}
            />
            {errors.address?.postalCode && (
              <span className="error-message">
                {errors.address.postalCode.message}
              </span>
            )}
          </div>

          {/* Social Media Links */}
          <div className="form-group full-width">
            <h3>Social Media (Optional)</h3>
          </div>
          <div className="form-group">
            <label htmlFor="facebook">Facebook URL</label>
            <input
              id="facebook"
              type="text"
              {...register("socialMedia.facebook")}
              placeholder="https://facebook.com/yourprofile"
            />
          </div>
          <div className="form-group">
            <label htmlFor="instagram">Instagram URL</label>
            <input
              id="instagram"
              type="text"
              {...register("socialMedia.instagram")}
              placeholder="https://instagram.com/yourprofile"
            />
          </div>
          <div className="form-group">
            <label htmlFor="linkedin">LinkedIn URL</label>
            <input
              id="linkedin"
              type="text"
              {...register("socialMedia.linkedin")}
              placeholder="https://linkedin.com/in/yourprofile"
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            disabled={loadingUpdate}
            className="submit-btn btn-primary"
          >
            {loadingUpdate ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
