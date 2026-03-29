const About = () => {
    return (
        <section
            id="about"
            className="relative overflow-hidden py-24 px-6 md:px-16 lg:px-24 xl:px-32 text-gray-800 bg-linear-to-b from-white via-blue-50 to-blue-100 bg-[radial-gradient(#c1c1c1_1px,transparent_1px)] bg-size-[18px_18px]"
        >
            <div className="absolute -left-10 top-20 w-72 h-72 bg-blue-300 opacity-30 rounded-full blur-3xl animate-pulse -z-10" />
            <div className="absolute right-0 bottom-10 w-64 h-64 bg-purple-300 opacity-30 rounded-full blur-3xl animate-pulse -z-10" />

            <div className="relative max-w-5xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-6 bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-purple-600">
                    About SmartServe
                </h2>

                <p className="text-center text-lg text-gray-700 max-w-3xl mx-auto mb-16">
                    SmartServe is a modern vehicle renting platform with{" "}
                    <strong>doorstep delivery</strong>. Whether you need a stylish car for
                    a weekend getaway or a quick bike for daily commute, we bring the
                    vehicle right to your location with real-time GPS tracking.
                </p>

                <div className="grid md:grid-cols-3 gap-10 mt-10">
                    {[
                        {
                            emoji: "🚗",
                            title: "Easy & Quick Bookings",
                            desc: "Choose your preferred vehicle and get instant confirmations without lengthy paperwork.",
                            color: "blue",
                        },
                        {
                            emoji: "🚚",
                            title: "Doorstep Delivery",
                            desc: "Get your vehicle delivered to your doorstep with real-time GPS tracking of your delivery.",
                            color: "green",
                        },
                        {
                            emoji: "🔧",
                            title: "Well-Maintained Vehicles",
                            desc: "All bikes and cars are regularly serviced and inspected to ensure maximum safety.",
                            color: "yellow",
                        },
                    ].map((card, i) => (
                        <div
                            key={i}
                            className="group flex flex-col items-center text-center p-8 bg-white/80 backdrop-blur-xl shadow-lg rounded-2xl border border-white/40 hover:shadow-2xl hover:-translate-y-1 transition-all"
                        >
                            <div
                                className={`h-16 w-16 flex items-center justify-center bg-${card.color}-100 text-${card.color}-600 rounded-full text-3xl shadow-md mb-4`}
                                role="img"
                                aria-label={card.title}
                            >
                                {card.emoji}
                            </div>
                            <h3 className="font-semibold text-xl mb-2">{card.title}</h3>
                            <p className="text-gray-600">{card.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default About;