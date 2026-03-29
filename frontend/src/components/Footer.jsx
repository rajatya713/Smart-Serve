import { Link } from "react-router-dom";

const Footer = () => {
    const scrollToSection = (id) => {
        const section = document.getElementById(id);
        if (!section) return;
        const y = section.getBoundingClientRect().top + window.pageYOffset - 40;
        window.scrollTo({ top: y, behavior: "smooth" });
    };

    return (
        <footer className="relative bg-[#0f1114] pt-24 pb-10 px-6 md:px-16 lg:px-24 xl:px-32 text-gray-300 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 blur-[2px]" />

            <div className="max-w-7xl mx-auto grid gap-12 md:grid-cols-4">
                {/* Brand */}
                <div>
                    <h2 className="text-3xl font-extrabold text-white">SmartServe</h2>
                    <p className="mt-4 text-gray-400 text-sm leading-relaxed">
                        SmartServe is your trusted platform for renting vehicles with
                        doorstep delivery. Smarter rides, better journeys.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="text-xl font-semibold mb-4 text-white">Quick Links</h3>
                    <ul className="space-y-2 text-gray-400">
                        {["hero", "about", "services", "contact"].map((id) => (
                            <li key={id}>
                                <button
                                    onClick={() => scrollToSection(id)}
                                    className="hover:text-blue-400 transition capitalize cursor-pointer"
                                >
                                    {id === "hero" ? "Home" : id}
                                </button>
                            </li>
                        ))}
                        <li>
                            <Link to="/customer/login" className="hover:text-blue-400 transition">
                                Customer Login
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Partner With Us */}
                <div>
                    <h3 className="text-xl font-semibold mb-4 text-white">Partner With Us</h3>
                    <p className="text-gray-400 text-sm">
                        Join SmartServe and grow your fleet business.
                    </p>
                    <ul className="mt-4 space-y-2 font-medium">
                        <li>
                            <Link
                                to="/customer/register?role=agency"
                                className="text-blue-400 hover:text-blue-300 transition"
                            >
                                👉 Register as Agency
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/customer/register?role=delivery"
                                className="text-cyan-400 hover:text-cyan-300 transition"
                            >
                                👉 Join as Delivery Agent
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/customer/register?role=admin"
                                className="text-purple-400 hover:text-purple-300 transition"
                            >
                                👉 Admin Access
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Newsletter */}
                <div>
                    <h3 className="text-xl font-semibold mb-4 text-white">Stay Updated</h3>
                    <div className="bg-[#15171c] shadow-lg rounded-xl border border-white/10 p-4">
                        <p className="text-gray-400 mb-2 text-sm">Subscribe for updates.</p>
                        <input
                            type="email"
                            placeholder="Your email"
                            className="w-full p-2 bg-[#1c1f24] text-gray-300 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <button className="mt-3 w-full p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                            Subscribe
                        </button>
                    </div>
                </div>
            </div>

            <div className="w-full h-px bg-white/10 my-10" />
            <div className="text-center text-gray-500 text-sm">
                © {new Date().getFullYear()} SmartServe. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;