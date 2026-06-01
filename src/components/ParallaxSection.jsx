import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const ParallaxSection = ({ children, className = '' }) => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -200]);

  return (
    <motion.div className={className} style={{ y }}>
      {children}
    </motion.div>
  );
};

export default ParallaxSection;
