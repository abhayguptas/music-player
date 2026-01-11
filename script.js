// Storage Manager
const Storage = {
    get(key) {
        try {
            return JSON.parse(localStorage.getItem(key)) || [];
        } catch {
            return [];
        }
    },
    set(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    },
    add(key, item) {
        const data = this.get(key);
        data.unshift(item);
        this.set(key, data);
    },
    remove(key, id) {
        const data = this.get(key);
        const filtered = data.filter(item => item.id !== id);
        this.set(key, filtered);
    },
    exists(key, id) {
        const data = this.get(key);
        return data.some(item => item.id === id);
    }
};

// Music Player Class
class MusicPlayer {
    constructor() {
        this.audio = document.getElementById('audioPlayer');
        this.currentSong = null;
        this.playlist = [];
        this.currentIndex = -1;
        this.isPlaying = false;
        
        this.initElements();
        this.initEventListeners();
        this.loadFavorites();
        this.loadHistory();
    }

    initElements() {
        // Player controls
        this.playPauseBtn = document.getElementById('playPauseBtn');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.favoriteBtn = document.getElementById('favoriteBtn');
        this.progressBar = document.getElementById('progressBar');
        this.volumeBar = document.getElementById('volumeBar');
        
        // Player info
        this.playerTitle = document.getElementById('playerTitle');
        this.playerArtist = document.getElementById('playerArtist');
        this.playerArt = document.getElementById('playerArt');
        this.currentTime = document.getElementById('currentTime');
        this.duration = document.getElementById('duration');
        this.progress = document.getElementById('progress');
        
        // Search
        this.searchInput = document.getElementById('searchInput');
        this.searchBtn = document.getElementById('searchBtn');
        this.searchResults = document.getElementById('searchResults');
        
        // Lists
        this.favoritesList = document.getElementById('favoritesList');
        this.historyList = document.getElementById('historyList');
        
        // Tabs
        this.tabBtns = document.querySelectorAll('.tab-btn');
        
        // Loading
        this.loadingOverlay = document.getElementById('loadingOverlay');
    }

    initEventListeners() {
        // Player controls
        this.playPauseBtn.addEventListener('click', () => this.togglePlay());
        this.prevBtn.addEventListener('click', () => this.playPrevious());
        this.nextBtn.addEventListener('click', () => this.playNext());
        this.favoriteBtn.addEventListener('click', () => this.toggleFavorite());
        
        // Audio events
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('loadedmetadata', () => this.updateDuration());
        this.audio.addEventListener('ended', () => this.playNext());
        
        // Progress bar
        this.progressBar.addEventListener('input', (e) => this.seek(e));
        
        // Volume
        this.volumeBar.addEventListener('input', (e) => this.setVolume(e));
        this.audio.volume = 0.7;
        
        // Search
        this.searchBtn.addEventListener('click', () => this.search());
        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.search();
        });
        
        // Tabs
        this.tabBtns.forEach(btn => {
            btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
        });
    }

    async search() {
        const query = this.searchInput.value.trim();
        if (!query) return;
        
        this.showLoading();
        try {
            // Using YouTube Music API through a proxy
            const results = await this.searchYouTube(query);
            this.displaySearchResults(results);
        } catch (error) {
            console.error('Search error:', error);
            this.searchResults.innerHTML = '<div class="empty-state"><i class="fas fa-exclamation-circle"></i><p>Search failed. Please try again.</p></div>';
        } finally {
            this.hideLoading();
        }
    }

    async searchYouTube(query) {
        try {
            console.log('Searching for:', query);
            
            // Use local server's search endpoint
            const response = await fetch(`http://localhost:3000/search?q=${encodeURIComponent(query)}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log('Got results:', data.length);
                if (data && data.length > 0) {
                    return data;
                }
            } else {
                throw new Error(`Search failed with status: ${response.status}`);
            }

            // If no results, show message
            console.log('No results found');
            return [];
        } catch (error) {
            console.error('Search error:', error);
            // Show helpful error message
            this.searchResults.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>Could not connect to search server.</p>
                    <p style="font-size: 14px; margin-top: 10px;">Make sure the server is running:</p>
                    <ol style="text-align: left; max-width: 500px; margin: 20px auto;">
                        <li>Open terminal in the music-player folder</li>
                        <li>Run: <code>npm install</code> (if not done already)</li>
                        <li>Run: <code>node server.js</code></li>
                        <li>Refresh this page</li>
                    </ol>
                </div>
            `;
            return [];
        }
    }

    generateMockResults(query) {
        // Generate mock results for demonstration with diverse artists
        const westernArtists = ['The Weeknd', 'Taylor Swift', 'Drake', 'Ed Sheeran', 'Ariana Grande', 'Post Malone'];
        const indianArtists = ['Arijit Singh', 'Atif Aslam', 'Shreya Ghoshal', 'Sonu Nigam', 'Neha Kakkar', 'Armaan Malik'];
        
        // Detect if query is likely Indian music
        const indianKeywords = ['hindi', 'bollywood', 'punjabi', 'tamil', 'telugu', 'arijit', 'shreya', 'kumar', 'singh', 'desi', 'indian'];
        const isIndianQuery = indianKeywords.some(keyword => query.toLowerCase().includes(keyword));
        
        const artists = isIndianQuery ? indianArtists : westernArtists;
        const results = [];
        
        for (let i = 0; i < 10; i++) {
            const artist = artists[Math.floor(Math.random() * artists.length)];
            results.push({
                id: `song_${Date.now()}_${i}`,
                title: `${query} ${i + 1}`,
                artist: artist,
                duration: Math.floor(Math.random() * 180) + 120, // 2-5 minutes
                thumbnail: `https://picsum.photos/seed/${query}${i}/200/200`,
                // For demo, using a free audio URL - replace with actual music source
                url: `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${(i % 16) + 1}.mp3`
            });
        }
        
        return results;
    }

    displaySearchResults(results) {
        if (results.length === 0) {
            this.searchResults.innerHTML = '<div class="empty-state"><i class="fas fa-search"></i><p>No results found</p></div>';
            return;
        }

        this.playlist = results;
        this.searchResults.innerHTML = '';
        
        results.forEach((song, index) => {
            const songEl = this.createSongElement(song, index);
            this.searchResults.appendChild(songEl);
        });
    }

    createSongElement(song, index) {
        const div = document.createElement('div');
        div.className = 'song-item';
        if (this.currentSong && this.currentSong.id === song.id && this.isPlaying) {
            div.classList.add('playing');
        }
        
        const isFavorited = Storage.exists('favorites', song.id);
        
        div.innerHTML = `
            <img src="${song.thumbnail}" alt="${song.title}">
            <div class="song-info">
                <div class="song-name">${song.title}</div>
                <div class="song-artist">${song.artist}</div>
            </div>
            <span class="song-duration">${this.formatTime(song.duration)}</span>
            <div class="song-actions">
                <button class="action-btn fav-btn ${isFavorited ? 'favorited' : ''}" data-id="${song.id}">
                    <i class="fa${isFavorited ? 's' : 'r'} fa-heart"></i>
                </button>
            </div>
        `;
        
        div.addEventListener('click', (e) => {
            if (!e.target.closest('.action-btn')) {
                this.playSong(song, index);
            }
        });
        
        const favBtn = div.querySelector('.fav-btn');
        favBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleSongFavorite(song, favBtn);
        });
        
        return div;
    }

    playSong(song, index = -1) {
        console.log('Playing song:', song.title);
        this.currentSong = song;
        this.currentIndex = index;
        
        // Show loading
        this.showLoading();
        
        // Remove previous event listeners by cloning the audio element
        const oldAudio = this.audio;
        const newAudio = oldAudio.cloneNode();
        newAudio.crossOrigin = 'anonymous';
        oldAudio.parentNode.replaceChild(newAudio, oldAudio);
        this.audio = newAudio;
        
        // Re-attach event listeners
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('loadedmetadata', () => this.updateDuration());
        this.audio.addEventListener('ended', () => this.playNext());
        this.audio.volume = 0.7;
        
        // Set the audio source
        console.log('Setting audio source to:', song.url);
        this.audio.src = song.url;
        
        // Handle loading
        const onLoadedData = () => {
            console.log('Audio loaded successfully');
            this.hideLoading();
        };
        
        const onCanPlay = () => {
            console.log('Audio can play');
            this.hideLoading();
        };
        
        this.audio.addEventListener('loadeddata', onLoadedData, { once: true });
        this.audio.addEventListener('canplay', onCanPlay, { once: true });
        
        // Handle errors with more details
        const onError = (e) => {
            console.error('Audio load error:', e);
            console.error('Error details:', {
                error: this.audio.error,
                code: this.audio.error?.code,
                message: this.audio.error?.message,
                networkState: this.audio.networkState,
                readyState: this.audio.readyState
            });
            this.hideLoading();
            
            let errorMsg = `Cannot play "${song.title}".\n\n`;
            if (this.audio.error) {
                switch(this.audio.error.code) {
                    case 1: errorMsg += 'Error: MEDIA_ERR_ABORTED - The user aborted the audio.'; break;
                    case 2: errorMsg += 'Error: MEDIA_ERR_NETWORK - A network error occurred. Check your connection and make sure the server is running.'; break;
                    case 3: errorMsg += 'Error: MEDIA_ERR_DECODE - The audio file is corrupted or unsupported format.'; break;
                    case 4: errorMsg += 'Error: MEDIA_ERR_SRC_NOT_SUPPORTED - The audio source is not supported.'; break;
                    default: errorMsg += `Error code: ${this.audio.error.code}`;
                }
            } else {
                errorMsg += 'The audio source may be unavailable.\n\nPlease try:\n1. Another song\n2. Make sure the server is running (node server.js)';
            }
            alert(errorMsg);
            this.isPlaying = false;
            this.updatePlayPauseButton();
        };
        
        this.audio.addEventListener('error', onError, { once: true });
        
        // Try to play
        const playPromise = this.audio.play();
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    console.log('Playback started');
                    this.isPlaying = true;
                    this.updatePlayerInfo();
                    this.updatePlayPauseButton();
                    this.updateFavoriteButton();
                    this.addToHistory(song);
                    this.updatePlayingState();
                })
                .catch(err => {
                    console.error('Play error:', err);
                    this.hideLoading();
                    this.isPlaying = false;
                    this.updatePlayPauseButton();
                    alert(`Cannot play "${song.title}". Error: ${err.message}`);
                });
        }
    }

    togglePlay() {
        if (!this.currentSong) return;
        
        if (this.isPlaying) {
            this.audio.pause();
            this.isPlaying = false;
        } else {
            this.audio.play();
            this.isPlaying = true;
        }
        
        this.updatePlayPauseButton();
        this.updatePlayingState();
    }

    playNext() {
        if (this.playlist.length === 0) return;
        
        this.currentIndex = (this.currentIndex + 1) % this.playlist.length;
        this.playSong(this.playlist[this.currentIndex], this.currentIndex);
    }

    playPrevious() {
        if (this.playlist.length === 0) return;
        
        this.currentIndex = this.currentIndex <= 0 ? this.playlist.length - 1 : this.currentIndex - 1;
        this.playSong(this.playlist[this.currentIndex], this.currentIndex);
    }

    toggleFavorite() {
        if (!this.currentSong) return;
        
        if (Storage.exists('favorites', this.currentSong.id)) {
            Storage.remove('favorites', this.currentSong.id);
        } else {
            Storage.add('favorites', this.currentSong);
        }
        
        this.updateFavoriteButton();
        this.loadFavorites();
    }

    toggleSongFavorite(song, button) {
        if (Storage.exists('favorites', song.id)) {
            Storage.remove('favorites', song.id);
            button.classList.remove('favorited');
            button.innerHTML = '<i class="far fa-heart"></i>';
        } else {
            Storage.add('favorites', song);
            button.classList.add('favorited');
            button.innerHTML = '<i class="fas fa-heart"></i>';
        }
        
        this.loadFavorites();
        if (this.currentSong && this.currentSong.id === song.id) {
            this.updateFavoriteButton();
        }
    }

    addToHistory(song) {
        const history = Storage.get('history');
        const existing = history.findIndex(item => item.id === song.id);
        
        if (existing !== -1) {
            history.splice(existing, 1);
        }
        
        Storage.add('history', {
            ...song,
            playedAt: Date.now()
        });
        
        this.loadHistory();
    }

    loadFavorites() {
        const favorites = Storage.get('favorites');
        
        if (favorites.length === 0) {
            this.favoritesList.innerHTML = '<div class="empty-state"><i class="fas fa-heart"></i><p>No favorites yet</p></div>';
            return;
        }
        
        this.favoritesList.innerHTML = '';
        favorites.forEach((song, index) => {
            const songEl = this.createSongElement(song, index);
            this.favoritesList.appendChild(songEl);
        });
    }

    loadHistory() {
        const history = Storage.get('history');
        
        if (history.length === 0) {
            this.historyList.innerHTML = '<div class="empty-state"><i class="fas fa-history"></i><p>No listening history</p></div>';
            return;
        }
        
        this.historyList.innerHTML = '';
        history.forEach((song, index) => {
            const songEl = this.createSongElement(song, index);
            this.historyList.appendChild(songEl);
        });
    }

    updatePlayerInfo() {
        if (!this.currentSong) return;
        
        this.playerTitle.textContent = this.currentSong.title;
        this.playerArtist.textContent = this.currentSong.artist;
        this.playerArt.src = this.currentSong.thumbnail;
    }

    updatePlayPauseButton() {
        const icon = this.playPauseBtn.querySelector('i');
        icon.className = this.isPlaying ? 'fas fa-pause' : 'fas fa-play';
    }

    updateFavoriteButton() {
        if (!this.currentSong) return;
        
        const icon = this.favoriteBtn.querySelector('i');
        const isFavorited = Storage.exists('favorites', this.currentSong.id);
        icon.className = isFavorited ? 'fas fa-heart' : 'far fa-heart';
    }

    updateProgress() {
        if (!this.audio.duration) return;
        
        const percent = (this.audio.currentTime / this.audio.duration) * 100;
        this.progressBar.value = percent;
        this.progress.style.width = percent + '%';
        this.currentTime.textContent = this.formatTime(this.audio.currentTime);
    }

    updateDuration() {
        this.duration.textContent = this.formatTime(this.audio.duration);
    }

    seek(e) {
        const time = (e.target.value / 100) * this.audio.duration;
        this.audio.currentTime = time;
    }

    setVolume(e) {
        this.audio.volume = e.target.value / 100;
    }

    updatePlayingState() {
        document.querySelectorAll('.song-item').forEach(item => {
            item.classList.remove('playing');
        });
        
        if (this.currentSong && this.isPlaying) {
            document.querySelectorAll('.song-item').forEach(item => {
                const songTitle = item.querySelector('.song-name').textContent;
                if (songTitle === this.currentSong.title) {
                    item.classList.add('playing');
                }
            });
        }
    }

    switchTab(tabName) {
        // Update tab buttons
        this.tabBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });
        
        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.toggle('active', content.id === tabName);
        });
    }

    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    showLoading() {
        this.loadingOverlay.classList.add('show');
    }

    hideLoading() {
        this.loadingOverlay.classList.remove('show');
    }
}

// Initialize the music player when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new MusicPlayer();
});
