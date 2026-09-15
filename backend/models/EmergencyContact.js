import mongoose from "mongoose";

const emergencyContactSchema = new mongoose.Schema(
  {
    driverProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DriverProfile",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    relationship: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    isPrimary: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const EmergencyContact = mongoose.model(
  "EmergencyContact",
  emergencyContactSchema
);

export default EmergencyContact;