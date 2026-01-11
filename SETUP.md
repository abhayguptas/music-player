# Music Player - Quick Setup Guide

## 🚀 Quick Start (2 Options)

### Option 1: Just Try It (Limited Features)
1. Simply open `index.html` in your browser
2. Search will show a helpful message
3. Songs won't play from real sources

### Option 2: Full Setup with Real Music (Recommended)

#### Step 1: Install Dependencies
Open terminal in the `music-player` folder and run:
```bash
npm install
```

#### Step 2: Start the Backend Server
```bash
node server.js
```

You should see:
```
🎵 Music Player Server running on http://localhost:3000
```

#### Step 3: Open the Music Player
Open `index.html` in your browser, or go to:
```
http://localhost:3000/player
```

#### Step 4: Start Searching!
- Search for any song: "Blinding Lights"
- Search for Bollywood: "Kesariya Brahmastra"
- Search for artist: "Arijit Singh songs"
- Search for regional: "Tamil songs 2024"

## 🎵 Features

✅ **Real YouTube Music Search** - Get actual songs from YouTube
✅ **High Quality Audio** - Streams best available audio quality
✅ **Play/Pause/Skip** - Full playback controls
✅ **Favorites** - Save your favorite songs
✅ **History** - Auto-saves listening history
✅ **Indian Music Support** - Bollywood, Punjabi, Tamil, Telugu, etc.
✅ **Offline Storage** - All data stored locally

## 🔍 Search Examples

| Type | Example Search |
|------|----------------|
| Song Name | "Tum Hi Ho" |
| Artist | "Arijit Singh latest" |
| Bollywood | "Kesariya Brahmastra" |
| Album | "Rockstar movie songs" |
| Regional | "Tamil romantic songs" |
| Western | "The Weeknd greatest hits" |

## 🛠️ Troubleshooting

### Server won't start?
- Make sure Node.js is installed: `node --version`
- Install dependencies: `npm install`
- Check if port 3000 is free

### Songs won't play?
- Make sure the server is running
- Check browser console for errors (F12)
- Try refreshing the page
- Some songs may be region-restricted

### Search not working?
- Check your internet connection
- The server needs to be running
- Look at terminal for error messages

## 📝 Notes

- First search might take a few seconds
- Some songs may not be available due to YouTube restrictions
- All favorites and history are stored in your browser's local storage
- Works best in Chrome, Firefox, or Edge

## 🎯 Tips for Best Experience

1. **Be Specific**: Instead of "love song", try "Tum Hi Ho Arijit Singh"
2. **Add Artist Name**: "Kesariya Brahmastra" works better than just "Kesariya"
3. **Use Official Names**: Search for official song names for best results
4. **Internet Required**: You need internet for searching and streaming

## 📂 Project Structure

```
music-player/
├── index.html      # Main player interface
├── style.css       # Beautiful styling
├── script.js       # Player logic & search
├── server.js       # Backend server for YouTube
├── package.json    # Dependencies
└── README.md       # This file
```

## ❤️ Enjoy Your Music!

Now you can search and play any song - Western or Indian! 🎶
