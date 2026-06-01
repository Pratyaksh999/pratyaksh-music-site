import React from 'react';
import { motion } from 'framer-motion';

const CircleVisualizer = ({ isPlaying }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
      {/* Rotating rings */}
      {[0, 1, 2, 3, 4].map((index) => (
        <motion.div
          key={index}
          className="absolute rounded-full border-2 opacity-10"
          style={{
            width: `${(index + 1) * 150}px`,
            height: `${(index + 1) * 150}px`,
            borderColor: index % 2 === 0 ? '#a855f7' : '#ec4899',
          }}
          animate={{
            rotate: 360,
            scale: isPlaying ? [1, 1.1, 1] : 1,
          }}
          transition={{
            rotate: {
              duration: 20 + index * 5,
              repeat: Infinity,
              ease: "linear"
            },
            scale: {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
        />
      ))}

      {/* Pulsing center circle */}
      <motion.div
        className="absolute w-32 h-32 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 blur-xl"
        animate={{
          scale: isPlaying ? [1, 1.5, 1] : [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Orbiting dots */}
      {isPlaying && Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 rounded-full bg-gradient-to-br from-purple-400 to-pink-400"
          style={{
            top: '50%',
            left: '50%',
          }}
          animate={{
            x: [0, Math.cos((i * Math.PI * 2) / 12) * 200],
            y: [0, Math.sin((i * Math.PI * 2) / 12) * 200],
            scale: [0, 1, 0],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.25,
            ease: "easeOut"
          }}
        />
      ))}
    </div>
  );
};

export default CircleVisualizer;
