const express = require('express');
const cors = require('cors');
const ytsearch = require('yt-search');
const path = require('path');
const { spawn } = require('child_process');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Serve the music player HTML
app.get('/player', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Search for songs on YouTube
app.get('/search', async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) {
            return res.status(400).json({ error: 'Query parameter is required' });
        }

        console.log(`🔍 Searching for: "${query}"`);
        
        const searchResults = await ytsearch(query);
        const videos = searchResults.videos.slice(0, 20);

        // Filter for better music results
        const filteredVideos = videos.filter(video => {
            const title = video.title.toLowerCase();
            const author = video.author.name.toLowerCase();
            
            // Prefer music content
            return (
                !title.includes('trailer') &&
                !title.includes('review') &&
                !title.includes('reaction') &&
                (title.includes('official') ||
                 title.includes('audio') ||
                 title.includes('music') ||
                 title.includes('video') ||
                 title.includes('lyric') ||
                 title.includes('song') ||
                 author.includes('topic') ||
                 author.includes('vevo') ||
                 author.includes('official') ||
                 author.includes('music'))
            );
        });

        const finalVideos = filteredVideos.length > 5 ? filteredVideos : videos;

        const results = finalVideos.slice(0, 15).map(video => ({
            id: video.videoId,
            title: video.title,
            artist: video.author.name,
            duration: video.timestamp ? parseDuration(video.timestamp) : 0,
            thumbnail: video.thumbnail || `https://i.ytimg.com/vi/${video.videoId}/mqdefault.jpg`,
            url: `http://localhost:${PORT}/stream/${video.videoId}`,
            views: video.views || 0
        }));

        console.log(`✅ Found ${results.length} results`);
        res.json(results);
    } catch (error) {
        console.error('❌ Search error:', error);
        res.status(500).json({ error: 'Failed to search for songs' });
    }
});

// Stream audio from YouTube using yt-dlp
app.get('/stream/:videoId', async (req, res) => {
    try {
        const videoId = req.params.videoId;
        const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
        
        console.log(`🎵 Streaming: ${videoId}`);

        // Set proper headers
        res.setHeader('Content-Type', 'audio/webm');
        res.setHeader('Content-Disposition', 'inline');
        res.setHeader('Accept-Ranges', 'bytes');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Range');
        res.setHeader('Cache-Control', 'public, max-age=3600');

        // Use yt-dlp to stream audio directly
        // yt-dlp -f "bestaudio[ext=m4a]/bestaudio" -o - <url>
        const ytdlp = spawn('yt-dlp', [
            '-f', 'bestaudio[ext=m4a]/bestaudio/best',
            '-o', '-',
            '--no-playlist',
            videoUrl
        ], {
            stdio: ['ignore', 'pipe', 'pipe']
        });

        ytdlp.stdout.pipe(res);

        ytdlp.stderr.on('data', (data) => {
            // yt-dlp outputs progress to stderr, we can ignore most of it
            const output = data.toString();
            if (output.includes('ERROR') || output.includes('WARNING')) {
                console.log('yt-dlp:', output.trim());
            }
        });

        ytdlp.on('error', (error) => {
            console.error('❌ yt-dlp error:', error);
            if (!res.headersSent) {
                res.status(500).json({ error: 'yt-dlp not found. Please install: brew install yt-dlp (Mac) or pip install yt-dlp' });
            }
        });

        ytdlp.on('close', (code) => {
            if (code !== 0 && !res.headersSent) {
                console.error(`❌ yt-dlp exited with code ${code}`);
                res.status(500).json({ error: 'Failed to stream audio' });
            }
        });

        res.on('close', () => {
            ytdlp.kill();
        });

        console.log(`✅ Streaming audio via yt-dlp`);

    } catch (error) {
        console.error('❌ Stream error:', error);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Failed to stream audio: ' + error.message });
        }
    }
});

// Get video info using yt-search (already working)
app.get('/info/:videoId', async (req, res) => {
    try {
        const videoId = req.params.videoId;
        const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

        // Use yt-search to get video info
        const searchResults = await ytsearch({ videoId: videoId });
        
        if (!searchResults || !searchResults.videos || searchResults.videos.length === 0) {
            return res.status(500).json({ error: 'Failed to get video info' });
        }

        const video = searchResults.videos[0];
        
        res.json({
            title: video.title || 'Unknown',
            artist: video.author?.name || 'Unknown',
            duration: video.timestamp ? parseDuration(video.timestamp) : 0,
            thumbnail: video.thumbnail || `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`,
            views: video.views || 0,
            description: ''
        });
    } catch (error) {
        console.error('❌ Info error:', error);
        res.status(500).json({ error: 'Failed to get video info: ' + error.message });
    }
});

function parseDuration(timestamp) {
    if (!timestamp) return 0;
    
    const parts = timestamp.split(':').reverse();
    let seconds = 0;
    
    if (parts[0]) seconds += parseInt(parts[0]);
    if (parts[1]) seconds += parseInt(parts[1]) * 60;
    if (parts[2]) seconds += parseInt(parts[2]) * 3600;
    
    return seconds;
}

app.listen(PORT, () => {
    console.log('\n🎵 ═══════════════════════════════════════════════════════');
    console.log('   Music Player Server is RUNNING!');
    console.log('═══════════════════════════════════════════════════════\n');
    console.log(`✅ Server URL: http://localhost:${PORT}`);
    console.log(`🎵 Music Player: http://localhost:${PORT}/player`);
    console.log(`🔍 Search API: http://localhost:${PORT}/search?q=<query>`);
    console.log(`📡 Stream API: http://localhost:${PORT}/stream/<videoId>\n`);
    console.log('🌟 Ready to play music! Open the player URL in your browser.');
    console.log('═══════════════════════════════════════════════════════\n');
});

