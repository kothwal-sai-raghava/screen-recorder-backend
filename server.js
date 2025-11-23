import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoute from "./routes/auth.js";
import cors from "cors";
import recordingRoutes from "./routes/recordingRoutes.js";

dotenv.config();
const app=express();
app.use(express.json());
app.use(cors({
    origin:"http://localhost:5173",
  credentials: true
}));
connectDB();

app.use("/api/auth",authRoute);
app.use("/api/recordings", recordingRoutes);

const PORT=process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log(`server running at ${PORT}`)
})