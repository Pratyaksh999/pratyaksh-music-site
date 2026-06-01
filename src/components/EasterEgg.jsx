import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const EasterEgg = () => {
  const [clickCount, setClickCount] = useState(0);
  const [isActivated, setIsActivated] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Listen for Konami code: ↑ ↑ ↓ ↓ ← → ← → B A
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;

    const handleKeyPress = (e) => {
      if (e.key.toLowerCase() === konamiCode[konamiIndex].toLowerCase()) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
          activateEasterEgg();
          konamiIndex = 0;
        }
      } else {
        konamiIndex = 0;
      }
    };

    // Listen for triple click on logo
    const handleLogoClick = () => {
      setClickCount(prev => {
        const newCount = prev + 1;
        if (newCount >= 7) {
          activateEasterEgg();
          return 0;
        }
        return newCount;
      });
    };

    // Reset click count after 2 seconds
    const resetTimer = setTimeout(() => {
      setClickCount(0);
    }, 2000);

    window.addEventListener('keydown', handleKeyPress);

    // Add click listener to logo/name elements
    const logoElements = document.querySelectorAll('[data-easter-egg-trigger]');
    logoElements.forEach(el => el.addEventListener('click', handleLogoClick));

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      logoElements.forEach(el => el.removeEventListener('click', handleLogoClick));
      clearTimeout(resetTimer);
    };
  }, [clickCount]);

  const activateEasterEgg = () => {
    setIsActivated(true);
    setShowConfetti(true);

    // Play a sound (optional - would need audio file)
    // const audio = new Audio('/easter-egg-sound.mp3');
    // audio.play();

    setTimeout(() => {
      setShowConfetti(false);
    }, 5000);
  };

  const closeEasterEgg = () => {
    setIsActivated(false);
  };

  // Confetti particles
  const confettiColors = ['#FF3D00', '#FF6D00', '#FFB300', '#059669', '#3B82F6', '#F59E0B'];
  const confettiParticles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
    x: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 2 + Math.random() * 2,
    rotation: Math.random() * 360
  }));

  return (
    <>
      {/* Confetti Animation */}
      <AnimatePresence>
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-[200] overflow-hidden">
            {confettiParticles.map((particle) => (
              <motion.div
                key={particle.id}
                initial={{
                  top: -20,
                  left: `${particle.x}%`,
                  opacity: 1,
                  rotate: 0,
                  scale: 1
                }}
                animate={{
                  top: '100vh',
                  opacity: 0,
                  rotate: particle.rotation,
                  scale: [1, 1.5, 0.5]
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: particle.duration,
                  delay: particle.delay,
                  ease: 'linear'
                }}
                className="absolute w-3 h-3 rounded-sm"
                style={{ backgroundColor: particle.color }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Easter Egg Modal */}
      <AnimatePresence>
        {isActivated && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-lg z-[150]"
              onClick={closeEasterEgg}
            />

            {/* Easter Egg Content */}
            <div className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-[200] md:w-[90%] md:max-w-2xl max-h-[calc(100vh-2rem)] overflow-y-auto flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.5, rotateY: 180 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 0.5, rotateY: -180 }}
                transition={{ type: 'spring', damping: 20 }}
                className="w-full"
              >
              <div className="bg-gradient-to-br from-theme-primary via-theme-secondary to-theme-primary p-6 md:p-8 rounded-3xl shadow-2xl border-4 border-white/20 relative overflow-hidden">
                {/* Animated background */}
                <motion.div
                  className="absolute inset-0 opacity-20"
                  animate={{
                    background: [
                      'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.8) 0%, transparent 50%)',
                      'radial-gradient(circle at 80% 50%, rgba(255,255,255,0.8) 0%, transparent 50%)',
                      'radial-gradient(circle at 50% 20%, rgba(255,255,255,0.8) 0%, transparent 50%)',
                      'radial-gradient(circle at 50% 80%, rgba(255,255,255,0.8) 0%, transparent 50%)',
                      'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.8) 0%, transparent 50%)',
                    ]
                  }}
                  transition={{ duration: 5, repeat: Infinity }}
                />

                {/* Close button */}
                <button
                  onClick={closeEasterEgg}
                  className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-all z-10"
                >
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <div className="relative z-10 text-center">
                  {/* Trophy Icon */}
                  <motion.div
                    animate={{
                      rotate: [0, -10, 10, -10, 10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
                    className="text-6xl md:text-8xl mb-4 md:mb-6"
                  >
                    🏆
                  </motion.div>

                  <h2 className="font-display font-black text-3xl md:text-5xl lg:text-6xl text-white mb-3 md:mb-4">
                    You Found It!
                  </h2>

                  <p className="text-white/90 text-base md:text-xl mb-4 md:mb-6 max-w-lg mx-auto px-2">
                    Congratulations! You discovered the secret easter egg.
                    You're a true fan! 🔥
                  </p>

                  {/* Secret Message */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 md:p-6 mb-4 md:mb-6 border-2 border-white/20">
                    <p className="text-white font-bold text-base md:text-lg mb-2">
                      🎵 Secret Message from Pratyaksh:
                    </p>
                    <p className="text-white/80 italic text-sm md:text-base">
                      "Thanks for exploring! New music coming soon. Stay tuned and keep the vibes alive! 🎤✨"
                    </p>
                  </div>

                  {/* Share buttons */}
                  <div className="flex gap-3 md:gap-4 justify-center flex-wrap">
                    <motion.a
                      href="https://open.spotify.com/artist/4xwROKTcnt5K1GmLitjPz4"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 md:px-6 py-2 md:py-3 bg-white text-theme-primary font-bold rounded-full hover:scale-105 transition-transform text-sm md:text-base"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      🎧 Listen on Spotify
                    </motion.a>
                    <motion.button
                      onClick={closeEasterEgg}
                      className="px-4 md:px-6 py-2 md:py-3 bg-white/20 backdrop-blur-sm text-white font-bold rounded-full hover:bg-white/30 transition-all border-2 border-white/30 text-sm md:text-base"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Keep Exploring
                    </motion.button>
                  </div>

                  {/* Hint */}
                  <p className="text-white/60 text-xs md:text-sm mt-4 md:mt-6 px-2">
                    💡 Hint: Try the Konami code next time! ↑↑↓↓←→←→BA
                  </p>
                </div>
              </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Click Counter Indicator (for debugging/feedback) */}
      <AnimatePresence>
        {clickCount > 0 && clickCount < 7 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] bg-theme-primary text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg"
          >
            {7 - clickCount} more clicks...
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default EasterEgg;
