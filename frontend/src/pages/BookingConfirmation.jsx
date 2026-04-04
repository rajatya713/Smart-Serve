import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const BookingConfirmation = () => {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showCheck, setShowCheck] = useState(false);

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const res = await fetch(`${API_URL}/api/bookings/${bookingId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error("Not found");
                setBooking(await res.json());
                setTimeout(() => setShowCheck(true), 300);
            } catch {
                // ignore
            } finally {
                setLoading(false);
            }
        };
        fetchBooking();
    }, [bookingId, token]);

    const formatDate = (d) =>
        d
            ? new Date(d).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
            })
            : "—";

    if (loading) return <LoadingSpinner text="Loading confirmation..." />;

    if (!booking) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500 page-bg">
                Booking not found.{" "}
                <button className="ml-2 text-blue-600 underline" onClick={() => navigate("/vehicles")}>
                    Go to Vehicles
                </button>
            </div>
        );
    }

    return (
        <div className="page-bg px-4 py-10 sm:px-6 md:px-10 flex items-center justify-center min-h-screen">
            <div className="w-64 h-64 bg-green-300/30 rounded-full fixed top-10 left-5 blur-[120px] -z-10" />
            <div className="w-64 h-64 bg-blue-300/30 rounded-full fixed bottom-10 right-5 blur-[120px] -z-10" />

            <div className="w-full max-w-lg print-area">
                <div className="glass-card p-8 text-center fade-in">
                    {/* Animated Check */}
                    <div
                        className={`w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-5 shadow-lg transition-all duration-500 ${showCheck ? "scale-100 opacity-100" : "scale-50 opacity-0"
                            }`}
                    >
                        ✅
                    </div>

                    <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Booking Confirmed!</h1>
                    <p className="text-gray-500 text-sm mb-8">
                        {booking.deliveryRequired
                            ? "Your vehicle will be delivered to your doorstep. You'll receive GPS tracking."
                            : "Your vehicle has been booked successfully."}
                    </p>

                    <div className="bg-green-50 rounded-xl p-5 text-left space-y-3 text-sm mb-6">
                        {[
                            { label: "Booking ID", value: booking._id },
                            { label: "Vehicle", value: booking.vehicle?.name },
                            { label: "Pickup Date", value: formatDate(booking.pickupDate) },
                            { label: "Drop-off Date", value: formatDate(booking.dropoffDate) },
                            // { label: "Location", value: booking.location },
                            { label: "Delivery", value: booking.deliveryRequired ? "Yes (Doorstep)" : "No" },
                        ].map((item, i) => (
                            <div key={i} className="flex justify-between text-gray-600">
                                <span>{item.label}</span>
                                <span className="font-semibold text-gray-800 text-right max-w-[200px]">
                                    {item.value || "—"}
                                </span>
                            </div>
                        ))}

                        {booking.deliveryRequired && booking.deliveryAddress && (
                            <div className="flex justify-between text-gray-600">
                                <span>Delivery Address</span>
                                <span className="font-semibold text-gray-800 text-right max-w-[200px]">
                                    {booking.deliveryAddress}
                                </span>
                            </div>
                        )}

                        {booking.deliveryRequired && booking.deliveryOtp && (
                            <div className="flex justify-between text-gray-600">
                                <span>Delivery OTP</span>
                                <span className="font-bold text-blue-700 text-lg tracking-widest">
                                    {booking.deliveryOtp}
                                </span>
                            </div>
                        )}

                        <div className="h-px bg-green-200 my-1" />
                        <div className="flex justify-between text-gray-600">
                            <span>Amount Paid</span>
                            <span className="font-bold text-green-700 text-base">₹{booking.totalPrice}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Status</span>
                            <span className="font-semibold text-blue-700 capitalize">{booking.status}</span>
                        </div>
                    </div>

                    {booking.deliveryRequired && (
                        <p className="text-sm text-orange-600 bg-orange-50 rounded-lg p-3 mb-4">
                            🔑 <strong>Save your OTP: {booking.deliveryOtp}</strong> — Share it with the delivery agent upon receiving the vehicle.
                        </p>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={() => navigate("/customer/bookings")}
                            className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition cursor-pointer"
                        >
                            View My Bookings
                        </button>
                        {booking.deliveryRequired && (
                            <button
                                onClick={() => navigate(`/track/${booking._id}`)}
                                className="flex-1 py-3 rounded-xl bg-orange-500 text-white font-semibold hover:bg-orange-600 transition cursor-pointer"
                            >
                                📍 Track Delivery
                            </button>
                        )}
                        <button
                            onClick={() => window.print()}
                            className="flex-1 py-3 rounded-xl bg-gray-100 border border-gray-300 text-gray-700 font-semibold hover:bg-gray-200 transition cursor-pointer"
                        >
                            🖨️ Print
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingConfirmation;