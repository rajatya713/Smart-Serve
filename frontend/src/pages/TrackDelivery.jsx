import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// Custom marker icons
const agentIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
    iconSize: [35, 35],
    iconAnchor: [17, 35],
    popupAnchor: [0, -35],
});

const destIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/447/447031.png",
    iconSize: [35, 35],
    iconAnchor: [17, 35],
    popupAnchor: [0, -35],
});

const statusSteps = [
    { key: "assigned", label: "Assigned", icon: "📋" },
    { key: "picked-up", label: "Picked Up", icon: "🏪" },
    { key: "in-transit", label: "In Transit", icon: "🚚" },
    { key: "delivered", label: "Delivered", icon: "✅" },
];

const TrackDelivery = () => {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();
    const [trackingData, setTrackingData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchTracking = async () => {
        try {
            const res = await fetch(`${API_URL}/api/delivery/track/${bookingId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Tracking not available");
            const data = await res.json();
            setTrackingData(data);
        } catch {
            setError("Tracking information not available.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTracking();
        // Poll every 10 seconds for real-time updates
        const interval = setInterval(fetchTracking, 10000);
        return () => clearInterval(interval);
    }, [bookingId, token]);

    if (loading) return <LoadingSpinner text="Loading tracking..." />;

    if (error || !trackingData) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center page-bg gap-4">
                <div className="text-5xl">📍</div>
                <p className="text-gray-500">{error || "Tracking not available"}</p>
                <button
                    onClick={() => navigate("/customer/bookings")}
                    className="text-blue-600 underline font-medium"
                >
                    Back to Bookings
                </button>
            </div>
        );
    }

    const { booking, agent, tracking } = trackingData;
    const currentStep = statusSteps.findIndex((s) => s.key === booking.status);

    const agentPos =
        tracking?.currentLocation?.lat && tracking?.currentLocation?.lng
            ? [tracking.currentLocation.lat, tracking.currentLocation.lng]
            : null;

    const destPos =
        booking.deliveryLat && booking.deliveryLng
            ? [booking.deliveryLat, booking.deliveryLng]
            : null;

    const mapCenter = agentPos || destPos || [26.8467, 80.9462]; // Default: Lucknow

    return (
        <div className="page-bg px-4 py-10 sm:px-6 md:px-10 min-h-screen">
            <div className="w-64 h-64 bg-orange-300/30 rounded-full fixed top-10 left-5 blur-[120px] -z-10" />
            <div className="w-64 h-64 bg-blue-300/30 rounded-full fixed bottom-10 right-5 blur-[120px] -z-10" />

            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-extrabold text-gray-800 mb-2">📍 Track Your Delivery</h1>
                <p className="text-gray-500 mb-8">Real-time tracking of your vehicle delivery</p>

                {/* Status Timeline */}
                <div className="glass-card p-6 mb-6">
                    <div className="flex items-center justify-between">
                        {statusSteps.map((step, i) => (
                            <div key={step.key} className="flex-1 flex flex-col items-center relative">
                                <div
                                    className={`w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-md z-10 ${i <= currentStep
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-200 text-gray-400"
                                        }`}
                                >
                                    {step.icon}
                                </div>
                                <p
                                    className={`text-xs mt-2 font-medium text-center ${i <= currentStep ? "text-blue-600" : "text-gray-400"
                                        }`}
                                >
                                    {step.label}
                                </p>

                                {/* Connector line */}
                                {i < statusSteps.length - 1 && (
                                    <div
                                        className={`absolute top-6 left-1/2 w-full h-0.5 ${i < currentStep ? "bg-blue-600" : "bg-gray-200"
                                            }`}
                                        style={{ transform: "translateX(50%)" }}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Map */}
                    <div className="lg:col-span-2 glass-card overflow-hidden" style={{ height: "400px" }}>
                        <MapContainer center={mapCenter} zoom={13} className="w-full h-full">
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />

                            {agentPos && (
                                <Marker position={agentPos} icon={agentIcon}>
                                    <Popup>
                                        🚚 <strong>{agent?.name || "Delivery Agent"}</strong>
                                        <br />
                                        Current Location
                                    </Popup>
                                </Marker>
                            )}

                            {destPos && (
                                <Marker position={destPos} icon={destIcon}>
                                    <Popup>
                                        📍 <strong>Delivery Destination</strong>
                                        <br />
                                        {booking.deliveryAddress}
                                    </Popup>
                                </Marker>
                            )}

                            {agentPos && destPos && (
                                <Polyline positions={[agentPos, destPos]} color="blue" dashArray="10" />
                            )}
                        </MapContainer>
                    </div>

                    {/* Info Panel */}
                    <div className="space-y-4">
                        <div className="glass-card p-5">
                            <h3 className="font-bold text-gray-800 mb-3">Delivery Details</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Status</span>
                                    <span className="font-semibold text-blue-600 capitalize">
                                        {booking.status.replace("-", " ")}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Address</span>
                                    <span className="font-medium text-gray-800 text-right max-w-[180px]">
                                        {booking.deliveryAddress || "—"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {agent && (
                            <div className="glass-card p-5">
                                <h3 className="font-bold text-gray-800 mb-3">Delivery Agent</h3>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                                        {agent.name?.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800">{agent.name}</p>
                                        <p className="text-sm text-gray-500">{agent.phone || "No phone"}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {booking.deliveryOtp && (
                            <div className="glass-card p-5 bg-orange-50 border-orange-200">
                                <h3 className="font-bold text-orange-800 mb-2">🔑 Delivery OTP</h3>
                                <p className="text-2xl font-bold tracking-widest text-orange-700 text-center">
                                    {booking.deliveryOtp}
                                </p>
                                <p className="text-xs text-orange-600 mt-2 text-center">
                                    Share this OTP with the agent upon vehicle arrival
                                </p>
                            </div>
                        )}

                        <button
                            onClick={() => navigate("/customer/bookings")}
                            className="w-full py-3 rounded-xl bg-gray-100 border border-gray-300 text-gray-700 font-semibold hover:bg-gray-200 transition cursor-pointer"
                        >
                            ← Back to Bookings
                        </button>
                    </div>
                </div>
                {/* Auto-refresh indicator */}
                <div className="mt-6 text-center">
                    <p className="text-xs text-gray-400">
                        📡 Auto-refreshing every 10 seconds
                    </p>
                    <button
                        onClick={fetchTracking}
                        className="mt-2 text-sm text-blue-600 underline hover:text-blue-800 cursor-pointer"
                    >
                        Refresh Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TrackDelivery;