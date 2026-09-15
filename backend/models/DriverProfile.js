import mongoose from "mongoose";

const driverProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    phone: {
      type: String,
      trim: true,
      default: "",
    },

    dateOfBirth: {
      type: Date,
      default: null,
    },

    licenseNumber: {
      type: String,
      trim: true,
      default: "",
    },

    drivingExperience: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

const DriverProfile = mongoose.model(
  "DriverProfile",
  driverProfileSchema
);

export default DriverProfile;