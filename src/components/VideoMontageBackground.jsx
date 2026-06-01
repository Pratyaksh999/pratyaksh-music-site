import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVideos } from '../hooks/useFirebaseData';

const VideoMontageBackground = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { videos: allVideos, loading } = useVideos(true); // Only fetch homepage videos

  // Use homepage videos for montage
  const montageVideos = allVideos;

  useEffect(() => {
    if (montageVideos.length === 0) return;

    // Change video every 30 seconds + transition time (800ms fade)
    // This ensures each video is visible for exactly 30 seconds
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentVideoIndex((prev) => (prev + 1) % montageVideos.length);
        setIsTransitioning(false);
      }, 100);
    }, 30800); // 30 seconds + 800ms transition

    return () => clearInterval(interval);
  }, [montageVideos.length]);

  if (loading || montageVideos.length === 0) {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-theme-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  const currentVideo = montageVideos[currentVideoIndex];

  // Get start times for specific videos (no end time - let our timer handle it)
  const getVideoStartTime = (videoId) => {
    // Tu Hi Bata - start at 1:07
    if (videoId === 'RGxPbbRJOFM') return 67;
    // Fantasy - start at 2:06
    if (videoId === 'O1P-AXbGA8c') return 126;
    // Taamjhaam - start at 1:16
    if (videoId === 'xmagCPYzGzY') return 76;
    // RAP KI MUSCLE - start at 1:56
    if (videoId === 'Kxa9gH2s-Z0') return 116;
    // Roll Kar - start at 0:23
    if (videoId === 'WmxYYWGm2_s') return 23;
    // Mujhse Badha - default start
    if (videoId === '3lttSGG4QEw') return 0;
    // Jon Snow Freeverse - start at 2:12
    if (videoId === 'DrIUTk38z-k') return 132;
    // Hallucinate - start at 1:24
    if (videoId === 'ZT-I2ghdQRA') return 84;
    return 0;
  };

  const startTime = getVideoStartTime(currentVideo.id);
  const embedUrl = `https://www.youtube.com/embed/${currentVideo.id}?autoplay=1&mute=1&controls=0&showinfo=0&modestbranding=1&rel=0&enablejsapi=1&playsinline=1&start=${startTime}`;

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Video Background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentVideoIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          {/* YouTube Embed */}
          <iframe
            src={embedUrl}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300%] h-[300%] pointer-events-none"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={currentVideo.title}
          />

          {/* Gradient Overlays for readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50" />

          {/* Subtle blur overlay */}
          <div className="absolute inset-0 backdrop-blur-[1px]" />
        </motion.div>
      </AnimatePresence>

      {/* Video Info Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isTransitioning ? 0 : 1, y: isTransitioning ? 20 : 0 }}
        transition={{ duration: 0.3 }}
        className="absolute bottom-8 left-8 z-10"
      >
        <div className="bg-black/60 backdrop-blur-md rounded-xl px-4 py-3 border border-white/20">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <div>
              <p className="text-white font-bold text-sm">{currentVideo.title}</p>
              <p className="text-white/70 text-xs">Music Video • {currentVideo.year}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Video Progress Indicators */}
      <div className="absolute bottom-8 right-8 z-10 flex gap-2">
        {montageVideos.map((_, index) => (
          <div
            key={index}
            className="relative w-12 h-1 bg-white/20 rounded-full overflow-hidden"
          >
            {index === currentVideoIndex && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-theme-primary to-theme-secondary rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 30.8, ease: 'linear' }}
              />
            )}
            {index < currentVideoIndex && (
              <div className="absolute inset-0 bg-gradient-to-r from-theme-primary to-theme-secondary rounded-full" />
            )}
          </div>
        ))}
      </div>

      {/* Skip/Navigate Controls */}
      <div className="absolute bottom-8 right-8 md:right-[450px] z-10 flex gap-2">
        <button
          onClick={() => {
            setIsTransitioning(true);
            setTimeout(() => {
              setCurrentVideoIndex((prev) => (prev - 1 + montageVideos.length) % montageVideos.length);
              setIsTransitioning(false);
            }, 300);
          }}
          className="w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center transition-all border border-white/30"
          aria-label="Previous video"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={() => {
            setIsTransitioning(true);
            setTimeout(() => {
              setCurrentVideoIndex((prev) => (prev + 1) % montageVideos.length);
              setIsTransitioning(false);
            }, 300);
          }}
          className="w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center transition-all border border-white/30"
          aria-label="Next video"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Vignette effect */}
      <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]" />
    </div>
  );
};

export default VideoMontageBackground;
