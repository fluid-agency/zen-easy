import { useForm, type SubmitHandler, useFieldArray } from "react-hook-form";
import "./OfferService.scss";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { getUsersProfessionalInfo } from "../../services/professionalServices";
import { useOfferService } from "../../hooks/useOfferService";
import { useNotification } from "../../context/notification/NotificationContext";
import { uploadCertificate } from "../../services/certificateService";

// ---------------type -------------
export type TProfessinalService = {
  provider: string;
  category: TServiceCategory;
  contactNumber: string;
  addressLine: string;
  serviceArea: string[];
  description: string;
  minimumPrice: number;
  maximumPrice: number;
  availableDays: string[];
  availableTime: "day" | "night" | "always";
  coverImage?: string;
  ratings?: TRating[];
  certificate: string;
  status?: 'active' | 'inactive';
};

export type TServiceCategory = "Maid" | "Tutor" | "Electrician" | "IT Provider" | "Painter" | "Plumber";
export type TRating = {
  client: string;
  rating: number;
  feedback: string;
};


type ProfessionalServiceFormData = Omit<TProfessinalService, 'provider' | 'minimumPrice' | 'maximumPrice' | 'availableDays' | 'availableTime' | 'coverImage' | 'ratings' | 'status' | 'serviceArea'> & {
  serviceAreas: { value: string }[];
  priceRange: {
    min: number;
    max: number;
  };
  dayOfWeek: string[];
  availableTimes: "day" | "night" | "always";
  coverImageFile?: FileList;

  certificateFile: FileList;
  certificate?: string; // S3 URL
};

const OfferService = () => {
  const { showSuccess } = useNotification();
  const [professions, setProfessions] = useState<any[]>([]);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const selfId = Cookies.get("zenEasySelfId");

  const { offerService, loading, success } = useOfferService();

  const {
    register,
    handleSubmit,
    watch,
    control,
    setError,
    formState: { errors },
  } = useForm<ProfessionalServiceFormData>({
    defaultValues: {
      serviceAreas: [{ value: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "serviceAreas",
    rules: {
      required: "At least one service area is required.",
      validate: (value) => {
        const nonEmptyAreas = value?.filter(area => area.value.trim().length > 0);
        return (nonEmptyAreas && nonEmptyAreas.length > 0) || "Please add at least one service area.";
      }
    }
  });

  const watchedCoverImageFile = watch("coverImageFile");
  const firstServiceAreaValue = watch(`serviceAreas.0.value`);


  useEffect(() => {
    if (watchedCoverImageFile && watchedCoverImageFile.length > 0) {
      const file = watchedCoverImageFile[0];
      if (file) {
        setCoverImagePreview(URL.createObjectURL(file));
      }
    } else {
      setCoverImagePreview(null);
    }
    return () => {
      if (coverImagePreview) {
        URL.revokeObjectURL(coverImagePreview);
      }
    };
  }, [watchedCoverImageFile , coverImagePreview]);

  // ---------------Handle form submission----------------


const onSubmit: SubmitHandler<ProfessionalServiceFormData> = async (data) => {
  try {
    if (data.priceRange.min >= data.priceRange.max) {
      setError("priceRange.max", {
        type: "manual",
        message: "Maximum price must be greater than minimum price",
      });
      return;
    }

    if (!data.certificateFile?.[0]) {
      setError("certificateFile", {
        type: "manual",
        message: "Certificate is required",
      });
      return;
    }

    // 🔥 1️⃣ Upload certificate to S3
    const certificateUrl = await uploadCertificate(
      data.certificateFile[0]
    );

    // 🔥 2️⃣ Inject URL into payload
    const payload = {
      ...data,
      certificate: certificateUrl,
    };

    // 🔥 3️⃣ Now save service
    await offerService(selfId as string, payload);
  } catch (error) {
    console.error("Offer service failed:", error);
  }
};


  useEffect(() => {
    if (success) {
      showSuccess("Professional Profile created", 1000)
      window.location.href = `/main/prof-profile/${selfId}`;
    }
  }, [success , selfId, showSuccess])
  // ------------------------
  useEffect(() => {
    const getProfessionalInfo = async () => {
      if (!selfId) {
        setProfessions([]);
        return;
      }
      try {
        const result = await getUsersProfessionalInfo(selfId as string);
        setProfessions(result?.professionalProfiles || []);
      } catch (error) {
        console.error("Failed to fetch professional info:", error);
        setProfessions([]);
      }
    };
    getProfessionalInfo();
  }, [selfId]);


  // ---------------------- return div --------------------
  return (
    <div className="offer-service-container">
      <div className="header-section">
        <div className="profile-status">
          {professions?.length === 0 ? (
            <div className="no-profile">
              <div className="status-icon">👤</div>
              <h3>No Professional Profile</h3>
              <p>Create your first professional service profile</p>
            </div>
          ) : (
            <div className="has-profile">
              <div className="status-icon">✅</div>
              <h3>Current Profession{professions.length > 1 ? "s" : ""}</h3>
              <p>You are currently working as:{" "}
                <span className="profession-name">
                  {professions.map((prof, index) => (
                    <span key={index}>{prof.category}{index < professions.length - 1 && ", "}</span>
                  ))}
                </span>
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="service-form-section">
        {professions?.length >= 2 ? (
          <div className="limit-reached">
            <div className="warning-icon">⚠️</div>
            <h3>Professional Profile's Limit Reached</h3>
            <p>You are not allowed to offer more than two services simultaneously.</p>
          </div>
        ) : (
          <div className="add-service">
            <div className="form-header">
              <h2>Add New Service</h2>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="service-form">
              <div className="form-grid">
                {/* Service Category Selection */}
                <div className="form-group full-width">
                  <label htmlFor="category">Service Type</label>
                  <select
                    id="category"
                    {...register("category", { required: "Please select a service type" })}
                    className={errors.category ? "error" : ""}
                  >
                    <option value="">Choose your service</option>
                    <option value="Maid">🏠 Home Maid</option>
                    <option value="Home Shifter">🚚 Home Shifter</option>
                    <option value="Tutor">📚 Private Tutor</option>
                    <option value="Electrician">⚡ Electrician</option>
                    <option value="IT Provider">💻 IT Provider</option>
                    <option value="Painter">🎨 Painter</option>
                    <option value="Plumber">🔧 Plumber</option>
                  </select>
                  {errors.category && (
                    <span className="error-message">{errors.category.message}</span>
                  )}
                </div>

                {/* Contact Number Input */}
                <div className="form-group">
                  <label htmlFor="contactNumber">Contact Number</label>
                  <input
                    id="contactNumber"
                    type="tel"
                    {...register("contactNumber", {
                      required: "Contact number is required",
                      pattern: {
                        value: /^[0-9+\-\s()]+$/,
                        message: "Please enter a valid phone number"
                      }
                    })}
                    placeholder="+880 1731588825"
                    className={errors.contactNumber ? "error" : ""}
                  />
                  {errors.contactNumber && (
                    <span className="error-message">{errors.contactNumber.message}</span>
                  )}
                </div>

                {/* Address Line Input */}
                <div className="form-group">
                  <label htmlFor="addressLine">Full Address Line</label>
                  <input
                    id="addressLine"
                    type="text"
                    {...register("addressLine", { required: "Address line is required" })}
                    placeholder="e.g., House 123, Road 4, Gulshan 1, Dhaka 1212"
                    className={errors.addressLine ? "error" : ""}
                  />
                  {errors.addressLine && (
                    <span className="error-message">{errors.addressLine.message}</span>
                  )}
                </div>

                {/* Service Area Dynamic Inputs */}
                <div className="form-group service-areas-group full-width">
                  <label>Service Areas</label>
                  {fields.map((field, index) => (
                    <div key={field.id} className="service-area-item">
                      <input
                        type="text"
                        {...register(`serviceAreas.${index}.value`, {
                          required: "Service area cannot be empty",
                          minLength: { value: 3, message: "Service area must be at least 3 characters" }
                        })}
                        placeholder={`Service Area ${index + 1}`}
                        className={errors.serviceAreas?.[index]?.value ? "error" : ""}
                      />
                      {fields.length > 1 && (
                        <button type="button" onClick={() => remove(index)} className="remove-area-btn">
                          &times;
                        </button>
                      )}
                      {errors.serviceAreas?.[index]?.value && (
                        <span className="error-message">{errors.serviceAreas[index]?.value?.message}</span>
                      )}
                    </div>
                  ))}
                  {/*"Add Another Area"  */}
                  {(firstServiceAreaValue && firstServiceAreaValue.trim().length > 0) || fields.length > 1 ? (
                    <button
                      type="button"
                      onClick={() => append({ value: "" })}
                      className="add-another-area-btn btn-secondary"
                    >
                      Add Another Area
                    </button>
                  ) : null}

                  {/*  validation message for serviceAreas array */}
                  {errors.serviceAreas && typeof errors.serviceAreas.message === 'string' && (
                    <span className="error-message full-width">{errors.serviceAreas.message}</span>
                  )}
                </div>

                {/* certificate field */}
                <div className="form-group full-width">
                  <label>Certificate (PDF / Image)</label>
                  <input
                    type="file"
                    accept="application/pdf,image/*"
                    {...register("certificateFile", {
                      required: "Certificate is required",
                      validate: {
                        fileType: (files) =>
                          files &&
                            ["application/pdf", "image/jpeg", "image/png"].includes(files[0].type)
                            ? true
                            : "Only PDF or image allowed",
                        fileSize: (files) =>
                          files && files[0].size <= 5 * 1024 * 1024
                            ? true
                            : "Max 5MB allowed",
                      },
                    })}
                  />
                  {errors.certificateFile && (
                    <span className="error-message">
                      {errors.certificateFile.message}
                    </span>
                  )}
                </div>


                {/* Cover Image Upload Field */}
                <div className="form-group full-width">
                  <label htmlFor="coverImage">Cover Image (optional)</label>
                  <input
                    id="coverImage"
                    type="file"
                    accept="image/*"
                    {...register("coverImageFile", {
                      validate: {
                        fileType: (value) => {
                          if (value && value.length > 0) {
                            const file = value[0];
                            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
                            if (!allowedTypes.includes(file.type)) {
                              return "Only JPEG, PNG, or GIF images are allowed.";
                            }
                            const maxSize = 5 * 1024 * 1024; // 5MB
                            if (file.size > maxSize) {
                              return "Image size must be less than 5MB.";
                            }
                          }
                          return true;
                        },
                      },
                    })}
                    className={errors.coverImageFile ? "error" : ""}
                  />
                  {errors.coverImageFile && (
                    <span className="error-message">{errors.coverImageFile.message}</span>
                  )}
                  {coverImagePreview && (
                    <div className="image-preview">
                      <img src={coverImagePreview} alt="Cover Preview" />
                    </div>
                  )}
                </div>

                {/* Description Textarea */}
                <div className="form-group full-width">
                  <label htmlFor="description">Service Description</label>
                  <textarea
                    id="description"
                    {...register("description", {
                      required: "Please describe your service",
                      minLength: {
                        value: 20,
                        message: "Description should be at least 20 characters"
                      },
                      maxLength: {
                        value: 1000,
                        message: "Description cannot exceed 1000 characters"
                      }
                    })}
                    placeholder="Describe your service, experience, and what makes you unique..."
                    rows={4}
                    className={errors.description ? "error" : ""}
                  />
                  {errors.description && (
                    <span className="error-message">{errors.description.message}</span>
                  )}
                </div>

                {/* Minimum Price Input */}
                <div className="form-group">
                  <label htmlFor="minPrice">Minimum Price (BDT)</label>
                  <input
                    id="minPrice"
                    type="number"
                    {...register("priceRange.min", {
                      required: "Minimum price is required",
                      min: { value: 1, message: "Price must be greater than 0" },
                      valueAsNumber: true,
                    })}
                    placeholder="500"
                    className={errors.priceRange?.min ? "error" : ""}
                  />
                  {errors.priceRange?.min && (
                    <span className="error-message">{errors.priceRange.min.message}</span>
                  )}
                </div>

                {/* Maximum Price Input */}
                <div className="form-group">
                  <label htmlFor="maxPrice">Maximum Price (BDT)</label>
                  <input
                    id="maxPrice"
                    type="number"
                    {...register("priceRange.max", {
                      required: "Maximum price is required",
                      min: { value: 1, message: "Price must be greater than 0" },
                      valueAsNumber: true,
                    })}
                    placeholder="2000"
                    className={errors.priceRange?.max ? "error" : ""}
                  />
                  {errors.priceRange?.max && (
                    <span className="error-message">{errors.priceRange.max.message}</span>
                  )}
                </div>

                {/* Available Days Checkboxes */}
                <div className="form-group full-width">
                  <label>Available Days</label>
                  <div className="checkbox-group">
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                      <label key={day} className="checkbox-item">
                        <input
                          type="checkbox"
                          value={day}
                          {...register("dayOfWeek", { required: "Please select at least one day" })}
                        />
                        <span className="checkmark"></span>
                        {day}
                      </label>
                    ))}
                  </div>
                  {errors.dayOfWeek && (
                    <span className="error-message">{errors.dayOfWeek.message}</span>
                  )}
                </div>

                {/* Available Time Radio Buttons */}
                <div className="form-group full-width">
                  <label>Available Time</label>
                  <div className="radio-group">
                    {[
                      { value: "day", label: "Day Time", icon: "☀️" },
                      { value: "night", label: "Night Time", icon: "🌙" },
                      { value: "always", label: "24/7 Available", icon: "🕐" }
                    ].map((time) => (
                      <label key={time.value} className="radio-item">
                        <input
                          type="radio"
                          value={time.value}
                          {...register("availableTimes", { required: "Please select your availability" })}
                        />
                        <span className="radio-mark"></span>
                        <div className="radio-content">
                          <span className="radio-icon">{time.icon}</span>
                          <span className="radio-label">{time.label}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                  {errors.availableTimes && (
                    <span className="error-message">{errors.availableTimes.message}</span>
                  )}
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  disabled={loading}
                  className="submit-btn btn-primary"
                >
                  {loading ? "Publishing..." : "Publish Service"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default OfferService;