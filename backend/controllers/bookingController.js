import Booking from "../models/bookingModel.js";
import Vehicle from "../models/vehicleModel.js";

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

    // Calculate number of days
    const pickup = new Date(pickupDate);
    const dropoff = new Date(dropoffDate);
    const diffTime = Math.abs(dropoff - pickup);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

    // Get vehicle price
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });

    const totalPrice = vehicle.pricePerDay * diffDays;

    const booking = await Booking.create({
      user: req.user._id,
      vehicle: vehicleId,
      agency: agencyId,
      pickupDate,
      dropoffDate,
      location,
      deliveryRequired,
      totalPrice,
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get bookings of logged-in user
export const getBookingsByUser = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("vehicle agency")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cancel a booking
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (booking.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });
    if (booking.status === "cancelled")
      return res.status(400).json({ message: "Booking already cancelled" });

    booking.status = "cancelled";
    await booking.save();
    res.json({ message: "Booking cancelled", booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
