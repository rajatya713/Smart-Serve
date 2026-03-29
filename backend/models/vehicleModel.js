import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    agency: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agency",
      required: true,
    },
    name: { type: String, required: true, trim: true },
    type: {
      type: String,
      required: true,
      enum: ["Car", "Bike", "SUV", "Scooter", "Van"],
    },
    pricePerDay: { type: Number, required: true, min: 0 },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    features: [{ type: String }],
    available: { type: Boolean, default: true },
  },
  { timestamps: true },
);

vehicleSchema.index({ agency: 1 });
vehicleSchema.index({ type: 1, pricePerDay: 1 });

export default mongoose.model("Vehicle", vehicleSchema);
