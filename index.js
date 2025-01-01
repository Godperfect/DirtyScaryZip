const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

// Replace this with your YouTube Data API key
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || "AIzaSyClkCIjpL3vAg0VZj2jDhzIIsgmXc1SQUM";

// Middleware
app.use(cors());

// Home route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the YouTube Video Downloader API",
    usage: "Use /video?url=YOUTUBE_VIDEO_URL to fetch video info",
  });
});

// Fetch video information and provide a link
app.get("/video", async (req, res) => {
  const videoUrl = req.query.url;

  if (!videoUrl) {
    return res.status(400).json({ error: "URL parameter is required" });
  }

  // Extract video ID from URL
  const videoId = videoUrl.split("v=")[1]?.split("&")[0] || videoUrl.split("shorts/")[1];

  if (!videoId) {
    return res.status(400).json({ error: "Invalid YouTube URL provided." });
  }

  try {
    // Fetch video details from YouTube API
    const videoDetailsUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${YOUTUBE_API_KEY}&part=snippet,contentDetails`;

    const response = await axios.get(videoDetailsUrl);
    const videoData = response.data;

    if (!videoData.items || videoData.items.length === 0) {
      return res.status(404).json({ error: "Video not found." });
    }

    const videoTitle = videoData.items[0].snippet.title;
    const sanitizedTitle = videoTitle.replace(/[^a-zA-Z0-9 ]/g, "");
    const downloadUrl = `https://www.youtube.com/watch?v=${videoId}`;

    res.json({
      success: true,
      title: sanitizedTitle,
      downloadUrl,
    });
  } catch (error) {
    console.error("Error fetching video details:", error.message);
    res.status(500).json({ error: "Failed to fetch video details." });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
