import { useEffect, useState, useContext } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { AuthContext } from '../../context/AuthContext';
import { useNotification } from '../../context/notification/NotificationContext';

import "react-datepicker/dist/react-datepicker.css";
import './EditProfProfile.scss';
import { useEditService } from '../../hooks/useEditProfProfile';
import { findServiceDetailsById } from '../../services/professionalServices';
import type { TServiceCategory } from '../../utils/types/serviceTitleType';

// types 
export type TProfessinalService = {
  _id: string;
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
  ratings?: any[]; 
  status?: 'active' | 'inactive'; 
  createdAt: string;
  updatedAt: string;
};

type TServiceStatus = 'active' | 'inactive'; 

// Form data type for React Hook Form
type EditServiceFormData = Omit<TProfessinalService, '_id' | 'provider' | 'minimumPrice' | 'maximumPrice' | 'availableDays' | 'availableTime' | 'coverImage' | 'ratings' | 'status' | 'createdAt' | 'updatedAt'> & {
    serviceAreas: { value: string }[];
    priceRange: {
        min: number;
        max: number;
    };
    dayOfWeek: string[]; 
    availableTimes: "day" | "night" | "always"; 
    coverImageFile?: FileList;
    existingCoverImage?: string; 
    status: TServiceStatus; 
};


const EditService = () => {
    const { serviceId } = useParams<{ serviceId: string }>();
    const navigate = useNavigate();
    const [serviceDataloading, setServiceDataLoading] = useState(true);
    const selfId = Cookies.get("zenEasySelfId"); 
    const authContext = useContext(AuthContext);
    const { showSuccess, showError } = useNotification();
    const [serviceData, setServiceData] = useState<TProfessinalService | null>(null);

    //---------------fetch and update service data-------------
    const {updateService, loading, error, success } = useEditService();

    // State for image preview
    const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);

    const { register, handleSubmit, control, setValue, watch, reset, formState: { errors } } = useForm<EditServiceFormData>({
        defaultValues: {
            serviceAreas: [{ value: '' }],
            priceRange: { min: 0, max: 0 },
            dayOfWeek: [],
            availableTimes: 'day',
            status: 'active', 
        }
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

    // -------------- service data and pre-populate form fields --------------
    useEffect(() => {
        setServiceDataLoading(true);
        const loadService = async () => {
            if (!serviceId) {
                showError("Service ID is missing from URL.");
                navigate(-1);
                return;
            }

            try{
                const result = await findServiceDetailsById(serviceId);
            const data = result?.data;
            setServiceData(data);
            if (data) {
                reset({
                    category: data.category,
                    contactNumber: data.contactNumber,
                    addressLine: data.addressLine,
                    serviceAreas: data.serviceArea.map((area:any) => ({ value: area })),
                    description: data.description,
                    priceRange: { min: data.minimumPrice, max: data.maximumPrice },
                    dayOfWeek: data.availableDays,
                    availableTimes: data.availableTime,
                    status: data.status,
                    existingCoverImage: data.coverImage, 
                });

                if (data.coverImage) {
                    setCoverImagePreview(data.coverImage);
                }
            }
            }finally{
                setServiceDataLoading(false);
            }
        };
        loadService();
    }, [serviceId, reset, navigate, showError]);

    // ---------update cover image preview ------------
    useEffect(() => {
        if (watchedCoverImageFile && watchedCoverImageFile.length > 0) {
            const file = watchedCoverImageFile[0];
            if (file) {
                setCoverImagePreview(URL.createObjectURL(file));
            }
        } else if (serviceData && !serviceData.coverImage && !watchedCoverImageFile?.length) {
            setCoverImagePreview(null);
        }
        return () => {
            if (coverImagePreview && coverImagePreview.startsWith('blob:')) {
                URL.revokeObjectURL(coverImagePreview);
            }
        };
    }, [watchedCoverImageFile, coverImagePreview, serviceData]);

    useEffect(() => {
        if (success) {
            console.log('success : true');
            showSuccess("Service updated successfully!" , 1000);
            navigate(`/main/prof-profile/${selfId}`); 
        }
        if (error) {
            showError(error);
        }
    }, [success, error, navigate, selfId, showSuccess, showError]);

    const onSubmit: SubmitHandler<EditServiceFormData> = async (data) => {
        if (!serviceId) {
            showError("Service ID is missing for update.");
            return;
        }
        if (data.priceRange.min >= data.priceRange.max) {
            showError("Maximum price must be greater than minimum price.");
            return;
        }
        const finalServiceAreas = data.serviceAreas.map(item => item.value.trim()).filter(area => area.length > 0);
        if (finalServiceAreas.length === 0) {
            showError("At least one service area is required.");
            return;
        }
       
        await updateService(serviceId, data);
    };

    if (!authContext) {
        return <Navigate to={"/auth/login"} />;
    }
    // Loading state 
    if (serviceDataloading) {
        return (
            <div className="edit-service-container min-h-screen loading-state">
                <div className="loading-spinner"></div>
                <p>Loading service details for editing...</p>
            </div>
        );
    }
    // Error state 
    if (error) {
        return (
            <div className="edit-service-container text-red-500 min-h-screen error-state">
                <p>Error: {error}</p>
                <button className='btn btn-primary px-2 py-1 rounded-[6px] my-6' onClick={() => navigate(-1)}>⬅️ Go Back</button>
            </div>
        );
    }
    if (!serviceData) {
        return (
            <div className="edit-service-container min-h-screen no-data-state">
                <p>Service data not found .</p>
                <button className='btn btn-primary px-3 py-1 rounded-[6px] my-8' onClick={() => navigate('/main/find-service/all')}>Browse Services</button>
            </div>
        );
    }
    if (selfId !== serviceData.provider) {
        return (
            <div className="edit-service-container unauthorized-state">
                <p>You are not authorized to edit this service.</p>
                <button onClick={() => navigate(`/main/prof-profile/${serviceData.provider}`)}>View Service Provider's Profile</button>
            </div>
        );
    }

// -------------------------------------- Service Update Form ----------------------------------//
    return (
        <div className="edit-service-container">
            <div className="edit-service-header">
                <h1>Edit Your Service: {serviceData.category}</h1>
                <p>Update your professional service details.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="edit-service-form">
                <div className="form-grid">
                    {/* Service Category  */}
                    <div className="form-group full-width">
                        <label htmlFor="category">Service Type <span className='font-semibold text-red-400'>(not editable)</span></label>
                        <input
                            id="category"
                            type="text"
                            value={serviceData.category}
                            readOnly
                            className="readonly"
                            tabIndex={-1}
                        />
                    </div>
                    {/* Service Status Select */}
                    <div className="form-group full-width">
                        <label htmlFor="status">Service Status</label>
                        <select
                            id="status"
                            {...register("status", { required: "Service status is required" })}
                            className={errors.status ? "error" : ""}
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                        {errors.status && <span className="error-message">{errors.status.message}</span>}
                    </div>

                    {/* Contact Number */}
                    <div className="form-group">
                        <label htmlFor="contactNumber">Contact Number</label>
                        <input
                            id="contactNumber"
                            type="tel"
                            {...register("contactNumber", { required: "Contact number is required" })}
                            className={errors.contactNumber ? "error" : ""}
                        />
                        {errors.contactNumber && <span className="error-message">{errors.contactNumber.message}</span>}
                    </div>

                    {/* Address Line */}
                    <div className="form-group">
                        <label htmlFor="addressLine">Full Address Line</label>
                        <input
                            id="addressLine"
                            type="text"
                            {...register("addressLine", { required: "Address line is required" })}
                            className={errors.addressLine ? "error" : ""}
                        />
                        {errors.addressLine && <span className="error-message">{errors.addressLine.message}</span>}
                    </div>

                    {/* Service Area */}
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
                        {(firstServiceAreaValue && firstServiceAreaValue.trim().length > 0) || fields.length > 1 ? (
                            <button
                                type="button"
                                onClick={() => append({ value: "" })}
                                className="add-another-area-btn btn-secondary"
                            >
                                Add Another Area
                            </button>
                        ) : null}
                        {errors.serviceAreas && typeof errors.serviceAreas.message === 'string' && (
                            <span className="error-message full-width">{errors.serviceAreas.message}</span>
                        )}
                    </div>

                    {/* Cover Image Upload Field */}
                    <div className="form-group full-width cover-image-upload-group">
                        <label htmlFor="coverImageFile">Cover Image</label>
                        <input
                            id="coverImageFile"
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
                                <button type="button" className="remove-preview-btn" onClick={() => {
                                    setCoverImagePreview(null);
                                    setValue('coverImageFile', undefined);
                                    setValue('existingCoverImage', '');
                                }}>&times;</button>
                            </div>
                        )}
                        {!coverImagePreview && serviceData?.coverImage && (
                            <p className="no-image-text">No image selected. Existing image will be removed on save.</p>
                        )}
                    </div>

                    {/* Description Textarea */}
                    <div className="form-group full-width">
                        <label htmlFor="description">Service Description</label>
                        <textarea
                            id="description"
                            {...register("description", {
                                required: "Please describe your service",
                                minLength: { value: 20, message: "Description should be at least 20 characters" },
                                maxLength: { value: 2000, message: "Description cannot exceed 500 characters" }
                            })}
                            placeholder="Describe your service, experience, and what makes you unique..."
                            rows={4}
                            className={errors.description ? "error" : ""}
                        ></textarea>
                        {errors.description && <span className="error-message">{errors.description.message}</span>}
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
                        {errors.priceRange?.min && <span className="error-message">{errors.priceRange.min.message}</span>}
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
                        {errors.priceRange?.max && <span className="error-message">{errors.priceRange.max.message}</span>}
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
                        {errors.dayOfWeek && <span className="error-message">{errors.dayOfWeek.message}</span>}
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
                        {errors.availableTimes && <span className="error-message">{errors.availableTimes.message}</span>}
                    </div>

                </div>

                <div className="form-actions">
                    <button type="submit" disabled={loading} className="submit-btn btn-primary">
                        {loading ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditService;