import mongoose from "mongoose";

const telemetrySchema = new mongoose.Schema(
  {
    driverProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DriverProfile",
      required: true,
    },

    speed: {
      type: Number,
      required: true,
      min: 0,
    },

    heartRate: {
      type: Number,
      required: true,
      min: 0,
    },

    motion: {
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

const Telemetry = mongoose.model(
  "Telemetry",
  telemetrySchema
);

export default Telemetry;