import express from "express";

import {
  createVehicle,
  getVehicle,
  updateVehicle,
} from "../controllers/vehicleController.js";

const router = express.Router();

router.post("/", createVehicle);

router.get("/:driverProfileId", getVehicle);
router.put("/:vehicleId", updateVehicle);

export default router;