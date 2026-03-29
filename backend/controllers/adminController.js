import User from "../models/userModel.js";
import Agency from "../models/agencyModel.js";
import Vehicle from "../models/vehicleModel.js";
import Booking from "../models/bookingModel.js";

export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCustomers = await User.countDocuments({ role: "customer" });
    const totalAgencies = await Agency.countDocuments();
    const totalVehicles = await Vehicle.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalDeliveryAgents = await User.countDocuments({ role: "delivery" });

    const paidBookings = await Booking.find({ paymentStatus: "paid" });
    const totalRevenue = paidBookings.reduce((sum, b) => sum + b.totalPrice, 0);

    const activeBookings = await Booking.countDocuments({
      status: { $nin: ["cancelled", "delivered"] },
    });

    const deliveryBookings = await Booking.countDocuments({
      deliveryRequired: true,
    });

    const recentBookings = await Booking.find()
      .populate("user", "name email")
      .populate("vehicle", "name type")
      .populate("agency", "name")
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      totalUsers,
      totalCustomers,
      totalAgencies,
      totalVehicles,
      totalBookings,
      totalDeliveryAgents,
      totalRevenue,
      activeBookings,
      deliveryBookings,
      recentBookings,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const { role } = req.query;
    const filter = {};
    if (role) filter.role = role;

    const users = await User.find(filter)
      .select("-password -resetPasswordToken -resetPasswordExpires")
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { userId, role } = req.body;

    const validRoles = ["customer", "agency", "delivery", "admin"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.role = role;
    await user.save({ validateBeforeSave: false });

    res.json({
      message: "User role updated",
      user: { _id: user._id, name: user.name, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role === "admin") {
      return res.status(400).json({ message: "Cannot delete admin user" });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllAgenciesAdmin = async (req, res) => {
  try {
    const agencies = await Agency.find()
      .populate("owner", "name email")
      .sort({ createdAt: -1 });

    res.json(agencies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAgencyStatus = async (req, res) => {
  try {
    const { agencyId, status } = req.body;

    const validStatuses = ["pending", "approved", "suspended"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const agency = await Agency.findById(agencyId);
    if (!agency) return res.status(404).json({ message: "Agency not found" });

    agency.status = status;
    await agency.save();

    res.json({ message: "Agency status updated", agency });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAgency = async (req, res) => {
  try {
    const agency = await Agency.findById(req.params.id);
    if (!agency) return res.status(404).json({ message: "Agency not found" });

    // Delete all vehicles of this agency
    await Vehicle.deleteMany({ agency: agency._id });
    await Agency.findByIdAndDelete(req.params.id);

    res.json({ message: "Agency and its vehicles deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllBookingsAdmin = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const bookings = await Booking.find(filter)
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
