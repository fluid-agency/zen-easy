import { useEffect, useState } from "react";
import "./Rents.scss";
import {
  Search,
  Eye,
  Edit2,
  X,
  Phone,
  MapPin,
  User,
  Trash2,
  Calendar,
  DollarSign,
  Home,
  Info,
} from "lucide-react";
import {
  getAllRents,
  updateRentById,
  deleteRentById,
} from "../../../../services/adminServices";

type TRent = {
  _id: string;
  category: "bachelor room" | "family room" | "flat" | "store" | "office" | "shopping mall";
  rentStartDate: string;
  imageUrls?: string[];
  rentPaymentFrequency: "daily" | "monthly" | "quarterly" | "annualy";
  details: string;
  cost: number;
  addressLine: string;
  city: string;
  postalCode: number;
  contactInfo: string;
  status?: "Active" | "Booked";
  user: {
    _id: string;
    name: string;
    email: string;
    contactNumber?: string;
  };
  createdAt?: string;
};

const Rents = () => {
  const [rents, setRents] = useState<TRent[]>([]);
  const [filteredRents, setFilteredRents] = useState<TRent[]>([]);
  const [selectedRent, setSelectedRent] = useState<TRent | null>(null);
  const [viewRent, setViewRent] = useState<TRent | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const fetchRents = async () => {
    setLoading(true);
    try {
      const data = await getAllRents();
      setRents(data);
      setFilteredRents(data);
    } catch (error) {
      console.error("Error fetching rents:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRents();
  }, []);

  useEffect(() => {
    let filtered = rents;

    if (searchTerm) {
      filtered = filtered.filter(
        (r) =>
          r.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.addressLine?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.contactInfo?.includes(searchTerm)
      );
    }

    if (filterCategory !== "all") {
      filtered = filtered.filter((r) => r.category === filterCategory);
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((r) => r.status === filterStatus);
    }

    setFilteredRents(filtered);
  }, [searchTerm, filterCategory, filterStatus, rents]);

  const handleSave = async () => {
    if (!selectedRent) return;

    try {
      setLoading(true);
      await updateRentById(selectedRent._id, selectedRent);
      setSelectedRent(null);
      await fetchRents();
    } catch (error) {
      console.error("Error updating rent:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      await deleteRentById(id);
      setShowDeleteConfirm(null);
      await fetchRents();
    } catch (error) {
      console.error("Error deleting rent:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status?: string) => {
    return status === "Active" ? "badge-active" : "badge-booked";
  };

  const getCategoryIcon = () => {
    return <Home size={16} />;
  };

  return (
    <div className="rents-admin-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Rents Management</h1>
          <p className="subtitle">Manage and monitor rental listings</p>
        </div>
        <div className="stats-row">
          <div className="stat-card">
            <span className="stat-label">Total Listings</span>
            <span className="stat-value">{rents.length}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Active</span>
            <span className="stat-value text-success">
              {rents.filter((r) => r.status === "Active").length}
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Booked</span>
            <span className="stat-value text-warning">
              {rents.filter((r) => r.status === "Booked").length}
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
            placeholder="Search by city, address, owner..."
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
            <option value="bachelor room">Bachelor Room</option>
            <option value="family room">Family Room</option>
            <option value="flat">Flat</option>
            <option value="store">Store</option>
            <option value="office">Office</option>
            <option value="shopping mall">Shopping Mall</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Booked">Booked</option>
          </select>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading rents...</p>
        </div>
      )}

      {/* Rents Table */}
      {!loading && (
        <div className="rents-table">
          <div className="table-header">
            <span>Property Info</span>
            <span>Owner</span>
            <span>Location</span>
            <span>Cost</span>
            <span>Status</span>
            <span>Actions</span>
          </div>

          {filteredRents.length === 0 ? (
            <div className="empty-state">
              <p>No rental listings found</p>
            </div>
          ) : (
            filteredRents.map((rent) => (
              <div key={rent._id} className="table-row">
                {/* Property Info */}
                <div className="property-info">
                  {rent.imageUrls && rent.imageUrls.length > 0 ? (
                    <img
                      src={rent.imageUrls[0]}
                      alt={rent.category}
                      className="property-image"
                    />
                  ) : (
                    <div className="image-fallback">
                      <Home size={20} />
                    </div>
                  )}
                  <div>
                    <div className="property-category">{rent.category}</div>
                    <div className="property-payment">
                      {rent.rentPaymentFrequency}
                    </div>
                  </div>
                </div>

                {/* Owner */}
                <div className="owner-info">
                  <User size={14} />
                  <div>
                    <div className="owner-name">{rent.user?.name || "N/A"}</div>
                    <div className="owner-contact">{rent.contactInfo}</div>
                  </div>
                </div>

                {/* Location */}
                <div className="location-info">
                  <MapPin size={14} />
                  <span>{rent.city}</span>
                </div>

                {/* Cost */}
                <div className="cost-info">
                  <DollarSign size={14} />
                  <span>৳{rent.cost.toLocaleString()}</span>
                </div>

                {/* Status */}
                <div>
                  <span className={`badge ${getStatusBadgeClass(rent.status)}`}>
                    {rent.status || "Active"}
                  </span>
                </div>

                {/* Actions */}
                <div className="action-buttons">
                  <button
                    className="btn-icon btn-view"
                    onClick={() => setViewRent(rent)}
                    title="View Details"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    className="btn-icon btn-edit"
                    onClick={() => setSelectedRent(rent)}
                    title="Edit Rent"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    className="btn-icon btn-delete"
                    onClick={() => setShowDeleteConfirm(rent._id)}
                    title="Delete Rent"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* View Modal */}
      {viewRent && (
        <div className="modal-overlay" onClick={() => setViewRent(null)}>
          <div
            className="modal-container view-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>Rental Details</h3>
              <button className="btn-close" onClick={() => setViewRent(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              {/* Images Section */}
              {viewRent.imageUrls && viewRent.imageUrls.length > 0 && (
                <div className="images-section">
                  <div className="images-grid">
                    {viewRent.imageUrls.map((url, index) => (
                      <img
                        key={index}
                        src={url}
                        alt={`Property ${index + 1}`}
                        className="property-img"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Property Details */}
              <div className="property-section">
                <h4 className="section-title">
                  {getCategoryIcon()} {viewRent.category}
                </h4>
                <div className="property-badges">
                  <span className={`badge ${getStatusBadgeClass(viewRent.status)}`}>
                    {viewRent.status || "Active"}
                  </span>
                  <span className="badge badge-payment">
                    {viewRent.rentPaymentFrequency}
                  </span>
                </div>
              </div>

              <div className="detail-grid">
                <div className="detail-item">
                  <label>
                    <DollarSign size={16} /> Rental Cost
                  </label>
                  <p>৳{viewRent.cost.toLocaleString()} / {viewRent.rentPaymentFrequency}</p>
                </div>

                <div className="detail-item">
                  <label>
                    <Calendar size={16} /> Available From
                  </label>
                  <p>{new Date(viewRent.rentStartDate).toLocaleDateString()}</p>
                </div>

                <div className="detail-item full-width">
                  <label>
                    <MapPin size={16} /> Address
                  </label>
                  <p>{viewRent.addressLine}, {viewRent.city} - {viewRent.postalCode}</p>
                </div>

                <div className="detail-item full-width">
                  <label>
                    <Info size={16} /> Details
                  </label>
                  <p>{viewRent.details}</p>
                </div>

                <div className="detail-item">
                  <label>
                    <Phone size={16} /> Contact Info
                  </label>
                  <p>{viewRent.contactInfo}</p>
                </div>

                {viewRent.createdAt && (
                  <div className="detail-item">
                    <label>
                      <Calendar size={16} /> Posted On
                    </label>
                    <p>{new Date(viewRent.createdAt).toLocaleDateString()}</p>
                  </div>
                )}
              </div>

              {/* Owner Info */}
              <div className="owner-section">
                <label>Property Owner</label>
                <div className="owner-details">
                  <div className="owner-avatar">
                    <User size={24} />
                  </div>
                  <div>
                    <div className="owner-name-large">{viewRent.user?.name || "N/A"}</div>
                    <div className="owner-email">{viewRent.user?.email || "N/A"}</div>
                    {viewRent.user?.contactNumber && (
                      <div className="owner-phone">
                        <Phone size={14} /> {viewRent.user.contactNumber}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {selectedRent && (
        <div className="modal-overlay" onClick={() => setSelectedRent(null)}>
          <div
            className="modal-container edit-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>Edit Rental Listing</h3>
              <button
                className="btn-close"
                onClick={() => setSelectedRent(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={selectedRent.category}
                    onChange={(e) =>
                      setSelectedRent({
                        ...selectedRent,
                        category: e.target.value as TRent["category"],
                      })
                    }
                  >
                    <option value="bachelor room">Bachelor Room</option>
                    <option value="family room">Family Room</option>
                    <option value="flat">Flat</option>
                    <option value="store">Store</option>
                    <option value="office">Office</option>
                    <option value="shopping mall">Shopping Mall</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Rental Cost (৳)</label>
                  <input
                    type="number"
                    value={selectedRent.cost}
                    onChange={(e) =>
                      setSelectedRent({
                        ...selectedRent,
                        cost: Number(e.target.value),
                      })
                    }
                    placeholder="Rental Cost"
                  />
                </div>

                <div className="form-group">
                  <label>Payment Frequency</label>
                  <select
                    value={selectedRent.rentPaymentFrequency}
                    onChange={(e) =>
                      setSelectedRent({
                        ...selectedRent,
                        rentPaymentFrequency: e.target.value as TRent["rentPaymentFrequency"],
                      })
                    }
                  >
                    <option value="daily">Daily</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="annualy">Annually</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Available From</label>
                  <input
                    type="date"
                    value={selectedRent.rentStartDate?.split('T')[0]}
                    onChange={(e) =>
                      setSelectedRent({
                        ...selectedRent,
                        rentStartDate: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    value={selectedRent.city}
                    onChange={(e) =>
                      setSelectedRent({
                        ...selectedRent,
                        city: e.target.value,
                      })
                    }
                    placeholder="City"
                  />
                </div>

                <div className="form-group">
                  <label>Postal Code</label>
                  <input
                    type="number"
                    value={selectedRent.postalCode}
                    onChange={(e) =>
                      setSelectedRent({
                        ...selectedRent,
                        postalCode: Number(e.target.value),
                      })
                    }
                    placeholder="Postal Code"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Address Line</label>
                  <input
                    type="text"
                    value={selectedRent.addressLine}
                    onChange={(e) =>
                      setSelectedRent({
                        ...selectedRent,
                        addressLine: e.target.value,
                      })
                    }
                    placeholder="Full Address"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Contact Info</label>
                  <input
                    type="text"
                    value={selectedRent.contactInfo}
                    onChange={(e) =>
                      setSelectedRent({
                        ...selectedRent,
                        contactInfo: e.target.value,
                      })
                    }
                    placeholder="Contact Number"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Details</label>
                  <textarea
                    value={selectedRent.details}
                    onChange={(e) =>
                      setSelectedRent({
                        ...selectedRent,
                        details: e.target.value,
                      })
                    }
                    placeholder="Property Details"
                    rows={4}
                  />
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={selectedRent.status || "Active"}
                    onChange={(e) =>
                      setSelectedRent({
                        ...selectedRent,
                        status: e.target.value as "Active" | "Booked",
                      })
                    }
                  >
                    <option value="Active">Active</option>
                    <option value="Booked">Booked</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setSelectedRent(null)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div
          className="modal-overlay"
          onClick={() => setShowDeleteConfirm(null)}
        >
          <div
            className="modal-container delete-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>Confirm Delete</h3>
              <button
                className="btn-close"
                onClick={() => setShowDeleteConfirm(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <p className="delete-warning">
                Are you sure you want to delete this rental listing? This action cannot be undone.
              </p>
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setShowDeleteConfirm(null)}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handleDelete(showDeleteConfirm)}
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete Listing"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rents;