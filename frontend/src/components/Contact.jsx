import React from 'react'

const Contact = () => {
  return (
    <section
      id="contact"
      className="
        relative overflow-hidden
        py-24 px-6 md:px-16 lg:px-24 xl:px-32 
        text-gray-800
        bg-linear-to-b from-purple-50 via-white to-blue-50
        bg-[radial-gradient(#c1c1c1_1px,transparent_1px)]
        bg-size-[18px_18px]
      "
    >

      {/* Floating glowing shapes */}
      <div className="absolute top-10 right-10 w-72 h-72 bg-blue-400 opacity-20 rounded-full blur-3xl animate-pulse -z-10"></div>
      <div className="absolute bottom-10 left-10 w-64 h-64 bg-pink-300 opacity-25 rounded-full blur-3xl animate-pulse -z-10"></div>

      {/* Title */}
      <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-6
        bg-clip-text text-transparent bg-linear-to-r from-purple-600 to-blue-600">
        Contact Us
      </h2>

      <p className="text-center text-lg text-gray-700 max-w-3xl mx-auto mb-16">
        Have questions or need assistance? Our support team is always here to help.
      </p>

      {/* Grid */}
      <div className="grid md:grid-cols-2 gap-12">

        {/* Contact Details */}
        <div className="space-y-8">
          <div className="flex items-start gap-4">
            <div className="h-14 w-14 bg-blue-100 text-blue-600 flex items-center justify-center rounded-full text-2xl shadow">
              📞
            </div>
            <div>
              <h4 className="font-semibold text-xl">Phone</h4>
              <p className="text-gray-600">+91 9876543210</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="h-14 w-14 bg-green-100 text-green-600 flex items-center justify-center rounded-full text-2xl shadow">
              ✉️
            </div>
            <div>
              <h4 className="font-semibold text-xl">Email</h4>
              <p className="text-gray-600">support@smartserve.com</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="h-14 w-14 bg-yellow-100 text-yellow-600 flex items-center justify-center rounded-full text-2xl shadow">
              📍
            </div>
            <div>
              <h4 className="font-semibold text-xl">Location</h4>
              <p className="text-gray-600">Lucknow, Uttar Pradesh, India</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="
          bg-white/80 backdrop-blur-xl p-10 shadow-xl rounded-2xl 
          border border-white/40
        ">
          <form className="space-y-6">
            <div>
              <label className="block font-medium text-gray-700">Your Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700">Message</label>
              <textarea
                rows={4}
                className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Write your message..."
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>

    </section>
  )
}

export default Contact