import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { statusColors, paymentColors } from "../assets/assets";
import LoadingSpinner from "../components/LoadingSpinner";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [cancellingId, setCancellingId] = useState(null);
    const [filter, setFilter] = useState("all");
    const [showCancelModal, setShowCancelModal] = useState(null);
    const navigate = useNavigate();
    const { token } = useAuth();

    useEffect(() => {
        fetchBookings();
    }, [token]);

    const fetchBookings = async () => {
        try {
            const res = await fetch(`${API_URL}/api/bookings/user`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setBookings(data);
        } catch {
            setError("Failed to load bookings.");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (bookingId) => {
        setCancellingId(bookingId);
        setShowCancelModal(null);
        try {
            const res = await fetch(`${API_URL}/api/bookings/${bookingId}/cancel`, {
                method: "PATCH",
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setBookings((prev) =>
                prev.map((b) => (b._id === bookingId ? { ...b, status: "cancelled" } : b))
            );
        } catch (err) {
            setError(err.message || "Failed to cancel.");
        } finally {
            setCancellingId(null);
        }
    };

    const formatDate = (d) =>
        d
            ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
            : "—";

    const filteredBookings = bookings.filter((b) => {
        if (filter === "all") return true;
        return b.status === filter;
    });

    if (loading) return <LoadingSpinner text="Loading bookings..." />;

    return (
        <div className="page-bg px-4 py-10 sm:px-6 md:px-10 min-h-screen">
            <div className="w-64 h-64 bg-blue-300/30 rounded-full fixed top-10 left-5 blur-[120px] -z-10" />
            <div className="w-64 h-64 bg-purple-300/30 rounded-full fixed bottom-10 right-5 blur-[120px] -z-10" />

            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-extrabold text-gray-800 mb-2">My Bookings</h1>
                <p className="text-gray-500 mb-6">{bookings.length} total bookings</p>

                {/* Filters */}
                <div className="flex gap-2 mb-6 flex-wrap">
                    {["all", "pending", "confirmed", "assigned", "in-transit", "delivered", "cancelled"].map(
                        (f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium transition cursor-pointer ${filter === f
                                        ? "bg-blue-600 text-white"
                                        : "bg-white/70 text-gray-600 hover:bg-blue-50 border border-gray-200"
                                    }`}
                            >
                                {f.charAt(0).toUpperCase() + f.slice(1).replace("-", " ")}
                            </button>
                        )
                    )}
                </div>

                {error && (
                    <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
                        {error}
                    </div>
                )}

                {filteredBookings.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-5xl mb-4">📭</div>
                        <p className="text-gray-500 text-lg mb-4">No bookings found.</p>
                        <button
                            onClick={() => navigate("/vehicles")}
                            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition cursor-pointer"
                        >
                            Browse Vehicles
                        </button>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {filteredBookings.map((booking) => (
                            <div key={booking._id} className="glass-card p-6 fade-in">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="h-14 w-14 bg-blue-100 rounded-xl flex items-center justify-center text-3xl shrink-0">
                                            {vehicle.image ? (
                                                <img
                                                    src={vehicle.image}
                                                    alt={vehicle.name}
                                                    className="h-full object-cover w-full"
                                                />
                                            ) : (
                                                <div className="h-full flex items-center justify-center text-4xl">
                                                    {vehicle.type === "bike" || vehicle.type === "scooter" ? "🏍️" : "🚗"}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-800 text-lg">
                                                {booking.vehicle?.name || "Vehicle"}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                {booking.agency?.name || "Agency"} — {booking.location}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2 items-center">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[booking.status]}`}
                                        >
                                            {booking.status.replace("-", " ")}
                                        </span>
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${paymentColors[booking.paymentStatus]}`}
                                        >
                                            {booking.paymentStatus}
                                        </span>
                                        {booking.deliveryRequired && (
                                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-100 text-cyan-700">
                                                🚚 Delivery
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase font-medium">Pickup</p>
                                        <p className="font-semibold text-gray-700">{formatDate(booking.pickupDate)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase font-medium">Drop-off</p>
                                        <p className="font-semibold text-gray-700">{formatDate(booking.dropoffDate)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase font-medium">Total</p>
                                        <p className="font-bold text-blue-600">₹{booking.totalPrice}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase font-medium">Delivery Agent</p>
                                        <p className="font-semibold text-gray-700">
                                            {booking.deliveryAgent?.name || "Not assigned"}
                                        </p>
                                    </div>
                                </div>

                                {/* Delivery OTP */}
                                {booking.deliveryRequired && booking.deliveryOtp && booking.status !== "cancelled" && (
                                    <div className="mt-3 px-4 py-2 bg-orange-50 rounded-lg text-sm text-orange-700">
                                        🔑 Delivery OTP: <strong className="tracking-widest">{booking.deliveryOtp}</strong>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="mt-4 flex flex-wrap gap-3 justify-end">
                                    {booking.deliveryRequired &&
                                        ["assigned", "picked-up", "in-transit"].includes(booking.status) && (
                                            <Link
                                                to={`/track/${booking._id}`}
                                                className="px-4 py-2 text-sm font-semibold text-orange-600 border border-orange-300 rounded-lg hover:bg-orange-50 transition"
                                            >
                                                📍 Track Delivery
                                            </Link>
                                        )}

                                    {booking.status === "pending" && booking.paymentStatus === "unpaid" && (
                                        <button
                                            onClick={() => navigate(`/payment/${booking._id}`)}
                                            className="px-4 py-2 text-sm font-semibold text-green-600 border border-green-300 rounded-lg hover:bg-green-50 transition cursor-pointer"
                                        >
                                            💳 Pay Now
                                        </button>
                                    )}

                                    {["pending", "confirmed"].includes(booking.status) && (
                                        <button
                                            onClick={() => setShowCancelModal(booking._id)}
                                            disabled={cancellingId === booking._id}
                                            className="px-4 py-2 text-sm font-semibold text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition disabled:opacity-50 cursor-pointer"
                                        >
                                            {cancellingId === booking._id ? "Cancelling..." : "Cancel Booking"}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Cancel Modal */}
            {showCancelModal && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
                    <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl fade-in">
                        <h3 className="font-bold text-lg text-gray-800 mb-2">Cancel Booking?</h3>
                        <p className="text-gray-500 text-sm mb-6">This action cannot be undone.</p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowCancelModal(null)}
                                className="flex-1 py-2 rounded-lg border border-gray-300 text-gray-600 font-medium hover:bg-gray-50 transition cursor-pointer"
                            >
                                Keep Booking
                            </button>
                            <button
                                onClick={() => handleCancel(showCancelModal)}
                                className="flex-1 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition cursor-pointer"
                            >
                                Yes, Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyBookings;