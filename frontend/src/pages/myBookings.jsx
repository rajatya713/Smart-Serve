import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const statusColors = {
    pending: "bg-yellow-100 text-yellow-700",
    confirmed: "bg-blue-100 text-blue-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-600",
};

const paymentColors = {
    unpaid: "bg-orange-100 text-orange-600",
    paid: "bg-green-100 text-green-700",
    refunded: "bg-gray-100 text-gray-600",
};

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [cancellingId, setCancellingId] = useState(null);
    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) {
            navigate("/customer/login");
            return;
        }
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/bookings/user", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setBookings(data);
        } catch (err) {
            setError("Failed to load bookings.");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (bookingId) => {
        if (!window.confirm("Are you sure you want to cancel this booking?")) return;
        setCancellingId(bookingId);
        try {
            const res = await fetch(
                `http://localhost:5000/api/bookings/${bookingId}/cancel`,
                {
                    method: "PATCH",
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            // Update local state
            setBookings((prev) =>
                prev.map((b) =>
                    b._id === bookingId ? { ...b, status: "cancelled" } : b
                )
            );
        } catch (err) {
            alert(err.message || "Failed to cancel booking.");
        } finally {
            setCancellingId(null);
        }
    };

    const formatDate = (d) =>
        d
            ? new Date(d).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
            })
            : "—";

    return (
        <div className="min-h-screen bg-linear-to-b from-white via-blue-50 to-blue-100 bg-[radial-gradient(#c1c1c1_1px,transparent_1px)] bg-size-[18px_18px] px-4 py-10 sm:px-6 md:px-10">

            {/* Blobs */}
            <div className="w-64 h-64 bg-blue-300/30 rounded-full fixed top-10 left-5 blur-[120px] -z-10"></div>
            <div className="w-64 h-64 bg-purple-300/30 rounded-full fixed bottom-10 right-5 blur-[120px] -z-10"></div>

            {/* Header */}
            <div className="max-w-5xl mx-auto flex items-center justify-between mb-10">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
                    <img src="/logo.png" alt="Logo" className="h-9 w-auto drop-shadow" />
                    <span className="text-2xl font-extrabold text-transparent bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text">
                        SmartServe
                    </span>
                </div>
                <button
                    onClick={() => navigate("/customer/dashboard")}
                    className="text-sm font-medium text-blue-600 hover:text-blue-800 underline"
                >
                    ← Dashboard
                </button>
            </div>

            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-extrabold text-gray-800 mb-2">My Bookings</h1>
                <p className="text-gray-500 mb-8">All your past and active vehicle bookings.</p>

                {loading ? (
                    <div className="text-center py-20 text-gray-500 text-lg">Loading bookings...</div>
                ) : error ? (
                    <div className="text-center py-20 text-red-500">{error}</div>
                ) : bookings.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-5xl mb-4">📭</div>
                        <p className="text-gray-500 text-lg mb-4">You have no bookings yet.</p>
                        <button
                            onClick={() => navigate("/vehicles")}
                            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
                        >
                            Browse Vehicles
                        </button>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {bookings.map((booking) => (
                            <div
                                key={booking._id}
                                className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl shadow-lg p-6 fade-in"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                                    {/* Left: Vehicle Info */}
                                    <div className="flex items-center gap-4">
                                        <div className="h-14 w-14 bg-blue-100 rounded-xl flex items-center justify-center text-3xl shrink-0">
                                            {booking.vehicle?.type?.toLowerCase() === "bike" ||
                                                booking.vehicle?.type?.toLowerCase() === "scooter"
                                                ? "🏍️"
                                                : "🚗"}
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

                                    {/* Right: Status Badges */}
                                    <div className="flex flex-wrap gap-2 items-center">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[booking.status]}`}>
                                            {booking.status}
                                        </span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${paymentColors[booking.paymentStatus]}`}>
                                            {booking.paymentStatus}
                                        </span>
                                    </div>
                                </div>

                                {/* Details Row */}
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
                                        <p className="text-xs text-gray-400 uppercase font-medium">Delivery</p>
                                        <p className="font-semibold text-gray-700">{booking.deliveryRequired ? "Yes" : "No"}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase font-medium">Total Paid</p>
                                        <p className="font-bold text-blue-600">₹{booking.totalPrice || "—"}</p>
                                    </div>
                                </div>

                                {/* Cancel Button */}
                                {booking.status === "pending" && (
                                    <div className="mt-4 flex justify-end">
                                        <button
                                            onClick={() => handleCancel(booking._id)}
                                            disabled={cancellingId === booking._id}
                                            className="px-4 py-2 text-sm font-semibold text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition disabled:opacity-50"
                                        >
                                            {cancellingId === booking._id ? "Cancelling..." : "Cancel Booking"}
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBookings;