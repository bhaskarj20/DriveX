import mongoose from "mongoose";

const riskEventSchema = new mongoose.Schema(
  {
    driverProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DriverProfile",
      required: true,
    },

    riskScore: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },

    riskLevel: {
      type: String,
      enum: ["Low", "Moderate", "High"],
      required: true,
    },

    emergency: {
      type: Boolean,
      default: false,
    },

    reasons: {
      type: [String],
      default: [],
    },

    signals: {
      speed: {
        type: Number,
        min: 0,
      },

      heartRate: {
        type: Number,
        min: 0,
      },

      motion: {
        type: String,
        default: "Unknown",
      },

      event: {
        type: String,
        default: "Normal",
      },

      driverState: {
        type: String,
        default: "Unknown",
      },
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

const RiskEvent = mongoose.model(
  "RiskEvent",
  riskEventSchema
);

export default RiskEvent;