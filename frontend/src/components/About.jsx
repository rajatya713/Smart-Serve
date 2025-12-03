

const About = () => {
    return (
        <section
            id="about"
            className="
        relative overflow-hidden
        py-24 px-6 md:px-16 lg:px-24 xl:px-32 
        text-gray-800
        bg-linear-to-b from-white via-blue-50 to-blue-100
        bg-[radial-gradient(#c1c1c1_1px,transparent_1px)]
        bg-size-[18px_18px]
      "
        >
            {/* Top wave */}
            <div className="absolute top-0 left-0 w-full overflow-hidden leading-none rotate-180">
                <svg
                    className="relative block w-full h-16"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="none"
                    viewBox="0 0 1200 120"
                >
                    <path
                        d="M321.39 56.24C149.3-12.28-14.2-30.7 0 33.88v86.11h1200V0C1048.77 47.52 775.84 126.4 321.39 56.24z"
                        className="fill-blue-50"
                    ></path>
                </svg>
            </div>

            {/* Smooth gradient overlay */}
            <div className="absolute inset-0 bg-linear-to-r from-blue-200/20 to-purple-200/20 pointer-events-none"></div>

            {/* Animated floating shapes */}
            <div className="absolute -left-10 top-20 w-72 h-72 bg-blue-300 opacity-30 rounded-full blur-3xl animate-pulse -z-10"></div>
            <div className="absolute right-0 bottom-10 w-64 h-64 bg-purple-300 opacity-30 rounded-full blur-3xl animate-pulse -z-10"></div>

            {/* Content Container */}
            <div className="relative max-w-5xl mx-auto">

                {/* Title with gradient shine */}
                <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-6 bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-purple-600 animate-pulse">
                    About SmartServe
                </h2>

                {/* Description */}
                <p className="text-center text-lg text-gray-700 max-w-3xl mx-auto mb-16">
                    SmartServe is a modern vehicle renting platform designed to make your
                    travel smarter, faster, and more affordable. Whether you need a stylish car
                    for a weekend getaway or a quick bike for daily commute, we bring you the
                    perfect ride — anytime, anywhere.
                </p>

                {/* 3 Feature Cards */}
                <div className="grid md:grid-cols-3 gap-10 mt-10">

                    {/* Card 1 */}
                    <div className="group flex flex-col items-center text-center p-8 
              bg-white/80 backdrop-blur-xl shadow-lg rounded-2xl 
              border border-white/40 hover:border-blue-400/50
              hover:shadow-2xl hover:-translate-y-1 transition-all">

                        <div className="h-16 w-16 flex items-center justify-center bg-blue-100 text-blue-600 
                rounded-full text-3xl shadow-md mb-4">
                            🚗
                        </div>

                        <h3 className="font-semibold text-xl mb-2 group-hover:text-blue-600 transition">
                            Easy & Quick Bookings
                        </h3>

                        <p className="text-gray-600">
                            Choose your preferred vehicle and get instant confirmations without
                            lengthy paperwork or delays.
                        </p>
                    </div>

                    {/* Card 2 */}
                    <div className="group flex flex-col items-center text-center p-8 
              bg-white/80 backdrop-blur-xl shadow-lg rounded-2xl 
              border border-white/40 hover:border-green-400/50
              hover:shadow-2xl hover:-translate-y-1 transition-all">

                        <div className="h-16 w-16 flex items-center justify-center bg-green-100 text-green-600 
                rounded-full text-3xl shadow-md mb-4">
                            💸
                        </div>

                        <h3 className="font-semibold text-xl mb-2 group-hover:text-green-600 transition">
                            Transparent Pricing
                        </h3>

                        <p className="text-gray-600">
                            No hidden fees or surprise charges — you get clear pricing and the best deals.
                        </p>
                    </div>

                    {/* Card 3 */}
                    <div className="group flex flex-col items-center text-center p-8 
              bg-white/80 backdrop-blur-xl shadow-lg rounded-2xl 
              border border-white/40 hover:border-yellow-400/50
              hover:shadow-2xl hover:-translate-y-1 transition-all">

                        <div className="h-16 w-16 flex items-center justify-center bg-yellow-100 text-yellow-600 
                rounded-full text-3xl shadow-md mb-4">
                            🔧
                        </div>

                        <h3 className="font-semibold text-xl mb-2 group-hover:text-yellow-600 transition">
                            Well-Maintained Vehicles
                        </h3>

                        <p className="text-gray-600">
                            All bikes and cars are regularly serviced and inspected to ensure maximum safety.
                        </p>
                    </div>
                </div>

                {/* Bottom Line */}
                <p className="text-center mt-16 text-md text-gray-700 font-medium">
                    With SmartServe, riding becomes effortless — find the right vehicle,
                    book in seconds, and enjoy a smooth journey every time.
                </p>
            </div>

        </section>
    );
};

export default About;
