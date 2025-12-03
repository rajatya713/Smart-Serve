const Hero = () => {
  return (
    <section className="relative w-full h-[90vh] mt-4 flex items-center justify-center text-white overflow-hidden">

      {/* Background Image */}
      <img
        src="/bg-image.jpg"
        alt="Hero Background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>

      {/* Animated Glowing Shapes */}
      {/* <div className="absolute top-20 right-20 w-80 h-80 bg-blue-500/30 blur-[120px] rounded-full glow-move"></div>
      <div className="absolute bottom-16 left-16 w-80 h-80 bg-purple-500/30 blur-[120px] rounded-full float"></div> */}

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-3xl fade-in">

        {/* Title */}
        <h1
          className="
            text-4xl md:text-6xl font-extrabold leading-tight
            bg-linear-to-r from-blue-400 to-purple-400 
            text-transparent bg-clip-text drop-shadow-xl
            opacity-0 slide-up
          "
        >
          Ride Smart <br /> Ride Comfortable
        </h1>

        {/* Subtitle */}
        <p
          className="
            mt-4 text-lg md:text-xl text-gray-200
            opacity-0 fade-in-delay
          "
        >
          Your trusted platform for renting bikes and cars — fast, affordable,
          and reliable.
        </p>

        {/* Buttons */}
        <div className="mt-8 flex justify-center gap-4 opacity-0 fade-in-delay">

          {/* Login Button */}
          <a
            href="/customer/login"
            className="
              px-6 py-3 bg-blue-600/80 backdrop-blur-md
              hover:bg-blue-700/90 rounded-xl font-semibold
              shadow-lg shadow-blue-500/20 
              transition-all duration-300
              hover:scale-105 active:scale-95
            "
          >
            Login
          </a>

          {/* Register Button */}
          <a
            href="/customer/register"
            className="
              px-6 py-3 bg-white/80 text-black
              hover:bg-white rounded-xl font-semibold
              shadow-lg shadow-white/30 backdrop-blur-md
              transition-all duration-300
              hover:scale-105 active:scale-95
            "
          >
            Register
          </a>

        </div>
      </div>
    </section>
  );
};

export default Hero;
