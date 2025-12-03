import Booking from "../models/bookingModel.js";

export const createBooking = async (req, res) => {
  try {
    const {
      vehicleId,
      agencyId,
      pickupDate,
      dropoffDate,
      location,
      deliveryRequired,
    } = req.body;

    const booking = await Booking.create({
      user: req.user._id,
      vehicle: vehicleId,
      agency: agencyId,
      pickupDate,
      dropoffDate,
      location,
      deliveryRequired,
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get bookings of logged-in user
export const getBookingsByUser = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate(
      "vehicle agency"
    );
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
