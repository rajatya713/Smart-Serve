import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import { statusColors, paymentColors } from "../assets/assets";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const CustomerDashboard = () => {
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const [recentBookings, setRecentBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecent = async () => {
            try {
                const res = await fetch(`${API_URL}/api/bookings/user`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.ok) {
                    const data = await res.json();
                    setRecentBookings(data.slice(0, 3));
                }
            } catch {
                // ignore
            } finally {
                setLoading(false);
            }
        };
        fetchRecent();
    }, [token]);

    const formatDate = (d) =>
        d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";

    if (loading) return <LoadingSpinner text="Loading dashboard..." />;

    return (
        <div className="page-bg px-4 py-10 sm:px-6 md:px-10 lg:px-14 xl:px-20 min-h-screen">
            <div className="w-64 h-64 bg-blue-300/30 rounded-full fixed top-10 left-5 blur-[120px] -z-10" />
            <div className="w-64 h-64 bg-purple-300/30 rounded-full fixed bottom-10 right-5 blur-[120px] -z-10" />

            <div className="max-w-6xl mx-auto">
                {/* Welcome */}
                <div className="glass-card p-8 mb-8 fade-in">
                    <div className="flex items-center gap-5">
                        <div className="h-16 w-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shrink-0">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h1 className="text-2xl font-extrabold text-gray-800">
                                Welcome back, {user?.name}! 👋
                            </h1>
                            <p className="text-gray-500 text-sm mt-1">{user?.email}</p>
                            <span className="inline-block mt-2 px-3 py-0.5 text-xs font-semibold bg-blue-100 text-blue-700 rounded-full capitalize">
                                {user?.role}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <h2 className="text-lg font-bold text-gray-700 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                    {[
                        { icon: "🚗", title: "Browse Vehicles", desc: "Find the perfect ride.", path: "/vehicles", color: "blue" },
                        { icon: "📋", title: "My Bookings", desc: "View and manage bookings.", path: "/customer/bookings", color: "green" },
                        { icon: "👤", title: "My Profile", desc: "Update your information.", path: "/customer/profile", color: "purple" },
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
                            <h3 className={`font-semibold text-gray-800 mb-1 group-hover:text-${action.color}-600 transition`}>
                                {action.title}
                            </h3>
                            <p className="text-gray-500 text-sm">{action.desc}</p>
                        </Link>
                    ))}
                </div>

                {/* Recent Bookings */}
                <h2 className="text-lg font-bold text-gray-700 mb-4">Recent Bookings</h2>
                {recentBookings.length === 0 ? (
                    <div className="glass-card p-6 text-center">
                        <p className="text-gray-500">No bookings yet.</p>
                        <Link
                            to="/vehicles"
                            className="mt-3 inline-block text-blue-600 font-medium underline"
                        >
                            Browse Vehicles →
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {recentBookings.map((b) => (
                            <Link
                                key={b._id}
                                to={`/customer/bookings`}
                                className="glass-card p-4 flex justify-between items-center hover:shadow-lg transition"
                            >
                                <div>
                                    <p className="font-semibold text-gray-800">{b.vehicle?.name || "Vehicle"}</p>
                                    <p className="text-xs text-gray-500">
                                        {formatDate(b.pickupDate)} → {formatDate(b.dropoffDate)}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${statusColors[b.status]}`}>
                                        {b.status}
                                    </span>
                                    {b.deliveryRequired && b.status === "in-transit" && (
                                        <Link
                                            to={`/track/${b._id}`}
                                            onClick={(e) => e.stopPropagation()}
                                            className="px-3 py-1 text-xs font-semibold bg-orange-100 text-orange-700 rounded-full hover:bg-orange-200 transition"
                                        >
                                            📍 Track
                                        </Link>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomerDashboard;