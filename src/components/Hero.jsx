import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { SpotifyIcon, InstagramIcon, YouTubeIcon, AppleMusicIcon } from './icons';
import { useTheme } from '../context/ThemeContext';
import VideoMontageBackground from './VideoMontageBackground';

const Hero = () => {
  const { scrollY } = useScroll();
  const { isDark, colors } = useTheme();

  // Parallax effects - elements move at different speeds
  const backgroundY = useTransform(scrollY, [0, 1000], [0, 400]);
  const textY = useTransform(scrollY, [0, 1000], [0, 200]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const scale = useTransform(scrollY, [0, 400], [1, 0.8]);

  // Individual letter fall apart animations
  const firstName = "PRATYAKSH";
  const lastName = "BHARADWAJ";

  // Pre-calculated random values for each letter (so they don't change on re-render)
  const firstNameAnimations = React.useMemo(() => [
    { x: -300, y: 600, rotate: -120 },
    { x: -200, y: 500, rotate: 90 },
    { x: 150, y: 700, rotate: -45 },
    { x: -100, y: 550, rotate: 180 },
    { x: 250, y: 650, rotate: -90 },
    { x: -50, y: 800, rotate: 45 },
    { x: 100, y: 450, rotate: -150 },
    { x: -250, y: 750, rotate: 60 },
    { x: 200, y: 550, rotate: -30 },
  ], []);

  const lastNameAnimations = React.useMemo(() => [
    { x: 180, y: 700, rotate: 75 },
    { x: -220, y: 600, rotate: -110 },
    { x: 120, y: 850, rotate: 135 },
    { x: -180, y: 500, rotate: -65 },
    { x: 280, y: 750, rotate: 95 },
    { x: -120, y: 650, rotate: -145 },
    { x: 80, y: 900, rotate: 50 },
    { x: -280, y: 550, rotate: -85 },
    { x: 220, y: 800, rotate: 120 },
  ], []);

  const getLetterAnimation = (index, isFirstName) => {
    const anim = isFirstName ? firstNameAnimations[index] : lastNameAnimations[index];

    // Always create transforms, values will be controlled by CSS
    return {
      x: useTransform(scrollY, [0, 2500], [0, anim.x]),
      y: useTransform(scrollY, [0, 2500], [0, anim.y]),
      rotate: useTransform(scrollY, [0, 2500], [0, anim.rotate]),
      opacity: useTransform(scrollY, [0, 2500], [1, 0]),
    };
  };

  return (
    <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Video Montage Background */}
      <VideoMontageBackground />

      {/* Animated Background with Parallax (fallback/overlay) */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-transparent via-black/20 to-transparent dark:from-transparent dark:via-black/30 dark:to-transparent pointer-events-none"
        style={{ y: backgroundY }}
      >
        {/* Floating particles - hidden on mobile via CSS */}
        <div className="absolute inset-0 opacity-30 hidden md:block">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-theme-secondary rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        className="relative z-10 text-center px-6"
        style={{ y: textY, opacity, scale }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.p
            className="text-white font-semibold tracking-widest text-sm md:text-base mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            OFFICIAL MUSIC SITE
          </motion.p>

          <motion.h1
            className="font-display font-black text-6xl md:text-8xl lg:text-9xl mb-6 leading-none relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            data-easter-egg-trigger
          >
            {/* First Name - PRATYAKSH */}
            <span className="block relative cursor-pointer" style={{ display: 'flex', justifyContent: 'center' }} data-easter-egg-trigger>
              {firstName.split('').map((letter, index) => {
                const anim = getLetterAnimation(index, true);
                return (
                  <motion.span
                    key={`first-${index}`}
                    style={{
                      x: anim.x,
                      y: anim.y,
                      rotate: anim.rotate,
                      opacity: anim.opacity,
                      display: 'inline-block',
                    }}
                  >
                    <motion.span
                      className="inline-block fire-glow"
                    >
                      <motion.span
                        animate={{
                          x: [0, -5, 3, -2, 4, 0],
                          y: [0, 2, -1, 0],
                          opacity: [1, 0.7, 0.9, 0.6, 1],
                          skewX: [0, -2, 1, 0],
                        }}
                        transition={{
                          duration: 0.3,
                          repeat: Infinity,
                          repeatDelay: 0.8,
                        }}
                        className="inline-block"
                      >
                        <motion.span
                          animate={{
                            backgroundPosition: ['0% center', '200% center'],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: 'linear',
                          }}
                          className="text-gradient inline-block"
                        >
                          {letter}
                        </motion.span>
                      </motion.span>
                    </motion.span>
                  </motion.span>
                );
              })}
            </span>

            {/* Last Name - BHARADWAJ */}
            <span className="block relative" style={{ display: 'flex', justifyContent: 'center' }}>
              {lastName.split('').map((letter, index) => {
                const anim = getLetterAnimation(index, false);
                return (
                  <motion.span
                    key={`last-${index}`}
                    style={{
                      x: anim.x,
                      y: anim.y,
                      rotate: anim.rotate,
                      opacity: anim.opacity,
                      display: 'inline-block',
                    }}
                  >
                    <motion.span
                      className="inline-block fire-glow"
                    >
                      <motion.span
                        animate={{
                          x: [0, 4, -3, 5, -2, 0],
                          y: [0, -2, 1, 0],
                          opacity: [1, 0.6, 0.8, 0.7, 1],
                          skewX: [0, 2, -1, 0],
                        }}
                        transition={{
                          duration: 0.3,
                          repeat: Infinity,
                          repeatDelay: 1,
                        }}
                        className="inline-block"
                      >
                        <motion.span
                          animate={{
                            backgroundPosition: ['0% center', '200% center'],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: 'linear',
                            delay: 0.5,
                          }}
                          className="text-gradient inline-block"
                        >
                          {letter}
                        </motion.span>
                      </motion.span>
                    </motion.span>
                  </motion.span>
                );
              })}
            </span>
          </motion.h1>

          <motion.p
            className="text-white text-lg md:text-xl max-w-2xl mx-auto mb-12 font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            Rapper • Singer • Songwriter from Dehradun
          </motion.p>

          {/* Platform Icons */}
          <motion.div
            className="flex items-center justify-center gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            {[
              { name: 'Spotify', Icon: SpotifyIcon, url: 'https://open.spotify.com/artist/4xwROKTcnt5K1GmLitjPz4', colorClass: 'social-icon-spotify' },
              { name: 'Apple Music', Icon: AppleMusicIcon, url: 'https://music.apple.com/us/artist/pratyaksh-bharadwaj/1550185242', colorClass: 'social-icon-apple' },
              { name: 'Instagram', Icon: InstagramIcon, url: 'https://instagram.com/bizarre_as_hell', colorClass: 'social-icon-instagram' },
              { name: 'YouTube', Icon: YouTubeIcon, url: 'https://youtube.com/@pratyakshbharadwaj', colorClass: 'social-icon-youtube' },
            ].map((platform, i) => {
              const { Icon } = platform;
              return (
                <motion.a
                  key={platform.name}
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group relative w-14 h-14 flex items-center justify-center bg-white dark:bg-dark-card rounded-full border border-theme-primary/30 hover:border-transparent transition-all duration-300 shadow-lg ${platform.colorClass}`}
                  whileHover={{ scale: 1.1, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="w-6 h-6 text-gray-900 dark:text-white group-hover:text-white transition-colors" />
                  <span className="absolute -bottom-8 text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {platform.name}
                  </span>
                </motion.a>
              );
            })}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-theme-secondary rounded-full flex items-start justify-center p-2">
          <motion.div
            className="w-1 h-3 bg-theme-secondary rounded-full"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
