import Booking from "../models/bookingModel.js";
import Vehicle from "../models/vehicleModel.js";

const DELIVERY_FEE = 50;

const generateOtp = () => Math.floor(1000 + Math.random() * 9000).toString();

export const createBooking = async (req, res) => {
  try {
    const {
      vehicleId,
      agencyId,
      pickupDate,
      dropoffDate,
      location,
      deliveryRequired,
      deliveryAddress,
      deliveryLat,
      deliveryLng,
    } = req.body;

    if (!vehicleId || !agencyId || !pickupDate || !dropoffDate || !location) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const pickup = new Date(pickupDate);
    const dropoff = new Date(dropoffDate);

    if (dropoff <= pickup) {
      return res.status(400).json({ message: "Drop-off must be after pickup" });
    }

    // Check double booking
    const overlapping = await Booking.findOne({
      vehicle: vehicleId,
      status: { $nin: ["cancelled"] },
      pickupDate: { $lt: dropoff },
      dropoffDate: { $gt: pickup },
    });

    if (overlapping) {
      return res
        .status(400)
        .json({ message: "Vehicle already booked for these dates" });
    }

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });
    if (!vehicle.available) {
      return res.status(400).json({ message: "Vehicle is not available" });
    }

    const diffTime = Math.abs(dropoff - pickup);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    const deliveryFee = deliveryRequired ? DELIVERY_FEE : 0;
    const totalPrice = vehicle.pricePerDay * diffDays + deliveryFee;

    const booking = await Booking.create({
      user: req.user._id,
      vehicle: vehicleId,
      agency: agencyId,
      pickupDate: pickup,
      dropoffDate: dropoff,
      location,
      deliveryRequired,
      deliveryAddress: deliveryRequired ? deliveryAddress || location : "",
      deliveryLat: deliveryRequired ? deliveryLat || 0 : 0,
      deliveryLng: deliveryRequired ? deliveryLng || 0 : 0,
      deliveryFee,
      totalPrice,
      deliveryOtp: deliveryRequired ? generateOtp() : "",
    });

    const populated = await Booking.findById(booking._id)
      .populate("vehicle", "name type pricePerDay")
      .populate("agency", "name location");

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBookingsByUser = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("vehicle", "name type pricePerDay image")
      .populate("agency", "name location")
      .populate("deliveryAgent", "name phone")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("vehicle", "name type pricePerDay image")
      .populate("agency", "name location contact")
      .populate("deliveryAgent", "name phone")
      .populate("user", "name email phone");

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Allow access for: booking owner, agency owner, delivery agent, admin
    const isOwner = booking.user._id.toString() === req.user._id.toString();
    const isDeliveryAgent =
      booking.deliveryAgent?._id?.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isDeliveryAgent && !isAdmin) {
      // Check if user is agency owner
      const Agency = (await import("../models/agencyModel.js")).default;
      const agency = await Agency.findOne({ owner: req.user._id });
      if (!agency || booking.agency._id.toString() !== agency._id.toString()) {
        return res.status(403).json({ message: "Not authorized" });
      }
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({ message: "Already cancelled" });
    }

    if (["delivered", "in-transit"].includes(booking.status)) {
      return res.status(400).json({ message: "Cannot cancel at this stage" });
    }

    booking.status = "cancelled";
    await booking.save();
    res.json({ message: "Booking cancelled", booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const assignDeliveryAgent = async (req, res) => {
  try {
    const { bookingId, agentId } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (!booking.deliveryRequired) {
      return res
        .status(400)
        .json({ message: "Delivery not required for this booking" });
    }

    // Verify agency ownership
    const Agency = (await import("../models/agencyModel.js")).default;
    const agency = await Agency.findOne({ owner: req.user._id });
    if (!agency || booking.agency.toString() !== agency._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const User = (await import("../models/userModel.js")).default;
    const agent = await User.findById(agentId);
    if (!agent || agent.role !== "delivery") {
      return res.status(400).json({ message: "Invalid delivery agent" });
    }

    booking.deliveryAgent = agentId;
    booking.status = "assigned";
    await booking.save();

    // Create delivery tracking
    const DeliveryTracking = (
      await import("../models/deliveryTrackingModel.js")
    ).default;
    await DeliveryTracking.findOneAndUpdate(
      { booking: bookingId },
      {
        booking: bookingId,
        deliveryAgent: agentId,
        status: "assigned",
      },
      { upsert: true, new: true },
    );

    res.json({ message: "Delivery agent assigned", booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email phone")
      .populate("vehicle", "name type")
      .populate("agency", "name location")
      .populate("deliveryAgent", "name phone")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
