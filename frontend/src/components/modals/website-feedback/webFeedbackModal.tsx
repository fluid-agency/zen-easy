import React, { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import "./webFeedbackModal.scss";
import { useNotification } from "../../../context/notification/NotificationContext";

const getCookie = (name: string) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
};

type ReviewFormData = {
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
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReviewFormData>({
    defaultValues: { rating: 0 },
  });

  const { showSuccess, showError } = useNotification();

  const selectedRating = watch("rating");
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      reset();
      setHoverRating(0);
    }
  }, [isOpen, reset]);

  const handleFormSubmit: SubmitHandler<ReviewFormData> = async (data) => {
    try {
      const userId = getCookie("zenEasySelfId");

      if (!userId) {
        showError("User not identified. Please login again.");
        return;
      }

      await onSubmitReview({
        user: userId,
        rating: data.rating,
        text: data.comment,
      });

      showSuccess("Thank you for your review!");
      onClose();
    } catch {
      showError("Something went wrong. Please try again.");
    }
  };

  if (!isOpen) return null;

  const displayRating = hoverRating || selectedRating;

  return (
    <div className="review-modal-overlay">
      <div className="review-modal-content">
        <button className="close-x" onClick={onClose}>&times;</button>
        <h2>Rate Our Service</h2>

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          {/* Star Rating */}
          <div className="form-group">
            <label>Your Rating</label>

            <div
              className="star-rating"
              onMouseLeave={() => setHoverRating(0)}
            >
              {[5,4,3,2,1].map((num) => (
                <span
                  key={num}
                  className={`star ${num <= displayRating ? "selected" : ""}`}
                  onMouseEnter={() => setHoverRating(num)}
                  onClick={() => setValue("rating", num)}
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          {/* Comment */}
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
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
