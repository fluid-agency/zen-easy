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
  certificate?: string;
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
    shouldUnregister: false,
    defaultValues: {
      serviceAreas: [{ value: "" }],
      dayOfWeek: [],
      priceRange: {
        min: 0,
        max: 0
      }
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

  // Debugging: This will help you see if validation is blocking submission
  const onError = (errors: any) => {
    console.log("Form Validation Errors:", errors);
  };

  useEffect(() => {
    if (watchedCoverImageFile && watchedCoverImageFile.length > 0) {
      const file = watchedCoverImageFile[0];
      if (file) {
        const previewUrl = URL.createObjectURL(file);
        setCoverImagePreview(previewUrl);

        // Cleanup function
        return () => {
          URL.revokeObjectURL(previewUrl);
        };
      }
    } else {
      setCoverImagePreview(null);
    }
  }, [watchedCoverImageFile]);

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
  }, [success, selfId, showSuccess])
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

  return (
    <div className="offer-service-compact">
      <div className="compact-header">
        <div className="profile-badge">
          <div className="badge-icon">
            {professions?.length === 0 ? "➕" : "👤"}
          </div>
          <div className="badge-content">
            <h3>
              {professions?.length === 0
                ? "No Professional Profile"
                : `Current Profession${professions.length > 1 ? "s" : ""}`}
            </h3>
            <p>
              {professions?.length === 0
                ? "Create your first professional service profile"
                : `You are currently working as: ${professions.map((prof, index) =>
                  `${prof.category}${index < professions.length - 1 ? ", " : ""}`
                )}`}
            </p>
          </div>
        </div>
      </div>

      {professions?.length >= 2 ? (
        <div className="limit-card">
          <div className="warning-badge">⚠️</div>
          <h3>Limit Reached</h3>
          <p>Maximum 2 services allowed</p>
        </div>
      ) : (
        <div className="compact-form-container">
          <div className="form-header">
            <h2>Add New Service</h2>
            <p>Fill in your service details</p>
          </div>

          <form
            // ADDED onError here to debug failures
            onSubmit={handleSubmit(onSubmit, onError)}
            className="compact-form"
            noValidate
          >

            <div className="form-sections">
              {/* Left Column */}
              <div className="form-column">
                {/* Service Type */}
                <div className="input-group floating">
                  <select
                    {...register("category", { required: "Please select a service type" })}
                    className={errors.category ? "error" : ""}
                  >
                    <option value="">Service Type</option>
                    <option value="Maid">🏠 Home Maid</option>
                    <option value="Home Shifter">🚚 Home Shifter</option>
                    <option value="Tutor">📚 Private Tutor</option>
                    <option value="Electrician">⚡ Electrician</option>
                    <option value="IT Provider">💻 IT Provider</option>
                    <option value="Painter">🎨 Painter</option>
                    <option value="Plumber">🔧 Plumber</option>
                  </select>
                  <label>Service Type *</label>
                  {errors.category && (
                    <span className="error-hint">{errors.category.message}</span>
                  )}
                </div>

                {/* Contact Number */}
                <div className="input-group floating">
                  <input
                    type="tel"
                    {...register("contactNumber", {
                      required: "Contact number is required",
                      pattern: {
                        value: /^[0-9+\-\s()]+$/,
                        message: "Please enter a valid phone number"
                      }
                    })}
                    className={errors.contactNumber ? "error" : ""}
                  />
                  <label>Contact Number *</label>
                  {errors.contactNumber && (
                    <span className="error-hint">{errors.contactNumber.message}</span>
                  )}
                </div>

                {/* Address */}
                <div className="input-group floating">
                  <input
                    type="text"
                    {...register("addressLine", { required: "Address line is required" })}
                    className={errors.addressLine ? "error" : ""}
                  />
                  <label>Full Address *</label>
                  {errors.addressLine && (
                    <span className="error-hint">{errors.addressLine.message}</span>
                  )}
                </div>

                {/* Service Areas */}
                <div className="dynamic-input-group">
                  <label>Service Areas *</label>
                  {fields.map((field, index) => (
                    <div key={field.id} className="tag-input">
                      <input
                        type="text"
                        {...register(`serviceAreas.${index}.value`, {
                          required: "Service area cannot be empty",
                          minLength: { value: 3, message: "At least 3 characters" }
                        })}
                        placeholder="Service area"
                        className={errors.serviceAreas?.[index]?.value ? "error" : ""}
                      />
                      {fields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="tag-remove"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => append({ value: "" })}
                    className="add-tag-btn"
                  >
                    + Add Area
                  </button>
                  {errors.serviceAreas && typeof errors.serviceAreas.message === 'string' && (
                    <span className="error-hint">{errors.serviceAreas.message}</span>
                  )}
                </div>

                {/* Description */}
                <div className="input-group floating">
                  <textarea
                    {...register("description", {
                      required: "Please describe your service",
                      minLength: {
                        value: 20,
                        message: "At least 20 characters"
                      },
                      maxLength: {
                        value: 1000,
                        message: "Max 1000 characters"
                      }
                    })}
                    rows={4}
                    className={errors.description ? "error" : ""}
                  />
                  <label>Service Description *</label>
                  {errors.description && (
                    <span className="error-hint">{errors.description.message}</span>
                  )}
                </div>
              </div>

              {/* Right Column */}
              <div className="form-column">
                {/* Price Range */}
                <div className="price-range-group">
                  <label>Price Range (BDT) *</label>
                  <div className="price-inputs">
                    <div className="input-group floating small">
                      <input
                        type="number"
                        {...register("priceRange.min", {
                          required: "Min price required",
                          min: { value: 1, message: "Must be > 0" },
                          valueAsNumber: true,
                        })}
                        className={errors.priceRange?.min ? "error" : ""}
                      />
                      <label>Min</label>
                    </div>
                    <div className="range-separator">to</div>
                    <div className="input-group floating small">
                      <input
                        type="number"
                        {...register("priceRange.max", {
                          required: "Max price required",
                          min: { value: 1, message: "Must be > 0" },
                          valueAsNumber: true,
                        })}
                        className={errors.priceRange?.max ? "error" : ""}
                      />
                      <label>Max</label>
                    </div>
                  </div>
                  {errors.priceRange?.min && (
                    <span className="error-hint">{errors.priceRange.min.message}</span>
                  )}
                  {errors.priceRange?.max && (
                    <span className="error-hint">{errors.priceRange.max.message}</span>
                  )}
                </div>

                {/* Available Days */}
                <div className="checkbox-group compact">
                  <label>Available Days *</label>
                  <div className="day-pills">
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                      <label key={day} className="day-pill">
                        <input
                          type="checkbox"
                          value={day}
                          {...register("dayOfWeek", { required: "Select at least one day" })}
                        />
                        <span className="pill-label">{day.slice(0, 3)}</span>
                      </label>
                    ))}
                  </div>
                  {errors.dayOfWeek && (
                    <span className="error-hint">{errors.dayOfWeek.message}</span>
                  )}
                </div>

                {/* Available Time */}
                <div className="radio-group compact">
                  <label>Available Time *</label>
                  <div className="time-options">
                    {[
                      { value: "day", label: "Day", icon: "☀️" },
                      { value: "night", label: "Night", icon: "🌙" },
                      { value: "always", label: "24/7", icon: "🕐" }
                    ].map((time) => (
                      <label key={time.value} className="time-option">
                        <input
                          type="radio"
                          value={time.value}
                          {...register("availableTimes", { required: "Please select availability" })}
                        />
                        <div className="option-content">
                          <span className="option-icon">{time.icon}</span>
                          <span className="option-label">{time.label}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                  {errors.availableTimes && (
                    <span className="error-hint">{errors.availableTimes.message}</span>
                  )}
                </div>

                {/* Certificate */}
                <div className="file-upload-group">
                  <label>Certificate (PDF / Image) *</label>
                  <div className="file-upload">
                    <input
                      id="certificate-upload"
                      type="file"
                      accept="application/pdf,image/*"
                      {...register("certificateFile", {
                        required: "Certificate is required",
                        validate: {
                          fileType: (files) => {
                            if (!files?.[0]) return "Certificate is required";
                            return ["application/pdf", "image/jpeg", "image/png"].includes(files[0].type)
                              ? true
                              : "Only PDF or image allowed";
                          },
                          fileSize: (files) =>
                            files && files[0].size <= 5 * 1024 * 1024
                              ? true
                              : "Max 5MB allowed",
                        },
                      })}
                    />

                    <label htmlFor="certificate-upload" className="file-info">
                      {watch("certificateFile")?.[0]?.name || "Upload PDF or Image (max 5MB)"}
                    </label>
                  </div>
                  {/* 🔥 ADDED MISSING ERROR DISPLAY */}
                  {errors.certificateFile && (
                    <span className="error-hint" style={{ color: "red", display: "block", marginTop: "5px" }}>
                      {errors.certificateFile.message}
                    </span>
                  )}
                </div>

                {/* Cover Image */}
                <div className="image-upload-group">
                  <label>Cover Image (optional)</label>
                  <div className="image-upload">
                    <input
                      id="cover-upload"
                      type="file"
                      accept="image/*"
                      {...register("coverImageFile", {
                        validate: {
                          fileType: (value) => {
                            if (value && value.length > 0) {
                              const file = value[0];
                              if (!["image/jpeg", "image/png", "image/gif"].includes(file.type)) {
                                return "Only JPEG, PNG, or GIF images";
                              }
                              if (file.size > 5 * 1024 * 1024) {
                                return "Image must be < 5MB";
                              }
                            }
                            return true;
                          },
                        },
                      })}
                    />

                    <label htmlFor="cover-upload" className="upload-prompt">
                      {coverImagePreview ? (
                        <div className="image-preview">
                          <img src={coverImagePreview} alt="Preview" />
                          <div className="preview-overlay">Change Image</div>
                        </div>
                      ) : (
                        <>
                          <div className="upload-icon">📷</div>
                          <div className="upload-text">
                            {watch("coverImageFile")?.[0]?.name || "Upload Cover Image"}
                          </div>
                        </>
                      )}
                    </label>
                  </div>
                  {/* 🔥 ADDED MISSING ERROR DISPLAY */}
                  {errors.coverImageFile && (
                    <span className="error-hint" style={{ color: "red", display: "block", marginTop: "5px" }}>
                      {errors.coverImageFile.message}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="form-footer">
              <button
                type="submit"
                disabled={loading}
                className="submit-btn"
              >
                {loading ? (
                  <span className="btn-loading">
                    <span className="spinner"></span>
                    Publishing...
                  </span>
                ) : (
                  'Publish Service'
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default OfferService;