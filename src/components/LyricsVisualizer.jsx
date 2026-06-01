import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const LyricsVisualizer = ({ isPlaying = false }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Generate random particles
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 2
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Animated gradient background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)'
          }}
          animate={{
            x: ['-10%', '110%'],
            y: ['-10%', '50%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut'
          }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, transparent 70%)'
          }}
          animate={{
            x: ['10%', '-110%'],
            y: ['10%', '-50%'],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut'
          }}
        />
      </div>

      {/* Floating particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-theme-primary/20"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.5, 0.2],
            scale: isPlaying ? [1, 1.5, 1] : 1
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'easeInOut'
          }}
        />
      ))}

      {/* Music bars visualization */}
      {isPlaying && (
        <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center gap-1 h-32 px-4 pb-4">
          {Array.from({ length: 50 }).map((_, i) => (
            <motion.div
              key={i}
              className="w-1 bg-gradient-to-t from-theme-primary to-theme-secondary rounded-full"
              animate={{
                height: ['20%', '80%', '20%'],
                opacity: [0.3, 0.8, 0.3]
              }}
              transition={{
                duration: 0.5 + Math.random() * 0.5,
                repeat: Infinity,
                delay: i * 0.02,
                ease: 'easeInOut'
              }}
            />
          ))}
        </div>
      )}

      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/5 dark:to-black/20" />
    </div>
  );
};

export default LyricsVisualizer;
