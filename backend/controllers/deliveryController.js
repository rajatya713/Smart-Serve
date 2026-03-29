import Booking from "../models/bookingModel.js";
import DeliveryTracking from "../models/deliveryTrackingModel.js";
import User from "../models/userModel.js";

// Get deliveries assigned to the logged-in delivery agent
export const getMyDeliveries = async (req, res) => {
  try {
    const bookings = await Booking.find({
      deliveryAgent: req.user._id,
      deliveryRequired: true,
      status: { $nin: ["cancelled"] },
    })
      .populate("user", "name email phone")
      .populate("vehicle", "name type image")
      .populate("agency", "name location contact")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update delivery agent GPS location
export const updateLocation = async (req, res) => {
  try {
    const { bookingId, lat, lng } = req.body;

    if (!bookingId || lat === undefined || lng === undefined) {
      return res
        .status(400)
        .json({ message: "bookingId, lat and lng are required" });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.deliveryAgent?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Update tracking record
    const tracking = await DeliveryTracking.findOneAndUpdate(
      { booking: bookingId },
      {
        currentLocation: { lat, lng },
        $push: {
          locationHistory: { lat, lng, timestamp: new Date() },
        },
      },
      { new: true },
    );

    // Update agent's current location
    await User.findByIdAndUpdate(req.user._id, {
      currentLocation: { lat, lng },
    });

    res.json({ message: "Location updated", tracking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get tracking info for a booking (customer can see this)
export const getTrackingInfo = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId).populate(
      "deliveryAgent",
      "name phone currentLocation",
    );

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Allow: customer (owner), delivery agent, agency owner, admin
    const isOwner = booking.user.toString() === req.user._id.toString();
    const isAgent =
      booking.deliveryAgent?._id?.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAgent && !isAdmin) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const tracking = await DeliveryTracking.findOne({ booking: bookingId });

    res.json({
      booking: {
        _id: booking._id,
        status: booking.status,
        deliveryAddress: booking.deliveryAddress,
        deliveryLat: booking.deliveryLat,
        deliveryLng: booking.deliveryLng,
        deliveryOtp: isOwner ? booking.deliveryOtp : undefined,
      },
      agent: booking.deliveryAgent
        ? {
            name: booking.deliveryAgent.name,
            phone: booking.deliveryAgent.phone,
            currentLocation: booking.deliveryAgent.currentLocation,
          }
        : null,
      tracking: tracking
        ? {
            currentLocation: tracking.currentLocation,
            status: tracking.status,
            startedAt: tracking.startedAt,
            deliveredAt: tracking.deliveredAt,
          }
        : null,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delivery agent picks up vehicle from agency
export const pickupVehicle = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.deliveryAgent?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (booking.status !== "assigned") {
      return res
        .status(400)
        .json({ message: "Booking not in assigned status" });
    }

    booking.status = "picked-up";
    await booking.save();

    const tracking = await DeliveryTracking.findOneAndUpdate(
      { booking: bookingId },
      { status: "picked-up", startedAt: new Date() },
      { new: true },
    );

    res.json({
      message: "Vehicle picked up, heading to customer",
      booking,
      tracking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delivery agent starts transit
export const startTransit = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.deliveryAgent?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (booking.status !== "picked-up") {
      return res.status(400).json({ message: "Vehicle not picked up yet" });
    }

    booking.status = "in-transit";
    await booking.save();

    await DeliveryTracking.findOneAndUpdate(
      { booking: bookingId },
      { status: "in-transit" },
    );

    res.json({ message: "In transit to customer", booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delivery agent completes delivery (OTP verification)
export const completeDelivery = async (req, res) => {
  try {
    const { bookingId, otp } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.deliveryAgent?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (booking.status !== "in-transit") {
      return res.status(400).json({ message: "Not in transit" });
    }

    if (booking.deliveryOtp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    booking.status = "delivered";
    await booking.save();

    await DeliveryTracking.findOneAndUpdate(
      { booking: bookingId },
      { status: "delivered", deliveredAt: new Date() },
    );

    // Mark agent as available
    await User.findByIdAndUpdate(req.user._id, { isAvailable: true });

    res.json({ message: "Delivery completed successfully", booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get available delivery agents
export const getAvailableAgents = async (req, res) => {
  try {
    const agents = await User.find({
      role: "delivery",
      isAvailable: true,
    }).select("name phone currentLocation");

    res.json(agents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
