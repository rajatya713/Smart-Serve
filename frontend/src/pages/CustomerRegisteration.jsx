import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Notification from "../components/Notification";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const getPasswordStrength = (pw) => {
    if (pw.length < 6) return { label: "Too short", color: "bg-red-400", width: "20%" };
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    if (score >= 3) return { label: "Strong", color: "bg-green-500", width: "100%" };
    if (score >= 2) return { label: "Good", color: "bg-yellow-400", width: "70%" };
    return { label: "Fair", color: "bg-orange-400", width: "40%" };
};

const CustomerRegister = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [pass, setPass] = useState("");
    const [confirmPass, setConfirmPass] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [notification, setNotification] = useState({ message: "", type: "" });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { user, login } = useAuth();
    const [searchParams] = useSearchParams();
    const roleFromUrl = searchParams.get("role");

    const [role, setRole] = useState(
        ["customer", "agency", "delivery"].includes(roleFromUrl)
            ? roleFromUrl
            : "customer"
    );

    useEffect(() => {
        if (user) {
            const dashboards = {
                customer: "/customer/dashboard",
                agency: "/agency/dashboard",
                delivery: "/delivery/dashboard",
                admin: "/admin/dashboard",
            };
            navigate(dashboards[user.role] || "/customer/dashboard");
        }
    }, [user, navigate]);

    const handleRegister = async (e) => {
        e.preventDefault();
        setNotification({ message: "", type: "" });

        if (!name.trim() || name.trim().length < 2) {
            setNotification({ message: "Enter a valid name (min 2 chars).", type: "error" });
            return;
        }
        if (!EMAIL_REGEX.test(email)) {
            setNotification({ message: "Enter a valid email.", type: "error" });
            return;
        }
        if (pass.length < 6) {
            setNotification({ message: "Password must be at least 6 characters.", type: "error" });
            return;
        }
        if (pass !== confirmPass) {
            setNotification({ message: "Passwords do not match.", type: "error" });
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/users/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: name.trim(),
                    email: email.toLowerCase().trim(),
                    password: pass,
                    phone,
                    role,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setNotification({ message: data.message || "Registration failed.", type: "error" });
                return;
            }

            login(data, data.token);
            setNotification({ message: "Registration successful!", type: "success" });

            setTimeout(() => {
                const dashboards = {
                    customer: "/customer/dashboard",
                    agency: "/agency/dashboard",
                    delivery: "/delivery/dashboard",
                    admin: "/admin/dashboard",
                };
                navigate(dashboards[data.role] || "/customer/dashboard");
            }, 800);
        } catch {
            setNotification({ message: "Unable to connect to server.", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    const roleLabels = {
        customer: { icon: "🚗", label: "Customer", desc: "Rent vehicles" },
        agency: { icon: "🏢", label: "Agency", desc: "List your vehicles" },
        delivery: { icon: "🚚", label: "Delivery Agent", desc: "Deliver vehicles" },
    };

    return (
        <div className="flex overflow-hidden min-h-screen px-4 page-bg relative items-center justify-center sm:px-6 md:px-10 py-10">
            <div className="absolute top-10 left-5 w-48 h-48 bg-blue-300/30 blur-[100px] rounded-full float -z-10 sm:w-64 sm:h-64" />
            <div className="absolute bottom-10 right-5 w-48 h-48 bg-purple-300/30 blur-[100px] rounded-full float -z-10 sm:w-64 sm:h-64" />

            <Notification
                message={notification.message}
                type={notification.type}
                onClose={() => setNotification({ message: "", type: "" })}
            />

            <div className="z-20 w-full max-w-md glass-card p-6 sm:p-8 md:max-w-lg md:p-10 fade-in">
                <Link
                    to="/"
                    className="flex mb-4 text-blue-700 font-medium text-sm hover:text-blue-900 items-center gap-2"
                >
                    ← Back to Home
                </Link>

                <div className="flex flex-col items-center text-center mb-6 sm:mb-8">
                    <div className="text-4xl sm:text-5xl mb-3">📝</div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Create Your Account
                    </h1>
                    <p className="mt-2 text-gray-600 text-sm sm:text-base">
                        Join SmartServe and start your journey.
                    </p>
                </div>

                {/* Role Selector */}
                <div className="grid grid-cols-3 gap-2 mb-6">
                    {Object.entries(roleLabels).map(([key, val]) => (
                        <button
                            key={key}
                            type="button"
                            onClick={() => setRole(key)}
                            className={`p-3 rounded-xl text-center transition-all border ${role === key
                                    ? "border-blue-500 bg-blue-50 shadow-md"
                                    : "border-gray-200 bg-white/50 hover:border-blue-300"
                                }`}
                        >
                            <div className="text-2xl mb-1">{val.icon}</div>
                            <p className="text-xs font-semibold text-gray-800">{val.label}</p>
                            <p className="text-[10px] text-gray-500">{val.desc}</p>
                        </button>
                    ))}
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label htmlFor="reg-name" className="text-gray-700 text-sm font-medium">
                            Full Name
                        </label>
                        <input
                            id="reg-name"
                            type="text"
                            placeholder="Enter your full name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-2.5 mt-1 text-sm bg-white/80 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    <div>
                        <label htmlFor="reg-email" className="text-gray-700 text-sm font-medium">
                            Email Address
                        </label>
                        <input
                            id="reg-email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                            className="w-full p-2.5 mt-1 text-sm bg-white/80 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    <div>
                        <label htmlFor="reg-phone" className="text-gray-700 text-sm font-medium">
                            Phone Number
                        </label>
                        <input
                            id="reg-phone"
                            type="tel"
                            placeholder="+91 XXXXXXXXXX"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full p-2.5 mt-1 text-sm bg-white/80 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    <div>
                        <label htmlFor="reg-password" className="text-gray-700 text-sm font-medium">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                id="reg-password"
                                type={showPass ? "text" : "password"}
                                placeholder="Enter password (min 6 chars)"
                                value={pass}
                                onChange={(e) => setPass(e.target.value)}
                                className="w-full p-2.5 mt-1 text-sm bg-white/80 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPass(!showPass)}
                                aria-label={showPass ? "Hide password" : "Show password"}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 text-lg"
                            >
                                {showPass ? "🙈" : "👁️"}
                            </button>
                        </div>

                        {pass && (
                            <div className="mt-2 flex items-center gap-2">
                                <div className="h-1.5 flex-1 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-300 ${getPasswordStrength(pass).color}`}
                                        style={{ width: getPasswordStrength(pass).width }}
                                    />
                                </div>
                                <span className="text-xs font-medium text-gray-600">
                                    {getPasswordStrength(pass).label}
                                </span>
                            </div>
                        )}
                    </div>

                    <div>
                        <label htmlFor="reg-confirm" className="text-gray-700 text-sm font-medium">
                            Confirm Password
                        </label>
                        <input
                            id="reg-confirm"
                            type="password"
                            placeholder="Confirm password"
                            value={confirmPass}
                            onChange={(e) => setConfirmPass(e.target.value)}
                            className="w-full p-2.5 mt-1 text-sm bg-white/80 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 text-white font-semibold text-sm bg-blue-600 rounded-lg transition-all hover:bg-blue-700 duration-300 hover:scale-[1.03] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer"
                    >
                        {loading ? "Registering..." : "Register"}
                    </button>
                </form>

                <p className="mt-6 text-gray-600 text-center text-sm">
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