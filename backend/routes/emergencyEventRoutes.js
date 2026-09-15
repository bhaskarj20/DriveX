import express from "express";

import {
  createEmergencyEvent,
} from "../controllers/emergencyEventController.js";

const router = express.Router();

router.use((req, res, next) => {
  console.log(
    "🔥 EMERGENCY ROUTER HIT:",
    req.method,
    req.originalUrl
  );

  next();
});

router.post(
  "/",
  createEmergencyEvent
);

export default router;