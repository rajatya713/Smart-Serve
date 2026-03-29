import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import Notification from "../components/Notification";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const AgencyDashboard = () => {
    const { token, user } = useAuth();
    const navigate = useNavigate();

    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [notification, setNotification] = useState({ message: "", type: "" });

    // Create agency form state
    const [agencyName, setAgencyName] = useState("");
    const [agencyLocation, setAgencyLocation] = useState("");
    const [agencyContact, setAgencyContact] = useState("");
    const [agencyDescription, setAgencyDescription] = useState("");
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        fetchStats();
    }, [token]);

    const fetchStats = async () => {
        try {
            const res = await fetch(`${API_URL}/api/agencies/stats`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.status === 404) {
                setShowCreateForm(true);
                setLoading(false);
                return;
            }

            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();
            setStats(data);
        } catch {
            setShowCreateForm(true);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateAgency = async (e) => {
        e.preventDefault();

        if (!agencyName.trim() || !agencyLocation.trim() || !agencyContact.trim()) {
            setNotification({ message: "All fields are required.", type: "error" });
            return;
        }

        setCreating(true);
        try {
            const res = await fetch(`${API_URL}/api/agencies`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: agencyName,
                    location: agencyLocation,
                    contact: agencyContact,
                    description: agencyDescription,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setNotification({ message: data.message || "Failed to create.", type: "error" });
                return;
            }

            setNotification({ message: "Agency created successfully!", type: "success" });
            setShowCreateForm(false);
            fetchStats();
        } catch {
            setNotification({ message: "Server error.", type: "error" });
        } finally {
            setCreating(false);
        }
    };

    if (loading) return <LoadingSpinner text="Loading agency dashboard..." />;

    // Create Agency Form
    if (showCreateForm && !stats) {
        return (
            <div className="page-bg px-4 py-10 sm:px-6 md:px-10 min-h-screen">
                <div className="w-64 h-64 bg-blue-300/30 rounded-full fixed top-10 left-5 blur-[120px] -z-10" />
                <div className="w-64 h-64 bg-purple-300/30 rounded-full fixed bottom-10 right-5 blur-[120px] -z-10" />

                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification({ message: "", type: "" })}
                />

                <div className="max-w-lg mx-auto">
                    <div className="glass-card p-8 fade-in">
                        <div className="text-center mb-8">
                            <div className="text-5xl mb-3">🏢</div>
                            <h1 className="text-2xl font-extrabold text-gray-800">Create Your Agency</h1>
                            <p className="text-gray-500 text-sm mt-2">
                                Set up your agency to start listing vehicles on SmartServe.
                            </p>
                        </div>

                        <form onSubmit={handleCreateAgency} className="space-y-5">
                            <div>
                                <label htmlFor="a-name" className="text-sm font-medium text-gray-700 block mb-1">
                                    Agency Name
                                </label>
                                <input
                                    id="a-name"
                                    type="text"
                                    value={agencyName}
                                    onChange={(e) => setAgencyName(e.target.value)}
                                    placeholder="e.g. SpeedRide Rentals"
                                    className="w-full p-3 rounded-lg border border-gray-300 bg-white/80 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                />
                            </div>

                            <div>
                                <label htmlFor="a-location" className="text-sm font-medium text-gray-700 block mb-1">
                                    Location
                                </label>
                                <input
                                    id="a-location"
                                    type="text"
                                    value={agencyLocation}
                                    onChange={(e) => setAgencyLocation(e.target.value)}
                                    placeholder="e.g. Lucknow, UP"
                                    className="w-full p-3 rounded-lg border border-gray-300 bg-white/80 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                />
                            </div>

                            <div>
                                <label htmlFor="a-contact" className="text-sm font-medium text-gray-700 block mb-1">
                                    Contact Number
                                </label>
                                <input
                                    id="a-contact"
                                    type="tel"
                                    value={agencyContact}
                                    onChange={(e) => setAgencyContact(e.target.value)}
                                    placeholder="+91 XXXXXXXXXX"
                                    className="w-full p-3 rounded-lg border border-gray-300 bg-white/80 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                />
                            </div>

                            <div>
                                <label htmlFor="a-desc" className="text-sm font-medium text-gray-700 block mb-1">
                                    Description (optional)
                                </label>
                                <textarea
                                    id="a-desc"
                                    value={agencyDescription}
                                    onChange={(e) => setAgencyDescription(e.target.value)}
                                    placeholder="Tell customers about your agency..."
                                    rows={3}
                                    className="w-full p-3 rounded-lg border border-gray-300 bg-white/80 focus:ring-2 focus:ring-blue-500 outline-none text-sm resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={creating}
                                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                            >
                                {creating ? "Creating Agency..." : "Create Agency"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page-bg px-4 py-10 sm:px-6 md:px-10 min-h-screen">
            <div className="w-64 h-64 bg-blue-300/30 rounded-full fixed top-10 left-5 blur-[120px] -z-10" />
            <div className="w-64 h-64 bg-purple-300/30 rounded-full fixed bottom-10 right-5 blur-[120px] -z-10" />

            <Notification
                message={notification.message}
                type={notification.type}
                onClose={() => setNotification({ message: "", type: "" })}
            />

            <div className="max-w-6xl mx-auto">
                {/* Agency Info */}
                <div className="glass-card p-8 mb-8 fade-in">
                    <div className="flex items-center gap-5">
                        <div className="h-16 w-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shrink-0">
                            🏢
                        </div>
                        <div>
                            <h1 className="text-2xl font-extrabold text-gray-800">
                                {stats?.agency?.name}
                            </h1>
                            <p className="text-gray-500 text-sm">
                                {stats?.agency?.location} • {stats?.agency?.contact}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: "Vehicles", value: stats?.vehicleCount || 0, icon: "🚗", color: "blue" },
                        { label: "Total Bookings", value: stats?.totalBookings || 0, icon: "📋", color: "green" },
                        { label: "Active Bookings", value: stats?.activeBookings || 0, icon: "⚡", color: "orange" },
                        {
                            label: "Revenue",
                            value: `₹${stats?.totalRevenue || 0}`,
                            icon: "💰",
                            color: "purple",
                        },
                    ].map((stat, i) => (
                        <div key={i} className="glass-card p-5 text-center">
                            <div className="text-3xl mb-2">{stat.icon}</div>
                            <p className={`text-2xl font-extrabold text-${stat.color}-600`}>{stat.value}</p>
                            <p className="text-xs text-gray-500 uppercase font-medium mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Quick Actions */}
                <h2 className="text-lg font-bold text-gray-700 mb-4">Manage</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {[
                        {
                            icon: "🚗",
                            title: "My Vehicles",
                            desc: "Add, edit or remove vehicles",
                            path: "/agency/vehicles",
                            color: "blue",
                        },
                        {
                            icon: "📋",
                            title: "Bookings",
                            desc: "View and manage all bookings",
                            path: "/agency/bookings",
                            color: "green",
                        },
                        {
                            icon: "👤",
                            title: "Profile",
                            desc: "Update your personal info",
                            path: "/customer/profile",
                            color: "purple",
                        },
                    ].map((action, i) => (
                        <Link
                            key={i}
                            to={action.path}
                            className="group glass-card p-6 hover:shadow-2xl hover:-translate-y-1 transition-all block"
                        >
                            <div
                                className={`h-12 w-12 bg-${action.color}-100 text-${action.color}-600 rounded-full flex items-center justify-center text-2xl mb-4 shadow`}
                            >
                                {action.icon}
                            </div>
                            <h3 className="font-semibold text-gray-800 mb-1">{action.title}</h3>
                            <p className="text-gray-500 text-sm">{action.desc}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AgencyDashboard;