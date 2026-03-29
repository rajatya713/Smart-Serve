const Services = () => {
    return (
        <section
            id="services"
            className="relative overflow-hidden py-24 px-6 md:px-16 lg:px-24 xl:px-32 text-gray-800 bg-linear-to-b from-blue-50 via-white to-purple-50 bg-[radial-gradient(#c1c1c1_1px,transparent_1px)] bg-size-[18px_18px]"
        >
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 opacity-20 rounded-full blur-3xl animate-pulse -z-10" />
            <div className="absolute bottom-10 right-10 w-64 h-64 bg-purple-400 opacity-20 rounded-full blur-3xl animate-pulse -z-10" />

            <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-6 bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-purple-600">
                Our Services
            </h2>

            <p className="text-center text-lg text-gray-700 max-w-3xl mx-auto mb-16">
                SmartServe offers flexible vehicle rental solutions with doorstep
                delivery — designed for your lifestyle.
            </p>

            <div className="grid md:grid-cols-3 gap-10 mt-10">
                {[
                    {
                        emoji: "🏍️",
                        title: "Bike & Scooter Rentals",
                        desc: "Affordable bikes and scooters delivered to your location for daily commutes and short trips.",
                        color: "blue",
                    },
                    {
                        emoji: "🚗",
                        title: "Car & SUV Rentals",
                        desc: "From hatchbacks to SUVs — ideal for family trips, road journeys, or city travel.",
                        color: "green",
                    },
                    {
                        emoji: "📍",
                        title: "GPS-Tracked Delivery",
                        desc: "Track your vehicle delivery in real-time. Know exactly when your ride will arrive.",
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
        </section>
    );
};

export default Services;