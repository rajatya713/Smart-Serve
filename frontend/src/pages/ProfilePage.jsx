import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import Notification from "../components/Notification";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const ProfilePage = () => {
    const { token, login } = useAuth();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [role, setRole] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [changePassword, setChangePassword] = useState(false);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [notification, setNotification] = useState({ message: "", type: "" });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch(`${API_URL}/api/users/profile`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message);
                setName(data.name);
                setEmail(data.email);
                setPhone(data.phone || "");
                setRole(data.role);
            } catch {
                setError("Failed to load profile.");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [token]);

    const handleSave = async (e) => {
        e.preventDefault();
        setError("");

        if (!name.trim()) {
            setError("Name cannot be empty.");
            return;
        }

        if (changePassword) {
            if (!currentPassword) {
                setError("Enter current password.");
                return;
            }
            if (newPassword.length < 6) {
                setError("New password must be at least 6 characters.");
                return;
            }
            if (newPassword !== confirmPassword) {
                setError("Passwords do not match.");
                return;
            }
        }

        setSaving(true);
        try {
            const body = { name, email, phone };
            if (changePassword) {
                body.currentPassword = currentPassword;
                body.password = newPassword;
            }

            const res = await fetch(`${API_URL}/api/users/profile`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            });

            const data = await res.json();
            if (!res.ok) {
                setError(data.message || "Update failed.");
                return;
            }

            login(data, data.token);
            setNotification({ message: "Profile updated!", type: "success" });
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setChangePassword(false);
        } catch {
            setError("Server error.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <LoadingSpinner text="Loading profile..." />;

    return (
        <div className="page-bg px-4 py-10 sm:px-6 md:px-10 min-h-screen">
            <div className="w-64 h-64 bg-blue-300/30 rounded-full fixed top-10 left-5 blur-[120px] -z-10" />
            <div className="w-64 h-64 bg-purple-300/30 rounded-full fixed bottom-10 right-5 blur-[120px] -z-10" />

            <Notification
                message={notification.message}
                type={notification.type}
                onClose={() => setNotification({ message: "", type: "" })}
            />

            <div className="max-w-3xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <div className="h-16 w-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shrink-0">
                        {name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h1 className="text-2xl font-extrabold text-gray-800">My Profile</h1>
                        <p className="text-gray-500 text-sm">Manage your personal information</p>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSave} className="space-y-6">
                    <div className="glass-card p-6">
                        <h2 className="text-lg font-bold text-gray-800 mb-5">Personal Information</h2>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="p-name" className="text-sm font-medium text-gray-700 block mb-1">
                                    Full Name
                                </label>
                                <input
                                    id="p-name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full p-3 rounded-lg border border-gray-300 bg-white/80 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                />
                            </div>
                            <div>
                                <label htmlFor="p-email" className="text-sm font-medium text-gray-700 block mb-1">
                                    Email Address
                                </label>
                                <input
                                    id="p-email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full p-3 rounded-lg border border-gray-300 bg-white/80 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                />
                            </div>
                            <div>
                                <label htmlFor="p-phone" className="text-sm font-medium text-gray-700 block mb-1">
                                    Phone Number
                                </label>
                                <input
                                    id="p-phone"
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full p-3 rounded-lg border border-gray-300 bg-white/80 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700 block mb-1">Role</label>
                                <div className="w-full p-3 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-500 capitalize">
                                    {role}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-6">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-lg font-bold text-gray-800">Password</h2>
                            <button
                                type="button"
                                onClick={() => {
                                    setChangePassword(!changePassword);
                                    setError("");
                                    setCurrentPassword("");
                                    setNewPassword("");
                                    setConfirmPassword("");
                                }}
                                className={`cursor-pointer text-sm font-semibold px-4 py-1.5 rounded-lg border transition ${changePassword
                                        ? "border-red-300 text-red-600 hover:bg-red-50"
                                        : "border-blue-300 text-blue-600 hover:bg-blue-50"
                                    }`}
                            >
                                {changePassword ? "Cancel" : "Change Password"}
                            </button>
                        </div>

                        {changePassword ? (
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="p-current" className="text-sm font-medium text-gray-700 block mb-1">
                                        Current Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="p-current"
                                            type={showCurrent ? "text" : "password"}
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            placeholder="Enter current password"
                                            className="w-full p-3 rounded-lg border border-gray-300 bg-white/80 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowCurrent(!showCurrent)}
                                            aria-label={showCurrent ? "Hide" : "Show"}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg"
                                        >
                                            {showCurrent ? "🙈" : "👁️"}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="p-new" className="text-sm font-medium text-gray-700 block mb-1">
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="p-new"
                                            type={showNew ? "text" : "password"}
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="Enter new password"
                                            className="w-full p-3 rounded-lg border border-gray-300 bg-white/80 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNew(!showNew)}
                                            aria-label={showNew ? "Hide" : "Show"}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg"
                                        >
                                            {showNew ? "🙈" : "👁️"}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="p-confirm" className="text-sm font-medium text-gray-700 block mb-1">
                                        Confirm New Password
                                    </label>
                                    <input
                                        id="p-confirm"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm new password"
                                        className="w-full p-3 rounded-lg border border-gray-300 bg-white/80 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                    />
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-400">Click &quot;Change Password&quot; to update.</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full py-4 rounded-xl text-white font-bold text-base bg-blue-600 hover:bg-blue-700 transition-all hover:scale-[1.01] shadow-lg shadow-blue-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                    >
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProfilePage;