import { useEffect, useState } from "react";
import "./Overview.scss";
import {
    Users,
    Briefcase,
    Clock,
    CheckCircle,
    TrendingUp,
    Star,
    MapPin,
    Activity,
    UserCheck,
    XCircle,
    Award,
    Calendar,
    Home,
    DollarSign,
} from "lucide-react";
import type { TProfessionalService } from "../../../../utils/types/profServiceTypes";
import {
    getAllProfServices,
    getAllUsers,
    getAllRents,
} from "../../../../services/adminServices";
import { Link } from "react-router-dom";

type TUser = {
    _id: string;
    name: string;
    email: string;
    isVerified?: boolean;
    status?: string;
    createdAt?: string;
};

type TRent = {
    _id: string;
    category: string;
    cost: number;
    city: string;
    status?: "Active" | "Booked";
    rentPaymentFrequency: string;
    imageUrls?: string[];
    createdAt?: string;
};

const DashboardOverview = () => {
    const [users, setUsers] = useState<TUser[]>([]);
    const [services, setServices] = useState<TProfessionalService[]>([]);
    const [rents, setRents] = useState<TRent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const [usersRes, servicesRes, rentsRes] = await Promise.all([
                    getAllUsers(),
                    getAllProfServices(),
                    getAllRents(),
                ]);
                setUsers(usersRes);
                setServices(servicesRes);
                setRents(rentsRes);
            } catch (err) {
                console.error("Failed to load dashboard data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // Calculate user statistics
    const totalUsers = users.length;
    const activeUsers = users.filter((u) => u.status === "active").length;
    const verifiedUsers = users.filter((u) => u.isVerified).length;

    // Calculate service statistics
    const totalServices = services.length;
    const pendingServices = services.filter(
        (s) => s.isApproved?.toLowerCase() === "pending"
    ).length;
    const approvedServices = services.filter(
        (s) => s.isApproved?.toLowerCase() === "approved"
    ).length;
    const rejectedServices = services.filter(
        (s) => s.isApproved?.toLowerCase() === "rejected" || s.isApproved?.toLowerCase() === "reject"
    ).length;

    // Calculate rent statistics
    const totalRents = rents.length;
    const activeRents = rents.filter((r) => r.status === "Active").length;
    const bookedRents = rents.filter((r) => r.status === "Booked").length;
    
    // Calculate total rent value
    const totalRentValue = rents.reduce((sum, r) => sum + (r.cost || 0), 0);
    
    // Get recent rents
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentRents = rents.filter(
        (r) => r.createdAt && new Date(r.createdAt) > sevenDaysAgo
    ).length;

    // Get recent users (last 7 days)
    const recentUsers = users.filter(
        (u) => u.createdAt && new Date(u.createdAt) > sevenDaysAgo
    ).length;

    // Service category breakdown
    const categoryCount: { [key: string]: number } = {};
    services.forEach((s) => {
        if (s.category) {
            categoryCount[s.category] = (categoryCount[s.category] || 0) + 1;
        }
    });
    const topCategories = Object.entries(categoryCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    // Rent category breakdown
    const rentCategoryCount: { [key: string]: number } = {};
    rents.forEach((r) => {
        if (r.category) {
            rentCategoryCount[r.category] = (rentCategoryCount[r.category] || 0) + 1;
        }
    });
    const topRentCategories = Object.entries(rentCategoryCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    // Calculate average rating
    const servicesWithRatings = services.filter(
        (s) => s.ratings && s.ratings.length > 0
    );
    const totalRatings = servicesWithRatings.reduce((sum, s) => {
        const avg =
            s.ratings!.reduce((acc, r) => acc + (r.rating || 0), 0) /
            s.ratings!.length;
        return sum + avg;
    }, 0);
    const averageRating = servicesWithRatings.length
        ? (totalRatings / servicesWithRatings.length).toFixed(1)
        : "0.0";

    // Get top rated services
    const topRatedServices = [...services]
        .filter((s) => s.ratings && s.ratings.length > 0)
        .map((s) => ({
            ...s,
            avgRating:
                s.ratings!.reduce((acc, r) => acc + (r.rating || 0), 0) /
                s.ratings!.length,
        }))
        .sort((a, b) => b.avgRating - a.avgRating)
        .slice(0, 5);

    // Recent services
    const recentServices = [...services]
        .sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return dateB - dateA;
        })
        .slice(0, 5);

    // Recent rent listings
    const recentRentListings = [...rents]
        .sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return dateB - dateA;
        })
        .slice(0, 5);

    // Top rental properties by price
    const topRentalsByPrice = [...rents]
        .sort((a, b) => b.cost - a.cost)
        .slice(0, 5);

    if (loading) {
        return (
            <div className="dashboard-overview">
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-overview">
            {/* Header */}
            <div className="dashboard-header">
                <div>
                    <h1>Dashboard Overview</h1>
                    <p className="subtitle">
                        Welcome back! Here's what's happening with your platform.
                    </p>
                </div>
                <div className="header-actions">
                    <div className="date-badge">
                        <Calendar size={16} />
                        {new Date().toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </div>
                </div>
            </div>

            {/* Main Stats Grid */}
            <div className="stats-grid">
                <div className="stat-card gradient-blue">
                    <div className="stat-header">
                        <div className="icon-wrapper">
                            <Users size={24} />
                        </div>
                        <div className="trend-badge positive">
                            <TrendingUp size={14} />
                            <span>+{recentUsers} this week</span>
                        </div>
                    </div>
                    <Link to='/admin/users'>
                        <div className="stat-content">
                            <h2>{totalUsers}</h2>
                            <p>Total Users</p>
                        </div>
                    </Link>
                    <div className="stat-footer">
                        <div className="mini-stat">
                            <UserCheck size={14} />
                            <span>{activeUsers} active</span>
                        </div>
                        <div className="mini-stat">
                            <CheckCircle size={14} />
                            <span>{verifiedUsers} verified</span>
                        </div>
                    </div>
                </div>

                <div className="stat-card gradient-green">
                    <div className="stat-header">
                        <div className="icon-wrapper">
                            <Briefcase size={24} />
                        </div>
                        <div className="trend-badge">
                            <Activity size={14} />
                            <span>{approvedServices} active</span>
                        </div>
                    </div>
                    <Link to='/admin/prof-services'>
                        <div className="stat-content">
                            <h2>{totalServices}</h2>
                            <p>Professional Services</p>
                        </div>
                    </Link>
                    <div className="stat-footer">
                        <div className="mini-stat">
                            <CheckCircle size={14} />
                            <span>{approvedServices} approved</span>
                        </div>
                        <div className="mini-stat">
                            <XCircle size={14} />
                            <span>{rejectedServices} rejected</span>
                        </div>
                    </div>
                </div>

                <div className="stat-card gradient-orange">
                    <div className="stat-header">
                        <div className="icon-wrapper">
                            <Home size={24} />
                        </div>
                        <div className="trend-badge positive">
                            <TrendingUp size={14} />
                            <span>+{recentRents} this week</span>
                        </div>
                    </div>
                    <Link to='/admin/rents'>
                        <div className="stat-content">
                            <h2>{totalRents}</h2>
                            <p>Rental Listings</p>
                        </div>
                    </Link>
                    <div className="stat-footer">
                        <div className="mini-stat">
                            <CheckCircle size={14} />
                            <span>{activeRents} active</span>
                        </div>
                        <div className="mini-stat">
                            <Award size={14} />
                            <span>{bookedRents} booked</span>
                        </div>
                    </div>
                </div>

                <div className="stat-card gradient-purple">
                    <div className="stat-header">
                        <div className="icon-wrapper">
                            <Clock size={24} />
                        </div>
                        {pendingServices > 0 && (
                            <div className="trend-badge warning">
                                <span>Needs attention</span>
                            </div>
                        )}
                    </div>
                    <div className="stat-content">
                        <h2>{pendingServices}</h2>
                        <p>Pending Approvals</p>
                    </div>
                    <div className="stat-footer">
                        <div className="progress-bar">
                            <div
                                className="progress-fill"
                                style={{
                                    width: `${totalServices > 0 ? (pendingServices / totalServices) * 100 : 0}%`,
                                }}
                            />
                        </div>
                        <span className="progress-text">
                            {totalServices > 0
                                ? ((pendingServices / totalServices) * 100).toFixed(0)
                                : 0}
                            % of total
                        </span>
                    </div>
                </div>

                <div className="stat-card gradient-teal">
                    <div className="stat-header">
                        <div className="icon-wrapper">
                            <Star size={24} />
                        </div>
                        <div className="trend-badge positive">
                            <Award size={14} />
                            <span>Excellent</span>
                        </div>
                    </div>
                    <div className="stat-content">
                        <h2>{averageRating}</h2>
                        <p>Average Rating</p>
                    </div>
                    <div className="stat-footer">
                        <div className="star-rating">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    size={14}
                                    fill={
                                        star <= parseFloat(averageRating) ? "#fbbf24" : "transparent"
                                    }
                                    color="#fbbf24"
                                />
                            ))}
                        </div>
                        <span>{servicesWithRatings.length} rated services</span>
                    </div>
                </div>

                <div className="stat-card gradient-indigo">
                    <div className="stat-header">
                        <div className="icon-wrapper">
                            <DollarSign size={24} />
                        </div>
                        <div className="trend-badge">
                            <Activity size={14} />
                            <span>Total Value</span>
                        </div>
                    </div>
                    <div className="stat-content">
                        <h2>৳{(totalRentValue / 1000).toFixed(0)}K</h2>
                        <p>Rent Portfolio</p>
                    </div>
                    <div className="stat-footer">
                        <div className="mini-stat">
                            <Home size={14} />
                            <span>{activeRents} listings</span>
                        </div>
                        <div className="mini-stat">
                            <DollarSign size={14} />
                            <span>৳{totalRents > 0 ? (totalRentValue / totalRents).toFixed(0) : 0} avg</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Two Column Layout */}
            <div className="dashboard-grid">
                {/* Left Column */}
                <div className="dashboard-column">
                    {/* Service Category Breakdown */}
                    <div className="dashboard-card">
                        <div className="card-header">
                            <h3>
                                <Briefcase size={20} />
                                Top Service Categories
                            </h3>
                            <span className="badge-info">{topCategories.length} categories</span>
                        </div>
                        <div className="card-body">
                            {topCategories.length > 0 ? (
                                <div className="category-list">
                                    {topCategories.map(([category, count], index) => (
                                        <div key={category} className="category-item">
                                            <div className="category-info">
                                                <span className="rank">#{index + 1}</span>
                                                <span className="category-name">{category}</span>
                                            </div>
                                            <div className="category-stats">
                                                <div className="category-bar">
                                                    <div
                                                        className="category-fill"
                                                        style={{
                                                            width: `${(count / totalServices) * 100}%`,
                                                        }}
                                                    />
                                                </div>
                                                <span className="category-count">{count}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="empty-state-small">No categories yet</div>
                            )}
                        </div>
                    </div>

                    {/* Rent Category Breakdown */}
                    <div className="dashboard-card">
                        <div className="card-header">
                            <h3>
                                <Home size={20} />
                                Top Rental Categories
                            </h3>
                            <span className="badge-info">{topRentCategories.length} types</span>
                        </div>
                        <div className="card-body">
                            {topRentCategories.length > 0 ? (
                                <div className="category-list">
                                    {topRentCategories.map(([category, count], index) => (
                                        <div key={category} className="category-item">
                                            <div className="category-info">
                                                <span className="rank rank-orange">#{index + 1}</span>
                                                <span className="category-name">{category}</span>
                                            </div>
                                            <div className="category-stats">
                                                <div className="category-bar">
                                                    <div
                                                        className="category-fill category-fill-orange"
                                                        style={{
                                                            width: `${(count / totalRents) * 100}%`,
                                                        }}
                                                    />
                                                </div>
                                                <span className="category-count">{count}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="empty-state-small">No rental categories yet</div>
                            )}
                        </div>
                    </div>

                    {/* Recent Services */}
                    <div className="dashboard-card">
                        <div className="card-header">
                            <h3>
                                <Activity size={20} />
                                Recent Services
                            </h3>
                            <span className="badge-info">Latest additions</span>
                        </div>
                        <div className="card-body">
                            {recentServices.length > 0 ? (
                                <div className="recent-list">
                                    {recentServices.map((service) => (
                                        <div key={service._id} className="recent-item">
                                            {service.coverImage ? (
                                                <img
                                                    src={service.coverImage}
                                                    alt={service.category}
                                                    className="recent-thumb"
                                                />
                                            ) : (
                                                <div className="recent-thumb-placeholder">
                                                    <Briefcase size={16} />
                                                </div>
                                            )}
                                            <div className="recent-info">
                                                <div className="recent-name">{service.category}</div>
                                                <div className="recent-meta">
                                                    <MapPin size={12} />
                                                    {service.addressLine || "No location"}
                                                </div>
                                            </div>
                                            <span
                                                className={`badge badge-${service.isApproved?.toLowerCase() === "approved"
                                                    ? "approved"
                                                    : service.isApproved?.toLowerCase() === "pending"
                                                        ? "pending"
                                                        : "rejected"
                                                    }`}
                                            >
                                                {service.isApproved}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="empty-state-small">No services yet</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="dashboard-column">
                    {/* Top Rated Services */}
                    <div className="dashboard-card">
                        <div className="card-header">
                            <h3>
                                <Star size={20} />
                                Top Rated Services
                            </h3>
                            <span className="badge-info">Highest ratings</span>
                        </div>
                        <div className="card-body">
                            {topRatedServices.length > 0 ? (
                                <div className="rated-list">
                                    {topRatedServices.map((service, index) => (
                                        <div key={service._id} className="rated-item">
                                            <div className="rated-rank">#{index + 1}</div>
                                            {service.coverImage ? (
                                                <img
                                                    src={service.coverImage}
                                                    alt={service.category}
                                                    className="rated-thumb"
                                                />
                                            ) : (
                                                <div className="rated-thumb-placeholder">
                                                    <Briefcase size={16} />
                                                </div>
                                            )}
                                            <div className="rated-info">
                                                <div className="rated-name">{service.category}</div>
                                                <div className="rated-rating">
                                                    <Star size={14} fill="#fbbf24" color="#fbbf24" />
                                                    <span>{service.avgRating.toFixed(1)}</span>
                                                    <span className="rated-reviews">
                                                        ({service.ratings?.length || 0} reviews)
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="empty-state-small">No ratings yet</div>
                            )}
                        </div>
                    </div>

                    {/* Recent Rental Listings */}
                    <div className="dashboard-card">
                        <div className="card-header">
                            <h3>
                                <Home size={20} />
                                Recent Rental Listings
                            </h3>
                            <span className="badge-info">Latest posts</span>
                        </div>
                        <div className="card-body">
                            {recentRentListings.length > 0 ? (
                                <div className="recent-list">
                                    {recentRentListings.map((rent) => (
                                        <div key={rent._id} className="recent-item">
                                            {rent.imageUrls && rent.imageUrls.length > 0 ? (
                                                <img
                                                    src={rent.imageUrls[0]}
                                                    alt={rent.category}
                                                    className="recent-thumb"
                                                />
                                            ) : (
                                                <div className="recent-thumb-placeholder rent-placeholder">
                                                    <Home size={16} />
                                                </div>
                                            )}
                                            <div className="recent-info">
                                                <div className="recent-name">{rent.category}</div>
                                                <div className="recent-meta">
                                                    <MapPin size={12} />
                                                    {rent.city}
                                                </div>
                                            </div>
                                            <span className="rent-price">
                                                ৳{rent.cost.toLocaleString()}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="empty-state-small">No rental listings yet</div>
                            )}
                        </div>
                    </div>

                    {/* Top Rentals by Price */}
                    <div className="dashboard-card">
                        <div className="card-header">
                            <h3>
                                <DollarSign size={20} />
                                Premium Rentals
                            </h3>
                            <span className="badge-info">Highest priced</span>
                        </div>
                        <div className="card-body">
                            {topRentalsByPrice.length > 0 ? (
                                <div className="rated-list">
                                    {topRentalsByPrice.map((rent, index) => (
                                        <div key={rent._id} className="rated-item">
                                            <div className="rated-rank rated-rank-green">#{index + 1}</div>
                                            {rent.imageUrls && rent.imageUrls.length > 0 ? (
                                                <img
                                                    src={rent.imageUrls[0]}
                                                    alt={rent.category}
                                                    className="rated-thumb"
                                                />
                                            ) : (
                                                <div className="rated-thumb-placeholder rent-placeholder">
                                                    <Home size={16} />
                                                </div>
                                            )}
                                            <div className="rated-info">
                                                <div className="rated-name">{rent.category}</div>
                                                <div className="rated-rating">
                                                    <DollarSign size={14} color="#10b981" />
                                                    <span>৳{rent.cost.toLocaleString()}</span>
                                                    <span className="rated-reviews">
                                                        / {rent.rentPaymentFrequency}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="empty-state-small">No premium rentals yet</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;