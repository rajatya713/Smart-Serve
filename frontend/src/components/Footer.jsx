const Footer = () => {

    // to scroll to specific section smoothly
    const scrollToSection = (id) => {
        const section = document.getElementById(id);
        if (!section) return;

        const yOffset = -40;
        const y =
            section.getBoundingClientRect().top +
            window.pageYOffset +
            yOffset;

        window.scrollTo({ top: y, behavior: "smooth" });
    };

    return (
        <footer
            className="
        relative bg-[#0f1114]
        pt-24 pb-10 px-6 md:px-16 lg:px-24 xl:px-32
        text-gray-300 overflow-hidden
      "
        >
            {/* Neon top border */}
            <div className="absolute top-0 left-0 w-full h-[3px] bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 blur-[2px]"></div>

            {/* Soft Glowing Background Shapes */}
            {/* <div className="absolute top-10 right-10 w-72 h-72 bg-blue-600/20 blur-[120px] -z-10"></div>
            <div className="absolute bottom-10 left-10 w-72 h-72 bg-purple-600/20 blur-[120px] -z-10"></div> */}

            {/* Grid Sections */}
            <div className="max-w-7xl mx-auto grid gap-12 md:grid-cols-4">

                {/* Brand + Social */}
                <div>
                    <h2 className="text-3xl font-extrabold text-white">SmartServe</h2>
                    <p className="mt-4 text-gray-400 text-sm leading-relaxed">
                        SmartServe is your trusted platform for renting bikes and cars.
                        Smarter rides, better journeys.
                    </p>

                    {/* Social Icons */}
                    <div className="flex space-x-4 mt-6">
                        <a className="text-2xl hover:text-blue-400 transition">🌐</a>
                        <a className="text-2xl hover:text-blue-400 transition">🐦</a>
                        <a className="text-2xl hover:text-blue-400 transition">📘</a>
                        <a className="text-2xl hover:text-blue-400 transition">📸</a>
                        <a className="text-2xl hover:text-blue-400 transition">▶</a>
                    </div>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="text-xl font-semibold mb-4 text-white">Quick Links</h3>
                    <ul className="space-y-2 text-gray-400">
                        <li><a className="hover:text-blue-400 transition">Home</a></li>
                        <li><a className="hover:text-blue-400 transition">About</a></li>
                        <li><a className="hover:text-blue-400 transition">Services</a></li>
                        <li><a className="hover:text-blue-400 transition">Contact</a></li>
                        <li><a href="/customer/login" className="hover:text-blue-400 transition">Customer Login</a></li>
                        <li><a href="/customer/register" className="hover:text-blue-400 transition">Customer Register</a></li>
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
                            <a href="/agency/register" className="text-blue-400 hover:text-blue-300 transition">
                                👉 For Agencies
                            </a>
                        </li>
                        <li>
                            <a href="/admin/register" className="text-purple-400 hover:text-purple-300 transition">
                                👉 For Admins / Fleet Owners
                            </a>
                        </li>
                    </ul>

                    {/* Payment Icons */}
                    <div className="mt-6 space-y-2">
                        <p className="font-semibold text-gray-200 mb-2">Payment Methods</p>
                        <div className="flex space-x-3 text-3xl">
                            <span>💳</span>
                            <span>💰</span>
                            <span>📱</span>
                            <span>🏦</span>
                        </div>
                    </div>
                </div>

                {/* Newsletter + App Download */}
                <div>
                    <h3 className="text-xl font-semibold mb-4 text-white">Stay Updated</h3>

                    {/* Newsletter */}
                    <div className="bg-[#15171c] shadow-lg rounded-xl border border-white/10 p-4">
                        <p className="text-gray-400 mb-2 text-sm">
                            Subscribe for updates and offers.
                        </p>
                        <input
                            type="email"
                            placeholder="Your email"
                            className="
                w-full p-2 bg-[#1c1f24] text-gray-300 border border-white/10 rounded-lg
                focus:ring-2 focus:ring-blue-500 outline-none
              "
                        />
                        <button
                            className="
                mt-3 w-full p-2 bg-blue-600 text-white rounded-lg
                hover:bg-blue-700 transition
              "
                        >
                            Subscribe
                        </button>
                    </div>

                    {/* Download App */}
                    <div className="mt-6 space-y-2">
                        <p className="font-semibold text-white">Download App</p>

                        <button className="w-full py-2 bg-black text-white rounded-lg flex items-center justify-center gap-2 hover:bg-gray-900 transition">
                            📱 Play Store
                        </button>

                        <button className="w-full py-2 bg-gray-800 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-gray-900 transition">
                            🍎 App Store
                        </button>
                    </div>
                </div>

            </div>

            {/* Divider */}
            <div className="w-full h-px bg-white/10 my-10"></div>

            {/* Copyright */}
            <div className="text-center text-gray-500 text-sm">
                © {new Date().getFullYear()} SmartServe. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
