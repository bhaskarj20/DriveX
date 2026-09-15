import express from "express";

import {
  createTelemetry,
  getTelemetryByDriverProfile,
} from "../controllers/telemetryController.js";

const router = express.Router();

router.post("/", createTelemetry);

router.get(
  "/:driverProfileId",
  getTelemetryByDriverProfile
);

export default router;
