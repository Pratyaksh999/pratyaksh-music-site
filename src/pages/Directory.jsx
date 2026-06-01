import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import PageTransition from '../components/PageTransition';
import FloatingActionButtons from '../components/FloatingActionButtons';
import Breadcrumb from '../components/Breadcrumb';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { useVideos, useSpotifyReleases } from '../hooks/useFirebaseData';
import { useAuth } from '../contexts/AuthContext';
import { isAdmin } from '../utils/adminCheck';
import InlineVideoEditor from '../components/InlineVideoEditor';
import InlineCatalogEditor from '../components/InlineCatalogEditor';

const Directory = () => {
  const [ref, inView] = useInView({ triggerOnce: false, threshold: 0.1 });
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedAlbums, setExpandedAlbums] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [editingVideoId, setEditingVideoId] = useState(null);
  const [editingReleaseId, setEditingReleaseId] = useState(null);
  const [addingVideo, setAddingVideo] = useState(false);
  const [addingRelease, setAddingRelease] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const { user } = useAuth();

  // Fetch data from Firebase (false = get all videos, not just homepage)
  const { videos: firebaseVideos, loading: videosLoading } = useVideos(false);
  const { releases: firebaseReleases, loading: releasesLoading } = useSpotifyReleases();

  // Convert videos to match the format (keep original data for editing)
  const videos = firebaseVideos.map(video => ({
    id: video.id,
    title: video.title,
    type: 'Video',
    year: video.year,
    image: video.thumbnail,
    url: video.url,
    category: 'youtube',
    originalData: video // Keep for editing
  }));

  // Combined data
  const allContent = [...firebaseReleases, ...videos];
  const loading = videosLoading || releasesLoading;

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

  // Group by category
  const spotifyResults = filteredResults.filter(item => item.category === 'spotify');
  const youtubeResults = filteredResults.filter(item => item.category === 'youtube');

  // Show loading state
  if (loading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-gradient-to-b from-gray-100 via-gray-50 to-white dark:from-dark-bg dark:via-dark-card dark:to-dark-bg pt-24 pb-16 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-theme-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Loading content...</p>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <Navigation
        scrollY={scrollY}
        searchQuery=""
        onSearchChange={() => {}}
        onSearchOpen={() => {}}
        editMode={editMode}
        setEditMode={setEditMode}
      />
      <div className="min-h-screen bg-gradient-to-b from-gray-100 via-gray-50 to-white dark:from-dark-bg dark:via-dark-card dark:to-dark-bg pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Breadcrumb
              items={[
                { label: 'Home', href: '/' },
                { label: 'Directory' }
              ]}
            />
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <h1 className="font-display font-black text-5xl md:text-7xl mb-4">
              Complete <span className="text-gradient fire-glow">Directory</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Browse all {allContent.length} songs, albums, and videos
            </p>
          </motion.div>

          {/* Search & Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white dark:bg-dark-card rounded-2xl shadow-xl border-2 border-theme-primary/20 p-6 mb-12"
          >
            {/* Search Bar */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title..."
                className="flex-1 bg-transparent text-xl font-semibold text-gray-900 dark:text-white placeholder-gray-400 outline-none"
              />
            </div>

            {/* Filters */}
            <div className="space-y-4">
              {/* Year filter */}
              <div>
                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">FILTER BY YEAR</p>
                <div className="flex gap-2 flex-wrap">
                  {years.map((year) => (
                    <button
                      key={year}
                      onClick={() => setSelectedYear(year)}
                      className={`px-4 py-2 text-sm font-semibold rounded-full transition-all ${
                        selectedYear === year
                          ? 'bg-gradient-to-r from-theme-primary to-theme-secondary text-white shadow-lg'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {year === 'all' ? 'All Years' : year}
                    </button>
                  ))}
                </div>
              </div>

              {/* Type filter */}
              <div>
                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">FILTER BY TYPE</p>
                <div className="flex gap-2 flex-wrap">
                  {types.map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className={`px-4 py-2 text-sm font-semibold rounded-full transition-all ${
                        selectedType === type
                          ? 'bg-gradient-to-r from-theme-primary to-theme-secondary text-white shadow-lg'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {type === 'all' ? 'All Types' : type}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                Showing {filteredResults.length} of {allContent.length} results
              </p>
            </div>
          </motion.div>

          {/* Spotify Section */}
          {spotifyResults.length > 0 && (
            <div className="mb-16">
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="font-display font-bold text-3xl md:text-4xl mb-8 flex items-center gap-3"
              >
                <svg className="w-8 h-8 text-[#1DB954]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                </svg>
                Spotify Releases ({spotifyResults.length})
              </motion.h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {/* Add New Release Card */}
                {editMode && isAdmin(user) && (
                  <div className="relative">
                    {addingRelease ? (
                      <div className="aspect-square rounded-xl border-2 border-dashed border-theme-primary bg-gray-50 dark:bg-dark-bg relative">
                        <InlineCatalogEditor
                          isNew={true}
                          onSave={() => {
                            setAddingRelease(false);
                            window.location.reload();
                          }}
                          onCancel={() => setAddingRelease(false)}
                        />
                      </div>
                    ) : (
                      <button
                        onClick={() => setAddingRelease(true)}
                        className="aspect-square rounded-xl border-2 border-dashed border-theme-primary bg-gray-50 dark:bg-dark-bg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all w-full flex flex-col items-center justify-center gap-3 group"
                      >
                        <div className="w-16 h-16 rounded-full bg-theme-primary/10 flex items-center justify-center group-hover:bg-theme-primary/20 transition-all">
                          <svg className="w-8 h-8 text-theme-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </div>
                        <p className="font-bold text-gray-700 dark:text-gray-300">Add Release</p>
                      </button>
                    )}
                  </div>
                )}

                {spotifyResults.map((item, index) => {
                  const hasTracks = item.tracks && item.tracks.length > 0;
                  const isExpanded = expandedAlbums[item.title];

                  return (
                    <div key={item.id || index} className="relative">
                      {/* Edit Button */}
                      {editMode && isAdmin(user) && item.id && (
                        <button
                          onClick={() => setEditingReleaseId(item.id)}
                          className="absolute top-2 right-2 z-20 w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-all shadow-lg"
                        >
                          ✏️
                        </button>
                      )}

                      {/* Inline Editor */}
                      <AnimatePresence>
                        {editingReleaseId === item.id && (
                          <div className="absolute inset-0 z-30">
                            <InlineCatalogEditor
                              release={item}
                              onSave={() => {
                                setEditingReleaseId(null);
                                window.location.reload();
                              }}
                              onDelete={() => {
                                setEditingReleaseId(null);
                                window.location.reload();
                              }}
                              onCancel={() => setEditingReleaseId(null)}
                            />
                          </div>
                        )}
                      </AnimatePresence>

                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                      className="bg-white dark:bg-dark-card rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 hover:border-theme-primary transition-all hover:shadow-xl"
                    >
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block group"
                      >
                        <div className="aspect-square overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-lg mb-1 group-hover:text-theme-primary transition-colors line-clamp-1">
                            {item.title}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                            {item.type} • {item.year}
                          </p>
                          {item.streams && (
                            <p className="text-xs font-semibold text-theme-secondary">
                              {item.streams}
                            </p>
                          )}
                        </div>
                      </a>

                      {/* Show Tracks Button for Albums/EPs */}
                      {hasTracks && (
                        <div className="px-4 pb-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedAlbums(prev => ({
                                ...prev,
                                [item.title]: !prev[item.title]
                              }));
                            }}
                            className="w-full px-3 py-2 text-sm font-semibold text-theme-primary border-2 border-theme-primary rounded-lg hover:bg-theme-primary hover:text-white transition-all flex items-center justify-center gap-2"
                          >
                            <span>{isExpanded ? 'Hide' : 'Show'} Tracklist ({item.tracks.length})</span>
                            <svg
                              className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>

                          {/* Tracklist */}
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                              >
                                <div className="mt-3 space-y-1 max-h-64 overflow-y-auto">
                                  {item.tracks.map((track) => (
                                    <a
                                      key={track.number}
                                      href={item.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-start gap-2 py-1.5 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer group"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <span className="text-xs font-semibold text-gray-400 min-w-[20px]">
                                        {track.number}.
                                      </span>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium text-gray-900 dark:text-white group-hover:text-theme-primary transition-colors line-clamp-2">
                                          {track.name}
                                        </p>
                                      </div>
                                      <svg className="w-3 h-3 text-gray-400 group-hover:text-theme-primary transition-colors flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                      </svg>
                                    </a>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}
                    </motion.div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* YouTube Section */}
          {youtubeResults.length > 0 && (
            <div>
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="font-display font-bold text-3xl md:text-4xl mb-8 flex items-center gap-3"
              >
                <svg className="w-8 h-8 text-[#FF0000]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"/>
                  <path fill="#fff" d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                Music Videos ({youtubeResults.length})
              </motion.h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {/* Add New Video Card */}
                {editMode && isAdmin(user) && (
                  <div className="relative">
                    {addingVideo ? (
                      <div className="aspect-video rounded-xl border-2 border-dashed border-theme-primary bg-gray-50 dark:bg-dark-bg relative">
                        <InlineVideoEditor
                          isNew={true}
                          onSave={() => {
                            setAddingVideo(false);
                            window.location.reload();
                          }}
                          onCancel={() => setAddingVideo(false)}
                        />
                      </div>
                    ) : (
                      <button
                        onClick={() => setAddingVideo(true)}
                        className="aspect-video rounded-xl border-2 border-dashed border-theme-primary bg-gray-50 dark:bg-dark-bg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all w-full flex flex-col items-center justify-center gap-3 group"
                      >
                        <div className="w-16 h-16 rounded-full bg-theme-primary/10 flex items-center justify-center group-hover:bg-theme-primary/20 transition-all">
                          <svg className="w-8 h-8 text-theme-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </div>
                        <p className="font-bold text-gray-700 dark:text-gray-300">Add Video</p>
                      </button>
                    )}
                  </div>
                )}

                {youtubeResults.map((item, index) => (
                  <div key={item.id || index} className="relative">
                    {/* Edit Button */}
                    {editMode && isAdmin(user) && item.id && (
                      <button
                        onClick={() => setEditingVideoId(item.id)}
                        className="absolute top-2 right-2 z-20 w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-all shadow-lg"
                      >
                        ✏️
                      </button>
                    )}

                    {/* Inline Editor */}
                    <AnimatePresence>
                      {editingVideoId === item.id && (
                        <div className="absolute inset-0 z-30">
                          <InlineVideoEditor
                            video={item.originalData}
                            onSave={() => {
                              setEditingVideoId(null);
                              window.location.reload();
                            }}
                            onDelete={() => {
                              setEditingVideoId(null);
                              window.location.reload();
                            }}
                            onCancel={() => setEditingVideoId(null)}
                          />
                        </div>
                      )}
                    </AnimatePresence>

                    <motion.a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                      className="group bg-white dark:bg-dark-card rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 hover:border-theme-primary transition-all hover:shadow-xl block"
                      whileHover={{ y: -5 }}
                    >
                      <div className="aspect-video overflow-hidden relative">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            // Fallback to hqdefault if maxresdefault fails
                            if (e.target.src.includes('maxresdefault')) {
                              e.target.src = e.target.src.replace('maxresdefault', 'hqdefault');
                            }
                          }}
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-12 h-12 bg-[#FF0000] rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-lg mb-1 group-hover:text-theme-primary transition-colors line-clamp-1">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {item.type} • {item.year}
                        </p>
                      </div>
                    </motion.a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {filteredResults.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="text-8xl mb-6">🔍</div>
              <h3 className="font-bold text-2xl mb-3 text-gray-900 dark:text-white">
                No results found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Try adjusting your search or filters
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedYear('all');
                  setSelectedType('all');
                }}
                className="px-6 py-3 bg-gradient-to-r from-theme-primary to-theme-secondary text-white font-bold rounded-full hover:shadow-lg transition-all"
              >
                Clear Filters
              </button>
            </motion.div>
          )}
        </div>
      </div>
      <FloatingActionButtons />
      <Footer />
    </PageTransition>
  );
};

export default Directory;
