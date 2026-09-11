import express from "express";
import dotenv from "dotenv";
import apiRoutes from "./routes/index.js";
import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "DriveX backend is running",
  });
});

app.use("/api", apiRoutes);

app.use(notFound);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(
    `DriveX backend running on http://localhost:${PORT}`
  );
});