import mongoose from "mongoose";

const RecordingSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  video: { type: Buffer, required: true },
  createdAt: Date,
});

export default mongoose.model("Recording", RecordingSchema);
