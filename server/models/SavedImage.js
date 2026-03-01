const mongoose = require("mongoose");

const savedImageSchema = new mongoose.Schema(
  {
    unsplashId: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      default: "Untitled",
    },
    imageUrl: {
      type: String,
      required: true,
    },
    thumbnailUrl: {
      type: String,
      required: true,
    },
    downloadUrl: {
      type: String,
      required: true,
    },
    photographer: {
      type: String,
      required: true,
    },
    photographerProfile: {
      type: String,
    },
    width: Number,
    height: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("SavedImage", savedImageSchema);
