import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CustomerDashboard = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Read user from localStorage (saved at login/register)
        const savedUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        // If no token, redirect to login
        if (!token || !savedUser) {
            navigate("/customer/login");
            return;
        }

        setUser(JSON.parse(savedUser));
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/customer/login");
    };

    if (!user) return null; // Waiting for auth check

    return (
        <div className="min-h-screen bg-linear-to-b from-white via-blue-50 to-blue-100 bg-[radial-gradient(#c1c1c1_1px,transparent_1px)] bg-size-[18px_18px] px-4 py-10 sm:px-6 md:px-10 lg:px-14 xl:px-20">

            {/* Background Blobs */}
            <div className="w-64 h-64 bg-blue-300/30 rounded-full fixed top-10 left-5 blur-[120px] -z-10"></div>
            <div className="w-64 h-64 bg-purple-300/30 rounded-full fixed bottom-10 right-5 blur-[120px] -z-10"></div>

            {/* Header */}
            <div className="max-w-5xl mx-auto flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                    <img src="/logo.png" alt="Logo" className="h-9 w-auto drop-shadow" />
                    <span className="text-2xl font-extrabold text-transparent bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text">
                        SmartServe
                    </span>
                </div>
                <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 transition"
                >
                    Logout
                </button>
            </div>

            {/* Welcome Card */}
            <div className="max-w-5xl mx-auto">
                <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl shadow-2xl p-8 mb-8 fade-in">
                    <div className="flex items-center gap-5">
                        {/* Avatar */}
                        <div className="h-16 w-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h1 className="text-2xl font-extrabold text-gray-800">
                                Welcome back, {user.name}! 👋
                            </h1>
                            <p className="text-gray-500 text-sm mt-1">{user.email}</p>
                            <span className="inline-block mt-2 px-3 py-0.5 text-xs font-semibold bg-blue-100 text-blue-700 rounded-full capitalize">
                                {user.role}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <h2 className="text-lg font-bold text-gray-700 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">

                    <div className="group bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl shadow-lg p-6 hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer">
                        <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl mb-4 shadow">
                            🚗
                        </div>
                        <h3 className="font-semibold text-gray-800 mb-1 group-hover:text-blue-600 transition">Browse Vehicles</h3>
                        <p className="text-gray-500 text-sm">Find the perfect ride for your journey.</p>
                    </div>

                    <div className="group bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl shadow-lg p-6 hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer">
                        <div className="h-12 w-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-2xl mb-4 shadow">
                            📋
                        </div>
                        <h3 className="font-semibold text-gray-800 mb-1 group-hover:text-green-600 transition">My Bookings</h3>
                        <p className="text-gray-500 text-sm">View and manage your current bookings.</p>
                    </div>

                    <div className="group bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl shadow-lg p-6 hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer">
                        <div className="h-12 w-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-2xl mb-4 shadow">
                            👤
                        </div>
                        <h3 className="font-semibold text-gray-800 mb-1 group-hover:text-purple-600 transition">My Profile</h3>
                        <p className="text-gray-500 text-sm">Update your personal information.</p>
                    </div>
                </div>

                {/* Account Info */}
                <h2 className="text-lg font-bold text-gray-700 mb-4">Account Details</h2>
                <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl shadow-lg p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Full Name</p>
                            <p className="text-gray-800 font-semibold mt-1">{user.name}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Email</p>
                            <p className="text-gray-800 font-semibold mt-1">{user.email}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Role</p>
                            <p className="text-gray-800 font-semibold mt-1 capitalize">{user.role}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">User ID</p>
                            <p className="text-gray-800 font-semibold mt-1 text-xs font-mono">{user._id}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerDashboard;