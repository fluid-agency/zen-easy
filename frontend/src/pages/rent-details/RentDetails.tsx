import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./RentDetails.scss";
import { deleteRentPost, getRentDetails } from "../../services/rentServices";
import Cookies from "js-cookie";
import OrbitalSpinner from "../../components/ui/LoadingSpinner";
import { useNotification } from "../../context/notification/NotificationContext";

const RentDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [rentProperty, setRentProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const selfId = Cookies.get("zenEasySelfId") || "";
  const {showSuccess} = useNotification();

  // ------scroll to top----------
   useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto' 
    });
  }, [id])

  // -----------fetch rent details ------------

  useEffect(() => {
    const fetchRentDetails = async () => {
      setLoading(true);
      setError(null);
      setRentProperty(null);
      try {
        const result = await getRentDetails(id as string);
        if (result?.success) {
          setRentProperty(result.data);
        } else {
          setError("Rent details not found!");
        }
      } catch (err: any) {
        console.error("Failed to fetch rent details:", err);
        setError(err.message || "Could not load property details.");
      } finally {
        setLoading(false);
      }
    };

    fetchRentDetails();
  }, [id]);

  // Image slider navigation
  const goToNextImage = () => {
    if (rentProperty?.imageUrls) {
      setCurrentImageIndex((prevIndex) =>
        (prevIndex + 1) % rentProperty.imageUrls!.length
      );
    }
  };

  const goToPrevImage = () => {
    if (rentProperty?.imageUrls) {
      setCurrentImageIndex((prevIndex) =>
        (prevIndex - 1 + rentProperty.imageUrls!.length) % rentProperty.imageUrls!.length
      );
    }
  };

  if (loading) {
    return <div className="rent-details-container min-w-full min-h-screen flex justify-center items-center loading-state"><OrbitalSpinner/></div>;
  }

  if (error) {
    return (
      <div className="rent-details-container text-yellow-500 font-semibold flex justify-center items-center flex-col min-h-screen min-w-[100vw] error-state">
        <p>Error: {error}</p>
        <button onClick={() => window.location.href="/main/rent"} className="retry-btn">
          Back
        </button>
      </div>
    );
  }

  if (!rentProperty) {
    return <div className="rent-details-container no-data-state">No details available for this property.</div>;
  }

  const handleDelete = async(id:string) => {
     const result = await deleteRentPost(id); 
     showSuccess("Rent post deleted successfully", 2000)
     if(result.success){
      setTimeout(() => {
        window.location.href="/main/rent"
      }, 2000);
     }
  };

  return (
    <div className="rent-details-wrapper">
      <div className="rent-details-container">
        {/* Header Section */}
        <div className="rent-header">
          <h1 className="rent-title">{rentProperty.category.replace(/\b\w/g, (char: string) => char.toUpperCase())} for Rent</h1>
          <p className="rent-address-line">{rentProperty.addressLine}, {rentProperty.city}, {rentProperty.postalCode}</p>
          <p className="rent-cost">BDT {rentProperty.cost} <span className="frequency">/ {rentProperty.rentPaymentFrequency}</span></p>
        </div>

        {/* Image Carousel */}
        <div className="rent-image-gallery">
          {rentProperty.imageUrls && rentProperty.imageUrls.length > 0 ? (
            <>
              <div className="main-image-container">
                <img
                  src={rentProperty.imageUrls[currentImageIndex]}
                  alt={`Property Image ${currentImageIndex + 1}`}
                  className="main-image"
                />
                {rentProperty.imageUrls.length > 1 && (
                  <>
                    <button className="nav-button prev-button" onClick={goToPrevImage}>&lt;</button>
                    <button className="nav-button next-button" onClick={goToNextImage}>&gt;</button>
                  </>
                )}
              </div>
              {rentProperty.imageUrls.length > 1 && (
                <div className="thumbnail-gallery">
                  {rentProperty.imageUrls.map((url: string, index: number) => (
                    <img
                      key={index}
                      src={url}
                      alt={`Thumbnail ${index + 1}`}
                      className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="no-images-placeholder">No images available for this property.</div>
          )}
        </div>

        {/* Details Section */}
        <div className="rent-info-sections">
          <div className="info-card details-description">
            <h2>Property Details</h2>
            <p className="description-text">{rentProperty.details}</p>
          </div>

          <div className="info-card">
            <h2>Key Information</h2>
            <ul className="key-info-list">
              <li><strong>Category:</strong> {rentProperty.category.replace(/\b\w/g, (char: string) => char.toUpperCase())}</li>
              <li><strong>Rent:</strong> BDT {rentProperty.cost} / {rentProperty.rentPaymentFrequency}</li>
              <li><strong>Available From:</strong> {new Date(rentProperty.rentStartDate).toLocaleDateString('en-GB', {year: 'numeric', month: 'long', day: 'numeric'})}</li>
              <li><strong>Posted On:</strong> {new Date(rentProperty.createdAt).toLocaleDateString('en-GB', {year: 'numeric', month: 'long', day: 'numeric'})}</li>
              <li><strong>Contact:</strong> {rentProperty.contactInfo}</li>
              <li><strong>Posted by:</strong><Link className="primary font-semibold cursor-pointer" to={`/main/profile/${rentProperty?.user?._id}`}> {rentProperty?.user?.name}</Link></li>
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        {
          selfId === rentProperty?.user?._id && (
            <div className="rent-actions">
              <button onClick={()=>handleDelete(rentProperty?._id)} className="delete-btn">Delete Listing</button>
            </div>
          )
        }
      </div>
    </div>
  );
};

export default RentDetailsPage;
