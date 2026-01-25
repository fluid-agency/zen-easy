import { useEffect, useState } from "react";
import "./Users.scss";
import {
  Search,
  Eye,
  Edit2,
  X,
  Mail,
  Phone,
  MapPin,
  User,
  Trash2,
  Calendar,
  Globe,
  Briefcase,
} from "lucide-react";
import {
  getAllUsers,
  updateUserById,
  deleteUserById,
} from "../../../../services/adminServices";

type TUser = {
  _id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  profileImage?: string;
  gender?: "Male" | "Female";
  nationality?: string;
  occupation?: string;
  status?: "active" | "inactive";
  isVerified?: boolean;
  dateOfBirth?: string;
  address?: {
    street: string;
    city: string;
    postalCode: string;
  };
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  };
  createdAt?: string;
};

const Users = () => {
  const [users, setUsers] = useState<TUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<TUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<TUser | null>(null);
  const [viewUser, setViewUser] = useState<TUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterVerified, setFilterVerified] = useState("all");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(
        (u) =>
          u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.phoneNumber?.includes(searchTerm)
      );
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((u) => u.status === filterStatus);
    }

    if (filterVerified !== "all") {
      const isVerified = filterVerified === "verified";
      filtered = filtered.filter((u) => u.isVerified === isVerified);
    }

    setFilteredUsers(filtered);
  }, [searchTerm, filterStatus, filterVerified, users]);

  const handleSave = async () => {
    if (!selectedUser) return;

    try {
      setLoading(true);
      await updateUserById(selectedUser._id, selectedUser);
      setSelectedUser(null);
      await fetchUsers();
    } catch (error) {
      console.error("Error updating user:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      await deleteUserById(id);
      setShowDeleteConfirm(null);
      await fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status?: string) => {
    return status === "active" ? "badge-active" : "badge-inactive";
  };

  return (
    <div className="users-admin-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Users Management</h1>
          <p className="subtitle">Manage and monitor platform users</p>
        </div>
        <div className="stats-row">
          <div className="stat-card">
            <span className="stat-label">Total Users</span>
            <span className="stat-value">{users.length}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Active</span>
            <span className="stat-value text-success">
              {users.filter((u) => u.status === "active").length}
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Verified</span>
            <span className="stat-value text-info">
              {users.filter((u) => u.isVerified).length}
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
            placeholder="Search by name, email, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <select
            value={filterVerified}
            onChange={(e) => setFilterVerified(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Verification</option>
            <option value="verified">Verified</option>
            <option value="unverified">Unverified</option>
          </select>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading users...</p>
        </div>
      )}

      {/* Users Table */}
      {!loading && (
        <div className="users-table">
          <div className="table-header">
            <span>User Info</span>
            <span>Contact</span>
            <span>Status</span>
            <span>Verified</span>
            <span>Joined</span>
            <span>Actions</span>
          </div>

          {filteredUsers.length === 0 ? (
            <div className="empty-state">
              <p>No users found</p>
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div key={user._id} className="table-row">
                {/* User Info */}
                <div className="user-info">
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.name}
                      className="user-avatar"
                    />
                  ) : (
                    <div className="avatar-fallback">
                      <User size={20} />
                    </div>
                  )}
                  <div>
                    <div className="user-name">{user.name}</div>
                    <div className="user-email">{user.email}</div>
                  </div>
                </div>

                {/* Contact */}
                <div className="contact-info">
                  <Phone size={14} />
                  {user.phoneNumber || "N/A"}
                </div>

                {/* Status */}
                <div>
                  <span className={`badge ${getStatusBadgeClass(user.status)}`}>
                    {user.status || "active"}
                  </span>
                </div>

                {/* Verified */}
                <div>
                  <span
                    className={`badge ${
                      user.isVerified ? "badge-verified" : "badge-unverified"
                    }`}
                  >
                    {user.isVerified ? "Verified" : "Unverified"}
                  </span>
                </div>

                {/* Joined Date */}
                <div className="joined-date">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "N/A"}
                </div>

                {/* Actions */}
                <div className="action-buttons">
                  <button
                    className="btn-icon btn-view"
                    onClick={() => setViewUser(user)}
                    title="View Details"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    className="btn-icon btn-edit"
                    onClick={() => setSelectedUser(user)}
                    title="Edit User"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    className="btn-icon btn-delete"
                    onClick={() => setShowDeleteConfirm(user._id)}
                    title="Delete User"
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
      {viewUser && (
        <div className="modal-overlay" onClick={() => setViewUser(null)}>
          <div
            className="modal-container view-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>User Details</h3>
              <button className="btn-close" onClick={() => setViewUser(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div className="profile-section">
                {viewUser.profileImage ? (
                  <img
                    src={viewUser.profileImage}
                    alt={viewUser.name}
                    className="profile-image"
                  />
                ) : (
                  <div className="profile-placeholder">
                    <User size={48} />
                  </div>
                )}
                <h4 className="profile-name">{viewUser.name}</h4>
                <p className="profile-email">{viewUser.email}</p>
                <div className="profile-badges">
                  <span
                    className={`badge ${getStatusBadgeClass(viewUser.status)}`}
                  >
                    {viewUser.status || "active"}
                  </span>
                  <span
                    className={`badge ${
                      viewUser.isVerified ? "badge-verified" : "badge-unverified"
                    }`}
                  >
                    {viewUser.isVerified ? "Verified" : "Unverified"}
                  </span>
                </div>
              </div>

              <div className="detail-grid">
                <div className="detail-item">
                  <label>
                    <Phone size={16} /> Phone Number
                  </label>
                  <p>{viewUser.phoneNumber || "N/A"}</p>
                </div>

                <div className="detail-item">
                  <label>
                    <Mail size={16} /> Email
                  </label>
                  <p>{viewUser.email}</p>
                </div>

                {viewUser.gender && (
                  <div className="detail-item">
                    <label>
                      <User size={16} /> Gender
                    </label>
                    <p>{viewUser.gender}</p>
                  </div>
                )}

                {viewUser.nationality && (
                  <div className="detail-item">
                    <label>
                      <Globe size={16} /> Nationality
                    </label>
                    <p>{viewUser.nationality}</p>
                  </div>
                )}

                {viewUser.occupation && (
                  <div className="detail-item">
                    <label>
                      <Briefcase size={16} /> Occupation
                    </label>
                    <p>{viewUser.occupation}</p>
                  </div>
                )}

                {viewUser.dateOfBirth && (
                  <div className="detail-item">
                    <label>
                      <Calendar size={16} /> Date of Birth
                    </label>
                    <p>{new Date(viewUser.dateOfBirth).toLocaleDateString()}</p>
                  </div>
                )}

                {viewUser.address && (
                  <div className="detail-item full-width">
                    <label>
                      <MapPin size={16} /> Address
                    </label>
                    <p>
                      {viewUser.address.street}, {viewUser.address.city},{" "}
                      {viewUser.address.postalCode}
                    </p>
                  </div>
                )}

                {viewUser.createdAt && (
                  <div className="detail-item">
                    <label>
                      <Calendar size={16} /> Joined
                    </label>
                    <p>{new Date(viewUser.createdAt).toLocaleDateString()}</p>
                  </div>
                )}
              </div>

              {viewUser.socialMedia &&
                (viewUser.socialMedia.facebook ||
                  viewUser.socialMedia.instagram ||
                  viewUser.socialMedia.linkedin) && (
                  <div className="social-media-section">
                    <label>Social Media</label>
                    <div className="social-links">
                      {viewUser.socialMedia.facebook && (
                        <a
                          href={viewUser.socialMedia.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="social-link facebook"
                        >
                          Facebook
                        </a>
                      )}
                      {viewUser.socialMedia.instagram && (
                        <a
                          href={viewUser.socialMedia.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="social-link instagram"
                        >
                          Instagram
                        </a>
                      )}
                      {viewUser.socialMedia.linkedin && (
                        <a
                          href={viewUser.socialMedia.linkedin}
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
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {selectedUser && (
        <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
          <div
            className="modal-container edit-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>Edit User</h3>
              <button
                className="btn-close"
                onClick={() => setSelectedUser(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    value={selectedUser.name}
                    onChange={(e) =>
                      setSelectedUser({ ...selectedUser, name: e.target.value })
                    }
                    placeholder="User Name"
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={selectedUser.email}
                    onChange={(e) =>
                      setSelectedUser({ ...selectedUser, email: e.target.value })
                    }
                    placeholder="Email Address"
                  />
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    value={selectedUser.phoneNumber || ""}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        phoneNumber: e.target.value,
                      })
                    }
                    placeholder="Phone Number"
                  />
                </div>

                <div className="form-group">
                  <label>Gender</label>
                  <select
                    value={selectedUser.gender || ""}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        gender: e.target.value as "Male" | "Female",
                      })
                    }
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Nationality</label>
                  <input
                    type="text"
                    value={selectedUser.nationality || ""}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        nationality: e.target.value,
                      })
                    }
                    placeholder="Nationality"
                  />
                </div>

                <div className="form-group">
                  <label>Occupation</label>
                  <input
                    type="text"
                    value={selectedUser.occupation || ""}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        occupation: e.target.value,
                      })
                    }
                    placeholder="Occupation"
                  />
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={selectedUser.status || "active"}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        status: e.target.value as "active" | "inactive",
                      })
                    }
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Verified Status</label>
                  <select
                    value={selectedUser.isVerified ? "true" : "false"}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        isVerified: e.target.value === "true",
                      })
                    }
                  >
                    <option value="true">Verified</option>
                    <option value="false">Unverified</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setSelectedUser(null)}
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
                Are you sure you want to delete this user? This action cannot be
                undone.
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
                {loading ? "Deleting..." : "Delete User"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;