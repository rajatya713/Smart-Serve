import { useState } from "react";
import { Link } from "react-router-dom";

const CustomerLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    setError("");
    setToast("");

    if (!email.includes("@")) {
      setError("Please enter a valid email.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setToast("Login successful! Redirecting...");
    setTimeout(() => setToast(""), 2000);
  };

  return (
    <div
      className="
            flex overflow-hidden
            min-h-screen
            px-4
            bg-linear-to-b from-white via-blue-50 to-blue-100 bg-[radial-gradient(#c1c1c1_1px,transparent_1px)] bg-size-[18px_18px]
            relative items-center justify-center
            sm:px-6
            md:px-10
          "
    >
      {/* Background Blobs */}
      <div
        className="
                w-48 h-48
                bg-blue-300/30
                rounded-full
                absolute top-10 left-5 blur-[100px] float -z-10
                sm:w-64 sm:h-64 sm:left-10
                md:w-72 md:h-72
              "
      ></div>
      <div
        className="
                w-48 h-48
                bg-purple-300/30
                rounded-full
                absolute bottom-10 right-5 blur-[100px] float -z-10
                sm:w-64 sm:h-64 sm:right-10
                md:w-72 md:h-72
              "
      ></div>

      {/* Toast Message */}
      {toast && (
        <div
          className="
                    z-50
                    px-6 py-3
                    text-white text-sm
                    bg-green-600
                    rounded-lg
                    shadow-lg
                    fixed top-4 left-1/2 -translate-x-1/2 fade-in
                    sm:text-base
                  "
        >
          {toast}
        </div>
      )}

      {error && (
        <div
          className="
                    z-50
                    px-6 py-3
                    text-white text-sm
                    bg-red-600
                    rounded-lg
                    shadow-lg
                    fixed top-4 left-1/2 -translate-x-1/2 fade-in
                    sm:text-base
                  "
        >
          {error}
        </div>
      )}

      {/* Login Card */}
      <div
        className="
                z-20
                w-full max-w-md
                p-6
                bg-white/70
                border border-white/40 rounded-2xl
                shadow-2xl
                backdrop-blur-xl fade-in
                sm:p-8
                md:max-w-lg md:p-10
              "
      >
        {/* Back Button */}
        <Link
          to="/"
          className="
                    flex
                    mb-4
                    text-blue-700 font-medium text-sm
                    hover:text-blue-900 items-center gap-2
                    sm:text-base
                  "
        >
          ← Back to Home
        </Link>

        {/* Logo + Heading */}
        <div
          className="
                    flex flex-col
                    mb-6
                    text-center
                    items-center
                    sm:mb-8
                  "
        >
          <div
            className="
                        mb-3
                        text-4xl
                        sm:text-5xl
                      "
          >
            🔐
          </div>

          <h1
            className="
                        text-2xl font-extrabold text-transparent
                        bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text
                        sm:text-3xl
                      "
          >
            Welcome Back!
          </h1>

          <p
            className="
                        mt-2
                        text-gray-600 text-sm
                        sm:text-base
                      "
          >
            Login to continue your SmartServe journey.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleLogin}
          className="
                    space-y-5
                    sm:space-y-6
                  "
        >
          {/* Email */}
          <div>
            <label
              className="
                            text-gray-700 text-sm font-medium
                            sm:text-base
                          "
            >
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="
                            w-full
                            p-2.5 mt-1
                            text-sm
                            bg-white/80
                            rounded-lg border border-gray-300
                            focus:ring-2 focus:ring-blue-500 outline-none
                            sm:p-3 sm:text-base
                          "
            />
          </div>

          {/* Password */}
          <div>
            <label
              className="
                            text-gray-700 text-sm font-medium
                            sm:text-base
                          "
            >
              Password
            </label>

            <div
              className="
                            relative
                          "
            >
              <input
                type={showPass ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="
                                w-full
                                p-2.5 mt-1
                                text-sm
                                bg-white/80
                                rounded-lg border border-gray-300
                                focus:ring-2 focus:ring-blue-500 outline-none
                                sm:p-3 sm:text-base
                              "
              />

              {/* Password Toggle */}
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="
                                text-gray-600 text-lg
                                absolute right-3 top-1/2 -translate-y-1/2
                              "
              >
                {showPass ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <div
            className="
                        flex
                        justify-end
                      "
          >
            <button
              type="button"
              className="
                            text-sm text-blue-600
                            hover:text-blue-800 underline
                            sm:text-base
                          "
            >
              Forgot Password?
            </button>
          </div>

          {/* Login Button */}
          <button
            className="
                        w-full
                        py-2.5
                        text-white font-semibold text-sm
                        bg-blue-600
                        rounded-lg
                        transition-all
                        hover:bg-blue-700 duration-300 hover:scale-[1.03]
                        sm:py-3 sm:text-base
                      "
          >
            Login
          </button>
        </form>

        {/* Register Link */}
        <p
          className="
                    mt-6
                    text-gray-600 text-center text-sm
                    sm:text-base
                  "
        >
          Don't have an account?
          <Link
            to="/customer/register"
            className="
                        ml-1
                        text-blue-600 font-medium
                        underline hover:text-blue-800
                      "
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CustomerLogin;
