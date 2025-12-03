import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle" },
    agency: { type: mongoose.Schema.Types.ObjectId, ref: "Agency" },
    pickupDate: Date,
    dropoffDate: Date,
    location: String,
    deliveryRequired: Boolean,
    status: {
      type: String,
      enum: ["pending", "confirmed", "delivered", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
