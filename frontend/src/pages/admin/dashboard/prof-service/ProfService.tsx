import { useEffect, useState } from "react";
import "./ProfService.scss";
import {
  getAllProfServices,
  getUserById,
  updateProfService,
} from "../../../../services/adminServices";
import type { TProfessionalService } from "../../../../utils/types/profServiceTypes";
import { Search, Edit2, Eye, X, MapPin, Phone, Star, Briefcase, Mail, User } from "lucide-react";
import { GrAchievement } from "react-icons/gr";

const ProfService = () => {
  const [services, setServices] = useState<TProfessionalService[]>([]);
  const [filteredServices, setFilteredServices] = useState<TProfessionalService[]>([]);
  const [selected, setSelected] = useState<TProfessionalService | null>(null);
  const [viewService, setViewService] = useState<TProfessionalService | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterApproval, setFilterApproval] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [providerInfo, setProviderInfo] = useState<any | null>(null);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const data = await getAllProfServices();
      setServices(data);
      console.log(data);
      setFilteredServices(data);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Filtering logic
  useEffect(() => {
    let filtered = services;

    if (searchTerm) {
      filtered = filtered.filter(s =>
        s.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.contactNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.addressLine?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter(s => s.status === filterStatus);
    }

    if (filterApproval !== "all") {
      filtered = filtered.filter(s =>
        s.isApproved.toLowerCase() === filterApproval.toLowerCase()
      );
    }

    if (filterCategory !== "all") {
      filtered = filtered.filter(s => s.category === filterCategory);
    }

    setFilteredServices(filtered);
  }, [searchTerm, filterStatus, filterApproval, filterCategory, services]);

  const handleSave = async () => {
    if (!selected) return;

    try {
      setLoading(true);
      await updateProfService(selected._id as string, selected);
      setSelected(null);
      await fetchServices();
    } catch (error) {
      console.error("Error updating service:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCategories = () => {
    const cats = new Set(services.map(s => s.category));
    return Array.from(cats);
  };

  const getApprovalBadgeClass = (approval: string) => {
    const lower = approval.toLowerCase();
    if (lower === "approved") return "badge-approved";
    if (lower === "rejected" || lower === "reject") return "badge-rejected";
    return "badge-pending";
  };

  const getStatusBadgeClass = (status: string) => {
    return status === "active" ? "badge-active" : "badge-inactive";
  };

  const calculateAvgRating = (ratings: any[] = []) => {
    if (!ratings || ratings.length === 0) return 0;
    const sum = ratings.reduce((acc, r) => acc + (r.rating || 0), 0);
    return (sum / ratings.length).toFixed(1);
  };


  return (
    <div className="prof-service-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Professional Services</h1>
          <p className="subtitle">Manage and review service providers</p>
        </div>
        <div className="stats-row">
          <div className="stat-card">
            <span className="stat-label">Total</span>
            <span className="stat-value">{services.length}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Pending</span>
            <span className="stat-value text-warning">
              {services.filter(s => s.isApproved.toLowerCase() === "pending").length}
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Approved</span>
            <span className="stat-value text-success">
              {services.filter(s => s.isApproved.toLowerCase() === "approved").length}
            </span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search by category, contact, location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Categories</option>
            {getCategories().map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            value={filterApproval}
            onChange={(e) => setFilterApproval(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Approvals</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading services...</p>
        </div>
      )}

      {/* Services Table */}
      {!loading && (
        <div className="services-table">
          <div className="table-header">
            <span>Service Info</span>
            <span>Contact</span>
            <span>Price Range</span>
            <span>Approval</span>
            <span>Certificate</span>
            <span>Actions</span>
          </div>

          {filteredServices.length === 0 ? (
            <div className="empty-state">
              <p>No services found</p>
            </div>
          ) : (
            filteredServices.map((service) => (
              <div key={service._id} className="table-row">
                <div className="service-info">
                  {service.coverImage ? (
                    <img src={service.coverImage} alt={service.category} className="service-thumb" />
                  ) : (
                    <div className="service-thumb-placeholder">
                      <Briefcase size={24} />
                    </div>
                  )}
                  <div>
                    <div className="service-category">{service.category}</div>
                    <div className="service-location">
                      <MapPin size={14} />
                      {service.addressLine || "No address"}
                    </div>
                    {service.ratings && service.ratings.length > 0 && (
                      <div className="service-rating">
                        <Star size={14} fill="#fbbf24" color="#fbbf24" />
                        {calculateAvgRating(service.ratings)} ({service.ratings.length})
                      </div>
                    )}
                  </div>
                </div>

                <div className="contact-info">
                  <Phone size={14} />
                  {service.contactNumber}
                </div>

                <div className="price-range">
                  ৳ {service.minimumPrice?.toLocaleString()} - ৳ {service.maximumPrice?.toLocaleString()}
                </div>

                <div>
                  <span className={`badge ${getApprovalBadgeClass(service.isApproved)}`}>
                    {service.isApproved}
                  </span>
                </div>

                <div className="certificate-cell">
                  {service.certificate ? (
                    <button
                      className="btn-icon btn-view"
                      title="View Certificate"
                      onClick={() => {
                        window.open(service.certificate, "_blank");
                      }}
                    >
                      <GrAchievement/> <span className="ml-1">view</span>
                    </button>
                  ) : (
                    <span className="text-muted">No Certificate</span>
                  )}
                </div>

                <div className="action-buttons">
                  <button
                    className="btn-icon btn-view"
                    onClick={async () => {
                      setViewService(service);

                      if (service.provider) {
                        try {
                          const provider = await getUserById(service.provider as string);
                          setProviderInfo(provider);
                        } catch (err) {
                          console.error(err);
                          setProviderInfo(null);
                        }
                      }
                    }}
                    title="View Details"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    className="btn-icon btn-edit"
                    onClick={() => setSelected(service)}
                    title="Edit Service"
                  >
                    <Edit2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* View Modal */}
      {viewService && (
        <div className="modal-overlay" onClick={() => setViewService(null)}>
          <div className="modal-container view-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Service Details</h3>
              <button
                className="btn-close"
                onClick={() => {
                  setViewService(null);
                  setProviderInfo(null);
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              {viewService.coverImage ? (
                <div className="cover-image-container">
                  <img src={viewService.coverImage} alt={viewService.category} />
                </div>
              ) : (
                <div className="cover-image-placeholder">
                  <div className="placeholder-icon">
                    <Briefcase size={48} />
                  </div>
                  <p>{viewService.category}</p>
                </div>
              )}

              {providerInfo && (
                <div className="provider-card">
                  <div className="provider-header">
                    <User size={20} />
                    <h4>Provider Information</h4>
                  </div>
                  <div className="provider-details">
                    <div className="provider-item">
                      <User size={16} />
                      <span>{providerInfo.name || "N/A"}</span>
                    </div>
                    <div className="provider-item">
                      <Mail size={16} />
                      <span>{providerInfo.email || "N/A"}</span>
                    </div>
                    <div className="provider-item">
                      <Phone size={16} />
                      <span>{providerInfo.phoneNumber || "N/A"}</span>
                    </div>
                    {providerInfo.address && (
                      <div className="provider-item">
                        <MapPin size={16} />
                        <span>
                          {providerInfo.address.street}, {providerInfo.address.city},{" "}
                          {providerInfo.address.postalCode}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="detail-grid">
                <div className="detail-item">
                  <label>Category</label>
                  <p>{viewService.category}</p>
                </div>

                <div className="detail-item">
                  <label>Contact Number</label>
                  <p>{viewService.contactNumber}</p>
                </div>

                <div className="detail-item">
                  <label>Address</label>
                  <p>{viewService.addressLine || "N/A"}</p>
                </div>

                <div className="detail-item">
                  <label>Price Range</label>
                  <p>৳ {viewService.minimumPrice?.toLocaleString()} - ৳ {viewService.maximumPrice?.toLocaleString()}</p>
                </div>

                <div className="detail-item">
                  <label>Available Time</label>
                  <p className="capitalize">{viewService.availableTime}</p>
                </div>

                <div className="detail-item">
                  <label>Approval Status</label>
                  <span className={`badge ${getApprovalBadgeClass(viewService.isApproved)}`}>
                    {viewService.isApproved}
                  </span>
                </div>

                <div className="detail-item">
                  <label>Service Status</label>
                  <span className={`badge ${getStatusBadgeClass(viewService.status as string)}`}>
                    {viewService.status}
                  </span>
                </div>

                {viewService.ratings && viewService.ratings.length > 0 && (
                  <div className="detail-item">
                    <label>Average Rating</label>
                    <p>
                      <Star size={16} fill="#fbbf24" color="#fbbf24" style={{ display: "inline", marginRight: 4 }} />
                      {calculateAvgRating(viewService.ratings)} ({viewService.ratings.length} reviews)
                    </p>
                  </div>
                )}
              </div>

              {viewService.description && (
                <div className="detail-item full-width">
                  <label>Description</label>
                  <p className="description-text">{viewService.description}</p>
                </div>
              )}

              {viewService.availableDays && viewService.availableDays.length > 0 && (
                <div className="detail-item full-width">
                  <label>Available Days</label>
                  <div className="days-chips">
                    {viewService.availableDays.map(day => (
                      <span key={day} className="chip">{day}</span>
                    ))}
                  </div>
                </div>
              )}

              {viewService.serviceArea && viewService.serviceArea.length > 0 && (
                <div className="detail-item full-width">
                  <label>Service Areas</label>
                  <div className="days-chips">
                    {viewService.serviceArea.map(area => (
                      <span key={area} className="chip">{area}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-container edit-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Service</h3>
              <button className="btn-close" onClick={() => setSelected(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>Contact Number</label>
                  <input
                    type="text"
                    value={selected.contactNumber}
                    onChange={(e) =>
                      setSelected({ ...selected, contactNumber: e.target.value })
                    }
                    placeholder="Contact Number"
                  />
                </div>

                <div className="form-group">
                  <label>Address Line</label>
                  <input
                    type="text"
                    value={selected.addressLine || ""}
                    onChange={(e) =>
                      setSelected({ ...selected, addressLine: e.target.value })
                    }
                    placeholder="Address"
                  />
                </div>

                <div className="form-group">
                  <label>Minimum Price (৳)</label>
                  <input
                    type="number"
                    value={selected.minimumPrice}
                    onChange={(e) =>
                      setSelected({
                        ...selected,
                        minimumPrice: Number(e.target.value),
                      })
                    }
                    placeholder="Min Price"
                  />
                </div>

                <div className="form-group">
                  <label>Maximum Price (৳)</label>
                  <input
                    type="number"
                    value={selected.maximumPrice}
                    onChange={(e) =>
                      setSelected({
                        ...selected,
                        maximumPrice: Number(e.target.value),
                      })
                    }
                    placeholder="Max Price"
                  />
                </div>

                <div className="form-group">
                  <label>Available Time</label>
                  <select
                    value={selected.availableTime}
                    onChange={(e) =>
                      setSelected({
                        ...selected,
                        availableTime: e.target.value as "day" | "night" | "always",
                      })
                    }
                  >
                    <option value="day">Day</option>
                    <option value="night">Night</option>
                    <option value="always">Always</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Approval Status</label>
                  <select
                    value={selected.isApproved}
                    onChange={(e) =>
                      setSelected({
                        ...selected,
                        isApproved: e.target.value as "pending" | "approved" | "reject",
                      })
                    }
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="reject">Reject</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Service Status</label>
                  <select
                    value={selected.status}
                    onChange={(e) =>
                      setSelected({
                        ...selected,
                        status: e.target.value as "active" | "inactive",
                      })
                    }
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div className="form-group full-width">
                  <label>Description</label>
                  <textarea
                    value={selected.description || ""}
                    onChange={(e) =>
                      setSelected({ ...selected, description: e.target.value })
                    }
                    placeholder="Service Description"
                    rows={4}
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setSelected(null)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSave} disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfService;