import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useAuth } from '../contexts/AuthContext';
import { isAdmin } from '../utils/adminCheck';
import InlinePlaylistEditor from './InlinePlaylistEditor';
import InlineCollabEditor from './InlineCollabEditor';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';

const FeaturedCollabs = ({ editMode = false }) => {
  const [ref, inView] = useInView({ triggerOnce: false, threshold: 0.1 });
  const { user } = useAuth();
  const [editingPlaylistId, setEditingPlaylistId] = useState(null);
  const [editingCollabId, setEditingCollabId] = useState(null);
  const [addingPlaylist, setAddingPlaylist] = useState(false);
  const [addingCollab, setAddingCollab] = useState(false);
  const [firebasePlaylists, setFirebasePlaylists] = useState([]);
  const [firebaseCollabs, setFirebaseCollabs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load playlists and collabs from Firebase
  useEffect(() => {
    const loadData = async () => {
      try {
        const playlistsSnap = await getDocs(collection(db, 'featured-playlists'));
        const playlistsData = playlistsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const collabsSnap = await getDocs(collection(db, 'featured-artists'));
        const collabsData = collabsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        if (playlistsData.length > 0) setFirebasePlaylists(playlistsData);
        if (collabsData.length > 0) setFirebaseCollabs(collabsData);
      } catch (error) {
        console.error('Error loading featured content:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Fallback hardcoded data
  const hardcodedPlaylists = [
    {
      name: 'Desi Hip Hop',
      curator: 'Spotify',
      followers: '125K+',
      image: '/images/albums/rebirth.jpg',
      color: 'from-purple-500 to-pink-500',
      url: 'https://open.spotify.com/playlist/37i9dQZF1DX7HOk71GPfSw'
    },
    {
      name: 'Indian Indie',
      curator: 'Independent Artists',
      followers: '85K+',
      image: '/images/albums/darmiyaan.jpg',
      color: 'from-blue-500 to-cyan-500',
      url: 'https://open.spotify.com/playlist/37i9dQZF1DX0XUfTFmNBRM'
    },
    {
      name: 'Fresh Finds India',
      curator: 'Spotify Editorial',
      followers: '200K+',
      image: '/images/albums/lost-cassette.jpg',
      color: 'from-green-500 to-emerald-500',
      url: 'https://open.spotify.com/playlist/37i9dQZF1DWWMOmoXKqHTD'
    }
  ];

  const hardcodedCollaborations = [
    {
      track: 'Tu Hi Bata',
      featuring: 'Ananya Pandey',
      type: 'feat.',
      year: '2023',
      image: '/images/albums/eleven-seasons.jpg',
      url: 'https://open.spotify.com/track/RGxPbbRJOFM',
      color: 'from-pink-500 to-rose-500'
    },
    {
      track: 'Darmiyaan',
      featuring: 'Srishti Chauhan',
      type: 'feat.',
      year: '2025',
      image: '/images/albums/darmiyaan.jpg',
      url: 'https://open.spotify.com/album/221I7MJXRzctQdU3TMX2Ai',
      color: 'from-purple-500 to-indigo-500'
    },
    {
      track: 'Tere Hawaale',
      featuring: 'Akshun',
      type: 'feat.',
      year: '2025',
      image: '/images/albums/tere-hawaale.jpg',
      url: 'https://open.spotify.com/album/4c0CLoV4gSEn6Q6qKtPKtg',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      track: 'Boom Bap Shit',
      featuring: 'Kartikk',
      type: 'feat.',
      year: '2026',
      image: '/images/albums/rebirth.jpg',
      url: 'https://open.spotify.com/album/5F5BHw4uM2cyJ78phQDQtC',
      color: 'from-orange-500 to-red-500'
    }
  ];

  const playlists = firebasePlaylists.length > 0 ? firebasePlaylists : hardcodedPlaylists;
  const collaborations = firebaseCollabs.length > 0 ? firebaseCollabs : hardcodedCollaborations;

  return (
    <section
      ref={ref}
      className="section-padding bg-gradient-to-b from-white via-gray-50 to-white dark:from-dark-bg dark:via-dark-card dark:to-dark-bg relative overflow-hidden border-t border-gray-200 dark:border-theme-primary/10"
    >
      {/* Background decoration */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-theme-primary/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Featured Playlists Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <p className="text-theme-secondary font-semibold tracking-widest text-sm mb-3">
              PLAYLIST FEATURES
            </p>
            <h2 className="font-display font-black text-5xl md:text-7xl mb-4">
              Featured <span className="text-gradient fire-glow">Playlists</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
              Music featured in curated playlists reaching thousands of listeners
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Add Playlist Card */}
            {editMode && isAdmin(user) && (
              <div className="relative">
                {addingPlaylist ? (
                  <AnimatePresence>
                    <InlinePlaylistEditor
                      isNew={true}
                      onSave={() => {
                        setAddingPlaylist(false);
                        window.location.reload();
                      }}
                      onCancel={() => setAddingPlaylist(false)}
                    />
                  </AnimatePresence>
                ) : (
                  <button
                    onClick={() => setAddingPlaylist(true)}
                    className="aspect-square rounded-xl border-2 border-dashed border-theme-primary bg-gray-50 dark:bg-dark-bg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all w-full flex flex-col items-center justify-center gap-3 group"
                  >
                    <div className="w-16 h-16 rounded-full bg-theme-primary/10 flex items-center justify-center group-hover:bg-theme-primary/20 transition-all">
                      <svg className="w-8 h-8 text-theme-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <p className="font-bold text-gray-700 dark:text-gray-300">Add Playlist</p>
                  </button>
                )}
              </div>
            )}

            {playlists.map((playlist, index) => (
              <div key={playlist.id || index} className="relative">
                {/* Edit Button */}
                {editMode && isAdmin(user) && playlist.id && (
                  <button
                    onClick={() => setEditingPlaylistId(playlist.id)}
                    className="absolute top-2 right-2 z-20 w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-all shadow-lg"
                  >
                    ✏️
                  </button>
                )}

                {/* Inline Editor */}
                <AnimatePresence>
                  {editingPlaylistId === playlist.id && (
                    <InlinePlaylistEditor
                      playlist={playlist}
                      onSave={() => {
                        setEditingPlaylistId(null);
                        window.location.reload();
                      }}
                      onDelete={() => {
                        setEditingPlaylistId(null);
                        window.location.reload();
                      }}
                      onCancel={() => setEditingPlaylistId(null)}
                    />
                  )}
                </AnimatePresence>

              <motion.a
                key={playlist.id || index}
                href={playlist.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 50 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="group block"
                whileHover={{ y: -10 }}
              >
                <div className="relative bg-white dark:bg-dark-card rounded-2xl overflow-hidden border-2 border-theme-primary/20 hover:border-theme-primary transition-all shadow-lg hover:shadow-2xl">
                  {/* Gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${playlist.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />

                  {/* Playlist cover */}
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={playlist.image}
                      alt={playlist.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  {/* Playlist info */}
                  <div className="p-6">
                    <h3 className="font-bold text-xl mb-2 group-hover:text-theme-secondary transition-colors">
                      {playlist.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                      Curated by {playlist.curator}
                    </p>

                    {/* Followers badge */}
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">👥</span>
                      <span className="font-bold text-theme-primary">{playlist.followers}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">followers</span>
                    </div>

                    {/* Play button overlay */}
                    <div className="absolute top-4 right-4 w-12 h-12 bg-theme-primary rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                      <svg className="w-6 h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </motion.a>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Collaborations Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="text-center mb-12">
            <p className="text-theme-secondary font-semibold tracking-widest text-sm mb-3">
              ARTIST COLLABORATIONS
            </p>
            <h2 className="font-display font-black text-5xl md:text-7xl mb-4">
              Featured <span className="text-gradient fire-glow">Artists</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
              Songs featuring talented artists from the music community
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Add Collaboration Card */}
            {editMode && isAdmin(user) && (
              <div className="relative">
                {addingCollab ? (
                  <AnimatePresence>
                    <InlineCollabEditor
                      isNew={true}
                      onSave={() => {
                        setAddingCollab(false);
                        window.location.reload();
                      }}
                      onCancel={() => setAddingCollab(false)}
                    />
                  </AnimatePresence>
                ) : (
                  <button
                    onClick={() => setAddingCollab(true)}
                    className="aspect-square rounded-xl border-2 border-dashed border-theme-primary bg-gray-50 dark:bg-dark-bg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all w-full flex flex-col items-center justify-center gap-3 group"
                  >
                    <div className="w-16 h-16 rounded-full bg-theme-primary/10 flex items-center justify-center group-hover:bg-theme-primary/20 transition-all">
                      <svg className="w-8 h-8 text-theme-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <p className="font-bold text-gray-700 dark:text-gray-300">Add Artist</p>
                  </button>
                )}
              </div>
            )}

            {collaborations.map((collab, index) => (
              <div key={collab.id || index} className="relative">
                {/* Edit Button */}
                {editMode && isAdmin(user) && collab.id && (
                  <button
                    onClick={() => setEditingCollabId(collab.id)}
                    className="absolute top-2 right-2 z-20 w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-all shadow-lg"
                  >
                    ✏️
                  </button>
                )}

                {/* Inline Editor */}
                <AnimatePresence>
                  {editingCollabId === collab.id && (
                    <InlineCollabEditor
                      collab={collab}
                      onSave={() => {
                        setEditingCollabId(null);
                        window.location.reload();
                      }}
                      onDelete={() => {
                        setEditingCollabId(null);
                        window.location.reload();
                      }}
                      onCancel={() => setEditingCollabId(null)}
                    />
                  )}
                </AnimatePresence>

              <motion.a
                key={collab.id || index}
                href={collab.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group block"
              >
                <motion.div
                  className="bg-white dark:bg-dark-card rounded-2xl overflow-hidden border-2 border-theme-primary/20 hover:border-theme-primary transition-all h-full shadow-lg hover:shadow-xl"
                  whileHover={{ y: -5 }}
                >
                  {/* Album art */}
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={collab.image}
                      alt={collab.track}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* Gradient overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${collab.color} opacity-0 group-hover:opacity-30 transition-opacity duration-500`} />

                    {/* Play button */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                        <svg className="w-8 h-8 text-theme-primary ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Track info */}
                  <div className="p-5">
                    <h3 className="font-bold text-lg mb-2 group-hover:text-theme-secondary transition-colors">
                      {collab.track}
                    </h3>

                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm text-gray-500 dark:text-gray-400">{collab.type}</span>
                      <span className="font-semibold text-theme-primary">{collab.featuring}</span>
                    </div>

                    {/* Year badge */}
                    <div className="inline-block px-3 py-1 bg-theme-primary/10 text-theme-primary text-xs font-bold rounded-full">
                      {collab.year}
                    </div>
                  </div>
                </motion.div>
              </motion.a>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 1 }}
          className="text-center mt-16"
        >
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Want to collaborate or feature my music?
          </p>
          <motion.a
            href="mailto:pratyakshbharadwaj@gmail.com"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-theme-primary to-theme-secondary text-white font-bold rounded-full hover:shadow-xl hover:shadow-theme-primary/50 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Get In Touch
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedCollabs;
