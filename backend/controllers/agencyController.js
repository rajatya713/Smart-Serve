import Agency from "../models/agencyModel.js";

// Create Agency
export const createAgency = async (req, res) => {
  try {
    const { name, location, contact } = req.body;
    const agency = await Agency.create({ name, location, contact });
    res.status(201).json(agency);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all Agencies
export const getAllAgencies = async (req, res) => {
  try {
    const agencies = await Agency.find().populate("vehicles");
    res.json(agencies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single Agency
export const getAgencyById = async (req, res) => {
  try {
    const agency = await Agency.findById(req.params.id).populate("vehicles");
    if (!agency) return res.status(404).json({ message: "Agency not found" });
    res.json(agency);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
