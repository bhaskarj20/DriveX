import mongoose from "mongoose";

const emergencyEventSchema = new mongoose.Schema(
  {
    driverProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DriverProfile",
      required: true,
    },

    emergency: {
      type: Boolean,
      default: true,
    },

    reason: {
      type: String,
      required: true,
    },

    riskScore: {
      type: Number,
      min: 0,
      max: 10,
    },

    riskLevel: {
      type: String,
      enum: ["Low", "Moderate", "High"],
    },

    driverState: {
      type: String,
      enum: [
        "ALERT",
        "DISTRACTED",
        "DROWSY",
        "CRITICAL",
        "Unknown",
      ],
      default: "Unknown",
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

const EmergencyEvent = mongoose.model(
  "EmergencyEvent",
  emergencyEventSchema
);

export default EmergencyEvent;