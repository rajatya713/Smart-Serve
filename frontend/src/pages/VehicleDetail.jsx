import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const VehicleDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [vehicle, setVehicle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchVehicle = async () => {
            try {
                const res = await fetch(`${API_URL}/api/vehicles/${id}`);
                if (!res.ok) throw new Error("Vehicle not found");
                const data = await res.json();
                setVehicle(data);
            } catch {
                setError("Vehicle not found.");
            } finally {
                setLoading(false);
            }
        };
        fetchVehicle();
    }, [id]);

    useEffect(() => {
        if (vehicle) {
            document.title = `${vehicle.name} — SmartServe`;
        }
        return () => {
            document.title = "SmartServe";
        };
    }, [vehicle]);

    if (loading) return <LoadingSpinner text="Loading vehicle..." />;

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center page-bg text-gray-500 gap-4">
                <div className="text-5xl">😔</div>
                <p>{error}</p>
                <Link to="/vehicles" className="text-blue-600 underline font-medium">
                    Browse Vehicles
                </Link>
            </div>
        );
    }

    return (
        <div className="page-bg px-4 py-10 sm:px-6 md:px-10 min-h-screen">
            <div className="w-64 h-64 bg-blue-300/30 rounded-full fixed top-10 left-5 blur-[120px] -z-10" />
            <div className="w-64 h-64 bg-purple-300/30 rounded-full fixed bottom-10 right-5 blur-[120px] -z-10" />

            <div className="max-w-6xl mx-auto">
                <div className="glass-card overflow-hidden fade-in">
                    <div className="bg-linear-to-r from-blue-100 to-purple-100 h-52 flex items-center justify-center text-9xl">
                        {vehicle.image ? (
                            <img
                                src={vehicle.image}
                                alt={vehicle.name}
                                className="h-full object-cover w-full"
                            />
                        ) : (
                            <div className="h-full flex items-center justify-center text-4xl">
                                {vehicle.type === "bike" || vehicle.type === "scooter" ? "🏍️" : "🚗"}
                            </div>
                        )}
                    </div>

                    <div className="p-8">
                        <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
                            <div>
                                <h1 className="text-3xl font-extrabold text-gray-800">{vehicle.name}</h1>
                                <p className="text-gray-500 mt-1">
                                    {vehicle.agency?.name} — {vehicle.agency?.location}
                                </p>
                            </div>
                            <span
                                className={`px-4 py-1.5 rounded-full text-sm font-semibold ${vehicle.available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                                    }`}
                            >
                                {vehicle.available ? "✅ Available" : "❌ Unavailable"}
                            </span>
                        </div>

                        {vehicle.description && (
                            <p className="text-gray-600 mb-6">{vehicle.description}</p>
                        )}

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

                        {vehicle.features?.length > 0 && (
                            <div className="mb-8">
                                <h3 className="font-bold text-gray-800 mb-3">Features</h3>
                                <div className="flex flex-wrap gap-2">
                                    {vehicle.features.map((f, i) => (
                                        <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                                            {f}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {vehicle.agency?.contact && (
                            <div className="flex items-center gap-3 mb-8 text-gray-600">
                                <span className="text-xl">📞</span>
                                <span className="text-sm">
                                    Agency Contact: <strong>{vehicle.agency.contact}</strong>
                                </span>
                            </div>
                        )}

                        <button
                            disabled={!vehicle.available}
                            onClick={() => navigate(`/booking/${vehicle._id}`)}
                            className="w-full py-4 rounded-xl text-white font-bold text-lg bg-blue-600 hover:bg-blue-700 transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer"
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