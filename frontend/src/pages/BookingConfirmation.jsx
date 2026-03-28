import { useLocation, useNavigate } from "react-router-dom";

const BookingConfirmation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { booking, vehicle, paymentId } = location.state || {};

    const formatDate = (d) =>
        d
            ? new Date(d).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
            })
            : "—";

    if (!booking) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500">
                No booking found.{" "}
                <button
                    className="ml-2 text-blue-600 underline"
                    onClick={() => navigate("/vehicles")}
                >
                    Go to Vehicles
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-b from-white via-green-50 to-blue-100 bg-[radial-gradient(#c1c1c1_1px,transparent_1px)] bg-size-[18px_18px] px-4 py-10 sm:px-6 md:px-10 flex items-center justify-center">

            {/* Blobs */}
            <div className="w-64 h-64 bg-green-300/30 rounded-full fixed top-10 left-5 blur-[120px] -z-10"></div>
            <div className="w-64 h-64 bg-blue-300/30 rounded-full fixed bottom-10 right-5 blur-[120px] -z-10"></div>

            <div className="w-full max-w-lg">
                <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl shadow-2xl p-8 text-center fade-in">

                    {/* Success Icon */}
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-5 shadow-lg">
                        ✅
                    </div>

                    <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Booking Confirmed!</h1>
                    <p className="text-gray-500 text-sm mb-8">
                        Your vehicle has been booked and payment received successfully.
                    </p>

                    {/* Booking Details */}
                    <div className="bg-green-50 rounded-xl p-5 text-left space-y-3 text-sm mb-6">
                        <div className="flex justify-between text-gray-600">
                            <span>Vehicle</span>
                            <span className="font-semibold text-gray-800">{vehicle?.name || "—"}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Pickup Date</span>
                            <span className="font-semibold text-gray-800">{formatDate(booking.pickupDate)}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Drop-off Date</span>
                            <span className="font-semibold text-gray-800">{formatDate(booking.dropoffDate)}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Location</span>
                            <span className="font-semibold text-gray-800">{booking.location || "—"}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Delivery</span>
                            <span className="font-semibold text-gray-800">{booking.deliveryRequired ? "Yes" : "No"}</span>
                        </div>
                        <div className="h-px bg-green-200 my-1"></div>
                        <div className="flex justify-between text-gray-600">
                            <span>Amount Paid</span>
                            <span className="font-bold text-green-700 text-base">₹{booking.totalPrice}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Payment Status</span>
                            <span className="font-semibold text-green-700 capitalize">{booking.paymentStatus}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Booking Status</span>
                            <span className="font-semibold text-blue-700 capitalize">{booking.status}</span>
                        </div>
                        {paymentId && (
                            <div className="flex justify-between text-gray-600">
                                <span>Payment ID</span>
                                <span className="font-mono text-xs text-gray-500">{paymentId}</span>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={() => navigate("/customer/bookings")}
                            className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                        >
                            View My Bookings
                        </button>
                        <button
                            onClick={() => navigate("/vehicles")}
                            className="flex-1 py-3 rounded-xl bg-white border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition"
                        >
                            Book Another
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingConfirmation;
