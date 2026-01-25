import './ProfileSkeleton.scss';
const ProfileSkeleton = () => {
  return (
     <div className="profile-container">
        <div className="loading-skeleton">
          <div className="skeleton-header">
            <div className="skeleton-avatar"></div>
            <div className="skeleton-intro">
              <div className="skeleton-line name"></div>
              <div className="skeleton-line occupation"></div>
            </div>
            <div className="skeleton-actions">
              <div className="skeleton-button"></div>
              <div className="skeleton-button"></div>
            </div>
          </div>
          <div className="skeleton-content-grid">
            <div className="skeleton-card">
              <div className="skeleton-card-header"></div>
              <div className="skeleton-info-line long"></div>
              <div className="skeleton-info-line short"></div>
              <div className="skeleton-info-line"></div>
              <div className="skeleton-info-line short"></div>
            </div>
            <div className="skeleton-card">
              <div className="skeleton-card-header"></div>
              <div className="skeleton-info-line long"></div>
              <div className="skeleton-info-line short"></div>
              <div className="skeleton-info-line"></div>
              <div className="skeleton-info-line short"></div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default ProfileSkeleton ;