const Services = () => {
    return (
        <section
            className="
        relative overflow-hidden
        py-24 px-6 md:px-16 lg:px-24 xl:px-32 
        text-gray-800
        bg-linear-to-b from-blue-50 via-white to-purple-50
        bg-[radial-gradient(#c1c1c1_1px,transparent_1px)]
        bg-size-[18px_18px]
      "
        >

            {/* Floating blobs */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 opacity-20 rounded-full blur-3xl animate-pulse -z-10"></div>
            <div className="absolute bottom-10 right-10 w-64 h-64 bg-purple-400 opacity-20 rounded-full blur-3xl animate-pulse -z-10"></div>

            {/* Title */}
            <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-6
        bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-purple-600">
                Our Services
            </h2>

            <p className="text-center text-lg text-gray-700 max-w-3xl mx-auto mb-16">
                SmartServe offers a range of flexible vehicle rental solutions designed
                for your lifestyle — whether it's for daily travel or weekend adventures.
            </p>

            {/* Grid */}
            <div className="grid md:grid-cols-3 gap-10 mt-10">

                {/* Bike Rentals */}
                <div className="
          group flex flex-col items-center text-center p-8 
          bg-white/80 backdrop-blur-xl shadow-lg rounded-2xl
          border border-white/40 hover:border-blue-400/50
          hover:shadow-2xl hover:-translate-y-1 transition-all
        ">
                    <div className="h-16 w-16 flex items-center justify-center bg-blue-100 text-blue-600 
            rounded-full text-3xl shadow-md mb-4">🏍️</div>
                    <h3 className="font-semibold text-xl mb-2 group-hover:text-blue-600 transition">
                        Bike Rentals
                    </h3>
                    <p className="text-gray-600">
                        Affordable and quick bikes for your everyday travel, commutes,
                        and short-distance trips.
                    </p>
                </div>

                {/* Car Rentals */}
                <div className="
          group flex flex-col items-center text-center p-8 
          bg-white/80 backdrop-blur-xl shadow-lg rounded-2xl
          border border-white/40 hover:border-green-400/50
          hover:shadow-2xl hover:-translate-y-1 transition-all
        ">
                    <div className="h-16 w-16 flex items-center justify-center bg-green-100 text-green-600 
            rounded-full text-3xl shadow-md mb-4">🚗</div>
                    <h3 className="font-semibold text-xl mb-2 group-hover:text-green-600 transition">
                        Car Rentals
                    </h3>
                    <p className="text-gray-600">
                        Choose from hatchbacks, sedans, and SUVs — ideal for family trips,
                        road journeys, or city travel.
                    </p>
                </div>

                {/* Long-Term Rentals */}
                <div className="
          group flex flex-col items-center text-center p-8 
          bg-white/80 backdrop-blur-xl shadow-lg rounded-2xl
          border border-white/40 hover:border-yellow-400/50
          hover:shadow-2xl hover:-translate-y-1 transition-all
        ">
                    <div className="h-16 w-16 flex items-center justify-center bg-yellow-100 text-yellow-600 
            rounded-full text-3xl shadow-md mb-4">📆</div>
                    <h3 className="font-semibold text-xl mb-2 group-hover:text-yellow-600 transition">
                        Long-Term Plans
                    </h3>
                    <p className="text-gray-600">
                        Monthly and yearly rental packages with exclusive discounts and
                        priority support.
                    </p>
                </div>

            </div>

            {/* Bottom text */}
            <p className="text-center mt-16 text-md text-gray-700 font-medium">
                Wherever you're going — we've got the perfect ride for you.
            </p>
        </section>
    );
};

export default Services;
