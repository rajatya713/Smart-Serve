import { useState } from "react";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setStatus("Please fill all fields.");
      return;
    }
    setStatus("Message sent! We'll get back to you soon.");
    setForm({ name: "", email: "", message: "" });
    setTimeout(() => setStatus(""), 4000);
  };

  return (
    <section
      id="contact"
      className="relative overflow-hidden py-24 px-6 md:px-16 lg:px-24 xl:px-32 text-gray-800 bg-linear-to-b from-purple-50 via-white to-blue-50 bg-[radial-gradient(#c1c1c1_1px,transparent_1px)] bg-size-[18px_18px]"
    >
      <div className="absolute top-10 right-10 w-72 h-72 bg-blue-400 opacity-20 rounded-full blur-3xl animate-pulse -z-10" />
      <div className="absolute bottom-10 left-10 w-64 h-64 bg-pink-300 opacity-25 rounded-full blur-3xl animate-pulse -z-10" />

      <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-6 bg-clip-text text-transparent bg-linear-to-r from-purple-600 to-blue-600">
        Contact Us
      </h2>
      <p className="text-center text-lg text-gray-700 max-w-3xl mx-auto mb-16">
        Have questions? Our support team is always here to help.
      </p>

      <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
        <div className="space-y-8">
          {[
            { icon: "📞", title: "Phone", value: "+91 9876543210" },
            { icon: "✉️", title: "Email", value: "support@smartserve.com" },
            { icon: "📍", title: "Location", value: "Lucknow, Uttar Pradesh, India" },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-4">
              <div className="h-14 w-14 bg-blue-100 text-blue-600 flex items-center justify-center rounded-full text-2xl shadow">
                {item.icon}
              </div>
              <div>
                <h4 className="font-semibold text-xl">{item.title}</h4>
                <p className="text-gray-600">{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="glass-card p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="contact-name" className="block font-medium text-gray-700">
                Your Name
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label htmlFor="contact-email" className="block font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label htmlFor="contact-message" className="block font-medium text-gray-700">
                Message
              </label>
              <textarea
                id="contact-message"
                name="message"
                rows={4}
                value={form.message}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 resize-none outline-none"
                placeholder="Write your message..."
              />
            </div>

            {status && (
              <p className={`text-sm ${status.includes("sent") ? "text-green-600" : "text-red-600"}`}>
                {status}
              </p>
            )}

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
  );
};

export default Contact;