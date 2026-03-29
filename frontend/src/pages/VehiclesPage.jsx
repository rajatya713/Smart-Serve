import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const VehiclesPage = () => {
    const [vehicles, setVehicles] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [typeFilter, setTypeFilter] = useState("All");
    const [maxPrice, setMaxPrice] = useState(5000);
    const [search, setSearch] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const res = await fetch(`${API_URL}/api/vehicles`);
                const data = await res.json();
                setVehicles(data);
                setFiltered(data);
            } catch {
                setError("Failed to load vehicles. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        fetchVehicles();
    }, []);

    useEffect(() => {
        let result = vehicles;

        if (typeFilter !== "All") {
            result = result.filter(
                (v) => v.type?.toLowerCase() === typeFilter.toLowerCase()
            );
        }

        result = result.filter((v) => v.pricePerDay <= maxPrice);

        if (search.trim()) {
            result = result.filter((v) =>
                v.name?.toLowerCase().includes(search.toLowerCase())
            );
        }

        setFiltered(result);
    }, [typeFilter, maxPrice, search, vehicles]);

    const types = ["All", "Car", "Bike", "SUV", "Scooter"];

    return (
        <div className="min-h-screen bg-linear-to-b from-white via-blue-50 to-blue-100 bg-[radial-gradient(#c1c1c1_1px,transparent_1px)] bg-size-[18px_18px] px-4 py-10 sm:px-6 md:px-10 lg:px-14 xl:px-20">

            <div className="w-64 h-64 bg-blue-300/30 rounded-full fixed top-10 left-5 blur-[120px] -z-10"></div>
            <div className="w-64 h-64 bg-purple-300/30 rounded-full fixed bottom-10 right-5 blur-[120px] -z-10"></div>

            <div className="max-w-7xl mx-auto flex items-center justify-between mb-10">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/customer/dashboard")}>
                    <img src="/logo.png" alt="Logo" className="h-9 w-auto drop-shadow" />
                    <span className="text-2xl font-extrabold text-transparent bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text">
                        SmartServe
                    </span>
                </div>
                <button
                    onClick={() => navigate("/customer/dashboard")}
                    className="text-sm font-medium text-blue-600 hover:text-blue-800 underline cursor-pointer hover:scale-102"
                >
                    ← Dashboard
                </button>
            </div>

            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Browse Vehicles</h1>
                <p className="text-gray-500 mb-8">Find the perfect ride for your journey.</p>

                <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl shadow-lg p-6 mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:flex-wrap">
                    <div className="flex-1 min-w-[180px]">
                        <label className="text-sm font-medium text-gray-700 block mb-1">Search</label>
                        <input
                            type="text"
                            placeholder="Search by name..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full p-2.5 rounded-lg border border-gray-300 bg-white/80 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">Type</label>
                        <div className="flex gap-2 flex-wrap">
                            {types.map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setTypeFilter(t)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${typeFilter === t
                                        ? "bg-blue-600 text-white border-blue-600"
                                        : "bg-white text-gray-600 border-gray-300 hover:border-blue-400 cursor-pointer"
                                        }`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 min-w-[200px]">
                        <label className="text-sm font-medium text-gray-700 block mb-1">
                            Max Price: <span className="text-blue-600 font-semibold">₹{maxPrice}/day</span>
                        </label>
                        <input
                            type="range"
                            min={100}
                            max={5000}
                            step={100}
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(Number(e.target.value))}
                            className="w-full accent-blue-600"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-20 text-gray-500 text-lg">Loading vehicles...</div>
                ) : error ? (
                    <div className="text-center py-20 text-red-500">{error}</div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">No vehicles match your filters.</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtered.map((vehicle) => (
                            <div
                                key={vehicle._id}
                                className="group bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all overflow-hidden cursor-pointer"
                                onClick={() => navigate(`/vehicles/${vehicle._id}`)}
                            >
                                <div className="bg-linear-to-r from-blue-100 to-purple-100 h-36 flex items-center justify-center text-7xl">
                                    {vehicle.type?.toLowerCase() === "bike" || vehicle.type?.toLowerCase() === "scooter"
                                        ? "🏍️" : "🚗"}
                                </div>

                                <div className="p-5">
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="font-bold text-gray-800 text-lg group-hover:text-blue-600 transition">
                                            {vehicle.name}
                                        </h3>
                                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${vehicle.available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                                            }`}>
                                            {vehicle.available ? "Available" : "Unavailable"}
                                        </span>
                                    </div>

                                    <p className="text-sm text-gray-500 mb-1">
                                        <span className="font-medium text-gray-600">Type:</span> {vehicle.type}
                                    </p>
                                    <p className="text-sm text-gray-500 mb-3">
                                        <span className="font-medium text-gray-600">Agency:</span>{" "}
                                        {vehicle.agency?.name || "N/A"}
                                    </p>

                                    <div className="flex items-center justify-between">
                                        <span className="text-blue-600 font-bold text-lg">
                                            ₹{vehicle.pricePerDay}
                                            <span className="text-gray-400 font-normal text-sm">/day</span>
                                        </span>
                                        <button
                                            className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/vehicles/${vehicle._id}`);
                                            }}
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default VehiclesPage;