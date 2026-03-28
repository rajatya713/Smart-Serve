import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const BookingPage = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const vehicle = location.state?.vehicle;

    const [pickupDate, setPickupDate] = useState("");
    const [dropoffDate, setDropoffDate] = useState("");
    const [pickupLocation, setPickupLocation] = useState("");
    const [deliveryRequired, setDeliveryRequired] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Calculate days and total price
    const calcDays = () => {
        if (!pickupDate || !dropoffDate) return 0;
        const diff = new Date(dropoffDate) - new Date(pickupDate);
        return Math.max(Math.ceil(diff / (1000 * 60 * 60 * 24)), 1);
    };

    const days = calcDays();
    const totalPrice = vehicle ? days * vehicle.pricePerDay : 0;
    const today = new Date().toISOString().split("T")[0];

    const handleBooking = async (e) => {
        e.preventDefault();
        setError("");

        if (!pickupDate || !dropoffDate) {
            setError("Please select both pickup and drop-off dates.");
            return;
        }
        if (new Date(dropoffDate) <= new Date(pickupDate)) {
            setError("Drop-off date must be after pickup date.");
            return;
        }
        if (!pickupLocation.trim()) {
            setError("Please enter a pickup location.");
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/customer/login");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("http://localhost:5000/api/bookings", {
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
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Booking failed. Try again.");
                return;
            }

            // Navigate to payment page with booking data
            navigate("/payment", {
                state: {
                    booking: data,
                    vehicle,
                    totalPrice: data.totalPrice,
                },
            });
        } catch {
            setError("Server error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!vehicle)
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500">
                Vehicle data missing.{" "}
                <button
                    className="ml-2 text-blue-600 underline"
                    onClick={() => navigate("/vehicles")}
                >
                    Go to Vehicles
                </button>
            </div>
        );

    return (
        <div className="min-h-screen bg-linear-to-b from-white via-blue-50 to-blue-100 bg-[radial-gradient(#c1c1c1_1px,transparent_1px)] bg-size-[18px_18px] px-4 py-10 sm:px-6 md:px-10">

            {/* Blobs */}
            <div className="w-64 h-64 bg-blue-300/30 rounded-full fixed top-10 left-5 blur-[120px] -z-10"></div>
            <div className="w-64 h-64 bg-purple-300/30 rounded-full fixed bottom-10 right-5 blur-[120px] -z-10"></div>

            {/* Header */}
            <div className="max-w-3xl mx-auto flex items-center justify-between mb-10">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
                    <img src="/logo.png" alt="Logo" className="h-9 w-auto drop-shadow" />
                    <span className="text-2xl font-extrabold text-transparent bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text">
                        SmartServe
                    </span>
                </div>
                <button
                    onClick={() => navigate(-1)}
                    className="text-sm font-medium text-blue-600 hover:text-blue-800 underline"
                >
                    ← Back
                </button>
            </div>

            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Book Your Ride</h1>
                <p className="text-gray-500 mb-8">Fill in the details to confirm your booking.</p>

                {/* Error */}
                {error && (
                    <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">

                    {/* Form */}
                    <div className="md:col-span-3 bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl shadow-xl p-6 fade-in">
                        <form onSubmit={handleBooking} className="space-y-5">

                            {/* Pickup Date */}
                            <div>
                                <label className="text-sm font-medium text-gray-700 block mb-1">Pickup Date</label>
                                <input
                                    type="date"
                                    min={today}
                                    value={pickupDate}
                                    onChange={(e) => setPickupDate(e.target.value)}
                                    className="w-full p-3 rounded-lg border border-gray-300 bg-white/80 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                />
                            </div>

                            {/* Drop-off Date */}
                            <div>
                                <label className="text-sm font-medium text-gray-700 block mb-1">Drop-off Date</label>
                                <input
                                    type="date"
                                    min={pickupDate || today}
                                    value={dropoffDate}
                                    onChange={(e) => setDropoffDate(e.target.value)}
                                    className="w-full p-3 rounded-lg border border-gray-300 bg-white/80 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                />
                            </div>

                            {/* Location */}
                            <div>
                                <label className="text-sm font-medium text-gray-700 block mb-1">Pickup Location</label>
                                <input
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
                                    onClick={() => setDeliveryRequired(!deliveryRequired)}
                                    className={`relative w-12 h-6 rounded-full transition-all duration-300 ${deliveryRequired ? "bg-blue-600" : "bg-gray-300"
                                        }`}
                                >
                                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-300 ${deliveryRequired ? "left-7" : "left-1"
                                        }`}></span>
                                </button>
                                <label className="text-sm text-gray-700 font-medium">
                                    Request delivery to my location
                                </label>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {loading ? "Creating Booking..." : "Proceed to Payment →"}
                            </button>
                        </form>
                    </div>

                    {/* Summary Card */}
                    <div className="md:col-span-2 bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl shadow-xl p-6 h-fit fade-in">
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
                                <span className="font-medium text-gray-800">{deliveryRequired ? "Yes" : "No"}</span>
                            </div>
                            <div className="h-px bg-gray-200 my-2"></div>
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