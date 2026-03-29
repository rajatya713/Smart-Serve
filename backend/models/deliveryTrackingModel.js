import mongoose from "mongoose";

const locationPointSchema = new mongoose.Schema(
  {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false },
);

const deliveryTrackingSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      unique: true,
    },
    deliveryAgent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    currentLocation: {
      lat: { type: Number, default: 0 },
      lng: { type: Number, default: 0 },
    },
    locationHistory: [locationPointSchema],
    status: {
      type: String,
      enum: ["assigned", "picked-up", "in-transit", "delivered"],
      default: "assigned",
    },
    startedAt: { type: Date, default: null },
    deliveredAt: { type: Date, default: null },
  },
  { timestamps: true },
);

deliveryTrackingSchema.index({ booking: 1 });
deliveryTrackingSchema.index({ deliveryAgent: 1 });

export default mongoose.model("DeliveryTracking", deliveryTrackingSchema);
