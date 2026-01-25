import React from "react";
import "./ReviewsModal.scss";
import { Link } from "react-router-dom";
import type { TServiceCategory } from "../../../utils/types/serviceTitleType";

// --- Type
export type TRating = {
  client: any;
  rating: number;
  feedback: string;
};


// --- Props  ---
interface ReviewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  reviews: TRating[];
  serviceCategory: TServiceCategory | "";
}

const ReviewsModal: React.FC<ReviewsModalProps> = ({
  isOpen,
  onClose,
  reviews,
  serviceCategory,
}) => {
  if (!isOpen) {
    return null;
  }

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`star-icon ${i <= rating ? "filled" : ""}`}>
          ★
        </span>
      );
    }
    return <div className="stars-wrapper">{stars}</div>;
  };

  return (
    <div className="reviews-modal-overlay">
      <div className="reviews-modal-content">
        <button className="modal-close-button" onClick={onClose}>
          &times;
        </button>

        <h2 className="modal-title">
          Reviews for{" "}
          {serviceCategory ? `${serviceCategory} Service` : "Service"}
        </h2>
        <p className="modal-subtitle">Total Reviews: {reviews.length}</p>

        {reviews.length === 0 ? (
          <div className="no-reviews-message">
            <p>No reviews available yet for this service.</p>
            <p>Be the first to leave feedback!</p>
          </div>
        ) : (
          <div className="reviews-list-container">
            {reviews.map((review, index) => (
              <div key={index} className="review-card">
                <div className="review-header">
                  <p className="client-name"><Link to={`/main/profile/${review?.client?._id}`}>{review.client?.name}</Link></p>
                  {renderStars(review.rating)}
                </div>
                <p className="review-feedback">{review.feedback}</p>
              </div>
            ))}
          </div>
        )}

        <div className="modal-actions">
          <button type="button" className="close-button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewsModal;
