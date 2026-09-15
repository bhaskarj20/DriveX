import Vehicle from "../models/Vehicle.js";

import DriverProfile from "../models/DriverProfile.js";

export const createVehicle = async (req, res) => {
  try {
    const {
      driverProfileId,
      vehicleNumber,
      make,
      model,
      year,
      fuelType,
    } = req.body;

    if (
      !driverProfileId ||
      !vehicleNumber ||
      !make ||
      !model ||
      !year
    ) {
      return res.status(400).json({
        message: "Required vehicle details are missing",
      });
    }

    const driverProfile =
      await DriverProfile.findById(
        driverProfileId
      );

    if (!driverProfile) {
      return res.status(404).json({
        message: "Driver profile not found",
      });
    }

    const existingVehicle =
      await Vehicle.findOne({
        driverProfile: driverProfileId,
      });

    if (existingVehicle) {
      return res.status(409).json({
        message:
          "Vehicle already associated with this driver",
      });
    }

    const vehicle = await Vehicle.create({
      driverProfile: driverProfileId,
      vehicleNumber,
      make,
      model,
      year,
      fuelType,
    });

    res.status(201).json({
      message: "Vehicle associated successfully",
      vehicle,
    });
  } catch (error) {
    console.error(
      "Create vehicle error:",
      error.message
    );

    res.status(500).json({
      message: "Failed to create vehicle",
    });
  }
};

export const getVehicle = async (req, res) => {
  try {
    const { driverProfileId } = req.params;

    const vehicle =
      await Vehicle.findOne({
        driverProfile: driverProfileId,
      });

    if (!vehicle) {
      return res.status(404).json({
        message: "Vehicle not found",
      });
    }

    res.status(200).json({
      vehicle,
    });
  } catch (error) {
    console.error(
      "Get vehicle error:",
      error.message
    );

    res.status(500).json({
      message: "Failed to get vehicle",
    });
  }
};

export const updateVehicle = async (req, res) => {
  try {
    const { vehicleId } = req.params;

    const vehicle =
      await Vehicle.findById(vehicleId);

    if (!vehicle) {
      return res.status(404).json({
        message: "Vehicle not found",
      });
    }

    const {
      vehicleNumber,
      make,
      model,
      year,
      fuelType,
    } = req.body;

    if (vehicleNumber !== undefined) {
      vehicle.vehicleNumber =
        vehicleNumber;
    }

    if (make !== undefined) {
      vehicle.make = make;
    }

    if (model !== undefined) {
      vehicle.model = model;
    }

    if (year !== undefined) {
      vehicle.year = year;
    }

    if (fuelType !== undefined) {
      vehicle.fuelType = fuelType;
    }

    await vehicle.save();

    res.status(200).json({
      message: "Vehicle updated successfully",
      vehicle,
    });
  } catch (error) {
    console.error(
      "Update vehicle error:",
      error.message
    );

    res.status(500).json({
      message: "Failed to update vehicle",
    });
  }
};