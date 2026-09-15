import EmergencyEvent from "../models/EmergencyEvent.js";

export const createEmergencyEvent = async (
  req,
  res
) => {
  try {
    const {
      driverProfile,
      emergency,
      reason,
      riskScore,
      riskLevel,
      driverState,
      timestamp,
    } = req.body;

    if (!driverProfile) {
      return res.status(400).json({
        message: "Driver profile ID is required",
      });
    }

    if (!reason) {
      return res.status(400).json({
        message: "Emergency reason is required",
      });
    }

    const emergencyEvent =
      await EmergencyEvent.create({
        driverProfile,
        emergency,
        reason,
        riskScore,
        riskLevel,
        driverState,
        timestamp,
      });

    res.status(201).json({
      message:
        "Emergency event created successfully",
      emergencyEvent,
    });
  } catch (error) {
    console.error(
      "Create emergency event error:",
      error.message
    );

    res.status(500).json({
      message:
        "Failed to create emergency event",
    });
  }
};