
import DriverProfile from "../models/DriverProfile.js";

export const createDriverProfile = async (req, res) => {
  try {
    const {
      userId,
      phone,
      dateOfBirth,
      licenseNumber,
      drivingExperience,
    } = req.body;

    if (!userId) {
      return res.status(400).json({
        message: "User ID is required",
      });
    }

    const existingProfile =
      await DriverProfile.findOne({
        user: userId,
      });

    if (existingProfile) {
      return res.status(409).json({
        message: "Driver profile already exists",
      });
    }

    const profile = await DriverProfile.create({
      user: userId,
      phone,
      dateOfBirth,
      licenseNumber,
      drivingExperience,
    });

    res.status(201).json({
      message: "Driver profile created successfully",
      profile,
    });
  } catch (error) {
    console.error(
      "Create driver profile error:",
      error.message
    );

    res.status(500).json({
      message: "Failed to create driver profile",
    });
  }
};

export const getDriverProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const profile =
      await DriverProfile.findOne({
        user: userId,
      });

    if (!profile) {
      return res.status(404).json({
        message: "Driver profile not found",
      });
    }

    res.status(200).json({
      profile,
    });
  } catch (error) {
    console.error(
      "Get driver profile error:",
      error.message
    );

    res.status(500).json({
      message: "Failed to get driver profile",
    });
  }
};

export const updateDriverProfile = async (
  req,
  res
) => {
  try {
    const { userId } = req.params;

    const profile =
      await DriverProfile.findOne({
        user: userId,
      });

    if (!profile) {
      return res.status(404).json({
        message: "Driver profile not found",
      });
    }

    const {
      phone,
      dateOfBirth,
      licenseNumber,
      drivingExperience,
    } = req.body;

    if (phone !== undefined) {
      profile.phone = phone;
    }

    if (dateOfBirth !== undefined) {
      profile.dateOfBirth = dateOfBirth;
    }

    if (licenseNumber !== undefined) {
      profile.licenseNumber =
        licenseNumber;
    }

    if (drivingExperience !== undefined) {
      profile.drivingExperience =
        drivingExperience;
    }

    await profile.save();

    res.status(200).json({
      message: "Driver profile updated successfully",
      profile,
    });
  } catch (error) {
    console.error(
      "Update driver profile error:",
      error.message
    );

    res.status(500).json({
      message: "Failed to update driver profile",
    });
  }
};
