import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3003;

app.use(cors());
app.use(express.json());

const CLIENT_ID = process.env.VITE_SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.VITE_SPOTIFY_CLIENT_SECRET;

let tokenCache = null;
let tokenExpiry = null;

// Get Spotify access token
const getSpotifyToken = async () => {
  if (tokenCache && tokenExpiry && Date.now() < tokenExpiry) {
    return tokenCache;
  }

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')
    },
    body: 'grant_type=client_credentials'
  });

  const data = await response.json();
  tokenCache = data.access_token;
  tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000;
  return tokenCache;
};

// Proxy endpoint for album tracks
app.get('/api/spotify/albums/:albumId/tracks', async (req, res) => {
  try {
    const { albumId } = req.params;
    const token = await getSpotifyToken();

    console.log('Token obtained:', token ? 'Yes' : 'No');
    console.log('Fetching album:', albumId);

    const response = await fetch(
      `https://api.spotify.com/v1/albums/${albumId}/tracks`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    console.log('Spotify response status:', response.status);

    if (!response.ok) {
      const text = await response.text();
      console.error('Spotify error response:', text);
      return res.status(response.status).json({ error: text });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching album tracks:', error);
    res.status(500).json({ error: 'Failed to fetch tracks', message: error.message });
  }
});

// Proxy endpoint for artist data
app.get('/api/spotify/artists/:artistId', async (req, res) => {
  try {
    const { artistId } = req.params;
    const token = await getSpotifyToken();

    const response = await fetch(
      `https://api.spotify.com/v1/artists/${artistId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching artist data:', error);
    res.status(500).json({ error: 'Failed to fetch artist data' });
  }
});

// Proxy endpoint for artist albums (to get all tracks with features)
app.get('/api/spotify/artist/:artistId/albums', async (req, res) => {
  try {
    const { artistId } = req.params;
    const token = await getSpotifyToken();

    console.log('Fetching albums for artist:', artistId);

    const response = await fetch(
      `https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=album,single,appears_on&market=US&limit=50`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    console.log('Spotify response status:', response.status);

    if (!response.ok) {
      const text = await response.text();
      console.error('Spotify error response:', text);
      return res.status(response.status).json({ error: text });
    }

    const data = await response.json();

    // Filter for collaborations (tracks with multiple artists)
    const collaborations = data.items
      .filter(album => album.artists.length > 1 || album.album_group === 'appears_on')
      .map(album => ({
        name: album.name,
        artists: album.artists.map(a => a.name),
        releaseDate: album.release_date,
        type: album.album_type,
        image: album.images[0]?.url,
        url: album.external_urls.spotify
      }));

    res.json({ collaborations });
  } catch (error) {
    console.error('Error fetching collaborations:', error);
    res.status(500).json({ error: 'Failed to fetch collaborations', message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🎵 Spotify proxy server running on http://localhost:${PORT}`);
});
