import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SectionNav = () => {
  const [activeSection, setActiveSection] = useState(0);
  const [hoveredSection, setHoveredSection] = useState(null);
  const [scrollPercentage, setScrollPercentage] = useState(0);

  const sections = [
    { id: 'hero', label: 'Home', element: null },
    { id: 'latest', label: 'Latest Release', element: null },
    { id: 'catalog', label: 'Catalog', element: null },
    { id: 'videos', label: 'Videos', element: null },
    { id: 'about', label: 'About', element: null },
    { id: 'contact', label: 'Contact', element: null },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      // Calculate actual scroll percentage
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const scrollableHeight = documentHeight - windowHeight;
      const percentage = scrollableHeight > 0 ? (scrollTop / scrollableHeight) * 100 : 0;
      setScrollPercentage(Math.round(Math.min(100, Math.max(0, percentage))));

      // Find which section is currently in view
      let currentSection = 0;
      sections.forEach((section, index) => {
        const element = document.getElementById(section.id);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetBottom = offsetTop + element.offsetHeight;

          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            currentSection = index;
          }
        }
      });

      setActiveSection(currentSection);
    };

    // Initial check
    handleScroll();

    // Listen to scroll events
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden lg:block">
      <div className="flex flex-col gap-4">
        {sections.map((section, index) => {
          const isActive = activeSection === index;
          const isHovered = hoveredSection === index;

          return (
            <div
              key={section.id}
              className="relative flex items-center justify-end group"
              onMouseEnter={() => setHoveredSection(index)}
              onMouseLeave={() => setHoveredSection(null)}
            >
              {/* Label */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="absolute right-12 bg-white dark:bg-dark-card px-3 py-1.5 rounded-lg shadow-lg border-2 border-theme-primary/30 whitespace-nowrap"
                  >
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {section.label}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Dot Button */}
              <motion.button
                onClick={() => scrollToSection(section.id)}
                className="relative w-3 h-3 rounded-full cursor-pointer"
                whileHover={{ scale: 1.5 }}
                whileTap={{ scale: 0.9 }}
                aria-label={`Navigate to ${section.label}`}
              >
                {/* Background dot */}
                <div className={`absolute inset-0 rounded-full transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-theme-primary to-theme-secondary shadow-lg shadow-theme-primary/50'
                    : 'bg-gray-300 dark:bg-gray-600'
                }`} />

                {/* Animated ring for active section */}
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-theme-primary"
                    initial={{ scale: 1, opacity: 1 }}
                    animate={{ scale: 2, opacity: 0 }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
              </motion.button>

              {/* Progress bar between dots */}
              {index < sections.length - 1 && (
                <div className="absolute top-6 right-[5px] w-0.5 h-4 bg-gray-200 dark:bg-gray-700">
                  <motion.div
                    className="w-full bg-gradient-to-b from-theme-primary to-theme-secondary origin-top"
                    initial={{ scaleY: 0 }}
                    animate={{
                      scaleY: activeSection > index ? 1 : 0
                    }}
                    transition={{ duration: 0.3 }}
                    style={{ height: '100%' }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Progress Percentage */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-6 text-center"
      >
        <div className="bg-white dark:bg-dark-card px-3 py-2 rounded-lg shadow-lg border-2 border-theme-primary/30">
          <p className="text-xs font-bold text-gray-900 dark:text-white">
            {scrollPercentage}%
          </p>
        </div>
      </motion.div>

      {/* Scroll hint animation */}
      {activeSection === 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: [0, 1, 0], y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mt-4 flex justify-center"
        >
          <svg className="w-5 h-5 text-theme-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      )}
    </div>
  );
};

export default SectionNav;
