import { useState } from "react";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!email.includes("@")) {
            setError("Please enter a valid email address.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/users/forgot-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Something went wrong. Please try again.");
                return;
            }

            setSuccess(true);
        } catch {
            setError("Unable to connect to server. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex overflow-hidden min-h-screen px-4 bg-linear-to-b from-white via-blue-50 to-blue-100 bg-[radial-gradient(#c1c1c1_1px,transparent_1px)] bg-size-[18px_18px] relative items-center justify-center sm:px-6 md:px-10">

            <div className="w-48 h-48 bg-blue-300/30 rounded-full absolute top-10 left-5 blur-[100px] -z-10 sm:w-64 sm:h-64"></div>
            <div className="w-48 h-48 bg-purple-300/30 rounded-full absolute bottom-10 right-5 blur-[100px] -z-10 sm:w-64 sm:h-64"></div>

            <div className="z-20 w-full max-w-md p-6 bg-white/70 border border-white/40 rounded-2xl shadow-2xl backdrop-blur-xl fade-in sm:p-8 md:max-w-lg md:p-10">

                <Link to="/customer/login" className="flex mb-4 text-blue-700 font-medium text-sm hover:text-blue-900 items-center gap-2 sm:text-base">
                    ← Back to Login
                </Link>

                {/* Icon + Heading */}
                <div className="flex flex-col mb-6 text-center items-center sm:mb-8">
                    <div className="mb-3 text-4xl sm:text-5xl">🔑</div>
                    <h1 className="text-2xl font-extrabold text-transparent bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text sm:text-3xl">
                        Forgot Password?
                    </h1>
                    <p className="mt-2 text-gray-600 text-sm sm:text-base">
                        Enter your email and we'll send you a reset link.
                    </p>
                </div>

                {/* Success State */}
                {success ? (
                    <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 shadow">
                            ✅
                        </div>
                        <h2 className="text-lg font-bold text-gray-800 mb-2">Check your inbox!</h2>
                        <p className="text-gray-500 text-sm mb-6">
                            If an account with <strong>{email}</strong> exists, we've sent a password reset link.
                            It will expire in <strong>1 hour</strong>.
                        </p>
                        <p className="text-xs text-gray-400 mb-6">
                            Didn't receive it? Check your spam folder or try again.
                        </p>
                        <button
                            onClick={() => { setSuccess(false); setEmail(""); }}
                            className="text-sm text-blue-600 hover:text-blue-800 underline font-medium"
                        >
                            Try a different email
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Error */}
                        {error && (
                            <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
                                {error}
                            </div>
                        )}

                        {/* Email Input */}
                        <div>
                            <label className="text-gray-700 text-sm font-medium sm:text-base block mb-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                placeholder="Enter your registered email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-2.5 mt-1 text-sm bg-white/80 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none sm:p-3 sm:text-base"
                            />
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2.5 text-white font-semibold text-sm bg-blue-600 rounded-lg transition-all hover:bg-blue-700 duration-300 hover:scale-[1.03] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 sm:py-3 sm:text-base"
                        >
                            {loading ? "Sending Reset Link..." : "Send Reset Link"}
                        </button>

                        <p className="text-center text-sm text-gray-600">
                            Remembered your password?{" "}
                            <Link to="/customer/login" className="text-blue-600 font-medium underline hover:text-blue-800">
                                Login
                            </Link>
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ForgotPasswordPage;