import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const ProfilePage = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [changePassword, setChangePassword] = useState(false);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [toast, setToast] = useState("");

    // Fetch current profile from backend on mount
    useEffect(() => {
        if (!token) { navigate("/customer/login"); return; }

        const fetchProfile = async () => {
            try {
                const res = await fetch(`${API_URL}/api/users/profile`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message);
                setName(data.name);
                setEmail(data.email);
            } catch (err) {
                setError("Failed to load profile.");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setError("");
        setToast("");

        if (!name.trim()) { setError("Name cannot be empty."); return; }
        if (!email.includes("@")) { setError("Please enter a valid email."); return; }

        if (changePassword) {
            if (!currentPassword) { setError("Please enter your current password."); return; }
            if (newPassword.length < 6) { setError("New password must be at least 6 characters."); return; }
            if (newPassword !== confirmPassword) { setError("New passwords do not match."); return; }
        }

        setSaving(true);
        try {
            const body = { name, email };
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
            if (!res.ok) { setError(data.message || "Update failed."); return; }

            // Update localStorage with new user data and fresh token
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify({
                _id: data._id, name: data.name, email: data.email, role: data.role,
            }));

            setToast("Profile updated successfully!");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setChangePassword(false);

            setTimeout(() => setToast(""), 3000);
        } catch (err) {
            setError("Server error. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center text-gray-500 text-lg">
            Loading profile...
        </div>
    );

    return (
        <div className="min-h-screen bg-linear-to-b from-white via-blue-50 to-blue-100 bg-[radial-gradient(#c1c1c1_1px,transparent_1px)] bg-size-[18px_18px] px-4 py-10 sm:px-6 md:px-10">

            <div className="w-64 h-64 bg-blue-300/30 rounded-full fixed top-10 left-5 blur-[120px] -z-10"></div>
            <div className="w-64 h-64 bg-purple-300/30 rounded-full fixed bottom-10 right-5 blur-[120px] -z-10"></div>

            {/* Toast */}
            {toast && (
                <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg text-sm sm:text-base">
                    {toast}
                </div>
            )}

            {/* Header */}
            <div className="max-w-7xl mx-auto flex items-center justify-between mb-10">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate(-1)}>
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

            <div className="max-w-3xl mx-auto">

                {/* Page Header */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="h-16 w-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shrink-0">
                        {name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h1 className="text-2xl font-extrabold text-gray-800">My Profile</h1>
                        <p className="text-gray-500 text-sm mt-0.5">Manage your personal information and password</p>
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSave} className="space-y-6">

                    {/* Personal Info Card */}
                    <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl shadow-xl p-6 fade-in">
                        <h2 className="text-lg font-bold text-gray-800 mb-5">Personal Information</h2>

                        <div className="space-y-4">
                            {/* Name */}
                            <div>
                                <label className="text-sm font-medium text-gray-700 block mb-1">Full Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Your full name"
                                    className="w-full p-3 rounded-lg border border-gray-300 bg-white/80 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="text-sm font-medium text-gray-700 block mb-1">Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    className="w-full p-3 rounded-lg border border-gray-300 bg-white/80 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                />
                            </div>

                            {/* Role (read-only) */}
                            <div>
                                <label className="text-sm font-medium text-gray-700 block mb-1">Role</label>
                                <div className="w-full p-3 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-500 capitalize">
                                    {user.role}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Password Card */}
                    <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl shadow-xl p-6 fade-in">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-lg font-bold text-gray-800">Password</h2>
                            <button
                                type="button"
                                onClick={() => { setChangePassword(!changePassword); setError(""); setCurrentPassword(""); setNewPassword(""); setConfirmPassword(""); }}
                                className={`cursor-pointer text-sm font-semibold px-4 py-1.5 rounded-lg border transition ${changePassword ? "border-red-300 text-red-600 hover:bg-red-50" : "border-blue-300 text-blue-600 hover:bg-blue-50"}`}
                            >
                                {changePassword ? "Cancel" : "Change Password"}
                            </button>
                        </div>

                        {!changePassword ? (
                            <p className="text-sm text-gray-400">Click "Change Password" to update your password.</p>
                        ) : (
                            <div className="space-y-4">
                                {/* Current Password */}
                                <div>
                                    <label className="text-sm font-medium text-gray-700 block mb-1">Current Password</label>
                                    <div className="relative">
                                        <input
                                            type={showCurrent ? "text" : "password"}
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            placeholder="Enter current password"
                                            className="w-full p-3 rounded-lg border border-gray-300 bg-white/80 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                        />
                                        <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg">
                                            {showCurrent ? "🙈" : "👁️"}
                                        </button>
                                    </div>
                                </div>

                                {/* New Password */}
                                <div>
                                    <label className="text-sm font-medium text-gray-700 block mb-1">New Password</label>
                                    <div className="relative">
                                        <input
                                            type={showNew ? "text" : "password"}
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="Enter new password (min 6 chars)"
                                            className="w-full p-3 rounded-lg border border-gray-300 bg-white/80 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                        />
                                        <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg">
                                            {showNew ? "🙈" : "👁️"}
                                        </button>
                                    </div>
                                </div>

                                {/* Confirm New Password */}
                                <div>
                                    <label className="text-sm font-medium text-gray-700 block mb-1">Confirm New Password</label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm new password"
                                        className="w-full p-3 rounded-lg border border-gray-300 bg-white/80 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Save Button */}
                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full py-4 rounded-xl text-white font-bold text-base bg-blue-600 hover:bg-blue-700 transition-all duration-300 hover:scale-[1.01] shadow-lg shadow-blue-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer"
                    >
                        {saving ? "Saving Changes..." : "Save Changes"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProfilePage;