import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getUserProfileDetails } from "../../services/userProfileServices";
import OrbitalSpinner from "../../components/ui/LoadingSpinner";
import Cookies from "js-cookie";
import type { TServiceCategory } from "../../utils/types/serviceTitleType";
import "./profProfile.scss";
import ReviewsModal from "../../components/modals/reviews/ReviewsModal";

// --- Types
export type TProfessinalService = {
  _id: string;
  addressLine: string;
  availableDays: string[];
  availableTime: "day" | "night" | "always";
  category: TServiceCategory;
  contactNumber: string;
  coverImage?: string;
  createdAt: string;
  description: string;
  maximumPrice: number;
  minimumPrice: number;
  provider: string;
  ratings: TRating[];
  serviceArea: string[];
  status: "active" | "inactive";
  updatedAt: string;
};

export type TRating = {
  client: string;
  rating: number;
  feedback: string;
};

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
  professionalProfiles: TProfessinalService[];
  socialMedia?: TUserSocialMedia;
  isVerified: boolean;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
};

const serviceIcons: Record<TServiceCategory, string> = {
  Maid: "🏠",
  "Home Shifter": "🚚",
  Tutor: "📖",
  Electrician: "⚡",
  "IT Provider": "💻",
  Painter: "🎨",
  Plumber: "🔧",
};

const ProfProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [userProfile, setUserProfile] = useState<TUserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const selfId = Cookies.get("zenEasySelfId") || "";
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);
  const [currentServiceRatings, setCurrentServiceRatings] = useState<TRating[]>(
    []
  );
  const [currentServiceCategory, setCurrentServiceCategory] = useState<
    TServiceCategory | ""
  >("");
    // --- Reviews Modal Handlers ---
    const openReviewsModal = (
      ratings: TRating[],
      serviceCategory: TServiceCategory
    ) => {
      setCurrentServiceRatings(ratings);
      setCurrentServiceCategory(serviceCategory);
      setIsReviewsModalOpen(true);
    };
  
    const closeReviewsModal = () => {
      setIsReviewsModalOpen(false);
      setCurrentServiceRatings([]);
      setCurrentServiceCategory("");
    };

  // --- Fetch user profile and professional details ---
  useEffect(() => {
    const fetchUserProfileDetails = async () => {
      setLoading(true);
      setError(null);
      setUserProfile(null);

      if (!id) {
        setError("User ID is missing from the URL.");
        setLoading(false);
        return;
      }

      try {
        const response = await getUserProfileDetails(id as string);

        if (response?.success && response.res) {
          setUserProfile(response.res as TUserProfile);
        } else {
          setError(
            (response && "message" in response
              ? (response as any).message
              : undefined) || "Failed to fetch user profile."
          );
        }
      } catch (err: any) {
        console.error("Error fetching user profile:", err);
        setError(
          err.message || "An unexpected error occurred while loading profile."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfileDetails();
  }, [id]);

  const capitalizeWords = (str: string) => {
    if (!str) return "";
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  if (loading) {
    return (
      <div className="prof-profile-wrapper flex justify-center items-center loading-state">
        <OrbitalSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="prof-profile-wrapper error-state">
        <div className="error-icon">⚠️</div>
        <h2>Error Loading Profile</h2>
        <p>{error}</p>
        <p>Please try again later or check your network connection.</p>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="prof-profile-wrapper no-data-state">
        <div className="no-data-icon">😔</div>
        <h2>Profile Not Found</h2>
        <p>The user profile you are looking for does not exist.</p>
      </div>
    );
  }
  // ------------- Main div ------------------------
  return (
    <div className="prof-profile-wrapper">
      <div className="prof-profile-container">
        {/* --- Left Column: User Profile Details --- */}
        <div className="user-profile-card">
          <div className="profile-header">
            <div className="profile-image-container">
              <img
                src={
                  userProfile.profileImage ||
                  "https://via.placeholder.com/150/CCCCCC/888888?text=No+Image"
                }
                alt={`${userProfile.name}'s profile`}
                className="profile-image"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://via.placeholder.com/150/CCCCCC/888888?text=Error";
                }}
              />
            </div>
            <h1 className="profile-name">{userProfile.name}</h1>
            <p className="profile-status">
              Status:{" "}
              <span className={`status-pill status-${userProfile.status}`}>
                {capitalizeWords(userProfile.status)}
              </span>
            </p>
          </div>

          <div className="profile-info-section">
            <h2>Contact Information</h2>
            <ul className="info-list">
              <li>
                <span className="icon">📧</span> Email: {userProfile.email}
              </li>
              <li>
                <span className="icon">📞</span> Phone:{" "}
                {userProfile.phoneNumber}
              </li>
              <li>
                <span className="icon">🏠</span> Address:{" "}
                {userProfile.address.street}, {userProfile.address.city},{" "}
                {userProfile.address.postalCode}
              </li>
            </ul>
          </div>

          <div className="profile-info-section">
            <h2>Personal Details</h2>
            <ul className="info-list">
              <li>
                <span className="icon">🎂</span> Born:{" "}
                {new Date(userProfile.dateOfBirth).toLocaleDateString("en-GB", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </li>
              <li>
                <span className="icon">🚻</span> Gender: {userProfile.gender}
              </li>
              <li>
                <span className="icon">🌍</span> Nationality:{" "}
                {userProfile.nationality}
              </li>
              {userProfile.occupation && (
                <li>
                  <span className="icon">💼</span> Occupation:{" "}
                  {userProfile.occupation}
                </li>
              )}
              {userProfile.nid && (
                <li>
                  <span className="icon">🆔</span> NID: {userProfile.nid}
                </li>
              )}
              {userProfile.isVerified && (
                <li className="verified-status">
                  <span className="icon">✅</span> Account Verified
                </li>
              )}
            </ul>
          </div>

          {userProfile.socialMedia &&
            (userProfile.socialMedia.facebook ||
              userProfile.socialMedia.instagram ||
              userProfile.socialMedia.linkedin) && (
              <div className="profile-info-section">
                <h2>Social Media</h2>
                <div className="social-links">
                  {userProfile.socialMedia.facebook && (
                    <a
                      href={userProfile.socialMedia.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link facebook"
                    >
                      Facebook
                    </a>
                  )}
                  {userProfile.socialMedia.instagram && (
                    <a
                      href={userProfile.socialMedia.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link instagram"
                    >
                      Instagram
                    </a>
                  )}
                  {userProfile.socialMedia.linkedin && (
                    <a
                      href={userProfile.socialMedia.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link linkedin"
                    >
                      LinkedIn
                    </a>
                  )}
                </div>
              </div>
            )}
        </div>

        {/* --- Right Column: Professional Profiles --- */}
        <div className="professional-profiles-column">
          <h2>Professional Services Offered</h2>
          {userProfile.professionalProfiles.length === 0 ? (
            <div className="no-professional-profiles">
              <div className="icon">🛠️</div>
              <p>No professional services.</p>
            </div>
          ) : (
            userProfile.professionalProfiles.slice(0, 2).map(
              (
                service // Display at most 2 profiles
              ) => (
                <div
                  key={service._id}
                  className="professional-service-card-design"
                >
                  <div className="card-header-main">
                    <div className="category-and-status">
                      <span className="category-icon">
                        {serviceIcons[service.category] || "✨"}
                      </span>
                      <p className="category-name">
                        {capitalizeWords(service.category)}
                      </p>
                      <span
                        className={`service-card-status status-${service.status}`}
                      >
                        {capitalizeWords(service.status)}
                      </span>
                    </div>
                  </div>

                  <div className="card-profile-summary">
                    <p className="professional-name">{userProfile.name}</p>
                    {userProfile.occupation && (
                      <p className="professional-occupation">
                        {userProfile.occupation}
                      </p>
                    )}
                  </div>

                  <div className="card-contact-summary">
                    <p className="contact-item">
                      <span className="icon">📞</span> {service.contactNumber}
                    </p>
                    {/* Use user's email directly from userProfile state */}
                    <p className="contact-item">
                      <span className="icon">📧</span> {userProfile.email}
                    </p>
                  </div>

                  <div className="card-description-area">
                    <p>{service.description}</p>
                  </div>

                  <div className="card-details-grid">
                    <div className="detail-row">
                      <span className="detail-label">Price Range:</span>
                      <span className="detail-value">
                        ৳{service.minimumPrice} - ৳{service.maximumPrice} BDT
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Availability:</span>
                      <span className="detail-value">
                        {capitalizeWords(service.availableTime)}
                      </span>
                    </div>
                    <div className="detail-row full-row">
                      <span className="detail-label">Available Days:</span>
                      <span className="detail-value">
                        {service.availableDays.join(", ")}
                      </span>
                    </div>
                    <div className="detail-row full-row">
                      <span className="detail-label">Service Area:</span>
                      <span className="detail-value">
                        {service.serviceArea.join(", ")}
                      </span>
                    </div>
                    <div className="detail-row full-row">
                      <span className="detail-label">Base Address:</span>
                      <span className="detail-value">
                        {service.addressLine}
                      </span>
                    </div>
                    {service.ratings && service.ratings.length > 0 && (
                      <div className="detail-row full-row rating-row">
                        <span className="detail-label">Rating:</span>
                        <span className="detail-value">
                          <button
                            onClick={() =>
                              openReviewsModal(
                                service.ratings!,
                                service.category
                              )
                            }
                            className="cursor-pointer"
                          >
                            ⭐{" "}
                            {(
                              service.ratings.reduce(
                                (sum, r) => sum + r.rating,
                                0
                              ) / service.ratings.length
                            ).toFixed(1)}
                            /5 ({service.ratings.length} reviews)
                          </button>
                        </span>
                      </div>
                    )}
                    {selfId === userProfile._id && (
                      <Link
                        to={`/main/edit-profession/${service._id}`}
                        className="edit-profession"
                      >
                        ✏️ Edit Profession
                      </Link>
                    )}
                  </div>
                </div>
              )
            )
          )}
        </div>
      </div>
      {/* Reviews Modal */}
      {isReviewsModalOpen && (
        <ReviewsModal
          isOpen={isReviewsModalOpen}
          onClose={closeReviewsModal}
          reviews={currentServiceRatings}
          serviceCategory={currentServiceCategory}
        />
      )}
    </div>
  );
};

export default ProfProfile;
