import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const KeyboardShortcuts = () => {
  const [showHelp, setShowHelp] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const { toggleMode, setColorTheme, colorThemes } = useTheme();

  useEffect(() => {
    const sections = ['hero', 'latest', 'catalog', 'videos', 'about', 'contact'];
    let currentSectionIndex = 0;

    const handleKeyPress = (e) => {
      // Ignore if user is typing in an input field
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      const key = e.key.toLowerCase();

      switch (key) {
        case ' ':
          // Space = play/pause Spotify player
          e.preventDefault();
          const spotifyIframe = document.querySelector('iframe[src*="spotify.com/embed"]');
          if (spotifyIframe) {
            console.log('Spotify player control requires API integration');
          }
          break;

        case 'arrowdown':
        case 'arrowup':
          // Arrow keys = navigate sections
          e.preventDefault();
          if (key === 'arrowdown') {
            currentSectionIndex = Math.min(currentSectionIndex + 1, sections.length - 1);
          } else {
            currentSectionIndex = Math.max(currentSectionIndex - 1, 0);
          }
          const targetSection = document.getElementById(sections[currentSectionIndex]);
          if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
          break;

        case 't':
          // T = toggle theme
          e.preventDefault();
          toggleMode();
          break;

        case 'p':
          // P = open color picker
          e.preventDefault();
          setShowColorPicker(prev => !prev);
          break;

        case '?':
          // ? = show help
          e.preventDefault();
          setShowHelp(prev => !prev);
          break;

        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [toggleMode]);

  // Show help on first visit
  useEffect(() => {
    const hasSeenHelp = localStorage.getItem('hasSeenKeyboardHelp');
    if (!hasSeenHelp) {
      setShowHelp(true);
      localStorage.setItem('hasSeenKeyboardHelp', 'true');
      setTimeout(() => setShowHelp(false), 5000);
    }
  }, []);

  const shortcuts = [
    { key: 'Space', description: 'Play/Pause music' },
    { key: '↑ ↓', description: 'Navigate sections' },
    { key: 'T', description: 'Toggle theme' },
    { key: 'P', description: 'Color picker' },
    { key: '?', description: 'Show/hide help' },
  ];

  return (
    <>
      {/* Help Button */}
      <motion.button
        onClick={() => setShowHelp(prev => !prev)}
        className="fixed bottom-28 left-8 z-[100] w-10 h-10 bg-gray-900/80 dark:bg-white/80 backdrop-blur-sm text-white dark:text-gray-900 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center text-xs font-bold"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Keyboard shortcuts"
        title="Keyboard shortcuts (?)"
      >
        ?
      </motion.button>

      {/* Help Modal */}
      <AnimatePresence>
        {showHelp && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[90]"
              onClick={() => setShowHelp(false)}
            />

            {/* Help Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed bottom-40 left-8 z-[100] bg-white dark:bg-dark-card rounded-2xl shadow-2xl border-2 border-theme-primary/30 p-6 w-80"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                  Keyboard Shortcuts
                </h3>
                <button
                  onClick={() => setShowHelp(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-3">
                {shortcuts.map((shortcut, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700 last:border-0"
                  >
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {shortcut.description}
                    </span>
                    <kbd className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg text-xs font-bold border border-gray-300 dark:border-gray-600 shadow-sm">
                      {shortcut.key}
                    </kbd>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  Press <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs">?</kbd> anytime to toggle this help
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Color Picker Modal */}
      <AnimatePresence>
        {showColorPicker && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[90]"
              onClick={() => setShowColorPicker(false)}
            />

            {/* Color Picker Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] bg-white dark:bg-dark-card rounded-2xl shadow-2xl border-2 border-theme-primary/30 p-6 w-80"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                  Color Theme
                </h3>
                <button
                  onClick={() => setShowColorPicker(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {Object.entries(colorThemes).map(([key, theme]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setColorTheme(key);
                      setShowColorPicker(false);
                    }}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-theme-primary transition-all group"
                  >
                    <div
                      className="w-12 h-12 rounded-full shadow-lg group-hover:scale-110 transition-transform"
                      style={{
                        background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`
                      }}
                    />
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {theme.name}
                    </span>
                  </button>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  Press <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs">P</kbd> to toggle color picker
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default KeyboardShortcuts;
