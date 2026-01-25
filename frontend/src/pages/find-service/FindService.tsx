import { Link, useParams } from "react-router-dom";
import "./FindSevice.scss";
import { useCallback, useEffect, useMemo, useState } from "react";
import { findServicesByCategory } from "../../services/professionalServices";
import debounce from "lodash.debounce";
import ReviewsModal from "../../components/modals/reviews/ReviewsModal";
import OrbitalSpinner from "../../components/ui/LoadingSpinner";
import type { TServiceCategory } from "../../utils/types/serviceTitleType";

// type
export type TProfessinalService = {
  _id: string;
  provider: {
    _id: string;
    name: string;
  };
  category: TServiceCategory;
  contactNumber: string;
  addressLine: string;
  serviceArea: string[];
  description: string;
  minimumPrice: number;
  maximumPrice: number;
  availableDays: string[];
  availableTime: "day" | "night" | "always";
  coverImage?: string;
  isApproved?:"approved" | "pending" | "rejected";
  ratings?: TRating[];
  status?: "active" | "inactive";
};

export type TRating = {
  client: string;
  rating: number;
  feedback: string;
};

// Icons
const serviceIcons: Record<TServiceCategory, string> = {
  Maid: "🏠",
  "Home Shifter": "🚚",
  Tutor: "👨‍🏫",
  Electrician: "⚡",
  "IT Provider": "💻",
  Painter: "🎨",
  Plumber: "🔧",
};

const FindService = () => {
  const { category } = useParams<{ category: string }>();

  const [allServices, setAllServices] = useState<TProfessinalService[]>([]);
  const [displayedServices, setDisplayedServices] = useState<
    TProfessinalService[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // --- Filter and Sort states ---
  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [selectedAvailableTime, setSelectedAvailableTime] = useState<
    "all" | "day" | "night" | "always"
  >("all");
  const [sortBy, setSortBy] = useState("minimumPrice");
  const [sortOrder, setSortOrder] = useState("asc");

  // --- State for Reviews Modal ---
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);
  const [currentServiceRatings, setCurrentServiceRatings] = useState<TRating[]>(
    []
  );
  const [currentServiceCategory, setCurrentServiceCategory] = useState<
    TServiceCategory | ""
  >("");

  // ---------------- Fetch all services ----------------
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [category]);
  
  useEffect(() => {
    const fetchAllServices = async () => {
      setLoading(true);
      setError(null);
      setAllServices([]);
      setDisplayedServices([]);

      if (!category) {
        setError("No service category specified in the URL.");
        setLoading(false);
        return;
      }

      try {
        const result = await findServicesByCategory(category as string);
        if (result?.success && Array.isArray(result.data)) {
          const approvedActiveServices = result.data.filter(
            (service:TProfessinalService)=>
              service.isApproved==='approved' && service.status==='active'
          );
          setAllServices(approvedActiveServices);
          setDisplayedServices(approvedActiveServices);
        } else {
          setError(
            result?.message ||
              `Failed to find services for category: ${category}`
          );
          setAllServices([]);
        }
      } catch (err: any) {
        console.error("Error fetching services:", err);
        setError(
          err.message || "An unexpected error occurred while fetching services."
        );
        setAllServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllServices();
  }, [category]);

  // ---------- Apply filters and sorting ----------------
  useEffect(() => {
    let filteredAndSortedServices = [...allServices];

    // --- Search Filter ---
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      filteredAndSortedServices = filteredAndSortedServices.filter(
        (service) =>
          service.addressLine.toLowerCase().includes(lowerCaseSearchTerm) ||
          service.description.toLowerCase().includes(lowerCaseSearchTerm) ||
          service.serviceArea.some((area) =>
            area.toLowerCase().includes(lowerCaseSearchTerm)
          ) ||
          service.provider.name.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }

    // --- Price Range Filter ---
    const min = parseFloat(minPrice);
    const max = parseFloat(maxPrice);

    if (!isNaN(min)) {
      filteredAndSortedServices = filteredAndSortedServices.filter(
        (service) => service.minimumPrice >= min
      );
    }
    if (!isNaN(max)) {
      filteredAndSortedServices = filteredAndSortedServices.filter(
        (service) => service.maximumPrice <= max
      );
    }

    // --- Availability Time Filter ---
    if (selectedAvailableTime !== "all") {
      filteredAndSortedServices = filteredAndSortedServices.filter(
        (service) => service.availableTime === selectedAvailableTime
      );
    }

    // --- Sorting ---
    filteredAndSortedServices.sort((a, b) => {
      let comparison = 0;
      if (sortBy === "minimumPrice") {
        comparison = a.minimumPrice - b.minimumPrice;
      } else if (sortBy === "ratings") {
        const avgRatingA =
          a.ratings && a.ratings.length > 0
            ? a.ratings.reduce((acc, r) => acc + r.rating, 0) / a.ratings.length
            : 0;
        const avgRatingB =
          b.ratings && b.ratings.length > 0
            ? b.ratings.reduce((acc, r) => acc + r.rating, 0) / b.ratings.length
            : 0;
        comparison = avgRatingA - avgRatingB;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    setDisplayedServices(filteredAndSortedServices);
  }, [
    allServices,
    searchTerm,
    minPrice,
    maxPrice,
    selectedAvailableTime,
    sortBy,
    sortOrder,
  ]);

  // --- Debounce ---
  const debouncedSetSearchTerm = useCallback(
    debounce((value: string) => {
      setSearchTerm(value);
    }, 100),
    []
  );

  useEffect(() => {
    return () => {
      debouncedSetSearchTerm.cancel();
    };
  }, [debouncedSetSearchTerm]);

  // ---capitalize words ---
  const capitalizeWords = (str: string) => {
    if (!str) return "";
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const getTotalFilteredCount = useMemo(() => {
    return displayedServices.length;
  }, [displayedServices]);

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

  return (
    <div className="find-service-page-wrapper">
      <div className="find-service-container">
        <div className="filter-sidebar">
          <div className="filter-header">
            <h2>Filter & Sort Services</h2>
            <div className="filter-count">
              {getTotalFilteredCount} {capitalizeWords(category || "")} Services
              Found
            </div>
          </div>

          {/* --- Search Input --- */}
          <div className="filter-group search-group">
            <label htmlFor="search">Search Services</label>
            <div className="search-input-wrapper">
              <svg
                className="search-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                id="search"
                placeholder="Search by area, description, provider..."
                onChange={(e) => debouncedSetSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* --- Price Range Filter --- */}
          <div className="filter-group price-group">
            <label>Price Range (BDT)</label>
            <div className="price-inputs">
              <div className="price-input-wrapper">
                <span className="currency-symbol">৳</span>
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
              </div>
              <div className="price-separator">to</div>
              <div className="price-input-wrapper">
                <span className="currency-symbol">৳</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* --- Available Time Filter --- */}
          <div className="filter-group">
            <label htmlFor="availableTime">Availability</label>
            <div className="select-wrapper">
              <select
                id="availableTime"
                value={selectedAvailableTime}
                onChange={(e) =>
                  setSelectedAvailableTime(
                    e.target.value as typeof selectedAvailableTime
                  )
                }
              >
                <option value="all">Any Time</option>
                <option value="day">Day Time ☀️</option>
                <option value="night">Night Time 🌙</option>
                <option value="always">24/7 Available 🕐</option>
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

          {/* --- Sort By Options --- */}
          <div className="filter-group">
            <label htmlFor="sortBy">Sort By</label>
            <div className="select-wrapper">
              <select
                id="sortBy"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="minimumPrice">Price</option>
                <option value="ratings">Rating</option>
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

          {/* --- Sort Order Radio Buttons --- */}
          <div className="filter-group">
            <label>Order</label>
            <div className="radio-group">
              <label className="radio-option">
                <input
                  type="radio"
                  name="sortOrder"
                  value="asc"
                  checked={sortOrder === "asc"}
                  onChange={(e) => setSortOrder(e.target.value)}
                />
                <span className="radio-custom"></span>
                <span className="radio-label">Ascending</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="sortOrder"
                  value="desc"
                  checked={sortOrder === "desc"}
                  onChange={(e) => setSortOrder(e.target.value)}
                />
                <span className="radio-custom"></span>
                <span className="radio-label">Descending</span>
              </label>
            </div>
          </div>

          {/* --- Clear Filters Button --- */}
          <div className="clear-filters">
            <button
              className="btn-clear"
              onClick={() => {
                setSearchTerm("");
                setMinPrice("");
                setMaxPrice("");
                setSelectedAvailableTime("all");
                setSortBy("minimumPrice");
                setSortOrder("asc");
                const searchInput = document.getElementById(
                  "search"
                ) as HTMLInputElement;
                if (searchInput) searchInput.value = "";
              }}
            >
              Clear All Filters
            </button>
          </div>
        </div>

        {/* --- Services Display ------------- */}
        <div className="services-display-area">
          <div className="page-main-header">
            <h1 className="page-main-title">
              {serviceIcons[category as TServiceCategory] || "✨"}{" "}
              {capitalizeWords(category || "All")} Professionals
            </h1>
            <p className="page-main-subtitle">
              Browse and connect with verified service providers in your area.
            </p>
          </div>

          {loading ? (
            <div className="">
              <OrbitalSpinner />
            </div>
          ) : error ? (
            <div className="error-state service-list-message">
              <div className="error-icon">⚠️</div>
              <h2>Oops! Something went wrong.</h2>
              <p>{error}</p>
              <p>We're having trouble loading services. Please try again.</p>
            </div>
          ) : displayedServices.length === 0 ? (
            <div className="no-services-found service-list-message">
              <h2>No Matching Services Found</h2>
            </div>
          ) : (
            <div className="service-cards-grid">
              {displayedServices.map((service, index) => (
                <div
                  key={service?._id}
                  className="service-card"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="card-image-container">
                    <img
                      src={
                        service.coverImage ||
                        `https://via.placeholder.com/400x300/E4ED64/000000?text=${capitalizeWords(
                          service.category
                        )}`
                      }
                      alt={`${service.category} service cover`}
                      className="card-image"
                      onError={(e) => {
                        e.currentTarget.src = `https://via.placeholder.com/400x300/CCCCCC/888888?text=Image+Error`;
                      }}
                    />
                    <span
                      className={`service-status status-${
                        service.status?.toLowerCase() || "active"
                      }`}
                    >
                      {capitalizeWords(service.status || "Active")}
                    </span>
                    {service.ratings && service.ratings.length > 0 && (
                      <div className="service-rating">
                        ⭐{" "}
                        {(
                          service.ratings.reduce(
                            (acc, r) => acc + r.rating,
                            0
                          ) / service.ratings.length
                        ).toFixed(1)}
                        /5
                      </div>
                    )}
                  </div>
                  <div className="card-content">
                    <Link to={`/main/profile/${service?.provider?._id}`}>
                      <h3 className="provider-name">
                        {service?.provider?.name}
                      </h3>
                    </Link>
                    <h3 className="card-category">
                      {serviceIcons[service.category] || "✨"}{" "}
                      {capitalizeWords(service.category)}
                    </h3>
                    <p className="card-description">
                      {service.description.length > 120
                        ? `${service.description.substring(0, 120)}...`
                        : service.description}
                    </p>
                    <div className="card-meta-grid">
                      <div className="meta-item-group">
                        <span className="icon">📍</span>
                        <span className="text">{service.addressLine}</span>
                      </div>
                      <div className="meta-item-group">
                        <span className="icon">🗺️</span>
                        <span className="text">
                          {service.serviceArea.join(", ")}
                        </span>
                      </div>
                      <div className="meta-item-group">
                        <span className="icon">📞</span>
                        <span className="text">{service.contactNumber}</span>
                      </div>
                      <div className="meta-item-group">
                        <span className="icon">⏰</span>
                        <span className="text">
                          Available: {capitalizeWords(service.availableTime)}
                        </span>
                      </div>
                      <div className="meta-item-group price-range">
                        <span className="icon">৳</span>
                        <span className="text">
                          {service.minimumPrice} - {service.maximumPrice} BDT
                        </span>
                      </div>
                    </div>

                    {service.ratings && service.ratings.length > 0 && (
                      <button
                        className="see-reviews-btn"
                        onClick={() =>
                          openReviewsModal(service.ratings!, service.category)
                        }
                      >
                        See Reviews ({service.ratings.length})
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
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

export default FindService;
