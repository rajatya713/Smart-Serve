import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import Notification from "../components/Notification";
import { statusColors } from "../assets/assets";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const DeliveryActive = () => {
    const { token } = useAuth();
    const [deliveries, setDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState({ message: "", type: "" });
    const [actionLoading, setActionLoading] = useState(null);
    const [otpInputs, setOtpInputs] = useState({});
    const [showOtpFor, setShowOtpFor] = useState(null);

    useEffect(() => {
        fetchDeliveries();
    }, [token]);

    const fetchDeliveries = async () => {
        try {
            const res = await fetch(`${API_URL}/api/delivery/my`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                // Show only active deliveries (not delivered/cancelled)
                setDeliveries(
                    data.filter((d) => !["delivered", "cancelled"].includes(d.status))
                );
            }
        } catch {
            setNotification({ message: "Failed to load deliveries.", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    const handlePickup = async (bookingId) => {
        setActionLoading(bookingId);
        try {
            const res = await fetch(`${API_URL}/api/delivery/pickup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ bookingId }),
            });

            const data = await res.json();
            if (!res.ok) {
                setNotification({
                    message: data.message || "Failed.",
                    type: "error",
                });
                return;
            }

            setNotification({
                message: "Vehicle picked up! Head to the customer.",
                type: "success",
            });
            fetchDeliveries();
        } catch {
            setNotification({ message: "Server error.", type: "error" });
        } finally {
            setActionLoading(null);
        }
    };

    const handleStartTransit = async (bookingId) => {
        setActionLoading(bookingId);
        try {
            const res = await fetch(`${API_URL}/api/delivery/start-transit`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ bookingId }),
            });

            const data = await res.json();
            if (!res.ok) {
                setNotification({
                    message: data.message || "Failed.",
                    type: "error",
                });
                return;
            }

            setNotification({
                message: "In transit! Customer can now track you.",
                type: "success",
            });
            fetchDeliveries();
        } catch {
            setNotification({ message: "Server error.", type: "error" });
        } finally {
            setActionLoading(null);
        }
    };

    const handleCompleteDelivery = async (bookingId) => {
        const otp = otpInputs[bookingId];
        if (!otp || otp.length !== 4) {
            setNotification({
                message: "Please enter the 4-digit OTP from the customer.",
                type: "error",
            });
            return;
        }

        setActionLoading(bookingId);
        try {
            const res = await fetch(`${API_URL}/api/delivery/complete`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ bookingId, otp }),
            });

            const data = await res.json();
            if (!res.ok) {
                setNotification({
                    message: data.message || "Invalid OTP.",
                    type: "error",
                });
                return;
            }

            setNotification({
                message: "🎉 Delivery completed successfully!",
                type: "success",
            });
            setShowOtpFor(null);
            setOtpInputs((prev) => {
                const updated = { ...prev };
                delete updated[bookingId];
                return updated;
            });
            fetchDeliveries();
        } catch {
            setNotification({ message: "Server error.", type: "error" });
        } finally {
            setActionLoading(null);
        }
    };

    const handleUpdateLocation = async (bookingId) => {
        if (!navigator.geolocation) {
            setNotification({
                message: "Geolocation is not supported by your browser.",
                type: "error",
            });
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude: lat, longitude: lng } = position.coords;

                try {
                    const res = await fetch(`${API_URL}/api/delivery/update-location`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ bookingId, lat, lng }),
                    });

                    if (res.ok) {
                        setNotification({
                            message: "📍 Location updated successfully!",
                            type: "success",
                        });
                    } else {
                        setNotification({
                            message: "Failed to update location.",
                            type: "error",
                        });
                    }
                } catch {
                    setNotification({ message: "Server error.", type: "error" });
                }
            },
            () => {
                setNotification({
                    message: "Location access denied. Please enable GPS.",
                    type: "error",
                });
            },
            { enableHighAccuracy: true }
        );
    };

    const formatDate = (d) =>
        d
            ? new Date(d).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
            })
            : "—";

    if (loading) return <LoadingSpinner text="Loading active deliveries..." />;

    return (
        <div className="page-bg px-4 py-10 sm:px-6 md:px-10 min-h-screen">
            <div className="w-64 h-64 bg-cyan-300/30 rounded-full fixed top-10 left-5 blur-[120px] -z-10" />
            <div className="w-64 h-64 bg-orange-300/30 rounded-full fixed bottom-10 right-5 blur-[120px] -z-10" />

            <Notification
                message={notification.message}
                type={notification.type}
                onClose={() => setNotification({ message: "", type: "" })}
            />

            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
                    Active Deliveries
                </h1>
                <p className="text-gray-500 mb-8">
                    {deliveries.length} active{" "}
                    {deliveries.length === 1 ? "delivery" : "deliveries"}
                </p>

                {deliveries.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-5xl mb-4">📭</div>
                        <p className="text-gray-500 text-lg mb-2">
                            No active deliveries right now.
                        </p>
                        <p className="text-gray-400 text-sm">
                            New deliveries will appear here when assigned by an agency.
                        </p>
                        <Link
                            to="/delivery/dashboard"
                            className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition"
                        >
                            Back to Dashboard
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {deliveries.map((delivery) => (
                            <div key={delivery._id} className="glass-card p-6 fade-in">
                                {/* Header */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="h-14 w-14 bg-cyan-100 rounded-xl flex items-center justify-center text-3xl shrink-0">
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
                                                {delivery.vehicle?.name || "Vehicle"}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                {delivery.agency?.name} —{" "}
                                                {delivery.agency?.location}
                                            </p>
                                        </div>
                                    </div>
                                    <span
                                        className={`px-4 py-1.5 rounded-full text-sm font-semibold capitalize ${statusColors[delivery.status]
                                            }`}
                                    >
                                        {delivery.status.replace("-", " ")}
                                    </span>
                                </div>

                                {/* Details Grid */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm mb-4">
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase font-medium">
                                            Customer
                                        </p>
                                        <p className="font-semibold text-gray-700">
                                            {delivery.user?.name || "—"}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            {delivery.user?.phone || delivery.user?.email || ""}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase font-medium">
                                            Pickup
                                        </p>
                                        <p className="font-semibold text-gray-700">
                                            {formatDate(delivery.pickupDate)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase font-medium">
                                            Drop-off
                                        </p>
                                        <p className="font-semibold text-gray-700">
                                            {formatDate(delivery.dropoffDate)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase font-medium">
                                            Total
                                        </p>
                                        <p className="font-bold text-blue-600">
                                            ₹{delivery.totalPrice}
                                        </p>
                                    </div>
                                </div>

                                {/* Delivery Address */}
                                {delivery.deliveryAddress && (
                                    <div className="bg-cyan-50 rounded-xl p-4 mb-4">
                                        <p className="text-xs text-gray-400 uppercase font-medium mb-1">
                                            📍 Delivery Address
                                        </p>
                                        <p className="font-semibold text-gray-700">
                                            {delivery.deliveryAddress}
                                        </p>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex flex-wrap gap-3 mt-4">
                                    {/* Pickup Button - shown when status is "assigned" */}
                                    {delivery.status === "assigned" && (
                                        <button
                                            onClick={() => handlePickup(delivery._id)}
                                            disabled={actionLoading === delivery._id}
                                            className="px-5 py-2.5 bg-cyan-600 text-white text-sm font-semibold rounded-lg hover:bg-cyan-700 transition disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                                        >
                                            {actionLoading === delivery._id
                                                ? "Processing..."
                                                : "🏪 Pickup from Agency"}
                                        </button>
                                    )}

                                    {/* Start Transit Button - shown when status is "picked-up" */}
                                    {delivery.status === "picked-up" && (
                                        <button
                                            onClick={() => handleStartTransit(delivery._id)}
                                            disabled={actionLoading === delivery._id}
                                            className="px-5 py-2.5 bg-orange-600 text-white text-sm font-semibold rounded-lg hover:bg-orange-700 transition disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                                        >
                                            {actionLoading === delivery._id
                                                ? "Processing..."
                                                : "🚚 Start Transit"}
                                        </button>
                                    )}

                                    {/* Complete Delivery - shown when status is "in-transit" */}
                                    {delivery.status === "in-transit" && (
                                        <>
                                            {showOtpFor === delivery._id ? (
                                                <div className="flex items-center gap-3">
                                                    <input
                                                        type="text"
                                                        maxLength={4}
                                                        placeholder="Enter 4-digit OTP"
                                                        value={otpInputs[delivery._id] || ""}
                                                        onChange={(e) =>
                                                            setOtpInputs((prev) => ({
                                                                ...prev,
                                                                [delivery._id]: e.target.value.replace(
                                                                    /\D/g,
                                                                    ""
                                                                ),
                                                            }))
                                                        }
                                                        className="w-36 p-2.5 rounded-lg border border-gray-300 text-center text-lg tracking-widest font-bold outline-none focus:ring-2 focus:ring-green-500"
                                                    />
                                                    <button
                                                        onClick={() =>
                                                            handleCompleteDelivery(delivery._id)
                                                        }
                                                        disabled={actionLoading === delivery._id}
                                                        className="px-5 py-2.5 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                                                    >
                                                        {actionLoading === delivery._id
                                                            ? "Verifying..."
                                                            : "✅ Complete"}
                                                    </button>
                                                    <button
                                                        onClick={() => setShowOtpFor(null)}
                                                        className="px-4 py-2.5 border border-gray-300 text-gray-600 text-sm rounded-lg hover:bg-gray-50 transition cursor-pointer"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => setShowOtpFor(delivery._id)}
                                                    className="px-5 py-2.5 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition cursor-pointer"
                                                >
                                                    ✅ Complete Delivery (Enter OTP)
                                                </button>
                                            )}
                                        </>
                                    )}

                                    {/* Update Location - shown for picked-up and in-transit */}
                                    {["picked-up", "in-transit"].includes(delivery.status) && (
                                        <button
                                            onClick={() => handleUpdateLocation(delivery._id)}
                                            className="px-5 py-2.5 border border-blue-300 text-blue-600 text-sm font-semibold rounded-lg hover:bg-blue-50 transition cursor-pointer"
                                        >
                                            📍 Update My Location
                                        </button>
                                    )}

                                    {/* Track on Map */}
                                    {["assigned", "picked-up", "in-transit"].includes(
                                        delivery.status
                                    ) && (
                                            <Link
                                                to={`/track/${delivery._id}`}
                                                className="px-5 py-2.5 border border-orange-300 text-orange-600 text-sm font-semibold rounded-lg hover:bg-orange-50 transition"
                                            >
                                                🗺️ View on Map
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

export default DeliveryActive;