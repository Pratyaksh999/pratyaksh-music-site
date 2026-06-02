import React, { useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import ScrollReveal from './ScrollReveal';
import InteractiveAlbumCard from './InteractiveAlbumCard';
import { useSpotifyReleases } from '../hooks/useFirebaseData';
import { useAuth } from '../contexts/AuthContext';
import InlineCatalogEditor from './InlineCatalogEditor';
import { isAdmin } from '../utils/adminCheck';

const Catalog = ({ editMode = false }) => {
  const [ref, inView] = useInView({ triggerOnce: false, threshold: 0.1 });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const titleScale = useTransform(scrollYProgress, [0.3, 0.5], [0.8, 1.1]);
  const { releases: firebaseReleases, loading } = useSpotifyReleases();
  const { user } = useAuth();
  const [editingReleaseId, setEditingReleaseId] = useState(null);
  const [addingNew, setAddingNew] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Fallback hardcoded releases if Firebase is empty
  const hardcodedReleases = [
    { title: 'Rebirth', type: 'Album', year: '2026', streams: 'Latest', image: '/images/albums/rebirth.jpg', url: 'https://open.spotify.com/album/5F5BHw4uM2cyJ78phQDQtC' },
    { title: 'Darmiyaan', type: 'Single', year: '2025', streams: '18.6K', image: '/images/albums/darmiyaan.jpg', url: 'https://open.spotify.com/album/221I7MJXRzctQdU3TMX2Ai' },
    { title: 'No Love', type: 'Single', year: '2025', streams: 'New', image: '/images/albums/no-love.jpg', url: 'https://open.spotify.com/album/7c4p3y3mNQqyW0EiaqTrd8' },
    { title: 'Daastaan-E-Ishq', type: 'Single', year: '2025', streams: 'New', image: '/images/albums/daastaan.jpg', url: 'https://open.spotify.com/album/49xpZ0RGtWMtZXQJr08K5x' },
    { title: 'Tere Hawaale', type: 'Single', year: '2025', streams: 'New', image: '/images/albums/tere-hawaale.jpg', url: 'https://open.spotify.com/album/4c0CLoV4gSEn6Q6qKtPKtg' },
    { title: 'Mystery Lady', type: 'Single', year: '2025', streams: 'New', image: '/images/albums/mystery-lady.jpg', url: 'https://open.spotify.com/album/2VTiLax7RZRSmIlvjw27d5' },
    { title: 'The Lost Cassette', type: 'Album', year: '2024', streams: 'Hot', image: '/images/albums/lost-cassette.jpg', url: 'https://open.spotify.com/album/4m6ahPcHJW9rXRpugqsC1L' },
    { title: 'Wish You Were Here', type: 'Album', year: '2024', streams: 'Popular', image: '/images/albums/wish-you-were-here.jpg', url: 'https://open.spotify.com/album/1JpHvOQXlE5D7njVO6IiLr' },
    { title: 'Lost In Letters', type: 'EP', year: '2024', streams: 'EP', image: '/images/albums/lost-in-letters.jpg', url: 'https://open.spotify.com/album/1pRoqSvdGS57qHrNkJDXBu' },
    { title: 'Prom Queen', type: 'Single', year: '2024', streams: 'Single', image: '/images/albums/prom-queen.jpg', url: 'https://open.spotify.com/album/0pL1lrm6ChWtrX6GqP5tS4' },
    { title: 'Eleven Seasons', type: 'Album', year: '2023', streams: 'Album', image: '/images/albums/eleven-seasons.jpg', url: 'https://open.spotify.com/album/6mRsV3wWpM3zzF7aMctz9t' },
    { title: 'Mere Saath', type: 'Single', year: '2023', streams: 'Single', image: '/images/albums/mere-saath.jpg', url: 'https://open.spotify.com/album/2fvMjgsqlgHC3jjGiSvNrs' },
  ];

  const releases = firebaseReleases.length > 0 ? firebaseReleases : hardcodedReleases;

  console.log('Catalog - releases count:', releases.length, 'loading:', loading, 'inView:', inView);

  if (loading) {
    return (
      <section id="catalog" className="section-padding bg-gradient-to-b from-gray-100 via-gray-50 to-white dark:from-dark-bg dark:to-dark-card">
        <div className="max-w-7xl mx-auto text-center py-12">
          <div className="w-12 h-12 border-4 border-theme-primary border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </section>
    );
  }

  return (
    <section id="catalog" className="section-padding bg-gradient-to-b from-gray-100 via-gray-50 to-white dark:from-dark-bg dark:to-dark-card border-t border-gray-200 dark:border-theme-primary/10" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <ScrollReveal direction="left" className="mb-16">
          <p className="text-theme-secondary font-semibold tracking-widest text-sm mb-3">
            FULL DISCOGRAPHY
          </p>
          <motion.h2
            className="font-display font-black text-4xl md:text-5xl lg:text-7xl"
            style={{ scale: titleScale }}
          >
            The <span className="text-gradient fire-glow">Catalog</span>
          </motion.h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {/* Add New Release Card */}
          {editMode && isAdmin(user) && (
            <div className="relative">
              {addingNew ? (
                <div className="aspect-square rounded-xl border-2 border-dashed border-theme-primary bg-gray-50 dark:bg-dark-bg relative">
                  <InlineCatalogEditor
                    isNew={true}
                    onSave={() => {
                      setAddingNew(false);
                      setRefreshKey(k => k + 1);
                      window.location.reload();
                    }}
                    onCancel={() => setAddingNew(false)}
                  />
                </div>
              ) : (
                <button
                  onClick={() => setAddingNew(true)}
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

          {releases.map((release, index) => (
            <div key={release.id || index} className="relative">
              {/* Edit Button */}
              {editMode && isAdmin(user) && release.id && (
                <button
                  onClick={() => setEditingReleaseId(release.id)}
                  className="absolute top-2 right-2 z-20 w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-all shadow-lg"
                >
                  ✏️
                </button>
              )}

              {/* Inline Editor */}
              <AnimatePresence>
                {editingReleaseId === release.id && (
                  <div className="absolute inset-0 z-30">
                    <InlineCatalogEditor
                      release={release}
                      onSave={() => {
                        setEditingReleaseId(null);
                        setRefreshKey(k => k + 1);
                        window.location.reload();
                      }}
                      onDelete={() => {
                        setEditingReleaseId(null);
                        setRefreshKey(k => k + 1);
                        window.location.reload();
                      }}
                      onCancel={() => setEditingReleaseId(null)}
                    />
                  </div>
                )}
              </AnimatePresence>

              <InteractiveAlbumCard
                release={release}
                index={index}
                inView={inView}
                scrollProgress={scrollYProgress}
              />
            </div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          className="text-center mt-16"
        >
          <motion.a
            href="https://open.spotify.com/artist/4xwROKTcnt5K1GmLitjPz4"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-10 py-4 bg-gray-100 dark:bg-dark-card text-gray-900 dark:text-white font-bold rounded-full border-2 border-theme-primary/30 hover:!border-[#1DB954] hover:!bg-[#1DB954] hover:!text-white hover:shadow-xl hover:shadow-[#1DB954]/50 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View Complete Catalog on Spotify
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default Catalog;
