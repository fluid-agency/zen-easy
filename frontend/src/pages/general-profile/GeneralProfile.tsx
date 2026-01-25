import { useContext, useEffect, useState } from "react";
import "./GeneralProfile.scss";
import { Link, Navigate, useParams } from "react-router-dom";
import { getUserProfileDetails } from "../../services/userProfileServices";
import Cookies from "js-cookie";
import FeedbackModal from "../../components/modals/feedback/FeedbackModal";
import { AuthContext } from "../../context/AuthContext";
import ProfileSkeleton from "../../components/ui/skeletons/general-profile/ProfileSkeleton";
import OrbitalSpinner from "../../components/ui/LoadingSpinner";

const GeneralProfile = () => {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { userId } = useParams<{ userId: string }>();
  const selfId = Cookies.get("zenEasySelfId");
  const authContext = useContext(AuthContext);

  if (!authContext) {
    console.error(
      "PrivateRoute: AuthContext is not available. Ensure AuthProvider wraps your application."
    );
    return <Navigate to={"/auth/login"} />;
  }

  const { logOut } = authContext
  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const result = await getUserProfileDetails(userId as string);
        if (result.success) {
          console.log(result.res);
          setUserProfile(result.res);
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        setLoading(false);
      }
    };
    getUserProfile();
  }, [userId, selfId]);

  const handleEditProfile = () => {
    window.location.href = `/main/edit-profile`;
  };
  //----------handle logout -------------
  const handleLogout = async () => {
    await logOut();
    window.location.href = "/";
  };
  //----------handle modal--------------
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  if (loading) {
    return (<div>
      <div className="hidden bg-primary min-h-screen min-w-full justify-center items-center lg:flex">
        <ProfileSkeleton />
      </div>
      <div className="flex min-h-screen justify-center items-center lg:hidden">
        <OrbitalSpinner />
      </div>
    </div>

    )
  }


  // -----------------------------------------//
  return (
    <div className="profile-container">
      <div className="profile-wrapper">
        {/* Header Section */}
        <div className="profile-header">
          <div className="profile-avatar">
            <img
              src={userProfile?.profileImage || "/images/profile/user.png"}
              alt="Profile"
              className="avatar-image"
            />
          </div>

          <div className="profile-intro">
            <h1 className="profile-name">
              {userProfile?.name || "Unknown User"}
            </h1>
            <p className="profile-occupation">
              {userProfile?.occupation || "No occupation listed"}
            </p>
          </div>

          {selfId == userProfile?._id ? (
            <>
              <div className="profile-actions">
                <button className="btn-edit" onClick={handleEditProfile}>
                  <svg viewBox="0 0 24 24" className="btn-icon">
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                  </svg>
                  Edit Profile
                </button>
                <button className="btn-logout" onClick={handleLogout}>
                  <svg viewBox="0 0 24 24" className="btn-icon">
                    <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.59L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
                  </svg>
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div>
              <button onClick={toggleModal} className="leave-review-btn">
                <span>Leave A Review</span>
              </button>
            </div>
          )}
        </div>

        {/* Content Grid */}
        <div className="profile-content">
          {/* Personal Information Card */}
          <div className="info-card personal-card">
            <div className="card-header">
              <svg viewBox="0 0 24 24" className="card-icon">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
              <h2>Personal Information</h2>
            </div>

            <div className="card-content">
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Phone</span>
                  <span className="info-value">
                    {userProfile?.phoneNumber || "Not provided"}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">WhatsApp</span>
                  <span className="info-value">
                    {userProfile?.whatsapp || "Not available"}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Email</span>
                  <span className="info-value">
                    {userProfile?.email || "Not provided"}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Date of Birth</span>
                  <span className="info-value">
                    {userProfile?.dateOfBirth
                      ? new Date(userProfile.dateOfBirth).toLocaleDateString()
                      : "Not provided"}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Gender</span>
                  <span className="info-value">
                    {userProfile?.gender || "Not specified"}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Nationality</span>
                  <span className="info-value">
                    {userProfile?.nationality || "Not specified"}
                  </span>
                </div>
                <div className="info-item address-item">
                  <span className="info-label">Address</span>
                  <span className="info-value mb-[20px]">
                    <span>Address Line : </span>
                    {userProfile?.address?.street || "Not provided"}
                  </span>
                  <span className="info-value mb-[20px]">
                    <span>City : </span>
                    {userProfile?.address?.city || "Not provided"}
                  </span>
                  <span className="info-value">
                    <span>Postal code : </span>
                    {userProfile?.address?.postalCode || "Not provided"}
                  </span>
                </div>
              </div>

              {/* Social Media Links */}
              {userProfile?.socialMedia && (
                <div className="social-section">
                  <h3>Social Media</h3>
                  <div className="social-links">
                    {userProfile.socialMedia.facebook && (
                      <Link
                        to={userProfile.socialMedia.facebook}
                        className="social-link facebook"
                      >
                        <svg viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                        Facebook
                      </Link>
                    )}
                    {userProfile.socialMedia.instagram && (
                      <Link
                        to={userProfile.socialMedia.instagram}
                        className="social-link instagram"
                      >
                        <svg viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                        Instagram
                      </Link>
                    )}
                    {userProfile.socialMedia.linkedin && (
                      <Link
                        to={userProfile.socialMedia.linkedin}
                        className="social-link linkedin"
                      >
                        <svg viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                        LinkedIn
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Professional Information Card */}
          <div className="info-card professional-card">
            <div className="card-header">
              <svg viewBox="0 0 24 24" className="card-icon">
                <path d="M20 6h-2.18c.11-.31.18-.65.18-1a2.996 2.996 0 0 0-5.5-1.65l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z" />
              </svg>
              <h2>Professional Information</h2>
            </div>

            <div className="card-content">
              {userProfile?.professionalProfiles &&
                userProfile.professionalProfiles.length > 0 ? (
                <div className="professional-profiles">
                  <h3>Professional Profiles</h3>
                  <div className="profiles-grid">
                    {userProfile.professionalProfiles.map(
                      (profession: any, index: number) => (
                        <Link
                          to={`/main/prof-profile/${userId}`}
                          className="profile-item"
                          key={index}
                        >
                          <div className="profile-content relative">
                            <span className="profile-name">
                              {profession.category}
                            </span>
                            {
                              profession.isApproved == 'approved' ?
                                <> <span
                                  className={`text-[10px] font-semibold absolute -bottom-4 left-[5px] ${profession.status === "active"
                                      ? "text-green-600"
                                      : "text-red-500"
                                    }`}
                                >
                                  {profession.status}
                                </span></> : <p className="text-gray-500 text-sm">Pending Approval</p>
                            }
                          </div>
                          <button className="view-btn">
                            <svg viewBox="0 0 24 24">
                              <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                            </svg>
                            View
                          </button>
                        </Link>
                      )
                    )}
                  </div>
                </div>
              ) : (
                <div className="empty-state">
                  <svg viewBox="0 0 24 24" className="empty-icon">
                    <path d="M22 9V7h-2V5c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-2h2v-2h-2v-2h2v-2h-2V9h2zm-4 10H4V5h14v14z" />
                    <path d="M6 13h5v4H6zm6-6h4v3h-4zM6 7h5v5H6zm6 4h4v6h-4z" />
                  </svg>
                  <p>No professional profiles added yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <FeedbackModal
        isOpen={isModalOpen}
        onClose={toggleModal}
        clientId={selfId as string}
        provider={userId as string}
        services={userProfile?.professionalProfiles}
      />
    </div>
  );
};

export default GeneralProfile;
