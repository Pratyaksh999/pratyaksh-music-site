import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { isAdmin } from '../utils/adminCheck';
import { db } from '../firebase/config';
import { collection, getDocs, query, orderBy, doc, updateDoc, increment } from 'firebase/firestore';
import LyricsEditor from './LyricsEditor';
import LyricsVisualizer from './LyricsVisualizer';
import WaveVisualizer from './WaveVisualizer';
import CircleVisualizer from './CircleVisualizer';

const LyricsViewer = ({ editMode = false }) => {
  const { user } = useAuth();
  const [songs, setSongs] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentLine, setCurrentLine] = useState(-1);
  const [showAnnotation, setShowAnnotation] = useState(null);
  const [editingSongId, setEditingSongId] = useState(null);
  const [addingNew, setAddingNew] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Track view count when a song is selected
  const trackSongView = async (songId) => {
    try {
      const songRef = doc(db, 'lyrics', songId);
      await updateDoc(songRef, {
        viewCount: increment(1),
        lastViewed: new Date()
      });
    } catch (error) {
      console.error('Error tracking view:', error);
    }
  };

  // Fetch songs with lyrics and match album art from releases
  useEffect(() => {
    const fetchSongs = async () => {
      setLoading(true);
      try {
        // Fetch lyrics
        const lyricsQuery = query(collection(db, 'lyrics'), orderBy('songTitle', 'asc'));
        const lyricsSnapshot = await getDocs(lyricsQuery);
        const songsData = lyricsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Fetch releases to get album art
        const releasesQuery = query(collection(db, 'spotify-releases'));
        const releasesSnapshot = await getDocs(releasesQuery);
        const releases = releasesSnapshot.docs.map(doc => doc.data());

        // Helper function to normalize title for matching
        const normalizeTitle = (title) => {
          return title
            ?.toLowerCase()
            .trim()
            // Remove featured artists
            .replace(/\s+(ft\.|feat\.|featuring|ft|feat)\s+.*/gi, '')
            // Remove special characters and extra spaces
            .replace(/[^\w\s]/g, '')
            .replace(/\s+/g, ' ')
            .trim();
        };

        console.log('🎵 Songs:', songsData.map(s => s.songTitle));
        console.log('📀 Releases:', releases.map(r => r.title));

        // Match songs with releases by title to get album art
        const songsWithAlbumArt = songsData.map(song => {
          const normalizedSongTitle = normalizeTitle(song.songTitle);
          console.log(`\n🔍 Matching "${song.songTitle}" → normalized: "${normalizedSongTitle}"`);

          // Try to find matching release
          const matchingRelease = releases.find(release => {
            const normalizedReleaseTitle = normalizeTitle(release.title);

            // Exact match after normalization
            if (normalizedReleaseTitle === normalizedSongTitle) {
              console.log(`  ✅ Exact match with "${release.title}"`);
              return true;
            }

            // One contains the other (partial match)
            if (normalizedReleaseTitle?.includes(normalizedSongTitle) ||
                normalizedSongTitle?.includes(normalizedReleaseTitle)) {
              console.log(`  ✅ Partial match with "${release.title}"`);
              return true;
            }

            return false;
          });

          // Override with catalog album art if found
          if (matchingRelease?.image) {
            console.log(`  🖼️ Album art: ${matchingRelease.image}`);
            return { ...song, albumArt: matchingRelease.image };
          } else {
            console.log(`  ❌ No match found`);
          }

          return song;
        });

        console.log('\n📊 Final result:', songsWithAlbumArt.filter(s => s.albumArt).length, 'songs with album art');

        setSongs(songsWithAlbumArt);

        // If we were editing a song, reselect it with updated data
        if (selectedSong) {
          const updatedSong = songsWithAlbumArt.find(s => s.id === selectedSong.id);
          if (updatedSong) {
            setSelectedSong(updatedSong);
          }
        } else if (songsWithAlbumArt.length > 0 && !selectedSong) {
          setSelectedSong(songsWithAlbumArt[0]);
        }
      } catch (error) {
        console.error('Error fetching lyrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, [refreshKey]);

  // Filter songs by search
  const filteredSongs = songs.filter(song => {
    const query = searchQuery.toLowerCase();
    const inTitle = song.songTitle?.toLowerCase().includes(query);
    const inArtist = song.artist?.toLowerCase().includes(query);
    const inLyrics = song.lines?.some(line =>
      line.text?.toLowerCase().includes(query)
    );
    return inTitle || inArtist || inLyrics;
  });

  // Highlight search matches in lyrics
  const highlightText = (text) => {
    if (!searchQuery) return text;

    const parts = text.split(new RegExp(`(${searchQuery})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === searchQuery.toLowerCase() ? (
        <mark key={i} className="bg-yellow-300 dark:bg-yellow-600">{part}</mark>
      ) : part
    );
  };

  if (loading) {
    return (
      <section className="section-padding bg-gradient-to-b from-white via-gray-50 to-white dark:from-dark-bg dark:via-dark-card dark:to-dark-bg">
        <div className="max-w-7xl mx-auto text-center py-12">
          <div className="w-12 h-12 border-4 border-theme-primary border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30 dark:from-dark-bg dark:via-purple-950/20 dark:to-pink-950/20 relative overflow-hidden">
      {/* Multi-layer Background Visualizers */}
      <LyricsVisualizer isPlaying={isPlaying} />
      <WaveVisualizer isPlaying={isPlaying} />
      <CircleVisualizer isPlaying={isPlaying} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2
            className="font-display font-black text-4xl md:text-6xl mb-3"
            animate={{
              backgroundPosition: ['0%', '100%', '0%']
            }}
            transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
          >
            <span className="text-gradient fire-glow bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-[length:200%_auto]">
              Lyrics
            </span>
          </motion.h2>
          <p className="text-gray-600 dark:text-gray-400">
            Dive into the words
          </p>
        </motion.div>

        {/* Search & Actions Bar */}
        <motion.div
          className="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between max-w-3xl mx-auto"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="relative flex-1 w-full">
            <motion.input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search songs or lyrics..."
              className="w-full pl-12 pr-4 py-3 bg-white/60 dark:bg-dark-card/60 backdrop-blur-xl border border-purple-200/50 dark:border-purple-700/50 rounded-xl focus:border-purple-500 outline-none shadow-lg transition-all"
              whileFocus={{ scale: 1.02, borderColor: '#a855f7' }}
            />
            <motion.svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              animate={{ rotate: searchQuery ? 360 : 0 }}
              transition={{ duration: 0.5 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </motion.svg>
          </div>

          {editMode && isAdmin(user) && (
            <motion.button
              onClick={() => setAddingNew(true)}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold shadow-lg whitespace-nowrap"
              whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(168, 85, 247, 0.4)' }}
              whileTap={{ scale: 0.95 }}
            >
              + Add Song
            </motion.button>
          )}
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Songs List */}
          <div className="lg:col-span-1">
            <motion.div
              className="bg-white/60 dark:bg-dark-card/60 backdrop-blur-xl rounded-xl p-4 sticky top-24 max-h-[calc(100vh-150px)] overflow-y-auto border border-gray-200/50 dark:border-gray-700/50 shadow-xl"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                {filteredSongs.length} {filteredSongs.length === 1 ? 'Song' : 'Songs'}
              </p>
              <div className="space-y-1">
                {filteredSongs.map((song, index) => (
                  <motion.div
                    key={song.id}
                    className="relative"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <motion.button
                      onClick={() => {
                        setSelectedSong(song);
                        setIsPlaying(!!song.spotifyTrackId);
                        trackSongView(song.id);
                      }}
                      className={`w-full text-left p-3 rounded-lg transition-all flex items-center gap-3 ${
                        selectedSong?.id === song.id
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-800/50'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {song.albumArt ? (
                        <img
                          src={song.albumArt}
                          alt={song.songTitle}
                          className="w-12 h-12 rounded-md object-cover shadow-md flex-shrink-0"
                          onError={(e) => {
                            console.error('Failed to load album art:', song.songTitle, song.albumArt);
                            e.target.style.display = 'none';
                          }}
                          onLoad={() => console.log('✅ Loaded:', song.songTitle)}
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-md bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                          {song.songTitle?.[0]?.toUpperCase()}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">{song.songTitle}</p>
                        <p className={`text-xs truncate ${selectedSong?.id === song.id ? 'text-white/70' : 'text-gray-500'}`}>
                          {song.artist || 'Pratyaksh Bharadwaj'}
                        </p>
                      </div>
                    </motion.button>
                    {editMode && isAdmin(user) && (
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingSongId(song.id);
                        }}
                        className="absolute top-2 right-2 w-7 h-7 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center justify-center text-xs z-10"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        ✏️
                      </motion.button>
                    )}
                  </motion.div>
                ))}

                {filteredSongs.length === 0 && (
                  <motion.p
                    className="text-center text-gray-500 py-8 text-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    No songs found
                  </motion.p>
                )}
              </div>
            </motion.div>
          </div>

          {/* Lyrics Display */}
          <div className="lg:col-span-3">
            {selectedSong ? (
              <motion.div
                className="bg-white/60 dark:bg-dark-card/60 backdrop-blur-xl rounded-xl p-5 md:p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                key={selectedSong.id}
              >
                {/* Song Header */}
                <motion.div
                  className="mb-5 pb-4 border-b border-gray-200 dark:border-gray-700"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex gap-4 mb-3">
                    {selectedSong.albumArt && (
                      <motion.img
                        src={selectedSong.albumArt}
                        alt={selectedSong.songTitle}
                        className="w-24 h-24 rounded-lg object-cover shadow-xl"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                      />
                    )}
                    <div className="flex-1">
                      <motion.h1
                        className="font-display font-bold text-2xl md:text-3xl mb-1 leading-tight"
                        initial={{ x: -20 }}
                        animate={{ x: 0 }}
                      >
                        {selectedSong.songTitle}
                      </motion.h1>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                        {selectedSong.artist || 'Pratyaksh Bharadwaj'}
                      </p>

                      <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                        {selectedSong.album && (
                          <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-full">
                            {selectedSong.album}
                          </span>
                        )}
                        {selectedSong.producers && (
                          <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-full">
                            Prod. by {selectedSong.producers}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Spotify Player */}
                  {selectedSong.spotifyTrackId && (
                    <motion.div
                      className="mt-4"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <iframe
                        src={`https://open.spotify.com/embed/track/${selectedSong.spotifyTrackId}?utm_source=generator&theme=0`}
                        width="100%"
                        height="80"
                        frameBorder="0"
                        allow="encrypted-media"
                        className="rounded-lg shadow-lg"
                        onLoad={() => setIsPlaying(true)}
                      />
                    </motion.div>
                  )}
                </motion.div>

                {/* Lyrics */}
                <div className="space-y-0 max-w-2xl">
                  {selectedSong.lines?.map((line, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.01 }}
                    >
                      <motion.div
                        className={`py-1 px-2 rounded transition-all ${
                          line.annotation
                            ? 'cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-900/20'
                            : ''
                        } ${
                          currentLine === index
                            ? 'bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 border-l-2 border-purple-500'
                            : ''
                        }`}
                        onClick={() => {
                          if (line.annotation) {
                            setShowAnnotation(showAnnotation === index ? null : index);
                          }
                        }}
                        whileHover={line.annotation ? { x: 5, scale: 1.01 } : {}}
                      >
                        <p className={`text-base md:text-lg leading-snug ${
                          line.text.trim() === '' ? 'h-3' : ''
                        }`}>
                          {highlightText(line.text)}
                          {line.annotation && (
                            <motion.span
                              className="ml-1.5 text-xs text-purple-500 opacity-50 hover:opacity-100"
                              animate={{ rotate: [0, 10, -10, 0] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              💭
                            </motion.span>
                          )}
                        </p>
                      </motion.div>

                      {/* Annotation popup */}
                      <AnimatePresence>
                        {showAnnotation === index && line.annotation && (
                          <motion.div
                            initial={{ opacity: 0, height: 0, y: -10 }}
                            animate={{ opacity: 1, height: 'auto', y: 0 }}
                            exit={{ opacity: 0, height: 0, y: -10 }}
                            className="ml-2 mb-1 p-3 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border-l-2 border-amber-400 rounded shadow-md"
                          >
                            <p className="text-xs text-gray-700 dark:text-gray-300 leading-snug">
                              💡 {line.annotation}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                className="bg-white/40 dark:bg-dark-card/40 backdrop-blur-xl rounded-xl p-20 text-center border border-gray-200/50 dark:border-gray-700/50"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <motion.svg
                  className="w-16 h-16 mx-auto mb-4 text-purple-400 dark:text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  animate={{
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </motion.svg>
                <p className="text-gray-500 dark:text-gray-400">
                  Select a song to view lyrics
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Lyrics Editor Modal */}
      <AnimatePresence>
        {(editingSongId || addingNew) && (
          <LyricsEditor
            songId={editingSongId}
            song={editingSongId ? songs.find(s => s.id === editingSongId) : null}
            isNew={addingNew}
            onSave={() => {
              setEditingSongId(null);
              setAddingNew(false);
              setRefreshKey(k => k + 1); // Refetch data without page reload
            }}
            onCancel={() => {
              setEditingSongId(null);
              setAddingNew(false);
            }}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default LyricsViewer;
