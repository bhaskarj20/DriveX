import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    driverProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DriverProfile",
      required: true,
      unique: true,
    },

    vehicleNumber: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    make: {
      type: String,
      required: true,
      trim: true,
    },

    model: {
      type: String,
      required: true,
      trim: true,
    },

    year: {
      type: Number,
      required: true,
    },

    fuelType: {
      type: String,
      enum: [
        "PETROL",
        "DIESEL",
        "ELECTRIC",
        "HYBRID",
      ],
      default: "PETROL",
    },
  },
  {
    timestamps: true,
  }
);

const Vehicle = mongoose.model(
  "Vehicle",
  vehicleSchema
);

export default Vehicle;