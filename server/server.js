import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";

import { connectDB } from "./config/db.js";
import errorHandler from "./middleware/errorMiddleware.js";

const app = express();

// ===============================
// BASIC MIDDLEWARE
// ===============================
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());

// ===============================
// ROUTES
// ===============================
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

// ===============================
// ERROR MIDDLEWARE (MUST BE LAST)
// ===============================
app.use(errorHandler);

// ===============================
// SERVER START FUNCTION
// ===============================
const startServer = async () => {
  try {
    console.log("🚀 Starting server...");

    await connectDB();
    console.log("✅ MongoDB connected successfully");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`🔥 Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("❌ Server failed to start:", error.message);
    process.exit(1);
  }
};

startServer();