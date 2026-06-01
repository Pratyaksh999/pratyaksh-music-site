import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { mode, colorTheme, toggleMode, setColorTheme, isDark, colorThemes } = useTheme();
  const [showColorPicker, setShowColorPicker] = useState(false);

  return (
    <div className="fixed top-24 right-6 md:right-12 z-50 flex flex-col items-end gap-3">
      {/* Light/Dark Toggle */}
      <motion.button
        onClick={toggleMode}
        className="w-14 h-14 rounded-full flex items-center justify-center bg-white dark:bg-dark-card border-2 border-theme-primary/30 hover:border-theme-primary transition-all shadow-lg"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      >
        <motion.div
          initial={false}
          animate={{ rotate: isDark ? 0 : 180 }}
          transition={{ duration: 0.3 }}
        >
          {isDark ? (
            <svg className="w-6 h-6 text-theme-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-theme-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </motion.div>
      </motion.button>

      {/* Color Theme Toggle */}
      <motion.button
        onClick={() => setShowColorPicker(!showColorPicker)}
        className="w-14 h-14 rounded-full flex items-center justify-center bg-white dark:bg-dark-card border-2 border-theme-primary/30 hover:border-theme-primary transition-all shadow-lg"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title="Change Color Theme"
      >
        <svg className="w-6 h-6 text-theme-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      </motion.button>

      {/* Color Picker Menu */}
      <AnimatePresence>
        {showColorPicker && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            className="bg-white dark:bg-dark-card border-2 border-theme-primary/30 rounded-2xl shadow-2xl p-4 flex flex-col gap-2"
          >
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 px-2">COLOR THEME</p>
            {Object.entries(colorThemes).map(([key, theme]) => (
              <motion.button
                key={key}
                onClick={() => {
                  setColorTheme(key);
                  setShowColorPicker(false);
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  colorTheme === key
                    ? 'bg-gray-100 dark:bg-gray-800 border-2 border-current'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800/50 border-2 border-transparent'
                }`}
                style={{ color: theme.primary }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div
                  className="w-6 h-6 rounded-full"
                  style={{
                    background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary}, ${theme.tertiary})`,
                  }}
                />
                <span className="font-semibold text-gray-900 dark:text-white text-sm">{theme.name}</span>
                {colorTheme === key && (
                  <svg className="w-4 h-4 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThemeToggle;
