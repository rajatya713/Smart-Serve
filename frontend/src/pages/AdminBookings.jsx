import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import { statusColors, paymentColors } from "../assets/assets";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const AdminBookings = () => {
    const { token } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("");

    useEffect(() => {
        fetchBookings();
    }, [token, filter]);

    const fetchBookings = async () => {
        try {
            const url = filter
                ? `${API_URL}/api/admin/bookings?status=${filter}`
                : `${API_URL}/api/admin/bookings`;
            const res = await fetch(url, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) setBookings(await res.json());
        } catch {
            // ignore
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (d) =>
        d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "—";

    if (loading) return <LoadingSpinner text="Loading bookings..." />;

    return (
        <div className="page-bg px-4 py-10 sm:px-6 md:px-10 min-h-screen">
            <div className="w-64 h-64 bg-purple-300/30 rounded-full fixed top-10 left-5 blur-[120px] -z-10" />

            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-extrabold text-gray-800 mb-2">All Bookings</h1>
                <p className="text-gray-500 mb-6">{bookings.length} bookings</p>

                {/* Filter */}
                <div className="flex gap-2 mb-6 flex-wrap">
                    {["", "pending", "confirmed", "assigned", "in-transit", "delivered", "cancelled"].map(
                        (f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium transition cursor-pointer ${filter === f
                                        ? "bg-blue-600 text-white"
                                        : "bg-white/70 text-gray-600 hover:bg-blue-50 border border-gray-200"
                                    }`}
                            >
                                {f ? f.charAt(0).toUpperCase() + f.slice(1).replace("-", " ") : "All"}
                            </button>
                        )
                    )}
                </div>

                <div className="glass-card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="text-left p-3 font-medium text-gray-600">Customer</th>
                                    <th className="text-left p-3 font-medium text-gray-600">Vehicle</th>
                                    <th className="text-left p-3 font-medium text-gray-600">Agency</th>
                                    <th className="text-left p-3 font-medium text-gray-600">Dates</th>
                                    <th className="text-left p-3 font-medium text-gray-600">Total</th>
                                    <th className="text-left p-3 font-medium text-gray-600">Delivery</th>
                                    <th className="text-left p-3 font-medium text-gray-600">Status</th>
                                    <th className="text-left p-3 font-medium text-gray-600">Payment</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.map((b) => (
                                    <tr key={b._id} className="border-t border-gray-100 hover:bg-gray-50">
                                        <td className="p-3">{b.user?.name || "—"}</td>
                                        <td className="p-3">{b.vehicle?.name || "—"}</td>
                                        <td className="p-3">{b.agency?.name || "—"}</td>
                                        <td className="p-3 text-xs">
                                            {formatDate(b.pickupDate)} → {formatDate(b.dropoffDate)}
                                        </td>
                                        <td className="p-3 font-bold">₹{b.totalPrice}</td>
                                        <td className="p-3">
                                            {b.deliveryRequired ? (
                                                <span className="text-cyan-600">🚚 Yes</span>
                                            ) : (
                                                "No"
                                            )}
                                        </td>
                                        <td className="p-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[b.status]}`}>
                                                {b.status.replace("-", " ")}
                                            </span>
                                        </td>
                                        <td className="p-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${paymentColors[b.paymentStatus]}`}>
                                                {b.paymentStatus}
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

export default AdminBookings;