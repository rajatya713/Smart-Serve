import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },
    agency: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agency",
      required: true,
    },
    pickupDate: { type: Date, required: true },
    dropoffDate: { type: Date, required: true },
    deliveryAddress: { type: String, default: "" },
    deliveryLat: { type: Number, default: 0 },
    deliveryLng: { type: Number, default: 0 },
    deliveryRequired: { type: Boolean, default: false },
    deliveryFee: { type: Number, default: 0 },
    totalPrice: { type: Number, default: 0, min: 0 },
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "assigned",
        "picked-up",
        "in-transit",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "refunded"],
      default: "unpaid",
    },
    deliveryAgent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    deliveryOtp: { type: String, default: "" },
    razorpayOrderId: { type: String, default: "" },
    razorpayPaymentId: { type: String, default: "" },
  },
  { timestamps: true },
);

bookingSchema.index({ user: 1, status: 1 });
bookingSchema.index({ agency: 1, status: 1 });
bookingSchema.index({ vehicle: 1, pickupDate: 1, dropoffDate: 1 });
bookingSchema.index({ deliveryAgent: 1, status: 1 });

bookingSchema.pre("validate", function (next) {
  if (
    this.dropoffDate &&
    this.pickupDate &&
    this.dropoffDate <= this.pickupDate
  ) {
    this.invalidate("dropoffDate", "Drop-off date must be after pickup date");
  }
  next();
});

export default mongoose.model("Booking", bookingSchema);
