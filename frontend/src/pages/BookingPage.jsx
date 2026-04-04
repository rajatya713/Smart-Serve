import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const DELIVERY_FEE = 50;

const BookingPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();

    const [vehicle, setVehicle] = useState(null);
    const [vehicleLoading, setVehicleLoading] = useState(true);
    const [pickupDate, setPickupDate] = useState("");
    const [dropoffDate, setDropoffDate] = useState("");
    const [pickupLocation, setPickupLocation] = useState("");
    const [deliveryRequired, setDeliveryRequired] = useState(false);
    const [deliveryAddress, setDeliveryAddress] = useState("");
    const [deliveryLat, setDeliveryLat] = useState(0);
    const [deliveryLng, setDeliveryLng] = useState(0);
    const [accuracyMeters, setAccuracyMeters] = useState(null);
    const [locating, setLocating] = useState(false);
    const [locError, setLocError] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchVehicle = async () => {
            try {
                const res = await fetch(`${API_URL}/api/vehicles/${id}`);
                if (!res.ok) throw new Error("Vehicle not found");
                setVehicle(await res.json());
            } catch {
                setError("Vehicle not found.");
            } finally {
                setVehicleLoading(false);
            }
        };
        fetchVehicle();
    }, [id]);

    const calcDays = () => {
        if (!pickupDate || !dropoffDate) return 0;
        const diff = new Date(dropoffDate) - new Date(pickupDate);
        return Math.max(Math.ceil(diff / (1000 * 60 * 60 * 24)), 1);
    };

    const days = calcDays();
    const deliveryFee = deliveryRequired ? DELIVERY_FEE : 0;
    const totalPrice = vehicle ? days * vehicle.pricePerDay + deliveryFee : 0;
    const today = new Date().toISOString().split("T")[0];

    const handleGetLocation = () => {
        setLocError("");
        setAccuracyMeters(null);

        if (!navigator.geolocation) {
            setLocError("Geolocation is not supported by your browser.");
            return;
        }

        setLocating(true);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude, accuracy } = position.coords;
                setDeliveryLat(latitude);
                setDeliveryLng(longitude);
                setAccuracyMeters(Math.round(accuracy));

                try {
                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&zoom=18&addressdetails=1`,
                        { headers: { "Accept-Language": "en" } }
                    );
                    const data = await res.json();
                    setDeliveryAddress(
                        data.display_name ||
                        `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
                    );
                } catch {
                    setDeliveryAddress(
                        `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
                    );
                }

                setLocating(false);
            },
            (err) => {
                setLocating(false);
                if (err.code === 1)
                    setLocError("Location access denied. Please allow location in your browser settings, or type your address below.");
                else if (err.code === 2)
                    setLocError("Location unavailable. Check that GPS/WiFi is enabled, or type your address below.");
                else if (err.code === 3)
                    setLocError("Location request timed out. Move to an open area or type your address below.");
                else
                    setLocError("Could not get location. Please type your address manually.");
            },
            {
                enableHighAccuracy: true,  // forces GPS/WiFi, not IP
                timeout: 15000,            // give GPS more time to lock
                maximumAge: 0,             // never use a cached position
            }
        );
    };

    const handleToggleDelivery = () => {
        const next = !deliveryRequired;
        setDeliveryRequired(next);
        if (!next) {
            setDeliveryAddress("");
            setDeliveryLat(0);
            setDeliveryLng(0);
            setAccuracyMeters(null);
            setLocError("");
        }
    };

    // Accuracy label helper
    const getAccuracyLabel = (meters) => {
        if (meters <= 20) return { label: `~${meters}m — Excellent`, color: "text-green-700", bg: "bg-green-50 border-green-200" };
        if (meters <= 100) return { label: `~${meters}m — Good`, color: "text-green-600", bg: "bg-green-50 border-green-200" };
        if (meters <= 500) return { label: `~${meters}m — Fair`, color: "text-yellow-700", bg: "bg-yellow-50 border-yellow-200" };
        return { label: `~${meters}m — Poor (try moving outdoors)`, color: "text-red-600", bg: "bg-red-50 border-red-200" };
    };

    const handleBooking = async (e) => {
        e.preventDefault();
        setError("");

        if (!pickupDate || !dropoffDate) {
            setError("Please select both dates.");
            return;
        }
        if (new Date(dropoffDate) <= new Date(pickupDate)) {
            setError("Drop-off must be after pickup.");
            return;
        }
        if (deliveryRequired && !deliveryAddress.trim()) {
            setError("Please enter a delivery address or use your current location.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/bookings`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    vehicleId: vehicle._id,
                    agencyId: vehicle.agency?._id,
                    pickupDate,
                    dropoffDate,
                    // location: pickupLocation,
                    deliveryRequired,
                    deliveryAddress: deliveryRequired ? deliveryAddress : "",
                    deliveryLat: deliveryRequired ? deliveryLat : 0,
                    deliveryLng: deliveryRequired ? deliveryLng : 0,
                }),
            });

            const data = await res.json();
            if (!res.ok) { setError(data.message || "Booking failed."); return; }
            navigate(`/payment/${data._id}`);
        } catch {
            setError("Server error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (vehicleLoading) return <LoadingSpinner text="Loading vehicle..." />;

    if (!vehicle) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500 page-bg">
                Vehicle not found.{" "}
                <button className="ml-2 text-blue-600 underline" onClick={() => navigate("/vehicles")}>
                    Browse Vehicles
                </button>
            </div>
        );
    }

    return (
        <div className="page-bg px-4 py-10 sm:px-6 md:px-10 min-h-screen">
            <div className="w-64 h-64 bg-blue-300/30 rounded-full fixed top-10 left-5 blur-[120px] -z-10" />
            <div className="w-64 h-64 bg-purple-300/30 rounded-full fixed bottom-10 right-5 blur-[120px] -z-10" />

            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Book Your Ride</h1>
                <p className="text-gray-500 mb-8">Fill in the details to confirm your booking.</p>

                {error && (
                    <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">

                    {/* Form */}
                    <div className="md:col-span-3 glass-card p-6 fade-in">
                        <form onSubmit={handleBooking} className="space-y-5">

                            <div>
                                <label htmlFor="b-pickup" className="text-sm font-medium text-gray-700 block mb-1">Pickup Date</label>
                                <input id="b-pickup" type="date" min={today} value={pickupDate}
                                    onChange={(e) => setPickupDate(e.target.value)}
                                    className="w-full p-3 rounded-lg border border-gray-300 bg-white/80 focus:ring-2 focus:ring-blue-500 outline-none text-sm cursor-pointer" />
                            </div>

                            <div>
                                <label htmlFor="b-dropoff" className="text-sm font-medium text-gray-700 block mb-1">Drop-off Date</label>
                                <input id="b-dropoff" type="date" min={pickupDate || today} value={dropoffDate}
                                    onChange={(e) => setDropoffDate(e.target.value)}
                                    className="w-full p-3 rounded-lg border border-gray-300 bg-white/80 focus:ring-2 focus:ring-blue-500 outline-none text-sm cursor-pointer" />
                            </div>

                            {/* Delivery Toggle */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <button type="button" role="switch" aria-checked={deliveryRequired}
                                        aria-label="Request doorstep delivery"
                                        onClick={handleToggleDelivery}
                                        className={`cursor-pointer relative w-12 h-6 rounded-full transition-all duration-300 ${deliveryRequired ? "bg-blue-600" : "bg-gray-300"}`}>
                                        <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-300 ${deliveryRequired ? "left-7" : "left-1"}`} />
                                    </button>
                                    <label className="text-sm text-gray-700 font-medium">
                                        🚚 Request doorstep delivery (+₹{DELIVERY_FEE})
                                    </label>
                                </div>

                                {/* Delivery address section */}
                                {deliveryRequired && (
                                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-3 fade-in">
                                        <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">Delivery Location</p>

                                        {/* Geolocation button */}
                                        <button type="button" onClick={handleGetLocation} disabled={locating}
                                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer">
                                            {locating ? (
                                                <>
                                                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                                    </svg>
                                                    Detecting Location...
                                                </>
                                            ) : deliveryLat !== 0 ? "📍 Re-detect My Location" : "📍 Use My Current Location"}
                                        </button>

                                        {/* Tips shown while locating */}
                                        {locating && (
                                            <p className="text-xs text-blue-600">
                                                💡 For best accuracy, ensure GPS and WiFi are enabled. This may take a few seconds.
                                            </p>
                                        )}

                                        {/* Location error */}
                                        {locError && (
                                            <p className="text-xs text-red-500">{locError}</p>
                                        )}

                                        {/* Accuracy badge — shown after capture */}
                                        {accuracyMeters !== null && (() => {
                                            const { label, color, bg } = getAccuracyLabel(accuracyMeters);
                                            return (
                                                <div className={`flex items-center gap-2 text-xs border rounded-lg px-3 py-2 ${bg}`}>
                                                    <span>📡</span>
                                                    <span className={`font-medium ${color}`}>GPS Accuracy: {label}</span>
                                                </div>
                                            );
                                        })()}

                                        {/* Delivery address — editable, pre-filled from reverse geocoding */}
                                        <div>
                                            <label htmlFor="b-delivery-address" className="text-xs font-medium text-gray-600 block mb-1">
                                                Delivery Address{" "}
                                                <span className="text-gray-400">(auto-filled or type manually)</span>
                                            </label>
                                            <input id="b-delivery-address" type="text"
                                                placeholder="Full delivery address"
                                                value={deliveryAddress}
                                                onChange={(e) => setDeliveryAddress(e.target.value)}
                                                className="w-full p-3 rounded-lg border border-gray-300 bg-white/80 focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                                            <p className="text-xs text-gray-400 mt-1">
                                                📍 Vehicle will be delivered to this address. You'll get GPS tracking.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button type="submit" disabled={loading}
                                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer">
                                {loading ? "Creating Booking..." : "Proceed to Payment →"}
                            </button>
                        </form>
                    </div>

                    {/* Summary */}
                    <div className="md:col-span-2 glass-card p-6 h-fit fade-in">
                        <h3 className="font-bold text-gray-800 mb-4 text-lg">Booking Summary</h3>
                        <div className="text-6xl text-center mb-4">
                            {vehicle.type?.toLowerCase() === "bike" || vehicle.type?.toLowerCase() === "scooter" ? "🏍️" : "🚗"}
                        </div>
                        <p className="font-semibold text-gray-800 text-center mb-4">{vehicle.name}</p>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between text-gray-600">
                                <span>Type</span>
                                <span className="font-medium text-gray-800">{vehicle.type}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Rate</span>
                                <span className="font-medium text-gray-800">₹{vehicle.pricePerDay}/day</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Days</span>
                                <span className="font-medium text-gray-800">{days || "—"}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Delivery</span>
                                <span className="font-medium text-gray-800">
                                    {deliveryRequired ? `Yes (+₹${DELIVERY_FEE})` : "No"}
                                </span>
                            </div>
                            <div className="h-px bg-gray-200 my-2" />
                            <div className="flex justify-between font-bold text-base">
                                <span className="text-gray-800">Total</span>
                                <span className="text-blue-600 text-lg">{days > 0 ? `₹${totalPrice}` : "—"}</span>
                            </div>
                        </div>

                        {/* Delivery address preview */}
                        {deliveryRequired && deliveryAddress && (
                            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                                <p className="text-xs font-semibold text-blue-700 mb-1">📍 Delivery to:</p>
                                <p className="text-xs text-gray-600 leading-relaxed">{deliveryAddress}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingPage;