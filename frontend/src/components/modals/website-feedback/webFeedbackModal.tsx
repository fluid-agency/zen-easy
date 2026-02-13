import React, { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import "./webFeedbackModal.scss";
import { useNotification } from "../../../context/notification/NotificationContext";


const getCookie = (name: string) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
};

type ReviewFormData = {
  serviceCategory: string; 
  rating: number;
  comment: string; 
};

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitReview: (data: any) => Promise<void>;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, onSubmitReview }) => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReviewFormData>({
    defaultValues: { rating: 5 },
  });

  const { showSuccess, showError } = useNotification();
  const watchedRating = watch("rating");

  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen, reset]);

  const handleFormSubmit: SubmitHandler<ReviewFormData> = async (data) => {
    try {
      const userId = getCookie("zenEasySelfId");

      if (!userId) {
        showError("User not identified. Please login again.");
        return;
      }
      const feedbackPayload = {
        user: userId,         
        rating: data.rating,   
        text: data.comment,   
      };

      await onSubmitReview(feedbackPayload);
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
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          {/* Star Rating Section */}
          <div className="form-group">
            <label>Your Rating</label>
            <div className="star-group">
              {[1, 2, 3, 4, 5].map((num) => (
                <label key={num}>
                  <input
                    type="radio"
                    value={num}
                    {...register("rating", { valueAsNumber: true })}
                    style={{ display: 'none' }}
                  />
                  <span className={`star ${num <= watchedRating ? "filled" : ""}`}>★</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Review Comment</label>
            <textarea
              {...register("comment", { 
                required: "Please write a comment",
                minLength: { value: 10, message: "Min 10 characters required" }
              })}
              placeholder="Tell us what you liked..."
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