import Agency from "../models/agencyModel.js";
import Vehicle from "../models/vehicleModel.js";
import Booking from "../models/bookingModel.js";

export const createAgency = async (req, res) => {
  try {
    const existing = await Agency.findOne({ owner: req.user._id });
    if (existing) {
      return res.status(400).json({ message: "You already have an agency" });
    }

    const { name, location, contact, description } = req.body;

    if (!name || !location || !contact) {
      return res
        .status(400)
        .json({ message: "Name, location and contact are required" });
    }

    const agency = await Agency.create({
      name,
      location,
      contact,
      description: description || "",
      owner: req.user._id,
    });

    res.status(201).json(agency);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyAgency = async (req, res) => {
  try {
    const agency = await Agency.findOne({ owner: req.user._id });
    if (!agency)
      return res
        .status(404)
        .json({ message: "Agency not found. Please create one." });
    res.json(agency);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAgency = async (req, res) => {
  try {
    const agency = await Agency.findOne({ owner: req.user._id });
    if (!agency) return res.status(404).json({ message: "Agency not found" });

    const { name, location, contact, description } = req.body;
    agency.name = name || agency.name;
    agency.location = location || agency.location;
    agency.contact = contact || agency.contact;
    agency.description =
      description !== undefined ? description : agency.description;

    const updated = await agency.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllAgencies = async (req, res) => {
  try {
    const agencies = await Agency.find({ status: "approved" }).select("-owner");
    res.json(agencies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAgencyById = async (req, res) => {
  try {
    const agency = await Agency.findById(req.params.id);
    if (!agency) return res.status(404).json({ message: "Agency not found" });
    res.json(agency);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAgencyStats = async (req, res) => {
  try {
    const agency = await Agency.findOne({ owner: req.user._id });
    if (!agency) return res.status(404).json({ message: "Agency not found" });

    const vehicleCount = await Vehicle.countDocuments({ agency: agency._id });
    const bookings = await Booking.find({ agency: agency._id });

    const totalBookings = bookings.length;
    const activeBookings = bookings.filter(
      (b) => !["cancelled", "delivered"].includes(b.status),
    ).length;
    const totalRevenue = bookings
      .filter((b) => b.paymentStatus === "paid")
      .reduce((sum, b) => sum + b.totalPrice, 0);
    const deliveryBookings = bookings.filter((b) => b.deliveryRequired).length;

    res.json({
      agency,
      vehicleCount,
      totalBookings,
      activeBookings,
      totalRevenue,
      deliveryBookings,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAgencyBookings = async (req, res) => {
  try {
    const agency = await Agency.findOne({ owner: req.user._id });
    if (!agency) return res.status(404).json({ message: "Agency not found" });

    const bookings = await Booking.find({ agency: agency._id })
      .populate("user", "name email phone")
      .populate("vehicle", "name type")
      .populate("deliveryAgent", "name phone")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
