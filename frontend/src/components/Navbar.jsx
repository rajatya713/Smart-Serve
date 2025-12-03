import { Link, useLocation } from "react-router-dom";
import { menuLinks, menu_icon, close_icon } from "../assets/assets";
import { useState, useEffect } from "react";

const Navbar = () => {
  const location = useLocation(); //to determine current path
  const [open, setOpen] = useState(false); //for mobile menu toggle
  const [activeSection, setActiveSection] = useState("hero"); //to track active section

  // to update active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = menuLinks.map((link) => link.id);
      for (let id of sections) {
        const sec = document.getElementById(id);
        if (!sec) continue;

        const rect = sec.getBoundingClientRect();
        if (rect.top <= 150 && rect.bottom >= 150) {
          setActiveSection(id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // for smooth scrolling to sections
  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (!section) return;
    setActiveSection(id);
    const yOffset = -40;
    const y =
      section.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: "smooth" });
    setOpen(false); //to close mobile menu
  };

  return (
    <div
      className={`
        fixed top-0 w-full z-50
                flex items-center justify-between
                px-4 md:px-6 lg:px-8 xl:px-12 py-4            
                border-b border-white/30 shadow-lg shadow-black/5
                transition-all duration-300
                ${location.pathname === "/" && "bg-light"}
      `}
    >
      {/* Logo */}
      <Link to="/">
        <div
          className="
            flex
            space-x-2
            cursor-pointer
            items-center
          "
        >
          <img
            src="/logo.png"
            alt="Logo"
            className="
              h-10 w-auto
              drop-shadow-md
            "
          />

          <span
            className="
              text-2xl font-extrabold text-transparent tracking-wide
              bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text
            "
          >
            SmartServe
          </span>
        </div>
      </Link>

      {/* Navigation Menu */}
      <div
        className={`
          flex flex-col z-50
          max-sm:fixed max-sm:top-0 max-sm:right-0 max-sm:h-screen max-sm:w-3/4 max-sm:p-10 max-sm:bg-white/80 max-sm:backdrop-blur-2xl max-sm:border-l max-sm:border-white/20
          transition-all
          items-start gap-6 duration-300
          sm:flex-row sm:items-center sm:gap-10
          ${open ? "max-sm:translate-x-0" : "max-sm:translate-x-full"}
        `}
      >
        {/* Close Button on Mobile */}
        <button
          onClick={() => setOpen(false)}
          className="
            absolute top-6 right-6
            sm:hidden
          "
        >
          <img
            src={close_icon}
            className="
              w-6
            "
          />
        </button>

        {/* Navigation Links */}
        {menuLinks.map((link, index) => (
          <button
            key={index}
            onClick={() => scrollToSection(link.id)}
            className={`
              text-lg font-medium
              cursor-pointer
              transition duration-300
              relative hover:text-blue-600  after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-blue-600 after:transition-all hover:after:w-full
              ${activeSection === link.id ? "text-red-600 font-semibold after:w-full after:bg-red-600" : "text-gray-700 hover:text-blue-600 hover:after:w-full after:bg-blue-600"}
            `}
          >
            {link.name}
          </button>
        ))}
      </div>

      {/* Mobile Menu Button */}
      <button
        aria-label="Menu"
        onClick={() => setOpen(!open)}
        className="
          cursor-pointer
          sm:hidden
        "
      >
        <img
          src={open ? close_icon : menu_icon}
          alt="menu"
          className="
            w-6
            drop-shadow-sm
          "
        />
      </button>
    </div>
  );
};

export default Navbar;
