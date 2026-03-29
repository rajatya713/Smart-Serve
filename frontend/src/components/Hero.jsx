import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Hero = () => {
  const { user } = useAuth();

  const getDashboardLink = () => {
    if (!user) return null;
    const dashboards = {
      customer: "/customer/dashboard",
      agency: "/agency/dashboard",
      delivery: "/delivery/dashboard",
      admin: "/admin/dashboard",
    };
    return dashboards[user.role] || "/customer/dashboard";
  };

  return (
    <section
      id="hero"
      aria-label="Hero banner"
      className="relative w-full h-[90vh] mt-16 flex items-center justify-center text-white overflow-hidden bg-gray-900"
    >
      <img
        src="/bg-image.jpg"
        alt="Vehicles on road"
        loading="eager"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />

      <div className="relative z-10 text-center px-6 max-w-3xl">
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight bg-linear-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text drop-shadow-xl slide-up">
          Ride Smart <br /> Ride Comfortable
        </h1>

        <p className="mt-4 text-lg md:text-xl text-gray-200 fade-in-delay">
          Your trusted platform for doorstep vehicle delivery — bikes, cars, and
          more delivered right to your location.
        </p>

        <div className="mt-8 flex justify-center gap-4 fade-in-delay">
          {user ? (
            <Link
              to={getDashboardLink()}
              className="px-6 py-3 bg-blue-600/80 backdrop-blur-md hover:bg-blue-700/90 rounded-xl font-semibold shadow-lg shadow-blue-500/20 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/customer/login"
                className="px-6 py-3 bg-blue-600/80 backdrop-blur-md hover:bg-blue-700/90 rounded-xl font-semibold shadow-lg shadow-blue-500/20 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                Login
              </Link>
              <Link
                to="/customer/register"
                className="px-6 py-3 bg-white/80 text-black hover:bg-white rounded-xl font-semibold shadow-lg shadow-white/30 backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;