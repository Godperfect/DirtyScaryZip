const express = require('express');
const ytdl = require('ytdl-core');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all requests
app.use(cors());

// API endpoint for downloading videos
app.get('/video', async (req, res) => {
    const videoUrl = req.query.url;

    if (!videoUrl) {
        return res.status(400).json({ error: 'URL parameter is required' });
    }

    try {
        const videoInfo = await ytdl.getInfo(videoUrl); // Get video info
        const title = videoInfo.videoDetails.title.replace(/[^a-zA-Z0-9 ]/g, ''); // Sanitize title

        // Set headers to initiate download
        res.header('Content-Disposition', `attachment; filename="${title}.mp4"`);
        res.header('Content-Type', 'video/mp4');

        // Pipe video to response
        ytdl(videoUrl, { format: 'mp4' }).pipe(res);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to download the video. Check the URL.' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});