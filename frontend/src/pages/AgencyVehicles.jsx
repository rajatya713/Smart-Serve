import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import Notification from "../components/Notification";
import { vehicleTypes } from "../assets/assets";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const AgencyVehicles = () => {
    const { token } = useAuth();
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState({ message: "", type: "" });
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    // Form state
    const [formName, setFormName] = useState("");
    const [formType, setFormType] = useState("Car");
    const [formPrice, setFormPrice] = useState("");
    const [formDescription, setFormDescription] = useState("");
    const [formImage, setFormImage] = useState("");
    const [formFeatures, setFormFeatures] = useState("");
    const [formAvailable, setFormAvailable] = useState(true);

    useEffect(() => {
        fetchVehicles();
    }, [token]);

    const fetchVehicles = async () => {
        try {
            const res = await fetch(`${API_URL}/api/vehicles/my`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed");
            setVehicles(await res.json());
        } catch {
            setNotification({ message: "Failed to load vehicles.", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormName("");
        setFormType("Car");
        setFormPrice("");
        setFormDescription("");
        setFormImage("");
        setFormFeatures("");
        setFormAvailable(true);
        setEditingId(null);
        setShowForm(false);
    };

    const startEdit = (v) => {
        setFormName(v.name);
        setFormType(v.type);
        setFormPrice(v.pricePerDay.toString());
        setFormDescription(v.description || "");
        setFormImage(v.image || "");
        setFormFeatures(v.features?.join(", ") || "");
        setFormAvailable(v.available);
        setEditingId(v._id);
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formName.trim() || !formType || !formPrice) {
            setNotification({ message: "Name, type and price are required.", type: "error" });
            return;
        }

        setSaving(true);
        try {
            const body = {
                name: formName.trim(),
                type: formType,
                pricePerDay: Number(formPrice),
                description: formDescription,
                image: formImage,
                features: formFeatures
                    .split(",")
                    .map((f) => f.trim())
                    .filter(Boolean),
                available: formAvailable,
            };

            const url = editingId
                ? `${API_URL}/api/vehicles/${editingId}`
                : `${API_URL}/api/vehicles`;

            const res = await fetch(url, {
                method: editingId ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            });

            const data = await res.json();

            if (!res.ok) {
                setNotification({ message: data.message || "Failed.", type: "error" });
                return;
            }

            setNotification({
                message: editingId ? "Vehicle updated!" : "Vehicle added!",
                type: "success",
            });
            resetForm();
            fetchVehicles();
        } catch {
            setNotification({ message: "Server error.", type: "error" });
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (vehicleId) => {
        if (!window.confirm("Delete this vehicle?")) return;

        setDeletingId(vehicleId);
        try {
            const res = await fetch(`${API_URL}/api/vehicles/${vehicleId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) throw new Error("Failed");

            setVehicles((prev) => prev.filter((v) => v._id !== vehicleId));
            setNotification({ message: "Vehicle deleted.", type: "success" });
        } catch {
            setNotification({ message: "Failed to delete.", type: "error" });
        } finally {
            setDeletingId(null);
        }
    };

    if (loading) return <LoadingSpinner text="Loading vehicles..." />;

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
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-800">My Vehicles</h1>
                        <p className="text-gray-500">{vehicles.length} vehicles listed</p>
                    </div>
                    <button
                        onClick={() => {
                            resetForm();
                            setShowForm(true);
                        }}
                        className="px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition cursor-pointer"
                    >
                        + Add Vehicle
                    </button>
                </div>

                {/* Add/Edit Form Modal */}
                {showForm && (
                    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
                        <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl fade-in max-h-[90vh] overflow-y-auto">
                            <h3 className="font-bold text-lg text-gray-800 mb-4">
                                {editingId ? "Edit Vehicle" : "Add New Vehicle"}
                            </h3>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="v-name" className="text-sm font-medium text-gray-700 block mb-1">
                                        Vehicle Name
                                    </label>
                                    <input
                                        id="v-name"
                                        type="text"
                                        value={formName}
                                        onChange={(e) => setFormName(e.target.value)}
                                        placeholder="e.g. Honda Activa 6G"
                                        className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="v-type" className="text-sm font-medium text-gray-700 block mb-1">
                                        Type
                                    </label>
                                    <select
                                        id="v-type"
                                        value={formType}
                                        onChange={(e) => setFormType(e.target.value)}
                                        className="w-full p-2.5 rounded-lg border border-gray-300 text-sm outline-none"
                                    >
                                        {vehicleTypes.map((t) => (
                                            <option key={t} value={t}>
                                                {t}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="v-price" className="text-sm font-medium text-gray-700 block mb-1">
                                        Price Per Day (₹)
                                    </label>
                                    <input
                                        id="v-price"
                                        type="number"
                                        min="0"
                                        value={formPrice}
                                        onChange={(e) => setFormPrice(e.target.value)}
                                        placeholder="e.g. 500"
                                        className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="v-desc" className="text-sm font-medium text-gray-700 block mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        id="v-desc"
                                        value={formDescription}
                                        onChange={(e) => setFormDescription(e.target.value)}
                                        placeholder="Optional description"
                                        rows={2}
                                        className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm resize-none"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="v-image" className="text-sm font-medium text-gray-700 block mb-1">
                                        Image URL
                                    </label>
                                    <input
                                        id="v-image"
                                        type="url"
                                        value={formImage}
                                        onChange={(e) => setFormImage(e.target.value)}
                                        placeholder="https://example.com/image.jpg"
                                        className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="v-features" className="text-sm font-medium text-gray-700 block mb-1">
                                        Features (comma-separated)
                                    </label>
                                    <input
                                        id="v-features"
                                        type="text"
                                        value={formFeatures}
                                        onChange={(e) => setFormFeatures(e.target.value)}
                                        placeholder="e.g. GPS, Helmet, Insurance"
                                        className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                    />
                                </div>

                                {editingId && (
                                    <div className="flex items-center gap-3">
                                        <button
                                            type="button"
                                            role="switch"
                                            aria-checked={formAvailable}
                                            onClick={() => setFormAvailable(!formAvailable)}
                                            className={`relative w-12 h-6 rounded-full transition cursor-pointer ${formAvailable ? "bg-green-600" : "bg-gray-300"
                                                }`}
                                        >
                                            <span
                                                className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition ${formAvailable ? "left-7" : "left-1"
                                                    }`}
                                            />
                                        </button>
                                        <span className="text-sm text-gray-700">
                                            {formAvailable ? "Available" : "Unavailable"}
                                        </span>
                                    </div>
                                )}

                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="flex-1 py-2.5 rounded-lg border border-gray-300 text-gray-600 font-medium hover:bg-gray-50 transition cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="flex-1 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition disabled:opacity-60 cursor-pointer"
                                    >
                                        {saving ? "Saving..." : editingId ? "Update" : "Add Vehicle"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Vehicle Cards */}
                {vehicles.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-5xl mb-4">🚗</div>
                        <p className="text-gray-500 mb-4">No vehicles listed yet.</p>
                        <button
                            onClick={() => setShowForm(true)}
                            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition cursor-pointer"
                        >
                            Add Your First Vehicle
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {vehicles.map((v) => (
                            <div key={v._id} className="glass-card overflow-hidden">
                                <div className="bg-linear-to-r from-blue-100 to-purple-100 h-32 flex items-center justify-center text-6xl">
                                    {v.image ? (
                                        <img
                                            src={v.image}
                                            alt={v.name}
                                            className="h-full object-cover w-full"
                                        />
                                    ) : (
                                        <div className="h-full flex items-center justify-center text-4xl">
                                            {v.type === "bike" || v.type === "scooter" ? "🏍️" : "🚗"}
                                        </div>
                                    )}
                                </div>
                                <div className="p-5">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-gray-800">{v.name}</h3>
                                        <span
                                            className={`text-xs font-semibold px-2 py-1 rounded-full ${v.available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                                                }`}
                                        >
                                            {v.available ? "Available" : "Unavailable"}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 mb-1">Type: {v.type}</p>
                                    <p className="text-blue-600 font-bold text-lg mb-4">₹{v.pricePerDay}/day</p>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => startEdit(v)}
                                            className="flex-1 py-2 rounded-lg border border-blue-300 text-blue-600 text-sm font-medium hover:bg-blue-50 transition cursor-pointer"
                                        >
                                            ✏️ Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(v._id)}
                                            disabled={deletingId === v._id}
                                            className="flex-1 py-2 rounded-lg border border-red-300 text-red-600 text-sm font-medium hover:bg-red-50 transition disabled:opacity-50 cursor-pointer"
                                        >
                                            {deletingId === v._id ? "Deleting..." : "🗑️ Delete"}
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

export default AgencyVehicles;