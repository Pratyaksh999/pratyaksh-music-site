import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useVideos } from '../hooks/useFirebaseData';
import { useAuth } from '../contexts/AuthContext';
import { isAdmin } from '../utils/adminCheck';
import InlineVideoEditor from './InlineVideoEditor';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';

const YouTubeVideos = ({ editMode = false }) => {
  const [ref, inView] = useInView({ triggerOnce: false, threshold: 0.1 });
  const [refreshKey, setRefreshKey] = useState(0);
  const { videos: allVideos, loading } = useVideos(true, refreshKey); // Pass refreshKey to force refetch
  const { user } = useAuth();
  const [editingVideoId, setEditingVideoId] = useState(null);
  const [addingNew, setAddingNew] = useState(false);

  // Get Firebase document IDs
  const [videoFirebaseIds, setVideoFirebaseIds] = useState({});

  React.useEffect(() => {
    const fetchFirebaseIds = async () => {
      const q = query(collection(db, 'videos'), where('showOnHomepage', '==', true));
      const snapshot = await getDocs(q);
      const ids = {};
      snapshot.docs.forEach(doc => {
        ids[doc.data().videoId] = doc.id;
      });
      setVideoFirebaseIds(ids);
    };
    fetchFirebaseIds();
  }, [refreshKey]);

  // Map to expected format with Firebase IDs
  const videos = allVideos.map(video => ({
    id: video.id,
    title: video.title,
    url: video.url,
    thumbnail: video.thumbnail,
    year: video.year,
    firebaseId: videoFirebaseIds[video.id]
  }));

  /* Original hardcoded videos
  const videosOld = [
    {
      id: 'RGxPbbRJOFM',
      title: 'Tu Hi Bata',
      url: 'https://youtu.be/RGxPbbRJOFM',
      thumbnail: `https://img.youtube.com/vi/RGxPbbRJOFM/hqdefault.jpg`
    },
    {
      id: 'O1P-AXbGA8c',
      title: 'Fantasy',
      url: 'https://youtu.be/O1P-AXbGA8c',
      thumbnail: `https://img.youtube.com/vi/O1P-AXbGA8c/hqdefault.jpg`
    },
    {
      id: 'xmagCPYzGzY',
      title: 'Taamjhaam',
      url: 'https://youtu.be/xmagCPYzGzY',
      thumbnail: `https://img.youtube.com/vi/xmagCPYzGzY/hqdefault.jpg`
    },
    {
      id: 'Kxa9gH2s-Z0',
      title: 'RAP KI MUSCLE',
      url: 'https://youtu.be/Kxa9gH2s-Z0',
      thumbnail: `https://img.youtube.com/vi/Kxa9gH2s-Z0/hqdefault.jpg`
    },
    {
      id: 'WmxYYWGm2_s',
      title: 'Roll Kar',
      url: 'https://youtu.be/WmxYYWGm2_s',
      thumbnail: `https://img.youtube.com/vi/WmxYYWGm2_s/hqdefault.jpg`
    },
    {
      id: '3lttSGG4QEw',
      title: 'Mujhse Badha',
      url: 'https://youtu.be/3lttSGG4QEw',
      thumbnail: `https://img.youtube.com/vi/3lttSGG4QEw/hqdefault.jpg`
    },
    {
      id: 'DrIUTk38z-k',
      title: 'Jon Snow Freeverse',
      url: 'https://youtu.be/DrIUTk38z-k',
      thumbnail: `https://img.youtube.com/vi/DrIUTk38z-k/hqdefault.jpg`
    }
  ];
  */

  if (loading) {
    return (
      <section id="videos" className="section-padding bg-gradient-to-br from-white via-gray-100 to-gray-50 dark:from-dark-card dark:via-dark-card dark:to-dark-card relative overflow-hidden border-t border-gray-200 dark:border-theme-primary/10" ref={ref}>
        <div className="max-w-7xl mx-auto text-center py-12">
          <div className="w-12 h-12 border-4 border-theme-primary border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </section>
    );
  }

  return (
    <section id="videos" className="section-padding bg-gradient-to-br from-white via-gray-100 to-gray-50 dark:from-dark-card dark:via-dark-card dark:to-dark-card relative overflow-hidden border-t border-gray-200 dark:border-theme-primary/10" ref={ref}>
      {/* Background decoration */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-theme-secondary/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <p className="text-theme-secondary font-semibold tracking-widest text-sm mb-3">
            YOUTUBE CHANNEL
          </p>
          <h2 className="font-display font-black text-5xl md:text-7xl mb-4">
            Music <span className="text-gradient fire-glow">Videos</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl">
            Watch my latest music videos and visual stories
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Add New Video Card (only in edit mode) */}
          {editMode && isAdmin(user) && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative"
            >
              {addingNew ? (
                <div className="aspect-video rounded-xl border-2 border-dashed border-theme-primary bg-gray-50 dark:bg-dark-bg relative">
                  <InlineVideoEditor
                    isNew={true}
                    onSave={() => {
                      setAddingNew(false);
                      setRefreshKey(k => k + 1);
                    }}
                    onCancel={() => setAddingNew(false)}
                  />
                </div>
              ) : (
                <button
                  onClick={() => setAddingNew(true)}
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
            </motion.div>
          )}

          {videos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative"
            >
              {/* Edit Button (only visible in edit mode) */}
              {editMode && isAdmin(user) && (
                <button
                  onClick={() => setEditingVideoId(video.id)}
                  className="absolute top-2 right-2 z-20 w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-all shadow-lg"
                >
                  ✏️
                </button>
              )}

              {/* Inline Editor */}
              <AnimatePresence>
                {editingVideoId === video.id && (
                  <InlineVideoEditor
                    video={video}
                    onSave={() => {
                      setEditingVideoId(null);
                      setRefreshKey(k => k + 1);
                    }}
                    onDelete={() => {
                      setEditingVideoId(null);
                      setRefreshKey(k => k + 1);
                    }}
                    onCancel={() => setEditingVideoId(null)}
                  />
                )}
              </AnimatePresence>

              <motion.a
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="relative aspect-video rounded-xl overflow-hidden border-2 border-theme-primary/30 group-hover:border-theme-primary transition-all duration-500 cursor-pointer">
                  {/* Thumbnail */}
                  <img
                    src={video.thumbnail ? video.thumbnail.replace('hqdefault', 'maxresdefault') : `https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`}
                    alt={video.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      // Fallback to high quality if maxres not available
                      if (e.target.src.includes('maxresdefault')) {
                        e.target.src = e.target.src.replace('maxresdefault', 'hqdefault');
                      }
                    }}
                  />

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-center justify-center">
                    <motion.div
                      className="w-16 h-16 bg-theme-primary rounded-full flex items-center justify-center shadow-xl shadow-theme-primary/50"
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <svg
                        className="w-8 h-8 text-white ml-1"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </motion.div>
                  </div>

                  {/* Watch on YouTube Badge */}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-theme-primary px-3 py-1.5 rounded-full flex items-center gap-2">
                      <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"/>
                        <path fill="#FF0000" d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                      <span className="text-white text-xs font-bold">Watch</span>
                    </div>
                  </div>
                </div>

                {/* Video Title Below */}
                <div className="mt-4">
                  <h3 className="font-bold text-lg group-hover:text-theme-secondary transition-colors">
                    {video.title}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                    Click to watch on YouTube
                  </p>
                </div>
              </motion.a>
            </motion.div>
          ))}
        </div>

        {/* View All Videos Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-16"
        >
          <motion.a
            href="/directory"
            className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-theme-primary to-theme-secondary text-white font-bold rounded-full hover:shadow-xl hover:shadow-theme-primary/50 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
            View All Videos ({allVideos.length})
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default YouTubeVideos;
