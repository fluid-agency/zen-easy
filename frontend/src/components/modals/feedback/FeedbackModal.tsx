import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import "./FeedbackModal.scss";
import { addNewFeedback } from "../../../services/professionalServices";
import { useNotification } from "../../../context/notification/NotificationContext";

// form strctr------------
type FeedbackFormData = {
  serviceId: any;
  rating: number;
  feedback: string;
};

// --- Props  ---
interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: string;
  provider: string;
  services: any[];
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  clientId,
  services,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FeedbackFormData>();

  const watchedRating = watch("rating");

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);
  const { showSuccess, showError } = useNotification();

  // -------- Handle form submission --------------
  const onSubmit: SubmitHandler<FeedbackFormData> = async (data) => {
    if (!data.serviceId) {
      showError("Please select a service category.");
      return;
    }
    if (data.rating < 1 || data.rating > 5) {
      showError("Rating must be between 1 and 5.");
      return;
    }
    if (!data.feedback || data.feedback.trim().length < 10) {
      showError("Feedback must be at least 10 characters long.");
      return;
    }

    showSuccess("Submitting feedback...");

    try {
      const finalFeedbackDataForBackend: any = {
        serviceId: data.serviceId,
        rating: data.rating,
        feedback: data.feedback,
        client: clientId,
      };
      console.log(finalFeedbackDataForBackend);
      const result = await addNewFeedback(finalFeedbackDataForBackend);
      if (result?.success) {
        onClose();
        reset();
      }
    } catch (error: any) {
      console.error("Error submitting feedback:", error);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="feedback-modal-overlay">
      <div className="feedback-modal-content">
        <button
          className="modal-close-button"
          onClick={onClose}
          disabled={isSubmitting}
        >
          &times;
        </button>

        <h2 className="modal-title">Share Your Feedback</h2>
        <p className="modal-subtitle">
          Help us improve by rating a service category.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="feedback-form">
          {/* Service Category Selection */}
          <div className="form-group">
            <label htmlFor="serviceCategory">
              For which service category is this feedback?
            </label>
            <div className="select-wrapper">
              <select
                id="serviceCategory"
                {...register("serviceId", {
                  required: "Please select a service category.",
                })}
                className={errors.serviceId ? "error" : ""}
              >
                <option value="">Select a category</option>
                {services?.map((category) => (
                  <option key={category.id} value={category._id}>
                    {category.category}
                  </option>
                ))}
              </select>
              <svg
                className="select-arrow"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <polyline points="6,9 12,15 18,9" />
              </svg>
            </div>
          </div>

          {/* Rating Input */}
          <div className="form-group">
            <label>Your Rating</label>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <label key={star} className="star-label">
                  <input
                    type="radio"
                    value={star}
                    {...register("rating", {
                      required: "Please give a rating.",
                      min: 1,
                      max: 5,
                      valueAsNumber: true,
                    })}
                    className="star-radio"
                  />
                  <span
                    className={`star-icon ${
                      star <= watchedRating ? "filled" : ""
                    }`}
                  >
                    ★
                  </span>
                </label>
              ))}
            </div>
            {errors.rating && (
              <span className="error-message">{errors.rating.message}</span>
            )}
          </div>

          {/* Feedback Textarea */}
          <div className="form-group">
            <label htmlFor="feedback">Your Feedback</label>
            <textarea
              id="feedback"
              {...register("feedback", {
                required: "Feedback is required.",
                minLength: {
                  value: 10,
                  message: "Feedback must be at least 10 characters.",
                },
                maxLength: {
                  value: 500,
                  message: "Feedback cannot exceed 500 characters.",
                },
              })}
              placeholder="Tell us about your experience..."
              rows={5}
              className={errors.feedback ? "error" : ""}
            ></textarea>
            {errors.feedback && (
              <span className="error-message">{errors.feedback.message}</span>
            )}
          </div>

          <div className="modal-actions">
            <button
              type="submit"
              className="submit-feedback-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </button>
            <button
              type="button"
              className="cancel-button"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackModal;
