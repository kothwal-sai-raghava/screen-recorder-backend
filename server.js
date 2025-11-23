import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoute from "./routes/auth.js";
import cors from "cors";
import recordingRoutes from "./routes/recordingRoutes.js";

dotenv.config();
const app = express();

// Enable JSON
app.use(express.json());

// CORS for production + local development
app.use(
  cors({
    origin: [process.env.FRONTEND_URL, "http://localhost:5173"],
    credentials: true,
  })
);

// Connect database
connectDB();

// Routes
app.use("/api/auth", authRoute);
app.use("/api/recordings", recordingRoutes);

// Server port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
