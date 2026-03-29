import { Link, useLocation } from "react-router-dom";
import { menuLinks, menu_icon, close_icon } from "../assets/assets";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          for (let link of menuLinks) {
            const sec = document.getElementById(link.id);
            if (!sec) continue;
            const rect = sec.getBoundingClientRect();
            if (rect.top <= 150 && rect.bottom >= 150) {
              setActiveSection(link.id);
              break;
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (!section) return;
    setActiveSection(id);
    const y = section.getBoundingClientRect().top + window.pageYOffset - 40;
    window.scrollTo({ top: y, behavior: "smooth" });
    setOpen(false);
  };

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
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 sm:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <div className="fixed top-0 w-full z-50 flex items-center justify-between px-4 md:px-6 lg:px-8 xl:px-12 py-4 border-b border-white/30 shadow-lg shadow-black/5 bg-white/70 backdrop-blur-md transition-all duration-300">
        <Link to="/">
          <div className="flex space-x-2 cursor-pointer items-center">
            <img src="/logo.png" alt="Logo" className="h-10 w-auto drop-shadow-md" />
            <span className="text-2xl font-extrabold text-transparent tracking-wide bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text">
              SmartServe
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden sm:flex items-center gap-8">
          {menuLinks.map((link, index) => (
            <button
              key={index}
              onClick={() => scrollToSection(link.id)}
              className={`text-lg font-medium cursor-pointer transition duration-300 relative
                after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-0.5 
                after:transition-all
                ${activeSection === link.id
                  ? "text-blue-600 font-semibold after:w-full after:bg-blue-600"
                  : "text-gray-700 hover:text-blue-600 after:w-0 hover:after:w-full after:bg-blue-600"
                }`}
            >
              {link.name}
            </button>
          ))}

          {/* Auth Buttons */}
          <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-300">
            {user ? (
              <Link
                to={getDashboardLink()}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/customer/login"
                  className="px-4 py-2 text-blue-600 text-sm font-medium hover:underline"
                >
                  Login
                </Link>
                <Link
                  to="/customer/register"
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg font-medium hover:bg-blue-700 transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        <button
          aria-label="Menu"
          onClick={() => setOpen(!open)}
          className="cursor-pointer sm:hidden"
        >
          <img src={open ? close_icon : menu_icon} alt="menu" className="w-6" />
        </button>

        {/* Mobile Slide Menu */}
        <div
          className={`fixed top-0 right-0 h-screen w-3/4 bg-white z-50 p-10 
            transition-transform duration-300 sm:hidden shadow-2xl
            ${open ? "translate-x-0" : "translate-x-full"}`}
        >
          <button onClick={() => setOpen(false)} className="absolute top-6 right-6">
            <img src={close_icon} className="w-6" alt="Close" />
          </button>

          <div className="mt-12 flex flex-col gap-4">
            {menuLinks.map((link, index) => (
              <button
                key={index}
                onClick={() => scrollToSection(link.id)}
                className={`text-lg font-medium text-left py-2 ${activeSection === link.id ? "text-blue-600" : "text-gray-700"
                  }`}
              >
                {link.name}
              </button>
            ))}

            <hr className="my-2" />

            {user ? (
              <Link
                to={getDashboardLink()}
                onClick={() => setOpen(false)}
                className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium text-center"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/customer/login"
                  onClick={() => setOpen(false)}
                  className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium text-center"
                >
                  Login
                </Link>
                <Link
                  to="/customer/register"
                  onClick={() => setOpen(false)}
                  className="w-full py-2 border border-blue-600 text-blue-600 rounded-lg font-medium text-center"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;