import mongoose from "mongoose";

const agencySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    contact: { type: String, required: true },
    vehicles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Vehicle" }],
  },
  { timestamps: true }
);

export default mongoose.model("Agency", agencySchema);
