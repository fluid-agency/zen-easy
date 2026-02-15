import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import "./FeedbackModal.scss";
import { addNewFeedback } from "../../../services/professionalServices";
import { useNotification } from "../../../context/notification/NotificationContext";

type FeedbackFormData = {
  serviceId: any;
  rating: number;
  feedback: string;
};

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
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FeedbackFormData>();

  const { showSuccess, showError } = useNotification();

  const selectedRating = watch("rating");
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      reset();
      setHoverRating(0);
    }
  }, [isOpen, reset]);

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
      const result = await addNewFeedback(finalFeedbackDataForBackend);
      if (result?.success) {
        onClose();
        reset();
      }
    } catch (error: any) {
      console.error("Error submitting feedback:", error);
    }
  };

  if (!isOpen) return null;

  const displayRating = hoverRating || selectedRating;

  return (
    <div className="feedback-modal-overlay">
      <div className="feedback-modal-content">
        <button className="modal-close-button" onClick={onClose} disabled={isSubmitting}>
          &times;
        </button>

        <h2 className="modal-title">Share Your Feedback</h2>
        <p className="modal-subtitle">Help us improve by rating a service category.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="feedback-form">
          {/* Service Category */}
          <div className="form-group">
            <label>For which service category is this feedback?</label>
            <div className="select-wrapper">
              <select
                {...register("serviceId", { required: true })}
                className={errors.serviceId ? "error" : ""}
              >
                <option value="">Select a category</option>
                {services?.map((category) => (
                  <option key={category.id} value={category._id}>
                    {category.category}
                  </option>
                ))}
              </select>
              <svg className="select-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="6,9 12,15 18,9" />
              </svg>
            </div>
          </div>

          {/* ⭐⭐⭐⭐⭐ FIXED STAR RATING */}
          <div className="form-group">
            <label>Your Rating</label>

            <div
              className="star-rating"
              onMouseLeave={() => setHoverRating(0)}
            >
              {[5,4,3,2,1].map((star) => (
                <label key={star}>
                  {/* hidden radio for react-hook-form */}
                  <input
                    type="radio"
                    value={star}
                    {...register("rating", {
                      required: "Please give a rating.",
                      valueAsNumber: true,
                    })}
                    style={{ display: "none" }}
                  />

                  <span
                    className={`star ${star <= displayRating ? "selected" : ""}`}
                    onMouseEnter={() => setHoverRating(star)}
                    onClick={() => setValue("rating", star)}
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

          {/* Feedback */}
          <div className="form-group">
            <label>Your Feedback</label>
            <textarea
              {...register("feedback", {
                required: "Feedback is required.",
                minLength: { value: 10, message: "Feedback must be at least 10 characters." },
                maxLength: { value: 500, message: "Feedback cannot exceed 500 characters." },
              })}
              rows={5}
              className={errors.feedback ? "error" : ""}
            />
            {errors.feedback && (
              <span className="error-message">{errors.feedback.message}</span>
            )}
          </div>

          <div className="modal-actions">
            <button type="submit" className="submit-feedback-button" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </button>
            <button type="button" className="cancel-button" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackModal;
