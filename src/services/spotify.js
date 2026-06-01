// Spotify API Service - Fetches real-time artist data

const SPOTIFY_ARTIST_ID = '4xwROKTcnt5K1GmLitjPz4';
const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

// Cache for access token
let tokenCache = null;
let tokenExpiry = null;

// Spotify API Client Credentials Flow
const getSpotifyAccessToken = async () => {
  // Return cached token if still valid
  if (tokenCache && tokenExpiry && Date.now() < tokenExpiry) {
    return tokenCache;
  }

  try {
    console.log('Fetching new Spotify access token...');
    console.log('Client ID:', CLIENT_ID ? 'Present' : 'Missing');
    console.log('Client Secret:', CLIENT_SECRET ? 'Present' : 'Missing');

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET)
      },
      body: 'grant_type=client_credentials'
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Token error:', errorData);
      throw new Error('Failed to get access token: ' + response.status);
    }

    const data = await response.json();
    tokenCache = data.access_token;
    tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000; // Refresh 1 min early
    console.log('Access token obtained successfully');
    return tokenCache;
  } catch (error) {
    console.error('Error getting Spotify access token:', error);
    return null;
  }
};

// Fetch artist data from Spotify API
export const getArtistData = async () => {
  try {
    const token = await getSpotifyAccessToken();

    if (!token) {
      throw new Error('Failed to get access token');
    }

    const response = await fetch(
      `https://api.spotify.com/v1/artists/${SPOTIFY_ARTIST_ID}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch artist data');
    }

    const data = await response.json();

    return {
      followers: data.followers.total,
      // Note: Monthly listeners is not available via standard API
      // We'll use a fallback or scraping method
      monthlyListeners: null,
      name: data.name,
      genres: data.genres,
      popularity: data.popularity,
      imageUrl: data.images[0]?.url
    };
  } catch (error) {
    console.error('Error fetching artist data:', error);
    // Return fallback data
    return {
      followers: 372,
      monthlyListeners: 668,
      name: 'Pratyaksh Bharadwaj',
      genres: [],
      popularity: 0,
      imageUrl: null
    };
  }
};

// Fetch top tracks
export const getTopTracks = async () => {
  try {
    const token = await getSpotifyAccessToken();

    if (!token) {
      throw new Error('Failed to get access token');
    }

    const response = await fetch(
      `https://api.spotify.com/v1/artists/${SPOTIFY_ARTIST_ID}/top-tracks?market=IN`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch top tracks');
    }

    const data = await response.json();

    return data.tracks.map(track => ({
      name: track.name,
      album: track.album.name,
      image: track.album.images[0]?.url,
      url: track.external_urls.spotify,
      popularity: track.popularity
    }));
  } catch (error) {
    console.error('Error fetching top tracks:', error);
    return [];
  }
};

// Fetch albums
export const getArtistAlbums = async () => {
  try {
    const token = await getSpotifyAccessToken();

    if (!token) {
      throw new Error('Failed to get access token');
    }

    const response = await fetch(
      `https://api.spotify.com/v1/artists/${SPOTIFY_ARTIST_ID}/albums?include_groups=album,single,ep&market=IN&limit=50`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch albums');
    }

    const data = await response.json();

    return data.items.map(album => ({
      id: album.id,
      name: album.name,
      type: album.album_type,
      releaseDate: album.release_date,
      image: album.images[0]?.url,
      url: album.external_urls.spotify,
      totalTracks: album.total_tracks
    }));
  } catch (error) {
    console.error('Error fetching albums:', error);
    return [];
  }
};

// Format number with K/M suffix
export const formatNumber = (num) => {
  if (!num) return '0';

  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

// Cache data in localStorage to reduce API calls
const CACHE_KEY = 'spotify_artist_data';
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

export const getCachedArtistData = () => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached);
    const now = Date.now();

    // Check if cache is still valid
    if (now - timestamp < CACHE_DURATION) {
      return data;
    }

    // Cache expired
    localStorage.removeItem(CACHE_KEY);
    return null;
  } catch (error) {
    return null;
  }
};

export const setCachedArtistData = (data) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  } catch (error) {
    console.error('Error caching data:', error);
  }
};

// Fetch album tracks via backend proxy
export const getAlbumTracks = async (albumId) => {
  try {
    console.log('Fetching tracks for album:', albumId);

    const response = await fetch(
      `http://localhost:3003/api/spotify/albums/${albumId}/tracks`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch album tracks: ' + response.status);
    }

    const data = await response.json();

    return data.items.map((track, index) => ({
      number: index + 1,
      title: track.name,
      duration: formatDuration(track.duration_ms),
      id: track.id,
      url: track.external_urls?.spotify || '#'
    }));
  } catch (error) {
    console.error('Error fetching album tracks:', error);
    return [];
  }
};

// Format duration from milliseconds to MM:SS
const formatDuration = (ms) => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

// Cache for album tracks
const TRACKS_CACHE_KEY = 'spotify_tracks_cache';
const TRACKS_CACHE_DURATION = 60 * 60 * 1000; // 1 hour

export const getCachedAlbumTracks = (albumId) => {
  try {
    const cached = localStorage.getItem(TRACKS_CACHE_KEY);
    if (!cached) return null;

    const cache = JSON.parse(cached);
    const albumCache = cache[albumId];

    if (!albumCache) return null;

    const now = Date.now();
    if (now - albumCache.timestamp < TRACKS_CACHE_DURATION) {
      return albumCache.data;
    }

    return null;
  } catch (error) {
    return null;
  }
};

export const setCachedAlbumTracks = (albumId, data) => {
  try {
    let cache = {};
    const existing = localStorage.getItem(TRACKS_CACHE_KEY);
    if (existing) {
      cache = JSON.parse(existing);
    }

    cache[albumId] = {
      data,
      timestamp: Date.now()
    };

    localStorage.setItem(TRACKS_CACHE_KEY, JSON.stringify(cache));
  } catch (error) {
    console.error('Error caching tracks:', error);
  }
};
