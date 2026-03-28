import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const VehicleDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [vehicle, setVehicle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchVehicle = async () => {
            try {
                const res = await fetch(`${API_URL}/api/vehicles`);
                const data = await res.json();
                const found = data.find((v) => v._id === id);
                if (!found) setError("Vehicle not found.");
                else setVehicle(found);
            } catch {
                setError("Failed to load vehicle.");
            } finally {
                setLoading(false);
            }
        };
        fetchVehicle();
    }, [id]);

    if (loading)
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500 text-lg">
                Loading vehicle details...
            </div>
        );

    if (error)
        return (
            <div className="min-h-screen flex items-center justify-center text-red-500">
                {error}
            </div>
        );

    return (
        <div className="min-h-screen bg-linear-to-b from-white via-blue-50 to-blue-100 bg-[radial-gradient(#c1c1c1_1px,transparent_1px)] bg-size-[18px_18px] px-4 py-10 sm:px-6 md:px-10">

            <div className="w-64 h-64 bg-blue-300/30 rounded-full fixed top-10 left-5 blur-[120px] -z-10"></div>
            <div className="w-64 h-64 bg-purple-300/30 rounded-full fixed bottom-10 right-5 blur-[120px] -z-10"></div>

            <div className="max-w-4xl mx-auto flex items-center justify-between mb-10">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
                    <img src="/logo.png" alt="Logo" className="h-9 w-auto drop-shadow" />
                    <span className="text-2xl font-extrabold text-transparent bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text">
                        SmartServe
                    </span>
                </div>
                <button
                    onClick={() => navigate("/vehicles")}
                    className="text-sm font-medium text-blue-600 hover:text-blue-800 underline"
                >
                    ← Back to Vehicles
                </button>
            </div>

            <div className="max-w-4xl mx-auto">
                <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl shadow-2xl overflow-hidden fade-in">

                    <div className="bg-linear-to-r from-blue-100 to-purple-100 h-52 flex items-center justify-center text-9xl">
                        {vehicle.type?.toLowerCase() === "bike" || vehicle.type?.toLowerCase() === "scooter"
                            ? "🏍️" : "🚗"}
                    </div>

                    <div className="p-8">
                        <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
                            <div>
                                <h1 className="text-3xl font-extrabold text-gray-800">{vehicle.name}</h1>
                                <p className="text-gray-500 mt-1">{vehicle.agency?.name} — {vehicle.agency?.location}</p>
                            </div>
                            <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${vehicle.available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                                }`}>
                                {vehicle.available ? "✅ Available" : "❌ Unavailable"}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-8">
                            <div className="bg-blue-50 rounded-xl p-4 text-center">
                                <p className="text-xs text-gray-400 uppercase font-medium mb-1">Type</p>
                                <p className="font-bold text-gray-800">{vehicle.type}</p>
                            </div>
                            <div className="bg-green-50 rounded-xl p-4 text-center">
                                <p className="text-xs text-gray-400 uppercase font-medium mb-1">Price / Day</p>
                                <p className="font-bold text-green-700 text-xl">₹{vehicle.pricePerDay}</p>
                            </div>
                            <div className="bg-purple-50 rounded-xl p-4 text-center">
                                <p className="text-xs text-gray-400 uppercase font-medium mb-1">Agency</p>
                                <p className="font-bold text-gray-800">{vehicle.agency?.name || "N/A"}</p>
                            </div>
                        </div>

                        {vehicle.agency?.contact && (
                            <div className="flex items-center gap-3 mb-8 text-gray-600">
                                <span className="text-xl">📞</span>
                                <span className="text-sm">Agency Contact: <strong>{vehicle.agency.contact}</strong></span>
                            </div>
                        )}

                        <button
                            disabled={!vehicle.available}
                            onClick={() => navigate(`/booking/${vehicle._id}`, { state: { vehicle } })}
                            className="w-full py-4 rounded-xl text-white font-bold text-lg bg-blue-600 hover:bg-blue-700 transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            {vehicle.available ? "🚀 Book Now" : "Currently Unavailable"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VehicleDetail;