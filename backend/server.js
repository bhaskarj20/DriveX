
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import apiRoutes from "./routes/index.js";
import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";
import connectDB from "./config/db.js";

dotenv.config();

const app = express();

app.use((req, res, next) => {
  console.log(
    "🔥 REQUEST REACHED EXPRESS:",
    req.method,
    req.originalUrl
  );

  next();
});

console.log("🔥🔥🔥 THIS SERVER.JS IS RUNNING 🔥🔥🔥");

const PORT = process.env.PORT || 5000;

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "DriveX backend is running",
  });
});

/*
  TEMPORARY EMERGENCY ROUTE TEST

  This bypasses the nested emergencyEventRoutes router.
*/
app.get("/debug-test", (req, res) => {
  console.log("🔥 DEBUG TEST ROUTE HIT");

  res.json({
    message: "Debug route works",
  });
});

app.post("/api/emergency-events", (req, res) => {
  console.log("🔥 DIRECT EMERGENCY ROUTE HIT");

  res.status(200).json({
    message: "Direct emergency route is working",
    body: req.body,
  });
});

app.use("/api", apiRoutes);

app.use(notFound);

app.use(errorHandler);

connectDB();

console.log("🔥 ROUTES LOADED:");
console.dir(app.router.stack, { depth: 5 });

app.listen(PORT, "0.0.0.0", () => {
  console.log(`DriveX backend running on port ${PORT}`);
});