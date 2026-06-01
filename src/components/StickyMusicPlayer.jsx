import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const StickyMusicPlayer = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedTrackIndex, setSelectedTrackIndex] = useState(0);
  const [isReady, setIsReady] = useState(false);

  // Available tracks/albums
  const tracks = [
    {
      title: 'Rebirth',
      artist: 'Pratyaksh Bharadwaj',
      album: 'Rebirth',
      cover: '/images/albums/rebirth.jpg',
      url: 'https://open.spotify.com/album/5F5BHw4uM2cyJ78phQDQtC',
      embedUrl: 'https://open.spotify.com/embed/album/5F5BHw4uM2cyJ78phQDQtC?utm_source=generator'
    },
    {
      title: 'Darmiyaan',
      artist: 'Pratyaksh Bharadwaj',
      album: 'Darmiyaan',
      cover: '/images/albums/darmiyaan.jpg',
      url: 'https://open.spotify.com/album/221I7MJXRzctQdU3TMX2Ai',
      embedUrl: 'https://open.spotify.com/embed/album/221I7MJXRzctQdU3TMX2Ai?utm_source=generator'
    },
    {
      title: 'The Lost Cassette',
      artist: 'Pratyaksh Bharadwaj',
      album: 'The Lost Cassette',
      cover: '/images/albums/lost-cassette.jpg',
      url: 'https://open.spotify.com/album/4m6ahPcHJW9rXRpugqsC1L',
      embedUrl: 'https://open.spotify.com/embed/album/4m6ahPcHJW9rXRpugqsC1L?utm_source=generator'
    },
    {
      title: 'Wish You Were Here',
      artist: 'Pratyaksh Bharadwaj',
      album: 'Wish You Were Here',
      cover: '/images/albums/wish-you-were-here.jpg',
      url: 'https://open.spotify.com/album/1JpHvOQXlE5D7njVO6IiLr',
      embedUrl: 'https://open.spotify.com/embed/album/1JpHvOQXlE5D7njVO6IiLr?utm_source=generator'
    },
    {
      title: 'Eleven Seasons',
      artist: 'Pratyaksh Bharadwaj',
      album: 'Eleven Seasons',
      cover: '/images/albums/eleven-seasons.jpg',
      url: 'https://open.spotify.com/album/6mRsV3wWpM3zzF7aMctz9t',
      embedUrl: 'https://open.spotify.com/embed/album/6mRsV3wWpM3zzF7aMctz9t?utm_source=generator'
    }
  ];

  const currentTrack = tracks[selectedTrackIndex];

  // Delay initial rendering to prevent flash on page load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 1000); // Wait 1 second after page load

    return () => clearTimeout(timer);
  }, []);

  // Show player after scrolling down
  useEffect(() => {
    if (!isReady) return; // Don't show until ready

    const handleScroll = () => {
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
        setIsExpanded(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isReady]);

  return (
    <AnimatePresence>
      {isReady && isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-6 right-6 z-50"
        >
          {/* Compact Player */}
          {!isExpanded && (
            <motion.div
              className="bg-white dark:bg-dark-card rounded-2xl shadow-2xl border-2 border-theme-primary/30 overflow-hidden cursor-pointer group"
              whileHover={{ scale: 1.05 }}
              onClick={() => setIsExpanded(true)}
            >
              <div className="flex items-center gap-4 p-4">
                {/* Album Art */}
                <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={currentTrack.cover}
                    alt={currentTrack.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Play/Pause Overlay */}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>

                {/* Track Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate">{currentTrack.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{currentTrack.artist}</p>
                </div>

                {/* Expand Button */}
                <button className="text-theme-primary p-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
              </div>
            </motion.div>
          )}

          {/* Expanded Player */}
          {isExpanded && (
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-white dark:bg-dark-card rounded-2xl shadow-2xl border-2 border-theme-primary/30 overflow-hidden w-96"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-bold text-sm">Now Playing</h3>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              {/* Spotify Embed Player */}
              <div className="p-4">
                <iframe
                  key={selectedTrackIndex}
                  src={currentTrack.embedUrl}
                  width="100%"
                  height="352"
                  frameBorder="0"
                  allowFullScreen=""
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  className="rounded-xl"
                ></iframe>

                {/* Track Selector */}
                <div className="mt-4 space-y-2">
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Switch Album
                  </p>
                  <div className="grid grid-cols-5 gap-2">
                    {tracks.map((track, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedTrackIndex(index)}
                        className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                          selectedTrackIndex === index
                            ? 'border-theme-primary shadow-lg scale-105'
                            : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                        title={track.title}
                      >
                        <img
                          src={track.cover}
                          alt={track.title}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StickyMusicPlayer;
