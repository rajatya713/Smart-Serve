import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle" },
    agency: { type: mongoose.Schema.Types.ObjectId, ref: "Agency" },
    pickupDate: Date,
    dropoffDate: Date,
    location: String,
    deliveryRequired: { type: Boolean, default: false },
    totalPrice: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["pending", "confirmed", "delivered", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "refunded"],
      default: "unpaid",
    },
    razorpayOrderId: { type: String, default: "" },
    razorpayPaymentId: { type: String, default: "" },
  },
  { timestamps: true },
);

export default mongoose.model("Booking", bookingSchema);
