import mongoose from "mongoose";

const driverStateEventSchema = new mongoose.Schema(
  {
    driverProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DriverProfile",
      required: true,
    },

    state: {
      type: String,
      enum: [
        "ALERT",
        "DISTRACTED",
        "DROWSY",
        "CRITICAL",
      ],
      required: true,
    },

    confidence: {
      type: Number,
      min: 0,
      max: 1,
      default: 0,
    },

    source: {
      type: String,
      required: true,
    },

    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const DriverStateEvent = mongoose.model(
  "DriverStateEvent",
  driverStateEventSchema
);

export default DriverStateEvent;