import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Notification from "../components/Notification";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const CustomerLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [searchParams] = useSearchParams();

  // Redirect if already logged in
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

  const handleLogin = async (e) => {
    e.preventDefault();
    setNotification({ message: "", type: "" });

    if (!EMAIL_REGEX.test(email)) {
      setNotification({ message: "Please enter a valid email.", type: "error" });
      return;
    }
    if (password.length < 6) {
      setNotification({ message: "Password must be at least 6 characters.", type: "error" });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.toLowerCase().trim(), password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setNotification({ message: data.message || "Login failed.", type: "error" });
        return;
      }

      login(data, data.token);
      setNotification({ message: "Login successful!", type: "success" });

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

  return (
    <div className="flex overflow-hidden min-h-screen px-4 page-bg relative items-center justify-center sm:px-6 md:px-10">
      <div className="w-48 h-48 bg-blue-300/30 rounded-full absolute top-10 left-5 blur-[100px] float -z-10 sm:w-64 sm:h-64" />
      <div className="w-48 h-48 bg-purple-300/30 rounded-full absolute bottom-10 right-5 blur-[100px] float -z-10 sm:w-64 sm:h-64" />

      <Notification
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ message: "", type: "" })}
      />

      <div className="z-20 w-full max-w-md p-6 glass-card fade-in sm:p-8 md:max-w-lg md:p-10">
        <Link
          to="/"
          className="flex mb-4 text-blue-700 font-medium text-sm hover:text-blue-900 items-center gap-2"
        >
          ← Back to Home
        </Link>

        <div className="flex flex-col mb-6 text-center items-center sm:mb-8">
          <div className="mb-3 text-4xl sm:text-5xl" role="img" aria-label="Lock">
            🔐
          </div>
          <h1 className="text-2xl font-extrabold text-transparent bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text sm:text-3xl">
            Welcome Back!
          </h1>
          <p className="mt-2 text-gray-600 text-sm sm:text-base">
            Login to continue your SmartServe journey.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5 sm:space-y-6">
          <div>
            <label htmlFor="login-email" className="text-gray-700 text-sm font-medium sm:text-base">
              Email
            </label>
            <input
              id="login-email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="w-full p-2.5 mt-1 text-sm bg-white/80 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none sm:p-3 sm:text-base"
            />
          </div>

          <div>
            <label htmlFor="login-password" className="text-gray-700 text-sm font-medium sm:text-base">
              Password
            </label>
            <div className="relative">
              <input
                id="login-password"
                type={showPass ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="w-full p-2.5 mt-1 text-sm bg-white/80 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none sm:p-3 sm:text-base"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                aria-label={showPass ? "Hide password" : "Show password"}
                className="text-gray-600 text-lg absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPass ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 text-white font-semibold text-sm bg-blue-600 rounded-lg transition-all hover:bg-blue-700 duration-300 hover:scale-[1.03] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 sm:py-3 sm:text-base cursor-pointer"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-gray-600 text-center text-sm sm:text-base">
          Don&apos;t have an account?
          <Link
            to="/customer/register"
            className="ml-1 text-blue-600 font-medium underline hover:text-blue-800"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CustomerLogin;