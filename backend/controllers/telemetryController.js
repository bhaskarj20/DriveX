
import Telemetry from "../models/Telemetry.js";

export const createTelemetry = async (req, res) => {
  try {
    const {
      driverProfile,
      speed,
      heartRate,
      motion,
    } = req.body;

    if (!driverProfile) {
      return res.status(400).json({
        message: "Driver profile ID is required",
      });
    }

    if (
      speed === undefined ||
      heartRate === undefined ||
      motion === undefined
    ) {
      return res.status(400).json({
        message:
          "Speed, heart rate, and motion are required",
      });
    }

    const telemetry = await Telemetry.create({
      driverProfile,
      speed,
      heartRate,
      motion,
    });

    res.status(201).json({
      message: "Telemetry created successfully",
      telemetry,
    });
  } catch (error) {
    console.error(
      "Create telemetry error:",
      error.message
    );

    res.status(500).json({
      message: "Failed to create telemetry",
    });
  }
};

export const getTelemetryByDriverProfile = async (
  req,
  res
) => {
  try {
    const { driverProfileId } = req.params;

    const telemetry =
      await Telemetry.find({
        driverProfile: driverProfileId,
      }).sort({
        timestamp: -1,
      });

    res.status(200).json({
      telemetry,
    });
  } catch (error) {
    console.error(
      "Get telemetry error:",
      error.message
    );

    res.status(500).json({
      message: "Failed to get telemetry",
    });
  }
};