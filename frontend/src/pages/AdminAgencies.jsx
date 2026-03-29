import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import Notification from "../components/Notification";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const AdminAgencies = () => {
    const { token } = useAuth();
    const [agencies, setAgencies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState({ message: "", type: "" });

    useEffect(() => {
        fetchAgencies();
    }, [token]);

    const fetchAgencies = async () => {
        try {
            const res = await fetch(`${API_URL}/api/admin/agencies`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) setAgencies(await res.json());
        } catch {
            setNotification({ message: "Failed to load.", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (agencyId, status) => {
        try {
            const res = await fetch(`${API_URL}/api/admin/agencies/status`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ agencyId, status }),
            });
            if (!res.ok) throw new Error("Failed");
            setNotification({ message: "Status updated.", type: "success" });
            fetchAgencies();
        } catch {
            setNotification({ message: "Failed to update.", type: "error" });
        }
    };

    const handleDelete = async (agencyId) => {
        if (!window.confirm("Delete this agency and all its vehicles?")) return;

        try {
            const res = await fetch(`${API_URL}/api/admin/agencies/${agencyId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed");
            setAgencies((prev) => prev.filter((a) => a._id !== agencyId));
            setNotification({ message: "Agency deleted.", type: "success" });
        } catch {
            setNotification({ message: "Failed to delete.", type: "error" });
        }
    };

    const statusColorMap = {
        approved: "bg-green-100 text-green-700",
        pending: "bg-yellow-100 text-yellow-700",
        suspended: "bg-red-100 text-red-600",
    };

    if (loading) return <LoadingSpinner text="Loading agencies..." />;

    return (
        <div className="page-bg px-4 py-10 sm:px-6 md:px-10 min-h-screen">
            <div className="w-64 h-64 bg-green-300/30 rounded-full fixed top-10 left-5 blur-[120px] -z-10" />

            <Notification
                message={notification.message}
                type={notification.type}
                onClose={() => setNotification({ message: "", type: "" })}
            />

            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Manage Agencies</h1>
                <p className="text-gray-500 mb-8">{agencies.length} agencies registered</p>

                {agencies.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">No agencies found.</div>
                ) : (
                    <div className="space-y-4">
                        {agencies.map((a) => (
                            <div key={a._id} className="glass-card p-6">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <h3 className="font-bold text-gray-800 text-lg">{a.name}</h3>
                                        <p className="text-sm text-gray-500">
                                            📍 {a.location} • 📞 {a.contact}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Owner: {a.owner?.name} ({a.owner?.email})
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusColorMap[a.status]}`}>
                                            {a.status}
                                        </span>

                                        <select
                                            value={a.status}
                                            onChange={(e) => handleStatusChange(a._id, e.target.value)}
                                            className="p-1.5 rounded border border-gray-300 text-xs outline-none"
                                        >
                                            <option value="approved">Approved</option>
                                            <option value="pending">Pending</option>
                                            <option value="suspended">Suspended</option>
                                        </select>

                                        <button
                                            onClick={() => handleDelete(a._id)}
                                            className="text-red-600 text-xs font-medium hover:underline cursor-pointer"
                                        >
                                            Delete
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

export default AdminAgencies;