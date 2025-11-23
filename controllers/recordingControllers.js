import Recording from "../models/Recording.js";

export const uploadRecording = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No video uploaded" });
    }
    if (!userId) return res.status(400).json({ success: false, message: "User ID missing" });

    const allowedTypes = ["video/webm", "video/mp4"];
    if (!allowedTypes.includes(req.file.mimetype)) {
        return res.status(400).json({ success: false, message: "Invalid file type" });
    }
    if (req.file.size > 100 * 1024 * 1024) {
    return res.status(400).json({ success: false, message: "File too large" });
    }

    const newRecording = new Recording({
      userId,
      video: req.file.buffer,
      createdAt: new Date(),
    });

    await newRecording.save();
    res.json({ success: true, message: "Recording saved", id: newRecording._id });

  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};



export const getRecordings = async (req, res) => {
  try {
    const userId = req.user.id;
    const recordings = await Recording.find({ userId }).select("_id createdAt");
    res.json({ success: true, recordings });

  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};


export const streamRecording = async (req, res) => {
  try {
    const { id } = req.params;
    const recording = await Recording.findById(id);

    if (!recording) {
      return res.status(404).json({ success: false, message: "Recording not found" });
    }

    res.setHeader("Content-Type", "video/webm");
    res.send(recording.video);

  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};


export const deleteRecording = async (req, res) => {
  try {
    const { id } = req.params;

    const recording = await Recording.findById(id);
    if (!recording) {
      return res.status(404).json({ success: false, message: "Recording not found" });
    }

    await Recording.findByIdAndDelete(id);

    res.json({ success: true, message: "Recording deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteAllRecordings = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) return res.status(400).json({ success: false, message: "User ID missing" });

    const result = await Recording.deleteMany({ userId });
    res.json({ success: true, message: `${result.deletedCount} recordings deleted` });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
