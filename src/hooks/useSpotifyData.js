import { useState, useEffect } from 'react';
import { getArtistData, getCachedArtistData, setCachedArtistData, formatNumber } from '../services/spotify';

export const useSpotifyData = () => {
  const [data, setData] = useState({
    followers: 372,
    monthlyListeners: 668,
    name: 'Pratyaksh Bharadwaj',
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchData = async () => {
      // Check cache first
      const cached = getCachedArtistData();
      if (cached) {
        setData({
          ...cached,
          loading: false,
          error: null
        });
        return;
      }

      // Fetch fresh data
      try {
        const artistData = await getArtistData();

        const newData = {
          followers: artistData.followers,
          monthlyListeners: artistData.monthlyListeners || 668, // Fallback if not available
          name: artistData.name,
          genres: artistData.genres,
          popularity: artistData.popularity,
          imageUrl: artistData.imageUrl,
          loading: false,
          error: null
        };

        setData(newData);
        setCachedArtistData(newData);
      } catch (error) {
        console.error('Error fetching Spotify data:', error);
        setData(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to fetch real-time data. Showing cached data.'
        }));
      }
    };

    fetchData();
  }, []);

  return {
    ...data,
    formattedFollowers: formatNumber(data.followers),
    formattedMonthlyListeners: formatNumber(data.monthlyListeners)
  };
};
