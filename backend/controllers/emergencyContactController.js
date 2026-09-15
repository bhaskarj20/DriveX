import EmergencyContact from "../models/EmergencyContact.js";

import DriverProfile from "../models/DriverProfile.js";

export const createEmergencyContact = async (req, res) => {
  try {
    const {
      driverProfileId,
      name,
      relationship,
      phone,
      isPrimary,
    } = req.body;

    if (
      !driverProfileId ||
      !name ||
      !relationship ||
      !phone
    ) {
      return res.status(400).json({
        message: "Required contact details are missing",
      });
    }

    const driverProfile =
      await DriverProfile.findById(driverProfileId);

    if (!driverProfile) {
      return res.status(404).json({
        message: "Driver profile not found",
      });
    }

    const contact =
      await EmergencyContact.create({
        driverProfile: driverProfileId,
        name,
        relationship,
        phone,
        isPrimary: isPrimary || false,
      });

    res.status(201).json({
      message: "Emergency contact created successfully",
      contact,
    });
  } catch (error) {
    console.error(
      "Create emergency contact error:",
      error.message
    );

    res.status(500).json({
      message: "Failed to create emergency contact",
    });
  }
};

export const getEmergencyContacts = async (req, res) => {
  try {
    const { driverProfileId } = req.params;

    const contacts =
      await EmergencyContact.find({
        driverProfile: driverProfileId,
      });

    res.status(200).json({
      contacts,
    });
  } catch (error) {
    console.error(
      "Get emergency contacts error:",
      error.message
    );

    res.status(500).json({
      message: "Failed to get emergency contacts",
    });
  }
};

export const updateEmergencyContact = async (req, res) => {
  try {
    const { contactId } = req.params;

    const contact =
      await EmergencyContact.findById(contactId);

    if (!contact) {
      return res.status(404).json({
        message: "Emergency contact not found",
      });
    }

    const {
      name,
      relationship,
      phone,
      isPrimary,
    } = req.body;

    if (name !== undefined) {
      contact.name = name;
    }

    if (relationship !== undefined) {
      contact.relationship = relationship;
    }

    if (phone !== undefined) {
      contact.phone = phone;
    }

    if (isPrimary !== undefined) {
      contact.isPrimary = isPrimary;
    }

    // Only one primary contact is allowed
    if (isPrimary === true) {
      await EmergencyContact.updateMany(
        {
          driverProfile: contact.driverProfile,
          _id: { $ne: contact._id },
        },
        {
          $set: {
            isPrimary: false,
          },
        }
      );
    }

    await contact.save();

    res.status(200).json({
      message: "Emergency contact updated successfully",
      contact,
    });
  } catch (error) {
    console.error(
      "Update emergency contact error:",
      error.message
    );

    res.status(500).json({
      message: "Failed to update emergency contact",
    });
  }
};

export const deleteEmergencyContact = async (
  req,
  res
) => {
  try {
    const { contactId } = req.params;

    const contact =
      await EmergencyContact.findById(contactId);

    if (!contact) {
      return res.status(404).json({
        message: "Emergency contact not found",
      });
    }

    await contact.deleteOne();

    res.status(200).json({
      message:
        "Emergency contact deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete emergency contact error:",
      error.message
    );

    res.status(500).json({
      message: "Failed to delete emergency contact",
    });
  }
};