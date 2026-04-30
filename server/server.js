import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/database.js";
import userRoutes from "./routes/userRoutes.js";
import healthRoutes from "./routes/healthRoutes.js";

dotenv.config();

// connect DB
connectDB();

const app = express();
const port = Number(process.env.PORT) || 5000;

app.use(cors());
app.use(express.json());

// routes
app.use("/api", healthRoutes);
app.use("/api/users", userRoutes);

// root route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Creators Platform API is running",
  });
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});