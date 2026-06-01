import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import ScrollReveal from './ScrollReveal';
import ShareButton from './ShareButton';
import { useSpotifyData } from '../hooks/useSpotifyData';
import { useAuth } from '../contexts/AuthContext';
import { isAdmin } from '../utils/adminCheck';
import InlineLatestReleaseEditor from './InlineLatestReleaseEditor';
import { db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';

const LatestRelease = ({ editMode = false }) => {
  const [ref, inView] = useInView({ triggerOnce: false, threshold: 0.2 });
  const { scrollYProgress } = useScroll();
  const { followers, monthlyListeners, formattedFollowers, formattedMonthlyListeners, loading } = useSpotifyData();
  const { user } = useAuth();
  const [showEditor, setShowEditor] = useState(false);
  const [releaseData, setReleaseData] = useState({
    title: 'Rebirth',
    type: 'Album',
    year: '2026',
    description: 'The latest chapter in Pratyaksh Bharadwaj\'s musical journey. A collection of tracks that showcase lyrical depth and soothing melodies, inspiring listeners through authentic storytelling and emotional resonance.',
    spotifyUrl: 'https://open.spotify.com/album/5F5BHw4uM2cyJ78phQDQtC',
    youtubeUrl: 'https://youtube.com/@pratyakshbharadwaj',
    image: '/images/albums/rebirth.jpg'
  });

  // Load release data from Firebase
  useEffect(() => {
    const loadReleaseData = async () => {
      try {
        const docRef = doc(db, 'site-config', 'latest-release');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setReleaseData(docSnap.data());
        }
      } catch (error) {
        console.error('Error loading latest release:', error);
      }
    };

    loadReleaseData();
  }, []);

  // Parallax for album art
  const albumY = useTransform(scrollYProgress, [0.1, 0.4], [100, -100]);
  const albumRotate = useTransform(scrollYProgress, [0.1, 0.4], [-5, 5]);
  const titleX = useTransform(scrollYProgress, [0.2, 0.5], [-100, 100]);

  return (
    <section id="latest" className="section-padding bg-gradient-to-b from-white via-gray-50 to-gray-100 dark:from-dark-bg dark:to-dark-bg border-t border-gray-200 dark:border-theme-primary/10 relative" ref={ref}>
      {/* Edit Button */}
      {editMode && isAdmin(user) && (
        <button
          onClick={() => setShowEditor(true)}
          className="absolute top-8 right-8 z-20 px-4 py-2 bg-blue-500 text-white rounded-full font-semibold hover:bg-blue-600 transition-all shadow-lg"
        >
          ✏️ Edit Latest Release
        </button>
      )}

      {/* Editor */}
      <AnimatePresence>
        {showEditor && (
          <InlineLatestReleaseEditor
            release={releaseData}
            onSave={() => {
              setShowEditor(false);
              window.location.reload();
            }}
            onCancel={() => setShowEditor(false)}
          />
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto">
        <ScrollReveal direction="up">
          <motion.p
            className="text-theme-secondary font-semibold tracking-widest text-sm mb-3"
            style={{ x: titleX }}
          >
            NEW RELEASE
          </motion.p>
          <motion.h2
            className="font-display font-black text-5xl md:text-7xl mb-16"
            style={{ x: useTransform(titleX, (x) => -x / 2) }}
          >
            Latest <span className="text-gradient fire-glow">Drop</span>
          </motion.h2>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Album Art */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ y: albumY, rotate: albumRotate }}
            className="relative group"
          >
            <div className="aspect-square bg-gradient-to-br from-theme-primary/20 to-theme-secondary/20 rounded-2xl overflow-hidden border-2 border-theme-primary/30 group-hover:border-theme-primary transition-all duration-500 relative">
              <img
                src={releaseData.image}
                alt={`${releaseData.title} Cover`}
                className="w-full h-full object-cover"
              />
              {/* Hover overlay inside the container */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          </motion.div>

          {/* Release Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-6"
          >
            <div>
              <h3 className="font-display font-bold text-4xl mb-3">
                {releaseData.title}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wider">
                {releaseData.type} • {releaseData.year}
              </p>
            </div>

            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
              {releaseData.description}
            </p>

            <div className="flex flex-wrap gap-4 items-center">
              <motion.a
                href={releaseData.spotifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-[#1DB954] text-white font-bold rounded-full hover:shadow-xl hover:shadow-[#1DB954]/50 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ▶ Play on Spotify
              </motion.a>
              <motion.a
                href={releaseData.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-[#FF0000] text-white font-bold rounded-full hover:shadow-xl hover:shadow-[#FF0000]/50 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Watch on YouTube
              </motion.a>
              <ShareButton
                track={releaseData.title}
                url={releaseData.spotifyUrl}
                image={releaseData.image}
              />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-theme-primary/20">
              {[
                { label: 'Followers', value: loading ? '...' : formattedFollowers },
                { label: 'Monthly', value: loading ? '...' : formattedMonthlyListeners },
                { label: 'Type', value: releaseData.type },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="font-display font-bold text-2xl text-theme-secondary mb-1">
                    {stat.value}
                  </p>
                  <p className="text-gray-400 dark:text-gray-500 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LatestRelease;
