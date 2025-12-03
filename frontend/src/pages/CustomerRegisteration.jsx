import { useState } from "react";
import { Link } from "react-router-dom";

const CustomerRegister = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const [confirmPass, setConfirmPass] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState("");
    const [toast, setToast] = useState("");

    const handleRegister = (e) => {
        e.preventDefault();
        setError("");
        setToast("");

        if (!name.trim()) {
            setError("Name is required.");
            return;
        }
        if (!email.includes("@")) {
            setError("Please enter a valid email.");
            return;
        }
        if (pass.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }
        if (pass !== confirmPass) {
            setError("Passwords do not match.");
            return;
        }

        setToast("Registration successful! Redirecting...");
        setTimeout(() => setToast(""), 2000);
    };

    return (
        <div
            className="
        flex overflow-hidden
        min-h-screen
        px-4
        bg-linear-to-b from-white via-blue-50 to-blue-100
        bg-[radial-gradient(#c1c1c1_1px,transparent_1px)]
        bg-size-[18px_18px]
        relative items-center justify-center
        sm:px-6
        md:px-10
      "
        >
            {/* Background Blobs */}
            <div className="absolute top-10 left-5 w-48 h-48 bg-blue-300/30 blur-[100px] rounded-full float -z-10 sm:w-64 sm:h-64 sm:left-10 md:w-72 md:h-72"></div>
            <div className="absolute bottom-10 right-5 w-48 h-48 bg-purple-300/30 blur-[100px] rounded-full float -z-10 sm:w-64 sm:h-64 sm:right-10 md:w-72 md:h-72"></div>

            {/* Toast Messages */}
            {toast && (
                <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg fade-in text-sm sm:text-base">
                    {toast}
                </div>
            )}

            {error && (
                <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg fade-in text-sm sm:text-base">
                    {error}
                </div>
            )}

            {/* Registration Card */}
            <div
                className="
          z-20 w-full max-w-md bg-white/70 backdrop-blur-xl
          border border-white/40 rounded-2xl shadow-2xl
          p-6 sm:p-8 md:max-w-lg md:p-10 fade-in
        "
            >
                {/* Back Button */}
                <Link
                    to="/"
                    className="
            flex mb-4 text-blue-700 font-medium text-sm
            hover:text-blue-900 items-center gap-2 sm:text-base
          "
                >
                    ← Back to Home
                </Link>

                {/* Heading */}
                <div className="flex flex-col items-center text-center mb-6 sm:mb-8">
                    <div className="text-4xl sm:text-5xl mb-3">📝</div>

                    <h1 className="text-2xl sm:text-3xl font-extrabold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Create Your Account
                    </h1>

                    <p className="mt-2 text-gray-600 text-sm sm:text-base">
                        Join SmartServe and start riding smart.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleRegister} className="space-y-5 sm:space-y-6">
                    {/* Name */}
                    <div>
                        <label className="text-gray-700 text-sm sm:text-base font-medium">
                            Full Name
                        </label>
                        <input
                            type="text"
                            placeholder="Enter your full name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="
                w-full p-2.5 mt-1 text-sm sm:p-3 sm:text-base
                bg-white/80 rounded-lg border border-gray-300
                focus:ring-2 focus:ring-blue-500 outline-none
              "
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="text-gray-700 text-sm sm:text-base font-medium">
                            Email Address
                        </label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="
                w-full p-2.5 mt-1 text-sm sm:p-3 sm:text-base
                bg-white/80 rounded-lg border border-gray-300
                focus:ring-2 focus:ring-blue-500 outline-none
              "
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="text-gray-700 text-sm sm:text-base font-medium">
                            Password
                        </label>

                        <div className="relative">
                            <input
                                type={showPass ? "text" : "password"}
                                placeholder="Enter password"
                                value={pass}
                                onChange={(e) => setPass(e.target.value)}
                                className="
                  w-full p-2.5 mt-1 text-sm sm:p-3 sm:text-base
                  bg-white/80 rounded-lg border border-gray-300
                  focus:ring-2 focus:ring-blue-500 outline-none
                "
                            />

                            {/* Show/Hide Password */}
                            <button
                                type="button"
                                onClick={() => setShowPass(!showPass)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 text-lg"
                            >
                                {showPass ? "🙈" : "👁️"}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="text-gray-700 text-sm sm:text-base font-medium">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            placeholder="Confirm password"
                            value={confirmPass}
                            onChange={(e) => setConfirmPass(e.target.value)}
                            className="
                w-full p-2.5 mt-1 text-sm sm:p-3 sm:text-base
                bg-white/80 rounded-lg border border-gray-300
                focus:ring-2 focus:ring-blue-500 outline-none
              "
                        />
                    </div>

                    {/* Register Button */}
                    <button
                        className="
              w-full py-2.5 sm:py-3 text-white font-semibold text-sm sm:text-base
              bg-blue-600 rounded-lg transition-all
              hover:bg-blue-700 duration-300 hover:scale-[1.03]
            "
                    >
                        Register
                    </button>
                </form>

                {/* Login Link */}
                <p className="mt-6 text-gray-600 text-center text-sm sm:text-base">
                    Already have an account?
                    <Link
                        to="/customer/login"
                        className="ml-1 text-blue-600 font-medium underline hover:text-blue-800"
                    >
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default CustomerRegister;
