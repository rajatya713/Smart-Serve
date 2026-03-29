import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import Notification from "../components/Notification";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const AdminUsers = () => {
    const { token } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState({ message: "", type: "" });
    const [roleFilter, setRoleFilter] = useState("");

    useEffect(() => {
        fetchUsers();
    }, [token, roleFilter]);

    const fetchUsers = async () => {
        try {
            const url = roleFilter
                ? `${API_URL}/api/admin/users?role=${roleFilter}`
                : `${API_URL}/api/admin/users`;
            const res = await fetch(url, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) setUsers(await res.json());
        } catch {
            setNotification({ message: "Failed to load users.", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            const res = await fetch(`${API_URL}/api/admin/users/role`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ userId, role: newRole }),
            });

            if (!res.ok) throw new Error("Failed");
            setNotification({ message: "Role updated.", type: "success" });
            fetchUsers();
        } catch {
            setNotification({ message: "Failed to update role.", type: "error" });
        }
    };

    const handleDelete = async (userId) => {
        if (!window.confirm("Delete this user?")) return;

        try {
            const res = await fetch(`${API_URL}/api/admin/users/${userId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed");
            setUsers((prev) => prev.filter((u) => u._id !== userId));
            setNotification({ message: "User deleted.", type: "success" });
        } catch {
            setNotification({ message: "Failed to delete.", type: "error" });
        }
    };

    if (loading) return <LoadingSpinner text="Loading users..." />;

    return (
        <div className="page-bg px-4 py-10 sm:px-6 md:px-10 min-h-screen">
            <div className="w-64 h-64 bg-purple-300/30 rounded-full fixed top-10 left-5 blur-[120px] -z-10" />

            <Notification
                message={notification.message}
                type={notification.type}
                onClose={() => setNotification({ message: "", type: "" })}
            />

            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Manage Users</h1>
                <p className="text-gray-500 mb-6">{users.length} users found</p>

                {/* Role Filter */}
                <div className="flex gap-2 mb-6 flex-wrap">
                    {["", "customer", "agency", "delivery", "admin"].map((r) => (
                        <button
                            key={r}
                            onClick={() => setRoleFilter(r)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition cursor-pointer ${roleFilter === r
                                    ? "bg-blue-600 text-white"
                                    : "bg-white/70 text-gray-600 hover:bg-blue-50 border border-gray-200"
                                }`}
                        >
                            {r ? r.charAt(0).toUpperCase() + r.slice(1) : "All"}
                        </button>
                    ))}
                </div>

                <div className="glass-card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="text-left p-3 font-medium text-gray-600">Name</th>
                                    <th className="text-left p-3 font-medium text-gray-600">Email</th>
                                    <th className="text-left p-3 font-medium text-gray-600">Phone</th>
                                    <th className="text-left p-3 font-medium text-gray-600">Role</th>
                                    <th className="text-left p-3 font-medium text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((u) => (
                                    <tr key={u._id} className="border-t border-gray-100 hover:bg-gray-50">
                                        <td className="p-3 font-medium">{u.name}</td>
                                        <td className="p-3 text-gray-600">{u.email}</td>
                                        <td className="p-3 text-gray-600">{u.phone || "—"}</td>
                                        <td className="p-3">
                                            <select
                                                value={u.role}
                                                onChange={(e) => handleRoleChange(u._id, e.target.value)}
                                                className="p-1.5 rounded border border-gray-300 text-xs outline-none"
                                            >
                                                {["customer", "agency", "delivery", "admin"].map((r) => (
                                                    <option key={r} value={r}>
                                                        {r}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="p-3">
                                            {u.role !== "admin" && (
                                                <button
                                                    onClick={() => handleDelete(u._id)}
                                                    className="text-red-600 text-xs font-medium hover:underline cursor-pointer"
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminUsers;