import express from "express";
import multer from "multer";
import { uploadRecording, getRecordings, streamRecording, deleteRecording, deleteAllRecordings } from "../controllers/recordingControllers.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/",protect, upload.single("video"), uploadRecording);
router.get("/", protect,getRecordings);
router.get("/:id", protect, streamRecording);
router.delete("/:id",protect,deleteRecording);
router.delete("/",protect,deleteAllRecordings);

export default router;
