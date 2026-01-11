# Music Player

A beautiful, feature-rich music player web application with search, play, pause, favorites, and history features.

## Features

✨ **Exact Search** - Search for any song (Western or Indian) and get accurate results
🎵 **Play/Pause** - Full playback controls with progress tracking
❤️ **Favorites** - Save your favorite songs locally
📜 **History** - Keep track of recently played songs
🎨 **Beautiful UI** - Modern, gradient design with smooth animations
💾 **Local Storage** - All data stored locally in your browser
📱 **Responsive** - Works on desktop and mobile devices
🌏 **Multi-Language Support** - Works great with Bollywood, Punjabi, Tamil, Telugu, and other Indian songs

## Search Tips

- For exact songs: `"Tum Hi Ho" Arijit Singh`
- For Bollywood songs: `Kesariya Brahmastra`
- For regional music: `Kannana Kanne Tamil song`
- For Western music: `Blinding Lights The Weeknd`

## Installation & Usage

### Option 1: Simple Setup (Demo Mode)

1. Open `index.html` in your web browser
2. The app will work with demo audio files

### Option 2: Full Setup with YouTube Integration

To enable real YouTube music search and playback:

1. Install Node.js dependencies:
```bash
cd music-player
npm init -y
npm install express cors ytdl-core yt-search
```

2. Create and run the backend server:
```bash
node server.js
```

3. Open `index.html` in your browser

4. Update the `searchYouTube` function in `script.js` to use the backend:
```javascript
async searchYouTube(query) {
    const response = await fetch(`http://localhost:3000/search?q=${encodeURIComponent(query)}`);
    const data = await response.json();
    return data;
}
```

## File Structure

```
music-player/
├── index.html      # Main HTML file
├── style.css       # Styling and animations
├── script.js       # Music player logic
├── server.js       # Backend server for YouTube integration
└── README.md       # This file
```

## Features Explanation

### Search
- Type any song name or artist in the search bar
- Press Enter or click the search button
- Results will display with thumbnails and duration

### Playback Controls
- **Play/Pause** - Toggle playback of current song
- **Next/Previous** - Navigate through the playlist
- **Progress Bar** - Seek to any position in the song
- **Volume Control** - Adjust the playback volume

### Favorites
- Click the heart icon on any song to add to favorites
- Access your favorites from the Favorites tab
- Remove from favorites by clicking the heart icon again

### History
- All played songs are automatically saved to history
- View your listening history in the History tab
- Most recent songs appear first

## Storage

All data is stored locally using browser's LocalStorage:
- Favorites: `favorites`
- History: `history`

No data is sent to external servers (except for song search when using YouTube integration).

## Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Opera: ✅ Full support

## Notes

- The demo version uses SoundHelix free music samples
- For full YouTube integration, you'll need to set up the backend server
- Make sure to comply with YouTube's Terms of Service when using their content

## Future Enhancements

- [ ] Playlist creation and management
- [ ] Shuffle and repeat modes
- [ ] Download songs for offline playback
- [ ] Equalizer and audio effects
- [ ] Social sharing features
- [ ] Lyrics display

## License

Free to use for personal and educational purposes.
