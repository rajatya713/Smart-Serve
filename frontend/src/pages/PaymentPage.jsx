import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const PaymentPage = () => {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const { token, user } = useAuth();

    const [booking, setBooking] = useState(null);
    const [pageLoading, setPageLoading] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [razorpayLoaded, setRazorpayLoaded] = useState(false);

    // Load Razorpay script
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        script.onload = () => setRazorpayLoaded(true);
        script.onerror = () => setError("Failed to load payment gateway. Refresh the page.");
        document.body.appendChild(script);
        return () => document.body.removeChild(script);
    }, []);

    // Fetch booking details
    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const res = await fetch(`${API_URL}/api/bookings/${bookingId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error("Booking not found");
                const data = await res.json();
                setBooking(data);
            } catch {
                setError("Booking not found.");
            } finally {
                setPageLoading(false);
            }
        };
        fetchBooking();
    }, [bookingId, token]);

    const handlePayment = async () => {
        setError("");
        setLoading(true);

        try {
            const orderRes = await fetch(`${API_URL}/api/payments/create-order`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ bookingId: booking._id }),
            });

            const orderData = await orderRes.json();
            if (!orderRes.ok) {
                setError(orderData.message || "Failed to create order.");
                setLoading(false);
                return;
            }

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: orderData.amount,
                currency: orderData.currency,
                name: "SmartServe",
                description: `Booking for ${booking.vehicle?.name}`,
                order_id: orderData.orderId,
                prefill: { name: user?.name || "", email: user?.email || "" },
                theme: { color: "#2563eb" },

                handler: async (response) => {
                    try {
                        const verifyRes = await fetch(`${API_URL}/api/payments/verify`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                bookingId: booking._id,
                            }),
                        });

                        const verifyData = await verifyRes.json();

                        if (!verifyRes.ok) {
                            setError("Payment verification failed. Contact support.");
                            setLoading(false);
                            return;
                        }

                        navigate(`/booking/confirmation/${booking._id}`);
                    } catch {
                        setError("Verification error. Contact support.");
                        setLoading(false);
                    }
                },

                modal: {
                    ondismiss: () => setLoading(false),
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.on("payment.failed", (response) => {
                setError(`Payment failed: ${response.error.description}`);
                setLoading(false);
            });
            rzp.open();
        } catch {
            setError("Something went wrong.");
            setLoading(false);
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

    if (pageLoading) return <LoadingSpinner text="Loading payment details..." />;

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
        <div className="page-bg px-4 py-10 sm:px-6 md:px-10 min-h-screen">
            <div className="w-64 h-64 bg-blue-300/30 rounded-full fixed top-10 left-5 blur-[120px] -z-10" />
            <div className="w-64 h-64 bg-purple-300/30 rounded-full fixed bottom-10 right-5 blur-[120px] -z-10" />

            <div className="max-w-lg mx-auto">
                <div className="glass-card p-8 fade-in">
                    <div className="text-center mb-6">
                        <div className="text-5xl mb-3">💳</div>
                        <h1 className="text-2xl font-extrabold text-gray-800">Complete Payment</h1>
                        <p className="text-gray-500 text-sm mt-1">Review your booking and pay securely</p>
                    </div>

                    <div className="bg-blue-50 rounded-xl p-5 mb-6 space-y-3 text-sm">
                        <h3 className="font-bold text-gray-700 mb-3">Order Summary</h3>
                        {[
                            { label: "Vehicle", value: booking.vehicle?.name },
                            { label: "Pickup", value: formatDate(booking.pickupDate) },
                            { label: "Drop-off", value: formatDate(booking.dropoffDate) },
                            { label: "Location", value: booking.location },
                            { label: "Delivery", value: booking.deliveryRequired ? "Yes (Doorstep)" : "No" },
                        ].map((item, i) => (
                            <div key={i} className="flex justify-between text-gray-600">
                                <span>{item.label}</span>
                                <span className="font-medium text-gray-800">{item.value || "—"}</span>
                            </div>
                        ))}

                        {booking.deliveryRequired && booking.deliveryAddress && (
                            <div className="flex justify-between text-gray-600">
                                <span>Delivery Address</span>
                                <span className="font-medium text-gray-800 text-right max-w-[200px]">
                                    {booking.deliveryAddress}
                                </span>
                            </div>
                        )}

                        {booking.deliveryFee > 0 && (
                            <div className="flex justify-between text-gray-600">
                                <span>Delivery Fee</span>
                                <span className="font-medium text-gray-800">₹{booking.deliveryFee}</span>
                            </div>
                        )}

                        <div className="h-px bg-blue-200 my-1" />
                        <div className="flex justify-between font-bold text-base">
                            <span>Total Amount</span>
                            <span className="text-blue-600 text-xl">₹{booking.totalPrice}</span>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
                            {error}
                        </div>
                    )}

                    <button
                        onClick={handlePayment}
                        disabled={loading || !razorpayLoaded}
                        className="w-full py-4 rounded-xl text-white font-bold text-lg bg-blue-600 hover:bg-blue-700 transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-blue-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer"
                    >
                        {!razorpayLoaded
                            ? "Loading payment gateway..."
                            : loading
                                ? "Processing..."
                                : `Pay ₹${booking.totalPrice} via Razorpay`}
                    </button>

                    <p className="text-center text-xs text-gray-400 mt-4">
                        🔒 Secured by Razorpay. Your payment info is safe.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;