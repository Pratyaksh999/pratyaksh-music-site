import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const MusicVisualizer = () => {
  const { scrollYProgress } = useScroll();

  // Create bars that react to scroll
  const bars = Array.from({ length: 12 }, (_, i) => {
    const height = useTransform(
      scrollYProgress,
      [0, 0.5, 1],
      [20, 100 + i * 10, 20]
    );
    const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.3, 1, 1, 0.3]);

    return { height, opacity, delay: i * 0.05 };
  });

  return (
    <div className="fixed bottom-0 left-0 right-0 h-32 pointer-events-none z-40 flex items-end justify-center gap-2 px-4">
      {bars.map((bar, index) => (
        <motion.div
          key={index}
          className="w-2 bg-gradient-to-t from-theme-primary via-theme-secondary to-theme-tertiary rounded-t-full"
          style={{
            height: bar.height,
            opacity: bar.opacity,
          }}
          animate={{
            scaleY: [1, 1.2, 1],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: bar.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

export default MusicVisualizer;
