import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import Notification from "../components/Notification";
import { statusColors, paymentColors } from "../assets/assets";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const AgencyBookings = () => {
    const { token } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState({ message: "", type: "" });
    const [assigningId, setAssigningId] = useState(null);
    const [selectedAgent, setSelectedAgent] = useState("");

    useEffect(() => {
        fetchData();
    }, [token]);

    const fetchData = async () => {
        try {
            const [bookingsRes, agentsRes] = await Promise.all([
                fetch(`${API_URL}/api/agencies/bookings`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                fetch(`${API_URL}/api/delivery/agents`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
            ]);

            if (bookingsRes.ok) setBookings(await bookingsRes.json());
            if (agentsRes.ok) setAgents(await agentsRes.json());
        } catch {
            setNotification({ message: "Failed to load data.", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    const handleAssignAgent = async (bookingId) => {
        if (!selectedAgent) {
            setNotification({ message: "Please select an agent.", type: "error" });
            return;
        }

        try {
            const res = await fetch(`${API_URL}/api/bookings/assign-agent`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ bookingId, agentId: selectedAgent }),
            });

            const data = await res.json();

            if (!res.ok) {
                setNotification({ message: data.message || "Failed.", type: "error" });
                return;
            }

            setNotification({ message: "Delivery agent assigned!", type: "success" });
            setAssigningId(null);
            setSelectedAgent("");
            fetchData();
        } catch {
            setNotification({ message: "Server error.", type: "error" });
        }
    };

    const formatDate = (d) =>
        d
            ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
            : "—";

    if (loading) return <LoadingSpinner text="Loading bookings..." />;

    return (
        <div className="page-bg px-4 py-10 sm:px-6 md:px-10 min-h-screen">
            <div className="w-64 h-64 bg-blue-300/30 rounded-full fixed top-10 left-5 blur-[120px] -z-10" />
            <div className="w-64 h-64 bg-purple-300/30 rounded-full fixed bottom-10 right-5 blur-[120px] -z-10" />

            <Notification
                message={notification.message}
                type={notification.type}
                onClose={() => setNotification({ message: "", type: "" })}
            />

            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Agency Bookings</h1>
                <p className="text-gray-500 mb-8">{bookings.length} total bookings</p>

                {bookings.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">
                        <div className="text-5xl mb-4">📋</div>
                        <p>No bookings yet.</p>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {bookings.map((b) => (
                            <div key={b._id} className="glass-card p-6 fade-in">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                                    <div>
                                        <h3 className="font-bold text-gray-800 text-lg">{b.vehicle?.name || "Vehicle"}</h3>
                                        <p className="text-sm text-gray-500">
                                            Customer: {b.user?.name} ({b.user?.email})
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[b.status]}`}>
                                            {b.status.replace("-", " ")}
                                        </span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${paymentColors[b.paymentStatus]}`}>
                                            {b.paymentStatus}
                                        </span>
                                        {b.deliveryRequired && (
                                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-100 text-cyan-700">
                                                🚚 Delivery
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm mb-4">
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase">Pickup</p>
                                        <p className="font-semibold text-gray-700">{formatDate(b.pickupDate)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase">Drop-off</p>
                                        <p className="font-semibold text-gray-700">{formatDate(b.dropoffDate)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase">Total</p>
                                        <p className="font-bold text-blue-600">₹{b.totalPrice}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase">Agent</p>
                                        <p className="font-semibold text-gray-700">
                                            {b.deliveryAgent?.name || "Not assigned"}
                                        </p>
                                    </div>
                                </div>

                                {/* Assign Delivery Agent */}
                                {b.deliveryRequired &&
                                    b.paymentStatus === "paid" &&
                                    b.status === "confirmed" && (
                                        <div className="mt-3 p-4 bg-cyan-50 rounded-xl">
                                            {assigningId === b._id ? (
                                                <div className="flex gap-3 items-end">
                                                    <div className="flex-1">
                                                        <label className="text-sm font-medium text-gray-700 block mb-1">
                                                            Select Delivery Agent
                                                        </label>
                                                        <select
                                                            value={selectedAgent}
                                                            onChange={(e) => setSelectedAgent(e.target.value)}
                                                            className="w-full p-2.5 rounded-lg border border-gray-300 text-sm outline-none"
                                                        >
                                                            <option value="">-- Select Agent --</option>
                                                            {agents.map((a) => (
                                                                <option key={a._id} value={a._id}>
                                                                    {a.name} ({a.phone || "No phone"})
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <button
                                                        onClick={() => handleAssignAgent(b._id)}
                                                        className="px-4 py-2.5 bg-blue-600 text-white text-sm rounded-lg font-medium hover:bg-blue-700 transition cursor-pointer"
                                                    >
                                                        Assign
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setAssigningId(null);
                                                            setSelectedAgent("");
                                                        }}
                                                        className="px-4 py-2.5 border border-gray-300 text-gray-600 text-sm rounded-lg font-medium hover:bg-gray-50 transition cursor-pointer"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => setAssigningId(b._id)}
                                                    className="text-sm font-semibold text-cyan-700 hover:text-cyan-900 underline cursor-pointer"
                                                >
                                                    🚚 Assign Delivery Agent
                                                </button>
                                            )}
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

export default AgencyBookings;