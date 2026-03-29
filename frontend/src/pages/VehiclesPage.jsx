import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const debounce = (func, delay) => {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => func(...args), delay);
    };
};

const VehiclesPage = () => {
    const [vehicles, setVehicles] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [typeFilter, setTypeFilter] = useState("All");
    const [maxPrice, setMaxPrice] = useState(5000);
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("default");
    const [page, setPage] = useState(1);
    const ITEMS_PER_PAGE = 9;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const res = await fetch(`${API_URL}/api/vehicles?available=true`);
                const data = await res.json();
                setVehicles(data);
                setFiltered(data);
            } catch {
                setError("Failed to load vehicles.");
            } finally {
                setLoading(false);
            }
        };
        fetchVehicles();
    }, []);

    useEffect(() => {
        let result = [...vehicles];

        if (typeFilter !== "All") {
            result = result.filter((v) => v.type?.toLowerCase() === typeFilter.toLowerCase());
        }
        result = result.filter((v) => v.pricePerDay <= maxPrice);
        if (search.trim()) {
            result = result.filter((v) => v.name?.toLowerCase().includes(search.toLowerCase()));
        }

        if (sortBy === "price-low") result.sort((a, b) => a.pricePerDay - b.pricePerDay);
        if (sortBy === "price-high") result.sort((a, b) => b.pricePerDay - a.pricePerDay);
        if (sortBy === "name") result.sort((a, b) => a.name.localeCompare(b.name));

        setFiltered(result);
        setPage(1);
    }, [typeFilter, maxPrice, search, vehicles, sortBy]);

    const debouncedSearch = useCallback(
        debounce((val) => setSearch(val), 300),
        []
    );

    const types = ["All", ...new Set(vehicles.map((v) => v.type).filter(Boolean))];
    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const paginatedVehicles = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    return (
        <div className="page-bg px-4 py-10 sm:px-6 md:px-10 lg:px-14 xl:px-20 min-h-screen">
            <div className="w-64 h-64 bg-blue-300/30 rounded-full fixed top-10 left-5 blur-[120px] -z-10" />
            <div className="w-64 h-64 bg-purple-300/30 rounded-full fixed bottom-10 right-5 blur-[120px] -z-10" />

            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Browse Vehicles</h1>
                <p className="text-gray-500 mb-8">
                    {filtered.length} vehicle{filtered.length !== 1 ? "s" : ""} available
                    {typeFilter !== "All" && ` for "${typeFilter}"`}
                </p>

                {/* Filters */}
                <div className="glass-card p-6 mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:flex-wrap">
                    <div className="flex-1 min-w-[180px]">
                        <label htmlFor="v-search" className="text-sm font-medium text-gray-700 block mb-1">
                            Search
                        </label>
                        <input
                            id="v-search"
                            type="text"
                            placeholder="Search by name..."
                            onChange={(e) => debouncedSearch(e.target.value)}
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
                                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-all cursor-pointer ${typeFilter === t
                                            ? "bg-blue-600 text-white border-blue-600"
                                            : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"
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

                    <div className="min-w-[140px]">
                        <label htmlFor="v-sort" className="text-sm font-medium text-gray-700 block mb-1">
                            Sort By
                        </label>
                        <select
                            id="v-sort"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-full p-2.5 rounded-lg border border-gray-300 bg-white/80 text-sm outline-none"
                        >
                            <option value="default">Default</option>
                            <option value="price-low">Price: Low → High</option>
                            <option value="price-high">Price: High → Low</option>
                            <option value="name">Name: A → Z</option>
                        </select>
                    </div>
                </div>

                {/* Results */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3">
                        <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full" />
                        <p className="text-gray-500">Loading vehicles...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-20 text-red-500">{error}</div>
                ) : paginatedVehicles.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">No vehicles match your filters.</div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {paginatedVehicles.map((vehicle) => (
                                <Link
                                    key={vehicle._id}
                                    to={`/vehicles/${vehicle._id}`}
                                    className="group glass-card hover:shadow-2xl hover:-translate-y-1 transition-all overflow-hidden block"
                                >
                                    <div className="bg-linear-to-r from-blue-100 to-purple-100 h-36 flex items-center justify-center text-7xl">
                                        {vehicle.type?.toLowerCase() === "bike" || vehicle.type?.toLowerCase() === "scooter"
                                            ? "🏍️"
                                            : "🚗"}
                                    </div>

                                    <div className="p-5">
                                        <div className="flex items-start justify-between mb-2">
                                            <h3 className="font-bold text-gray-800 text-lg group-hover:text-blue-600 transition">
                                                {vehicle.name}
                                            </h3>
                                            <span
                                                className={`text-xs font-semibold px-2 py-1 rounded-full ${vehicle.available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                                                    }`}
                                            >
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
                                            <span className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded-lg">
                                                View Details
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center gap-2 mt-8">
                                <button
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="px-4 py-2 rounded-lg border border-gray-300 text-sm disabled:opacity-50 hover:bg-blue-50 transition cursor-pointer"
                                >
                                    ← Previous
                                </button>
                                <span className="px-4 py-2 text-sm text-gray-600">
                                    Page {page} of {totalPages}
                                </span>
                                <button
                                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className="px-4 py-2 rounded-lg border border-gray-300 text-sm disabled:opacity-50 hover:bg-blue-50 transition cursor-pointer"
                                >
                                    Next →
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default VehiclesPage;