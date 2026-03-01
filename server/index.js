require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const imageRoutes = require("./routes/images");
const savedRoutes = require("./routes/saved");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("⚠️  MongoDB not connected (saved images feature disabled):", err.message));

// Routes
app.use("/api/images", imageRoutes);
app.use("/api/saved", savedRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
