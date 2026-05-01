import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';

import authRoutes from './routes/authRoutes.js';
import managerRoutes from './routes/managerRoutes.js';
import teamRoutes from './routes/teamRoutes.js';
import updateRoutes from './routes/updateRoutes.js';

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running ✅");
});

// Invite system removed completely
app.use("/api/auth", authRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/update", updateRoutes);
app.use("/api/manager", managerRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error("[UNHANDLED ERROR]:", err);
  res.status(500).json({ message: "Internal server error" });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();