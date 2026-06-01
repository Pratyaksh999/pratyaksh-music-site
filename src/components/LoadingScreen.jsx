import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LoadingScreen = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsComplete(true);
            setTimeout(() => {
              onLoadingComplete();
            }, 800);
          }, 500);
          return 100;
        }
        // Faster at start, slower at end for realistic feel
        const increment = prev < 50 ? 8 : prev < 80 ? 5 : 2;
        return Math.min(prev + increment, 100);
      });
    }, 100);

    return () => clearInterval(interval);
  }, [onLoadingComplete]);

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900"
        >
          {/* Animated background particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-theme-primary/30 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0.2, 0.5, 0.2],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          {/* Main content */}
          <div className="relative z-10 text-center px-6 max-w-md w-full">
            {/* Logo Animation */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="mb-8"
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="relative"
              >
                {/* Logo */}
                <div className="relative inline-block">
                  <motion.img
                    src="/logo.png"
                    alt="Pratyaksh Bharadwaj"
                    className="h-32 w-auto"
                    animate={{
                      filter: [
                        'drop-shadow(0 0 20px rgba(147, 51, 234, 0.5))',
                        'drop-shadow(0 0 40px rgba(147, 51, 234, 0.8))',
                        'drop-shadow(0 0 20px rgba(147, 51, 234, 0.5))',
                      ],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />

                  {/* Circular pulse rings */}
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 0, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeOut',
                    }}
                  >
                    <div className="w-32 h-32 rounded-full border-4 border-theme-primary" />
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>

            {/* Brand name */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="font-display font-black text-4xl md:text-5xl mb-2 text-white"
            >
              <span className="text-gradient">PRATYAKSH</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="text-gray-400 text-sm mb-8 tracking-wider"
            >
              BHARADWAJ
            </motion.p>

            {/* Loading text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="mb-4"
            >
              <p className="text-gray-400 text-sm mb-2">
                {progress < 30 && '🎧 Loading music...'}
                {progress >= 30 && progress < 60 && '🎸 Tuning instruments...'}
                {progress >= 60 && progress < 90 && '🎤 Setting up stage...'}
                {progress >= 90 && progress < 100 && '✨ Almost there...'}
                {progress === 100 && '🔥 Ready to rock!'}
              </p>
            </motion.div>

            {/* Progress bar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="relative"
            >
              {/* Background track */}
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                {/* Progress fill */}
                <motion.div
                  className="h-full bg-gradient-to-r from-theme-primary via-theme-secondary to-theme-tertiary relative"
                  initial={{ width: '0%' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                  {/* Shimmer effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{
                      x: ['-100%', '200%'],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  />
                </motion.div>
              </div>

              {/* Percentage */}
              <motion.p
                className="text-theme-primary font-bold text-sm mt-2"
                animate={{
                  scale: progress === 100 ? [1, 1.2, 1] : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                {progress}%
              </motion.p>
            </motion.div>

            {/* Sound waves visualization */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="flex justify-center items-center gap-1 mt-8 h-12"
            >
              {[...Array(7)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-theme-primary rounded-full"
                  animate={{
                    height: progress < 100 ? [10, 30, 10] : 10,
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: progress < 100 ? Infinity : 0,
                    delay: i * 0.1,
                    ease: 'easeInOut',
                  }}
                />
              ))}
            </motion.div>
          </div>

          {/* Copyright footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
            className="absolute bottom-8 text-center text-gray-500 text-xs"
          >
            <p>© 2026 Pratyaksh Bharadwaj</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
