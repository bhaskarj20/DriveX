import DriverStateEvent from "../models/DriverStateEvent.js";

export const createDriverStateEvent = async (
  req,
  res
) => {
  try {
    const {
      driverProfile,
      state,
      confidence,
      source,
      timestamp,
    } = req.body;

    if (!driverProfile) {
      return res.status(400).json({
        message: "Driver profile ID is required",
      });
    }

    if (!state || !source) {
      return res.status(400).json({
        message: "State and source are required",
      });
    }

    const driverStateEvent =
      await DriverStateEvent.create({
        driverProfile,
        state,
        confidence,
        source,
        timestamp,
      });

    res.status(201).json({
      message:
        "Driver state event created successfully",
      driverStateEvent,
    });
  } catch (error) {
    console.error(
      "Create driver state event error:",
      error.message
    );

    res.status(500).json({
      message:
        "Failed to create driver state event",
    });
  }
};

export const getDriverStateEventsByDriverProfile = async (
  req,
  res
) => {
  try {
    const { driverProfileId } = req.params;

    const driverStateEvents =
      await DriverStateEvent.find({
        driverProfile: driverProfileId,
      }).sort({
        timestamp: -1,
      });

    res.status(200).json({
      driverStateEvents,
    });
  } catch (error) {
    console.error(
      "Get driver state events error:",
      error.message
    );

    res.status(500).json({
      message:
        "Failed to get driver state events",
    });
  }
};