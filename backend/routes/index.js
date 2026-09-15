import express from "express";
import healthRoutes from "./healthRoutes.js";
import authRoutes from "./authRoutes.js";
import driverRoutes from "./driverRoutes.js";
import vehicleRoutes from "./vehicleRoutes.js";
import emergencyContactRoutes from "./emergencyContactRoutes.js";
import telemetryRoutes from "./telemetryRoutes.js";
import driverStateEventRoutes from "./driverStateEventRoutes.js";
import riskEventRoutes from "./riskEventRoutes.js";
import emergencyEventRoutes from "./emergencyEventRoutes.js";

const router = express.Router();
router.use((req, res, next) => {
  console.log(
    "🔥 API ROUTER HIT:",
    req.method,
    req.originalUrl
  );

  next();
});

router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/driver", driverRoutes);
router.use("/vehicle", vehicleRoutes);
router.use(
  "/emergency-contacts",
  emergencyContactRoutes
);
router.use("/telemetry", telemetryRoutes);
router.use(
  "/driver-state-events",
  driverStateEventRoutes
);
router.use(
  "/risk-events",
  riskEventRoutes
);
router.use(
  "/emergency-events",
  emergencyEventRoutes
);

export default router;