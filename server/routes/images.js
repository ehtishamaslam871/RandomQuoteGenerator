const express = require("express");
const router = express.Router();
const axios = require("axios");

const UNSPLASH_BASE = "https://api.unsplash.com";
const ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

// Search images
router.get("/search", async (req, res) => {
  try {
    const { query, page = 1, per_page = 30 } = req.query;

    if (!query) {
      return res.status(400).json({ error: "Search query is required" });
    }

    const response = await axios.get(`${UNSPLASH_BASE}/search/photos`, {
      params: { query, page, per_page },
      headers: { Authorization: `Client-ID ${ACCESS_KEY}` },
    });

    const images = response.data.results.map((img) => ({
      id: img.id,
      description: img.alt_description || img.description || "Untitled",
      imageUrl: img.urls.regular,
      thumbnailUrl: img.urls.small,
      fullUrl: img.urls.full,
      downloadUrl: img.links.download,
      photographer: img.user.name,
      photographerProfile: img.user.links.html,
      photographerAvatar: img.user.profile_image.small,
      width: img.width,
      height: img.height,
      likes: img.likes,
      color: img.color,
    }));

    res.json({
      images,
      totalPages: response.data.total_pages,
      total: response.data.total,
    });
  } catch (error) {
    console.error("Search error:", error.message);
    res.status(500).json({ error: "Failed to search images" });
  }
});

// Get random/trending images (homepage)
router.get("/random", async (req, res) => {
  try {
    const { count = 30 } = req.query;

    const response = await axios.get(`${UNSPLASH_BASE}/photos`, {
      params: { per_page: count, order_by: "popular" },
      headers: { Authorization: `Client-ID ${ACCESS_KEY}` },
    });

    const images = response.data.map((img) => ({
      id: img.id,
      description: img.alt_description || img.description || "Untitled",
      imageUrl: img.urls.regular,
      thumbnailUrl: img.urls.small,
      fullUrl: img.urls.full,
      downloadUrl: img.links.download,
      photographer: img.user.name,
      photographerProfile: img.user.links.html,
      photographerAvatar: img.user.profile_image.small,
      width: img.width,
      height: img.height,
      likes: img.likes,
      color: img.color,
    }));

    res.json({ images });
  } catch (error) {
    console.error("Random images error:", error.message);
    res.status(500).json({ error: "Failed to fetch images" });
  }
});

// Download image (triggers Unsplash download tracking + returns blob)
router.get("/download", async (req, res) => {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({ error: "Download URL is required" });
    }

    // Trigger Unsplash download endpoint for proper attribution
    await axios
      .get(`${url}`, {
        headers: { Authorization: `Client-ID ${ACCESS_KEY}` },
      })
      .catch(() => {});

    // Fetch the actual image
    const imageResponse = await axios.get(url, {
      responseType: "stream",
      headers: { Authorization: `Client-ID ${ACCESS_KEY}` },
    });

    res.setHeader("Content-Type", "image/jpeg");
    res.setHeader("Content-Disposition", "attachment; filename=unsplash-image.jpg");
    imageResponse.data.pipe(res);
  } catch (error) {
    console.error("Download error:", error.message);
    res.status(500).json({ error: "Failed to download image" });
  }
});

module.exports = router;
