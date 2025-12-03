import Vehicle from "../models/vehicleModel.js";
import Agency from "../models/agencyModel.js";

// Add vehicle
export const createVehicle = async (req, res) => {
  try {
    const { name, type, pricePerDay, agencyId } = req.body;

    const vehicle = await Vehicle.create({
      name,
      type,
      pricePerDay,
      agency: agencyId,
    });

    // Add vehicle to agency
    const agency = await Agency.findById(agencyId);
    agency.vehicles.push(vehicle._id);
    await agency.save();

    res.status(201).json(vehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get vehicles of one agency
export const getVehiclesByAgency = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ agency: req.params.agencyId });
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all vehicles
export const getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find().populate("agency");
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
