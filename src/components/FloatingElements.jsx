import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const FloatingElements = () => {
  const { scrollYProgress } = useScroll();

  // Create multiple floating elements with different scroll speeds
  const elements = [
    {
      size: 300,
      left: '10%',
      top: '20%',
      color: 'from-theme-primary/20 to-theme-secondary/10 dark:from-theme-primary/10 dark:to-theme-secondary/5',
      speed: [0, 500],
    },
    {
      size: 200,
      left: '80%',
      top: '40%',
      color: 'from-theme-secondary/20 to-theme-tertiary/10 dark:from-theme-secondary/10 dark:to-theme-tertiary/5',
      speed: [0, -300],
    },
    {
      size: 250,
      left: '60%',
      top: '70%',
      color: 'from-theme-primary/15 to-transparent dark:from-theme-primary/5 dark:to-transparent',
      speed: [0, 400],
    },
    {
      size: 180,
      left: '15%',
      top: '80%',
      color: 'from-theme-tertiary/20 to-theme-secondary/10 dark:from-theme-tertiary/10 dark:to-theme-secondary/5',
      speed: [0, -200],
    },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {elements.map((element, index) => {
        const y = useTransform(scrollYProgress, [0, 1], element.speed);
        const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);

        return (
          <motion.div
            key={index}
            className={`absolute rounded-full bg-gradient-to-br ${element.color} blur-3xl`}
            style={{
              width: element.size,
              height: element.size,
              left: element.left,
              top: element.top,
              y,
              rotate,
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 5 + index,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        );
      })}
    </div>
  );
};

export default FloatingElements;
