import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import { statusColors } from "../assets/assets";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const DeliveryDashboard = () => {
    const { user, token } = useAuth();
    const [deliveries, setDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDeliveries = async () => {
            try {
                const res = await fetch(`${API_URL}/api/delivery/my`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.ok) setDeliveries(await res.json());
            } catch {
                // ignore
            } finally {
                setLoading(false);
            }
        };
        fetchDeliveries();
    }, [token]);

    const activeDeliveries = deliveries.filter(
        (d) => !["delivered", "cancelled"].includes(d.status)
    );
    const completedDeliveries = deliveries.filter(
        (d) => d.status === "delivered"
    );
    const inTransit = deliveries.filter((d) => d.status === "in-transit");
    const assigned = deliveries.filter(
        (d) => d.status === "assigned" || d.status === "picked-up"
    );

    const formatDate = (d) =>
        d
            ? new Date(d).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
            })
            : "—";

    if (loading) return <LoadingSpinner text="Loading delivery dashboard..." />;

    return (
        <div className="page-bg px-4 py-10 sm:px-6 md:px-10 min-h-screen">
            <div className="w-64 h-64 bg-cyan-300/30 rounded-full fixed top-10 left-5 blur-[120px] -z-10" />
            <div className="w-64 h-64 bg-blue-300/30 rounded-full fixed bottom-10 right-5 blur-[120px] -z-10" />

            <div className="max-w-6xl mx-auto">
                {/* Welcome */}
                <div className="glass-card p-8 mb-8 fade-in">
                    <div className="flex items-center gap-5">
                        <div className="h-16 w-16 rounded-full bg-cyan-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shrink-0">
                            🚚
                        </div>
                        <div>
                            <h1 className="text-2xl font-extrabold text-gray-800">
                                Welcome, {user?.name}! 👋
                            </h1>
                            <p className="text-gray-500 text-sm mt-1">
                                Delivery Agent Dashboard
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                    {[
                        {
                            label: "Total Deliveries",
                            value: deliveries.length,
                            icon: "📦",
                            color: "blue",
                        },
                        {
                            label: "Active",
                            value: activeDeliveries.length,
                            icon: "⚡",
                            color: "orange",
                        },
                        {
                            label: "In Transit",
                            value: inTransit.length,
                            icon: "🚚",
                            color: "cyan",
                        },
                        {
                            label: "Completed",
                            value: completedDeliveries.length,
                            icon: "✅",
                            color: "green",
                        },
                    ].map((stat, i) => (
                        <div key={i} className="glass-card p-5 text-center">
                            <div className="text-3xl mb-2">{stat.icon}</div>
                            <p
                                className={`text-2xl font-extrabold text-${stat.color}-600`}
                            >
                                {stat.value}
                            </p>
                            <p className="text-xs text-gray-500 uppercase font-medium mt-1">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Quick Actions */}
                <h2 className="text-lg font-bold text-gray-700 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                    {[
                        {
                            icon: "📦",
                            title: "Active Deliveries",
                            desc: "View and manage your current deliveries",
                            path: "/delivery/active",
                            color: "cyan",
                        },
                        {
                            icon: "👤",
                            title: "My Profile",
                            desc: "Update your personal info",
                            path: "/customer/profile",
                            color: "purple",
                        },
                        {
                            icon: "📍",
                            title: "Track Active",
                            desc: `${inTransit.length} delivery in transit`,
                            path: "/delivery/active",
                            color: "orange",
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
                            <h3 className="font-semibold text-gray-800 mb-1">
                                {action.title}
                            </h3>
                            <p className="text-gray-500 text-sm">{action.desc}</p>
                        </Link>
                    ))}
                </div>

                {/* Recent Deliveries */}
                <h2 className="text-lg font-bold text-gray-700 mb-4">
                    Recent Deliveries
                </h2>
                {deliveries.length === 0 ? (
                    <div className="glass-card p-6 text-center">
                        <div className="text-5xl mb-3">📭</div>
                        <p className="text-gray-500">No deliveries assigned yet.</p>
                        <p className="text-gray-400 text-sm mt-1">
                            You'll see deliveries here when an agency assigns one to you.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {deliveries.slice(0, 5).map((d) => (
                            <div
                                key={d._id}
                                className="glass-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 bg-cyan-100 rounded-xl flex items-center justify-center text-2xl shrink-0">
                                        {d.vehicle?.type?.toLowerCase() === "bike" ||
                                            d.vehicle?.type?.toLowerCase() === "scooter"
                                            ? "🏍️"
                                            : "🚗"}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800">
                                            {d.vehicle?.name || "Vehicle"}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {d.user?.name} • {d.agency?.name}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            {formatDate(d.pickupDate)} → {formatDate(d.dropoffDate)}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[d.status]
                                            }`}
                                    >
                                        {d.status.replace("-", " ")}
                                    </span>

                                    {["assigned", "picked-up", "in-transit"].includes(
                                        d.status
                                    ) && (
                                            <Link
                                                to="/delivery/active"
                                                className="px-3 py-1 text-xs font-semibold bg-cyan-100 text-cyan-700 rounded-full hover:bg-cyan-200 transition"
                                            >
                                                Manage →
                                            </Link>
                                        )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DeliveryDashboard;