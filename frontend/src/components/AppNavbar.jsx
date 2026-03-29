import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { menu_icon, close_icon } from "../assets/assets";

const AppNavbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [open, setOpen] = useState(false);

    // Close menu on route change
    useEffect(() => {
        setOpen(false);
    }, [location.pathname]);

    // Lock body scroll when menu is open
    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : "auto";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [open]);

    const handleLogout = () => {
        logout();
        navigate("/customer/login");
    };

    const navLinks = {
        customer: [
            { name: "Dashboard", path: "/customer/dashboard" },
            { name: "Vehicles", path: "/vehicles" },
            { name: "My Bookings", path: "/customer/bookings" },
            { name: "Profile", path: "/customer/profile" },
        ],
        agency: [
            { name: "Dashboard", path: "/agency/dashboard" },
            { name: "My Vehicles", path: "/agency/vehicles" },
            { name: "Bookings", path: "/agency/bookings" },
            { name: "Profile", path: "/customer/profile" },
        ],
        delivery: [
            { name: "Dashboard", path: "/delivery/dashboard" },
            { name: "Active Deliveries", path: "/delivery/active" },
            { name: "Profile", path: "/customer/profile" },
        ],
        admin: [
            { name: "Dashboard", path: "/admin/dashboard" },
            { name: "Users", path: "/admin/users" },
            { name: "Agencies", path: "/admin/agencies" },
            { name: "Bookings", path: "/admin/bookings" },
        ],
    };

    const links = navLinks[user?.role] || navLinks.customer;

    return (
        <>
            {/* Overlay */}
            {open && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 sm:hidden"
                    onClick={() => setOpen(false)}
                />
            )}

            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 md:px-8 py-3">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2">
                        <img src="/logo.png" alt="SmartServe" className="h-8 w-auto" />
                        <span className="text-xl font-extrabold text-transparent bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text">
                            SmartServe
                        </span>
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden sm:flex items-center gap-6">
                        {links.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`text-sm font-medium transition ${location.pathname === link.path
                                        ? "text-blue-600"
                                        : "text-gray-600 hover:text-blue-600"
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}

                        <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-200">
                            <span className="text-xs text-gray-500 capitalize bg-gray-100 px-2 py-1 rounded-full">
                                {user?.role}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="px-3 py-1.5 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600 transition cursor-pointer"
                            >
                                Logout
                            </button>
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setOpen(!open)}
                        className="sm:hidden"
                        aria-label="Toggle menu"
                    >
                        <img
                            src={open ? close_icon : menu_icon}
                            alt="menu"
                            className="w-6"
                        />
                    </button>
                </div>
            </nav>

            {/* ✅ FIX: Mobile Menu - wrapped in overflow-hidden container */}
            <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden sm:hidden">
                <div
                    className={`absolute top-0 right-0 h-screen w-3/4 bg-white p-8 
            transition-transform duration-300 shadow-2xl pointer-events-auto
            ${open ? "translate-x-0" : "translate-x-full"}`}
                >
                    <button
                        onClick={() => setOpen(false)}
                        className="absolute top-6 right-6"
                    >
                        <img src={close_icon} alt="Close" className="w-6" />
                    </button>

                    <div className="mt-12 flex flex-col gap-4">
                        {links.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setOpen(false)}
                                className={`text-lg font-medium py-2 ${location.pathname === link.path
                                        ? "text-blue-600"
                                        : "text-gray-700"
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}

                        <hr className="my-2" />
                        <p className="text-sm text-gray-500">
                            Signed in as <strong>{user?.name}</strong>
                        </p>
                        <button
                            onClick={handleLogout}
                            className="w-full py-2 bg-red-500 text-white rounded-lg font-medium cursor-pointer"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AppNavbar;