import express from "express";

import {
  createEmergencyContact,
  getEmergencyContacts,
  updateEmergencyContact,
  deleteEmergencyContact,
} from "../controllers/emergencyContactController.js";

const router = express.Router();

router.post("/", createEmergencyContact);

router.get("/:driverProfileId", getEmergencyContacts);

router.put("/:contactId", updateEmergencyContact);

router.delete("/:contactId", deleteEmergencyContact);

export default router;