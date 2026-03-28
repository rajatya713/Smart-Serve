import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const PaymentPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { booking, vehicle, totalPrice } = location.state || {};
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);
        return () => document.body.removeChild(script);
    }, []);

    if (!booking || !vehicle) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500">
                Payment data missing.{" "}
                <button className="ml-2 text-blue-600 underline" onClick={() => navigate("/vehicles")}>
                    Go to Vehicles
                </button>
            </div>
        );
    }

    const handlePayment = async () => {
        setError("");
        setLoading(true);
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user") || "{}");

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
                setError(orderData.message || "Failed to create payment order.");
                setLoading(false);
                return;
            }

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: orderData.amount,
                currency: orderData.currency,
                name: "SmartServe",
                description: `Booking for ${vehicle.name}`,
                order_id: orderData.orderId,
                prefill: { name: user.name || "", email: user.email || "" },
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
                            return;
                        }

                        navigate("/booking/confirmation", {
                            state: {
                                booking: verifyData.booking,
                                vehicle,
                                paymentId: response.razorpay_payment_id,
                            },
                        });
                    } catch {
                        setError("Verification error. Please contact support.");
                    }
                },

                modal: { ondismiss: () => setLoading(false) },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (d) =>
        d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";

    return (
        <div className="min-h-screen bg-linear-to-b from-white via-blue-50 to-blue-100 bg-[radial-gradient(#c1c1c1_1px,transparent_1px)] bg-size-[18px_18px] px-4 py-10 sm:px-6 md:px-10">

            <div className="w-64 h-64 bg-blue-300/30 rounded-full fixed top-10 left-5 blur-[120px] -z-10"></div>
            <div className="w-64 h-64 bg-purple-300/30 rounded-full fixed bottom-10 right-5 blur-[120px] -z-10"></div>

            <div className="max-w-lg mx-auto flex items-center justify-between mb-10">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
                    <img src="/logo.png" alt="Logo" className="h-9 w-auto drop-shadow" />
                    <span className="text-2xl font-extrabold text-transparent bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text">
                        SmartServe
                    </span>
                </div>
            </div>

            <div className="max-w-lg mx-auto">
                <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl shadow-2xl p-8 fade-in">
                    <div className="text-center mb-6">
                        <div className="text-5xl mb-3">💳</div>
                        <h1 className="text-2xl font-extrabold text-gray-800">Complete Payment</h1>
                        <p className="text-gray-500 text-sm mt-1">Review your booking and pay securely via Razorpay</p>
                    </div>

                    <div className="bg-blue-50 rounded-xl p-5 mb-6 space-y-3 text-sm">
                        <h3 className="font-bold text-gray-700 mb-3">Order Summary</h3>
                        <div className="flex justify-between text-gray-600">
                            <span>Vehicle</span><span className="font-medium text-gray-800">{vehicle.name}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Pickup</span><span className="font-medium text-gray-800">{formatDate(booking.pickupDate)}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Drop-off</span><span className="font-medium text-gray-800">{formatDate(booking.dropoffDate)}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Location</span><span className="font-medium text-gray-800">{booking.location || "—"}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Delivery</span><span className="font-medium text-gray-800">{booking.deliveryRequired ? "Yes" : "No"}</span>
                        </div>
                        <div className="h-px bg-blue-200 my-1"></div>
                        <div className="flex justify-between font-bold text-base">
                            <span>Total Amount</span>
                            <span className="text-blue-600 text-xl">₹{totalPrice}</span>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
                            {error}
                        </div>
                    )}

                    <button
                        onClick={handlePayment}
                        disabled={loading}
                        className="w-full py-4 rounded-xl text-white font-bold text-lg bg-blue-600 hover:bg-blue-700 transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-blue-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                        {loading ? "Processing..." : `Pay ₹${totalPrice} via Razorpay`}
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