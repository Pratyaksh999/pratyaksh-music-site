import React from 'react';
import { motion, useTransform } from 'framer-motion';
import ShareButton from './ShareButton';

const InteractiveAlbumCard = ({ release, index, inView, scrollProgress }) => {
  // Create parallax effects based on scroll - disable on mobile
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const yOffset = (scrollProgress && !isMobile) ? useTransform(
    scrollProgress,
    [0, 0.5, 1],
    // Alternate direction based on index for visual variety
    index % 2 === 0 ? [100, 0, -50] : [50, 0, -100]
  ) : 0;

  const rotate = (scrollProgress && !isMobile) ? useTransform(scrollProgress, [0, 0.5, 1], [2, 0, -2]) : 0;
  const scale = (scrollProgress && !isMobile) ? useTransform(scrollProgress, [0, 0.3, 0.6, 1], [0.95, 1, 1, 0.95]) : 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      style={scrollProgress ? { y: yOffset, rotate, scale } : {}}
      className="group perspective-1000 w-full"
    >
      {/* 3D Card Container */}
      <motion.div
        className="relative"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        {/* Front - Album Cover */}
        <div
          className="relative overflow-hidden rounded-2xl border-2 border-theme-primary/20 group-hover:border-theme-primary transition-all duration-500"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {/* Album Art */}
          <div className="aspect-square bg-gradient-to-br from-theme-primary/10 to-theme-secondary/10">
            <img
              src={release.image}
              alt={`${release.title} Cover`}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Hover Overlay with Play Button */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-6 z-10">
            <motion.a
              href={release.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-theme-primary text-white font-bold rounded-full"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              ▶ Play on Spotify
            </motion.a>
          </div>

        </div>

        {/* Release Info */}
        <div className="mt-4 space-y-2">
          <h3 className="font-bold text-xl group-hover:text-theme-secondary transition-colors">
            {release.title}
          </h3>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">
              {release.type} • {release.year}
            </span>
            <span className="text-theme-secondary font-semibold">
              {release.streams}
            </span>
          </div>
          <div className="pt-2">
            <ShareButton
              track={release.title}
              url={release.url}
              image={release.image}
            />
          </div>
        </div>
      </motion.div>

    </motion.div>
  );
};

export default InteractiveAlbumCard;
