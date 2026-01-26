import React, { useEffect } from "react";
import { useForm,type SubmitHandler } from "react-hook-form";
import "./webFeedbackModal.scss";
import { useNotification } from "../../../context/notification/NotificationContext";

// Form Data Type
type ReviewFormData = {
  serviceCategory: string;
  rating: number;
  comment: string;
};

// Props Type
interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitReview: (data: ReviewFormData) => Promise<void>;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, onSubmitReview }) => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReviewFormData>({
    defaultValues: { rating: 5 }, // Default 5 star
  });

  const { showSuccess, showError } = useNotification();
  const watchedRating = watch("rating");

  // Modal bondho hole form reset hobe
  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen, reset]);

  const handleFormSubmit: SubmitHandler<ReviewFormData> = async (data) => {
    try {
      await onSubmitReview(data);
      showSuccess("Thank you for your review!");
      onClose();
    } catch (err) {
      showError("Something went wrong. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="review-modal-overlay">
      <div className="review-modal-content">
        <button className="close-x" onClick={onClose}>&times;</button>
        
        <h2>Rate Our Service</h2>
        <p>Your feedback helps us grow!</p>

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          {/* Category Selection */}
          <div className="form-group">
            <label>Which service did you use?</label>
            <select {...register("serviceCategory", { required: "Please select a category" })}>
              <option value="">Select Category</option>
              <option value="web-dev">Web Development</option>
              <option value="ui-ux">UI/UX Design</option>
              <option value="consulting">Consulting</option>
            </select>
            {errors.serviceCategory && <p className="error">{errors.serviceCategory.message}</p>}
          </div>

          {/* Star Rating */}
          <div className="form-group">
            <label>Your Rating</label>
            <div className="star-group">
              {[1, 2, 3, 4, 5].map((num) => (
                <label key={num}>
                  <input
                    type="radio"
                    value={num}
                    {...register("rating", { valueAsNumber: true })}
                  />
                  <span className={`star ${num <= watchedRating ? "filled" : ""}`}>★</span>
                </label>
              ))}
            </div>
          </div>

          {/* Comment box */}
          <div className="form-group">
            <label>Review Comment</label>
            <textarea
              {...register("comment", { 
                required: "Please write a comment",
                minLength: { value: 10, message: "Min 10 characters required" }
              })}
              placeholder="Tell us what you liked or how we can improve..."
              rows={4}
            />
            {errors.comment && <p className="error">{errors.comment.message}</p>}
          </div>

          <div className="actions">
            <button type="submit" disabled={isSubmitting} className="btn-submit">
              {isSubmitting ? "Submitting..." : "Post Review"}
            </button>
            <button type="button" onClick={onClose} className="btn-cancel">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;