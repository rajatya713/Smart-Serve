import Vehicle from "../models/vehicleModel.js";
import Agency from "../models/agencyModel.js";

export const createVehicle = async (req, res) => {
  try {
    const agency = await Agency.findOne({ owner: req.user._id });
    if (!agency) {
      return res.status(404).json({ message: "Create an agency first" });
    }

    const { name, type, pricePerDay, description, image, features } = req.body;

    if (!name || !type || !pricePerDay) {
      return res
        .status(400)
        .json({ message: "Name, type and price are required" });
    }

    const vehicle = await Vehicle.create({
      name,
      type,
      pricePerDay,
      description: description || "",
      image: image || "",
      features: features || [],
      agency: agency._id,
    });

    res.status(201).json(vehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });

    const agency = await Agency.findOne({ owner: req.user._id });
    if (!agency || vehicle.agency.toString() !== agency._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { name, type, pricePerDay, description, image, features, available } =
      req.body;

    vehicle.name = name || vehicle.name;
    vehicle.type = type || vehicle.type;
    vehicle.pricePerDay =
      pricePerDay !== undefined ? pricePerDay : vehicle.pricePerDay;
    vehicle.description =
      description !== undefined ? description : vehicle.description;
    vehicle.image = image !== undefined ? image : vehicle.image;
    vehicle.features = features || vehicle.features;
    vehicle.available = available !== undefined ? available : vehicle.available;

    const updated = await vehicle.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });

    const agency = await Agency.findOne({ owner: req.user._id });
    if (!agency || vehicle.agency.toString() !== agency._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Vehicle.findByIdAndDelete(req.params.id);
    res.json({ message: "Vehicle deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getVehiclesByAgency = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({
      agency: req.params.agencyId,
    }).populate("agency", "name location");
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyVehicles = async (req, res) => {
  try {
    const agency = await Agency.findOne({ owner: req.user._id });
    if (!agency) return res.status(404).json({ message: "Agency not found" });

    const vehicles = await Vehicle.find({ agency: agency._id });
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id).populate(
      "agency",
      "name location contact",
    );
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });
    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllVehicles = async (req, res) => {
  try {
    const { type, maxPrice, search, available } = req.query;
    const filter = {};

    if (type) filter.type = new RegExp(`^${type}$`, "i");
    if (maxPrice) filter.pricePerDay = { $lte: Number(maxPrice) };
    if (search) filter.name = new RegExp(search, "i");
    if (available === "true") filter.available = true;

    const vehicles = await Vehicle.find(filter).populate(
      "agency",
      "name location contact",
    );
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
