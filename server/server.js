import dotenv from "dotenv";
dotenv.config();

import uploadRoutes from "./routes/upload.js";

import jwt from "jsonwebtoken";

import { createServer } from "http";
import { Server } from "socket.io";

import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";

import { connectDB } from "./config/db.js";
import errorHandler from "./middleware/errorMiddleware.js";

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.use((socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error("No token provided"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    socket.data.user = decoded;

    next();
  } catch (error) {
    next(new Error("Authentication error"));
  }
});

io.on("connection", (socket) => {
  console.log(
    `✅ User connected: ${socket.id} | User: ${socket.data.user.email}`
  );

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});
// ===============================
// BASIC MIDDLEWARE
// ===============================
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());

app.use("/api/upload", uploadRoutes);

// ===============================
// ROUTES
// ===============================
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes(io));

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

    httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log("🔌 Socket.io ready");
});

  } catch (error) {
    console.error("❌ Server failed to start:", error.message);
    process.exit(1);
  }
};

startServer();