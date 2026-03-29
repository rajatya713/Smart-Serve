import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const ResetPasswordPage = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/users/reset-password/${token}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Reset failed. Please request a new link.");
                return;
            }

            setSuccess(true);
            // Redirect to login after 3 seconds
            setTimeout(() => navigate("/customer/login"), 3000);
        } catch {
            setError("Unable to connect to server. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // No token in URL
    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500">
                Invalid reset link.{" "}
                <Link to="/forgot-password" className="ml-2 text-blue-600 underline">
                    Request a new one
                </Link>
            </div>
        );
    }

    return (
        <div className="flex overflow-hidden min-h-screen px-4 bg-linear-to-b from-white via-blue-50 to-blue-100 bg-[radial-gradient(#c1c1c1_1px,transparent_1px)] bg-size-[18px_18px] relative items-center justify-center sm:px-6 md:px-10">

            <div className="w-48 h-48 bg-blue-300/30 rounded-full absolute top-10 left-5 blur-[100px] -z-10 sm:w-64 sm:h-64"></div>
            <div className="w-48 h-48 bg-purple-300/30 rounded-full absolute bottom-10 right-5 blur-[100px] -z-10 sm:w-64 sm:h-64"></div>

            <div className="z-20 w-full max-w-md p-6 bg-white/70 border border-white/40 rounded-2xl shadow-2xl backdrop-blur-xl fade-in sm:p-8 md:max-w-lg md:p-10">

                <div className="flex flex-col mb-6 text-center items-center sm:mb-8">
                    <div className="mb-3 text-4xl sm:text-5xl">{success ? "✅" : "🔐"}</div>
                    <h1 className="text-2xl font-extrabold text-transparent bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text sm:text-3xl">
                        {success ? "Password Reset!" : "Set New Password"}
                    </h1>
                    <p className="mt-2 text-gray-600 text-sm sm:text-base">
                        {success
                            ? "Your password has been updated successfully."
                            : "Enter your new password below."}
                    </p>
                </div>

                {/* Success State */}
                {success ? (
                    <div className="text-center">
                        <p className="text-gray-500 text-sm mb-6">
                            Redirecting you to login in a moment...
                        </p>
                        <Link
                            to="/customer/login"
                            className="w-full block py-3 text-white font-semibold text-sm bg-blue-600 rounded-lg text-center hover:bg-blue-700 transition"
                        >
                            Go to Login
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Error */}
                        {error && (
                            <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
                                {error}
                                {error.includes("expired") || error.includes("invalid") ? (
                                    <span>
                                        {" "}
                                        <Link to="/forgot-password" className="underline font-medium">
                                            Request a new link
                                        </Link>
                                    </span>
                                ) : null}
                            </div>
                        )}

                        {/* New Password */}
                        <div>
                            <label className="text-gray-700 text-sm font-medium block mb-1">
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPass ? "text" : "password"}
                                    placeholder="Enter new password (min 6 characters)"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full p-2.5 mt-1 text-sm bg-white/80 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none sm:p-3 sm:text-base"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass(!showPass)}
                                    className="text-gray-600 text-lg absolute right-3 top-1/2 -translate-y-1/2"
                                >
                                    {showPass ? "🙈" : "👁️"}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="text-gray-700 text-sm font-medium block mb-1">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirm ? "text" : "password"}
                                    placeholder="Confirm your new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full p-2.5 mt-1 text-sm bg-white/80 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none sm:p-3 sm:text-base"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm(!showConfirm)}
                                    className="text-gray-600 text-lg absolute right-3 top-1/2 -translate-y-1/2"
                                >
                                    {showConfirm ? "🙈" : "👁️"}
                                </button>
                            </div>
                        </div>

                        {/* Password strength hint */}
                        {password.length > 0 && (
                            <div className="flex items-center gap-2">
                                <div className={`h-1.5 flex-1 rounded-full transition-all ${password.length >= 8 ? "bg-green-400" : password.length >= 6 ? "bg-yellow-400" : "bg-red-400"}`}></div>
                                <span className={`text-xs font-medium ${password.length >= 8 ? "text-green-600" : password.length >= 6 ? "text-yellow-600" : "text-red-500"}`}>
                                    {password.length >= 8 ? "Strong" : password.length >= 6 ? "Fair" : "Too short"}
                                </span>
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2.5 text-white font-semibold text-sm bg-blue-600 rounded-lg transition-all hover:bg-blue-700 duration-300 hover:scale-[1.03] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 sm:py-3 sm:text-base"
                        >
                            {loading ? "Resetting Password..." : "Reset Password"}
                        </button>

                        <p className="text-center text-sm text-gray-600">
                            <Link to="/customer/login" className="text-blue-600 font-medium underline hover:text-blue-800">
                                Back to Login
                            </Link>
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ResetPasswordPage;