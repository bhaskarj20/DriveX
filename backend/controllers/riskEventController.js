
import RiskEvent from "../models/RiskEvent.js";

export const createRiskEvent = async (
  req,
  res
) => {
  try {
    const {
      driverProfile,
      riskScore,
      riskLevel,
      emergency,
      reasons,
      signals,
      timestamp,
    } = req.body;

    if (!driverProfile) {
      return res.status(400).json({
        message: "Driver profile ID is required",
      });
    }

    if (
      riskScore === undefined ||
      !riskLevel
    ) {
      return res.status(400).json({
        message:
          "Risk score and risk level are required",
      });
    }

    const riskEvent = await RiskEvent.create({
      driverProfile,
      riskScore,
      riskLevel,
      emergency,
      reasons,
      signals,
      timestamp,
    });

    res.status(201).json({
      message: "Risk event created successfully",
      riskEvent,
    });
  } catch (error) {
    console.error(
      "Create risk event error:",
      error.message
    );

    res.status(500).json({
      message: "Failed to create risk event",
    });
  }
};

export const getRiskEventsByDriverProfile = async (
  req,
  res
) => {
  try {
    const { driverProfileId } = req.params;

    const riskEvents =
      await RiskEvent.find({
        driverProfile: driverProfileId,
      }).sort({
        timestamp: -1,
      });

    res.status(200).json({
      riskEvents,
    });
  } catch (error) {
    console.error(
      "Get risk events error:",
      error.message
    );

    res.status(500).json({
      message: "Failed to get risk events",
    });
  }
};
