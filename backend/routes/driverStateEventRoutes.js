import express from "express";

import {
  createDriverStateEvent,
  getDriverStateEventsByDriverProfile,
} from "../controllers/driverStateEventController.js";

const router = express.Router();

router.post(
  "/",
  createDriverStateEvent
);

router.get(
  "/:driverProfileId",
  getDriverStateEventsByDriverProfile
);

export default router;