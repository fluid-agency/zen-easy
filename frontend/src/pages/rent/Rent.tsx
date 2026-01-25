import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./Rent.scss";
import { getRentPosts } from "../../services/rentServices";
import OrbitalSpinner from "../../components/ui/LoadingSpinner";
import debounce from "lodash.debounce";
import { rentCategories } from "../../utils/constants";
import InfiniteScroll from "react-infinite-scroll-component";
import Cookies from "js-cookie";

const RentPage = () => {
  const [rentPosts, setRentPosts] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [minPrice, setMinPrice] = useState<any>();
  const [maxPrice, setMaxPrice] = useState<any>();
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [hasMore, setHasMore] = useState(true);
  const selfId = Cookies.get("zenEasySelfId") || "";

  const [currentPage, setCurrentPage] = useState(1);
  const [allRentPosts, setAllRentPosts] = useState<any>([]);
  const POSTS_PER_PAGE = 12;
  const [postedBYFilter, setPostedBYFilter] = useState<"all" | "you" | "others">("all");

  // ----rent posts----
  useEffect(() => {
    const getAllRentPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getRentPosts();
        if (result.success) {
          setAllRentPosts(result.data);
          const initialPosts = result.data.slice(0, POSTS_PER_PAGE);
          setRentPosts(initialPosts);
          setHasMore(result.data.length > POSTS_PER_PAGE);
        } else {
          setAllRentPosts([]);
          setRentPosts([]);
          setHasMore(false);
        }
      } catch (error) {
        console.log(error);
        setError("An error occurred while fetching posts");
      } finally {
        setLoading(false);
      }
    };

    getAllRentPosts();
  }, []);

//------------------------------------------//
  const loadMorePosts = useCallback(() => {
    if (!hasMore || loading) return;

    const nextPage = currentPage + 1;
    const startIndex = currentPage * POSTS_PER_PAGE;
    const endIndex = startIndex + POSTS_PER_PAGE;

    let filteredAllPosts = [...allRentPosts];

    // Search Filter
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm?.toLowerCase();
      filteredAllPosts = filteredAllPosts.filter(
        (post: any) =>
          post.addressLine?.toLowerCase().includes(lowerCaseSearchTerm) ||
          post.description?.toLowerCase().includes(lowerCaseSearchTerm) ||
          post.propertyType?.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }

    //Category Filter
    if (selectedCategory !== "all") {
      filteredAllPosts = filteredAllPosts.filter(
        (post: any) => post.category === selectedCategory
      );
    }

    //price range
    const min = parseFloat(minPrice);
    const max = parseFloat(maxPrice);

    if (!isNaN(min)) {
      filteredAllPosts = filteredAllPosts.filter(
        (post: any) => post.cost >= min
      );
    }
    if (!isNaN(max)) {
      filteredAllPosts = filteredAllPosts.filter(
        (post: any) => post.cost <= max
      );
    }

    //posted by filter
    if(postedBYFilter === "you" && selfId){
      filteredAllPosts = filteredAllPosts.filter((post:any)=>post.user === selfId);
    }
    else if(postedBYFilter === "others" && selfId){
      filteredAllPosts = filteredAllPosts.filter((post:any)=>post.user !== selfId);
    }
    

    //sorting
    filteredAllPosts.sort((a: any, b: any) => {
      let comparison = 0;
      if (sortBy === "cost") {
        comparison = a.cost - b.cost;
      } else if (sortBy === "createdAt") {
        comparison =
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortBy === "rentStartDate") {
        comparison =
          new Date(a.rentStartDate).getTime() -
          new Date(b.rentStartDate).getTime();
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    const newPosts = filteredAllPosts.slice(startIndex, endIndex);

    if (newPosts.length > 0) {
      setRentPosts((prev: any) => [...prev, ...newPosts]);
      setCurrentPage(nextPage);
      setHasMore(endIndex < filteredAllPosts.length);
    } else {
      setHasMore(false);
    }
  }, [
    currentPage,
    allRentPosts,
    searchTerm,
    selectedCategory,
    minPrice,
    maxPrice,
    sortBy,
    sortOrder,
    hasMore,
    loading,
    postedBYFilter,
    selfId,
  ]);

  // Reset pagination when filters change
  useEffect(() => {
    if (allRentPosts.length === 0) return;
    setCurrentPage(1);
    let filtered = [...allRentPosts];
    // Search Filter
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm?.toLowerCase();
      filtered = filtered.filter(
        (post: any) =>
          post.addressLine?.toLowerCase().includes(lowerCaseSearchTerm) ||
          post.description?.toLowerCase().includes(lowerCaseSearchTerm) ||
          post.propertyType?.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }

    //Category Filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (post: any) => post.category === selectedCategory
      );
    }

    //price range
    const min = parseFloat(minPrice);
    const max = parseFloat(maxPrice);

    if (!isNaN(min)) {
      filtered = filtered.filter((post: any) => post.cost >= min);
    }
    if (!isNaN(max)) {
      filtered = filtered.filter((post: any) => post.cost <= max);
    }

     // Posted by filter
    if (postedBYFilter === "you" && selfId) {
      filtered = filtered.filter(
        (post: any) => post.user === selfId
      );
    } else if (postedBYFilter === "others" && selfId) {
      filtered = filtered.filter(
        (post: any) => post.user !== selfId
      );
    }

    //sorting
    filtered.sort((a: any, b: any) => {
      let comparison = 0;
      if (sortBy === "cost") {
        comparison = a.cost - b.cost;
      } else if (sortBy === "createdAt") {
        comparison =
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortBy === "rentStartDate") {
        comparison =
          new Date(a.rentStartDate).getTime() -
          new Date(b.rentStartDate).getTime();
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    // -----load first page------------
    const firstPagePosts = filtered.slice(0, POSTS_PER_PAGE);
    setRentPosts(firstPagePosts);
    setHasMore(filtered.length > POSTS_PER_PAGE);
  }, [
    allRentPosts,
    searchTerm,
    selectedCategory,
    minPrice,
    maxPrice,
    sortBy,
    sortOrder,
    postedBYFilter,
    selfId,
  ]);

  // debounce search
  const debouncedSetSearchTerm = useCallback(
    debounce((value: string) => {
      setSearchTerm(value);
    }, 100),
    []
  );

  //cleanup debounce
  useEffect(() => {
    return () => {
      debouncedSetSearchTerm.cancel();
    };
  }, [debouncedSetSearchTerm]);

  const renderImages = (images: string[]) => {
    const maxVisible = 3;
    const visibleImages = images.slice(0, maxVisible);
    const remainingCount = images.length - maxVisible;

    if (images.length === 1) {
      return (
        <div className="image-container single-image">
          <img src={images[0]} alt="Property" />
        </div>
      );
    }

    if (images.length === 2) {
      return (
        <div className="image-container two-images">
          {visibleImages.map((url, index) => (
            <div key={index} className="image-item">
              <img src={url} alt="Property" />
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="image-container multiple-images">
        {visibleImages.map((url, index) => (
          <div
            key={index}
            className={`image-item ${
              index === 2 && remainingCount > 0 ? "has-overlay" : ""
            }`}
          >
            <img src={url} alt="Property" />
            {index === 2 && remainingCount > 0 && (
              <div className="image-overlay">
                <span>+{remainingCount}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("BDT", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const propertyCategories = useMemo(() => {
    const categories = rentCategories;
    return ["all", ...categories];
  }, []);

  // -- total count-
  const getTotalFilteredCount = useMemo(() => {
    let filtered = [...allRentPosts];

    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm?.toLowerCase();
      filtered = filtered.filter(
        (post: any) =>
          post.addressLine?.toLowerCase().includes(lowerCaseSearchTerm) ||
          post.description?.toLowerCase().includes(lowerCaseSearchTerm) ||
          post.propertyType?.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (post: any) => post.category === selectedCategory
      );
    }

    const min = parseFloat(minPrice);
    const max = parseFloat(maxPrice);

    if (!isNaN(min)) {
      filtered = filtered.filter((post: any) => post.cost >= min);
    }
    if (!isNaN(max)) {
      filtered = filtered.filter((post: any) => post.cost <= max);
    }

    return filtered.length;
  }, [allRentPosts, searchTerm, selectedCategory, minPrice, maxPrice]);

  console.log("page rendered");

  // --------------------return body--------------------------//
  return (
    <div className="rent-posts-container">
      {loading && rentPosts.length === 0 ? (
        <div className="rent-loading-spinner">
          <OrbitalSpinner />
        </div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="posts-filtering-container">
          {/* --------------------filtering, sorting, searching container--------------------- */}
          {allRentPosts.length > 0 && (
            <div className="filter-container">
              <div className="filter-header">
                <h2>Filter & Sort</h2>
                <div className="filter-count">
                  {getTotalFilteredCount} properties found
                </div>
              </div>

              {/* search  */}
              <div className="filter-group search-group">
                <label htmlFor="search">Search Properties</label>
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
                    placeholder="Address, type, description..."
                    onChange={(e) => debouncedSetSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* category selction */}
              <div className="filter-group">
                <label htmlFor="category">Category</label>
                <div className="select-wrapper">
                  <select
                    id="category"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    {propertyCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat?.charAt(0).toUpperCase() + cat?.slice(1)}
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

              {/* price range */}
              <div className="filter-group price-group">
                <label>Price Range (USD)</label>
                <div className="price-inputs">
                  <div className="price-input-wrapper">
                    <span className="currency-symbol">$</span>
                    <input
                      type="number"
                      placeholder="Min"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                    />
                  </div>
                  <div className="price-separator">to</div>
                  <div className="price-input-wrapper">
                    <span className="currency-symbol">$</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                    />
                  </div>
                </div>
              </div>

               {/* posted by filter */}
              <div className="filter-group">
                <label htmlFor="postedBy">Posted By</label>
                <div className="radio-group">
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="postedBy"
                      value="all"
                      checked={postedBYFilter === "all"}
                      onChange={(e) => setPostedBYFilter(e.target.value as "all" | "you" | "others")}
                    />
                    <span className="radio-custom"></span>
                    <span className="radio-label">All</span>
                  </label>
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="postedBy"
                      value="you"
                      checked={postedBYFilter === "you"}
                      onChange={(e) => setPostedBYFilter(e.target.value as "all" | "you" | "others")}
                    />
                    <span className="radio-custom"></span>
                    <span className="radio-label">You</span>
                  </label>
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="postedBy"
                      value="others"
                      checked={postedBYFilter === "others"}
                      onChange={(e) => setPostedBYFilter(e.target.value as "all" | "you" | "others")}
                    />
                    <span className="radio-custom"></span>
                    <span className="radio-label">Others</span>
                  </label>
                </div>
              </div>

              {/* sort div */}
              <div className="filter-group">
                <label htmlFor="sortBy">Sort By</label>
                <div className="select-wrapper">
                  <select
                    id="sortBy"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="createdAt">Date Posted</option>
                    <option value="cost">Price</option>
                    <option value="rentStartDate">Rent Start Date</option>
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

              {/* sort by order */}
              <div className="filter-group">
                <label htmlFor="sortOrder">Order</label>
                <div className="radio-group">
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
                </div>
              </div>

              <div className="clear-filters">
                <button
                  className="btn-clear"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("all");
                    setMinPrice("");
                    setMaxPrice("");
                    setSortBy("createdAt");
                    setSortOrder("desc");
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
          )}
          {/* -----------------------posts display container------------------------ */}
          <div className="posts-container">
            <InfiniteScroll
              dataLength={rentPosts.length}
              next={loadMorePosts}
              hasMore={hasMore}
              loader={
                <div className="infinite-scroll-loader">
                  <OrbitalSpinner />
                </div>
              }
              endMessage={
                rentPosts.length > 0 ? (
                  <div className="infinite-scroll-end">
                    <p>You've seen all available properties!</p>
                  </div>
                ) : null
              }
              scrollThreshold={0.8} 
            >
              <div className="posts-grid">
                {rentPosts.length > 0 ? (
                  rentPosts.map((post: any) => (
                    <Link
                      key={post?._id}
                      to={`/main/view-rent/${post?._id}`}
                      className="post-card"
                    >
                      <div className="post-images">
                        {renderImages(post.imageUrls || [])}
                      </div>

                      <div className="post-content">
                        <div className="post-header">
                          <h3 className="post-address">{post.addressLine}</h3>
                          <div
                            className={`post-status ${post.status?.toLowerCase()}`}
                          >
                            {post.status}
                          </div>
                        </div>

                        <div className="post-details">
                          <div className="post-price">
                            <span className="amount">
                              {formatCurrency(post.cost)}
                            </span>
                            <span className="frequency">
                              /{post.rentPaymentFrequency}
                            </span>
                          </div>

                          <div className="post-date">
                            Available from {formatDate(post.rentStartDate)}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="no-posts">
                    <h3>No rental properties available</h3>
                    <p>Check back later for new listings</p>
                  </div>
                )}
              </div>
            </InfiniteScroll>
          </div>
        </div>
      )}
    </div>
  );
};

export default RentPage;
