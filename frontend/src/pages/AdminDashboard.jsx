import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import { statusColors } from "../assets/assets";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const AdminDashboard = () => {
    const { token } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch(`${API_URL}/api/admin/stats`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.ok) setStats(await res.json());
            } catch {
                // ignore
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [token]);

    const formatDate = (d) =>
        d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "—";

    if (loading) return <LoadingSpinner text="Loading admin dashboard..." />;

    return (
        <div className="page-bg px-4 py-10 sm:px-6 md:px-10 min-h-screen">
            <div className="w-64 h-64 bg-purple-300/30 rounded-full fixed top-10 left-5 blur-[120px] -z-10" />
            <div className="w-64 h-64 bg-blue-300/30 rounded-full fixed bottom-10 right-5 blur-[120px] -z-10" />

            <div className="max-w-6xl mx-auto">
                <div className="glass-card p-8 mb-8 fade-in">
                    <h1 className="text-3xl font-extrabold text-gray-800">Admin Dashboard</h1>
                    <p className="text-gray-500 mt-1">Manage SmartServe platform</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: "Users", value: stats?.totalUsers || 0, icon: "👥", color: "blue" },
                        { label: "Agencies", value: stats?.totalAgencies || 0, icon: "🏢", color: "green" },
                        { label: "Vehicles", value: stats?.totalVehicles || 0, icon: "🚗", color: "orange" },
                        { label: "Bookings", value: stats?.totalBookings || 0, icon: "📋", color: "purple" },
                        { label: "Customers", value: stats?.totalCustomers || 0, icon: "🧑", color: "cyan" },
                        { label: "Delivery Agents", value: stats?.totalDeliveryAgents || 0, icon: "🚚", color: "teal" },
                        { label: "Active Bookings", value: stats?.activeBookings || 0, icon: "⚡", color: "yellow" },
                        { label: "Revenue", value: `₹${stats?.totalRevenue || 0}`, icon: "💰", color: "green" },
                    ].map((stat, i) => (
                        <div key={i} className="glass-card p-4 text-center">
                            <div className="text-2xl mb-1">{stat.icon}</div>
                            <p className="text-xl font-extrabold text-gray-800">{stat.value}</p>
                            <p className="text-xs text-gray-500 uppercase font-medium">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                    {[
                        { icon: "👥", title: "Manage Users", path: "/admin/users", color: "blue" },
                        { icon: "🏢", title: "Manage Agencies", path: "/admin/agencies", color: "green" },
                        { icon: "📋", title: "All Bookings", path: "/admin/bookings", color: "purple" },
                    ].map((action, i) => (
                        <Link
                            key={i}
                            to={action.path}
                            className="group glass-card p-6 hover:shadow-2xl hover:-translate-y-1 transition-all block"
                        >
                            <div className="text-3xl mb-3">{action.icon}</div>
                            <h3 className="font-semibold text-gray-800">{action.title}</h3>
                        </Link>
                    ))}
                </div>

                {/* Recent Bookings */}
                <h2 className="text-lg font-bold text-gray-700 mb-4">Recent Bookings</h2>
                <div className="glass-card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="text-left p-3 font-medium text-gray-600">Customer</th>
                                    <th className="text-left p-3 font-medium text-gray-600">Vehicle</th>
                                    <th className="text-left p-3 font-medium text-gray-600">Agency</th>
                                    <th className="text-left p-3 font-medium text-gray-600">Date</th>
                                    <th className="text-left p-3 font-medium text-gray-600">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats?.recentBookings?.map((b) => (
                                    <tr key={b._id} className="border-t border-gray-100 hover:bg-gray-50">
                                        <td className="p-3">{b.user?.name || "—"}</td>
                                        <td className="p-3">{b.vehicle?.name || "—"}</td>
                                        <td className="p-3">{b.agency?.name || "—"}</td>
                                        <td className="p-3">{formatDate(b.createdAt)}</td>
                                        <td className="p-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[b.status]}`}>
                                                {b.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;