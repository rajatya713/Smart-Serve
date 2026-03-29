import mongoose from "mongoose";

const agencySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    location: { type: String, required: true },
    contact: { type: String, required: true },
    description: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "approved", "suspended"],
      default: "approved",
    },
  },
  { timestamps: true },
);

agencySchema.index({ owner: 1 });

export default mongoose.model("Agency", agencySchema);
