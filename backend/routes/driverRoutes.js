import express from "express";

import {
  createDriverProfile,
  getDriverProfile,
  updateDriverProfile,
} from "../controllers/driverController.js";

const router = express.Router();

router.post("/profile", createDriverProfile);

router.get(
  "/profile/:userId",
  getDriverProfile
);

router.put(
  "/profile/:userId",
  updateDriverProfile
);

export default router;
