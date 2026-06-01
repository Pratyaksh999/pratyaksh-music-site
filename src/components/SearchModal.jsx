import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVideos, useSpotifyReleases } from '../hooks/useFirebaseData';

const SearchModal = ({ isOpen, setIsOpen, searchQuery, setSearchQuery }) => {
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  // Fetch data from Firebase (false = get all videos, not just homepage)
  const { videos: firebaseVideos } = useVideos(false);
  const { releases: firebaseReleases } = useSpotifyReleases();

  // Convert videos to match the format
  const videos = firebaseVideos.map(video => ({
    title: video.title,
    type: 'Video',
    year: video.year,
    image: video.thumbnail,
    url: video.url,
    category: 'youtube'
  }));

  // Combined data
  const allContent = [...firebaseReleases, ...videos];

  const years = ['all', '2026', '2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2015'];
  const types = ['all', 'Album', 'Single', 'EP', 'Video'];

  // Filter results - also search through track names
  const filteredResults = allContent.filter(item => {
    // Check if title matches
    const titleMatches = item.title.toLowerCase().includes(searchQuery.toLowerCase());

    // Check if any track name matches (for albums/EPs)
    const trackMatches = item.tracks?.some(track =>
      track.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const matchesSearch = titleMatches || trackMatches;
    const matchesYear = selectedYear === 'all' || item.year === selectedYear;
    const matchesType = selectedType === 'all' || item.type === selectedType;
    return matchesSearch && matchesYear && matchesType;
  });

  // Close on escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    setSearchQuery('');
    setSelectedYear('all');
    setSelectedType('all');
  };

  return (
    <>
      {/* Search Results Dropdown */}
      <AnimatePresence>
        {isOpen && (searchQuery || selectedYear !== 'all' || selectedType !== 'all') && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[45] mt-20"
              onClick={handleClose}
            />

            {/* Results Panel */}
            <div className="fixed top-20 left-0 right-0 z-[50] flex justify-center px-4">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ type: 'spring', damping: 25 }}
                className="w-full max-w-4xl bg-white dark:bg-dark-card rounded-2xl shadow-2xl border-2 border-theme-primary/30 max-h-[80vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Filters */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex gap-3 flex-wrap">
                    {/* Year filter */}
                    <div className="flex gap-2 flex-wrap">
                      {years.map((year) => (
                        <button
                          key={year}
                          onClick={() => setSelectedYear(year)}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all ${
                            selectedYear === year
                              ? 'bg-gradient-to-r from-theme-primary to-theme-secondary text-white'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                          }`}
                        >
                          {year === 'all' ? 'All Years' : year}
                        </button>
                      ))}
                    </div>

                    {/* Type filter */}
                    <div className="flex gap-2 flex-wrap">
                      {types.map((type) => (
                        <button
                          key={type}
                          onClick={() => setSelectedType(type)}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all ${
                            selectedType === type
                              ? 'bg-gradient-to-r from-theme-primary to-theme-secondary text-white'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                          }`}
                        >
                          {type === 'all' ? 'All Types' : type}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Results */}
                <div className="overflow-y-auto p-4 flex-1">
                  {filteredResults.length > 0 ? (
                    <div className="space-y-2">
                      {filteredResults.slice(0, 10).map((result, index) => (
                        <motion.a
                          key={index}
                          href={result.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.03 }}
                          className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all group"
                          onClick={handleClose}
                        >
                          {/* Thumbnail */}
                          <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 relative">
                            <img
                              src={result.image}
                              alt={result.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              onError={(e) => {
                                // Fallback to hqdefault if maxresdefault fails
                                if (e.target.src.includes('maxresdefault')) {
                                  e.target.src = e.target.src.replace('maxresdefault', 'hqdefault');
                                }
                              }}
                            />
                            {result.category === 'youtube' && (
                              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M8 5v14l11-7z" />
                                </svg>
                              </div>
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-theme-primary transition-colors">
                              {result.title}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {result.type} • {result.year} • {result.category === 'youtube' ? 'YouTube' : 'Spotify'}
                            </p>
                          </div>

                          {/* Badge */}
                          {result.category === 'spotify' && result.streams && (
                            <div className="text-right">
                              <p className="text-xs font-semibold text-theme-primary">
                                {result.streams}
                              </p>
                            </div>
                          )}

                          {/* Arrow */}
                          <svg className="w-5 h-5 text-gray-400 group-hover:text-theme-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6l6 6-6 6" />
                          </svg>
                        </motion.a>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">🔍</div>
                      <h3 className="font-bold text-xl mb-2 text-gray-900 dark:text-white">
                        No results found
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        Try adjusting your search or filters
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                    <span>{filteredResults.length} results</span>
                    <span>•</span>
                    <span>Press <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs">ESC</kbd> to close</span>
                  </div>
                  <a
                    href="/directory"
                    className="px-4 py-2 bg-gradient-to-r from-theme-primary to-theme-secondary text-white text-sm font-bold rounded-full hover:shadow-lg transition-all"
                    onClick={handleClose}
                  >
                    Show All
                  </a>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default SearchModal;
