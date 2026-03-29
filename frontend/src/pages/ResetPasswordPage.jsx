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
                setError(data.message || "Reset failed.");
                return;
            }

            setSuccess(true);
            setTimeout(() => navigate("/customer/login"), 3000);
        } catch {
            setError("Unable to connect to server.");
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500 page-bg">
                Invalid reset link.{" "}
                <Link to="/forgot-password" className="ml-2 text-blue-600 underline">
                    Request a new one
                </Link>
            </div>
        );
    }

    return (
        <div className="flex overflow-hidden min-h-screen px-4 page-bg relative items-center justify-center sm:px-6 md:px-10">
            <div className="w-48 h-48 bg-blue-300/30 rounded-full absolute top-10 left-5 blur-[100px] -z-10 sm:w-64 sm:h-64" />
            <div className="w-48 h-48 bg-purple-300/30 rounded-full absolute bottom-10 right-5 blur-[100px] -z-10 sm:w-64 sm:h-64" />

            <div className="z-20 w-full max-w-md p-6 glass-card fade-in sm:p-8 md:max-w-lg md:p-10">
                <div className="flex flex-col mb-6 text-center items-center">
                    <div className="mb-3 text-4xl">{success ? "✅" : "🔐"}</div>
                    <h1 className="text-2xl font-extrabold text-transparent bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text sm:text-3xl">
                        {success ? "Password Reset!" : "Set New Password"}
                    </h1>
                    <p className="mt-2 text-gray-600 text-sm">
                        {success ? "Your password has been updated." : "Enter your new password below."}
                    </p>
                </div>

                {success ? (
                    <div className="text-center">
                        <p className="text-gray-500 text-sm mb-6">Redirecting to login...</p>
                        <Link
                            to="/customer/login"
                            className="w-full block py-3 text-white font-semibold bg-blue-600 rounded-lg text-center hover:bg-blue-700 transition"
                        >
                            Go to Login
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
                                {error}
                                {(error.includes("expired") || error.includes("invalid")) && (
                                    <Link to="/forgot-password" className="ml-1 underline font-medium">
                                        Request a new link
                                    </Link>
                                )}
                            </div>
                        )}

                        <div>
                            <label htmlFor="reset-pass" className="text-gray-700 text-sm font-medium block mb-1">
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    id="reset-pass"
                                    type={showPass ? "text" : "password"}
                                    placeholder="Enter new password (min 6 chars)"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full p-2.5 mt-1 text-sm bg-white/80 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass(!showPass)}
                                    aria-label={showPass ? "Hide" : "Show"}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 text-lg"
                                >
                                    {showPass ? "🙈" : "👁️"}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="reset-confirm" className="text-gray-700 text-sm font-medium block mb-1">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <input
                                    id="reset-confirm"
                                    type={showConfirm ? "text" : "password"}
                                    placeholder="Confirm your new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full p-2.5 mt-1 text-sm bg-white/80 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm(!showConfirm)}
                                    aria-label={showConfirm ? "Hide" : "Show"}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 text-lg"
                                >
                                    {showConfirm ? "🙈" : "👁️"}
                                </button>
                            </div>
                        </div>

                        {password.length > 0 && (
                            <div className="flex items-center gap-2">
                                <div
                                    className={`h-1.5 flex-1 rounded-full transition-all ${password.length >= 8 ? "bg-green-400" : password.length >= 6 ? "bg-yellow-400" : "bg-red-400"
                                        }`}
                                />
                                <span className="text-xs font-medium text-gray-600">
                                    {password.length >= 8 ? "Strong" : password.length >= 6 ? "Fair" : "Too short"}
                                </span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2.5 text-white font-semibold bg-blue-600 rounded-lg transition-all hover:bg-blue-700 hover:scale-[1.03] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                        >
                            {loading ? "Resetting..." : "Reset Password"}
                        </button>

                        <p className="text-center text-sm text-gray-600">
                            <Link to="/customer/login" className="text-blue-600 font-medium underline">
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