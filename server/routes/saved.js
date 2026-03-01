const express = require("express");
const router = express.Router();
const SavedImage = require("../models/SavedImage");

// Get all saved/bookmarked images
router.get("/", async (req, res) => {
  try {
    const saved = await SavedImage.find().sort({ createdAt: -1 });
    res.json({ images: saved });
  } catch (error) {
    console.error("Fetch saved error:", error.message);
    res.status(500).json({ error: "Failed to fetch saved images" });
  }
});

// Save/bookmark an image
router.post("/", async (req, res) => {
  try {
    const existing = await SavedImage.findOne({ unsplashId: req.body.unsplashId });
    if (existing) {
      return res.status(409).json({ error: "Image already saved" });
    }

    const saved = await SavedImage.create(req.body);
    res.status(201).json(saved);
  } catch (error) {
    console.error("Save error:", error.message);
    res.status(500).json({ error: "Failed to save image" });
  }
});

// Remove a saved image
router.delete("/:unsplashId", async (req, res) => {
  try {
    await SavedImage.findOneAndDelete({ unsplashId: req.params.unsplashId });
    res.json({ message: "Removed successfully" });
  } catch (error) {
    console.error("Delete error:", error.message);
    res.status(500).json({ error: "Failed to remove image" });
  }
});

module.exports = router;
