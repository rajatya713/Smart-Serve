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
        if (!pickupLocation.trim()) {
            setError("Please enter a pickup location.");
            return;
        }
        if (deliveryRequired && !deliveryAddress.trim()) {
            setError("Please enter a delivery address.");
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
                    location: pickupLocation,
                    deliveryRequired,
                    deliveryAddress: deliveryRequired ? deliveryAddress : "",
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Booking failed.");
                return;
            }

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
                <button
                    className="ml-2 text-blue-600 underline"
                    onClick={() => navigate("/vehicles")}
                >
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
                                <label htmlFor="b-pickup" className="text-sm font-medium text-gray-700 block mb-1">
                                    Pickup Date
                                </label>
                                <input
                                    id="b-pickup"
                                    type="date"
                                    min={today}
                                    value={pickupDate}
                                    onChange={(e) => setPickupDate(e.target.value)}
                                    className="w-full p-3 rounded-lg border border-gray-300 bg-white/80 focus:ring-2 focus:ring-blue-500 outline-none text-sm cursor-pointer"
                                />
                            </div>

                            <div>
                                <label htmlFor="b-dropoff" className="text-sm font-medium text-gray-700 block mb-1">
                                    Drop-off Date
                                </label>
                                <input
                                    id="b-dropoff"
                                    type="date"
                                    min={pickupDate || today}
                                    value={dropoffDate}
                                    onChange={(e) => setDropoffDate(e.target.value)}
                                    className="w-full p-3 rounded-lg border border-gray-300 bg-white/80 focus:ring-2 focus:ring-blue-500 outline-none text-sm cursor-pointer"
                                />
                            </div>

                            <div>
                                <label htmlFor="b-location" className="text-sm font-medium text-gray-700 block mb-1">
                                    Pickup Location
                                </label>
                                <input
                                    id="b-location"
                                    type="text"
                                    placeholder="e.g. MG Road, Lucknow"
                                    value={pickupLocation}
                                    onChange={(e) => setPickupLocation(e.target.value)}
                                    className="w-full p-3 rounded-lg border border-gray-300 bg-white/80 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                />
                            </div>

                            {/* Delivery Toggle */}
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    role="switch"
                                    aria-checked={deliveryRequired}
                                    aria-label="Request doorstep delivery"
                                    onClick={() => setDeliveryRequired(!deliveryRequired)}
                                    className={`cursor-pointer relative w-12 h-6 rounded-full transition-all duration-300 ${deliveryRequired ? "bg-blue-600" : "bg-gray-300"
                                        }`}
                                >
                                    <span
                                        className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-300 ${deliveryRequired ? "left-7" : "left-1"
                                            }`}
                                    />
                                </button>
                                <label className="text-sm text-gray-700 font-medium">
                                    🚚 Request doorstep delivery (+₹{DELIVERY_FEE})
                                </label>
                            </div>

                            {/* Delivery Address */}
                            {deliveryRequired && (
                                <div className="fade-in">
                                    <label htmlFor="b-delivery-address" className="text-sm font-medium text-gray-700 block mb-1">
                                        Delivery Address
                                    </label>
                                    <input
                                        id="b-delivery-address"
                                        type="text"
                                        placeholder="Full delivery address"
                                        value={deliveryAddress}
                                        onChange={(e) => setDeliveryAddress(e.target.value)}
                                        className="w-full p-3 rounded-lg border border-gray-300 bg-white/80 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                    />
                                    <p className="text-xs text-gray-400 mt-1">
                                        📍 Vehicle will be delivered to this address. You&apos;ll get GPS tracking.
                                    </p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                            >
                                {loading ? "Creating Booking..." : "Proceed to Payment →"}
                            </button>
                        </form>
                    </div>

                    {/* Summary */}
                    <div className="md:col-span-2 glass-card p-6 h-fit fade-in">
                        <h3 className="font-bold text-gray-800 mb-4 text-lg">Booking Summary</h3>
                        <div className="text-6xl text-center mb-4">
                            {vehicle.type?.toLowerCase() === "bike" || vehicle.type?.toLowerCase() === "scooter"
                                ? "🏍️"
                                : "🚗"}
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
                                <span className="text-blue-600 text-lg">
                                    {days > 0 ? `₹${totalPrice}` : "—"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingPage;