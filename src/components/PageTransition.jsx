import React from 'react';
import { motion } from 'framer-motion';

const PageTransition = ({ children }) => {
  return (
    <>
      {children}

      {/* Wipe transition overlay */}
      <motion.div
        className="fixed inset-0 bg-gradient-to-br from-theme-primary via-theme-secondary to-theme-tertiary z-[9998] pointer-events-none"
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        exit={{ x: '-100%' }}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      />

      {/* Secondary overlay for smooth blend */}
      <motion.div
        className="fixed inset-0 bg-gradient-to-tl from-theme-tertiary via-theme-secondary to-theme-primary z-[9997] pointer-events-none"
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        exit={{ x: '-100%' }}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
      />
    </>
  );
};

export default PageTransition;
