
import express from "express";

import {
  createRiskEvent,
  getRiskEventsByDriverProfile,
} from "../controllers/riskEventController.js";

const router = express.Router();

router.post(
  "/",
  createRiskEvent
);

router.get(
  "/:driverProfileId",
  getRiskEventsByDriverProfile
);

export default router;
