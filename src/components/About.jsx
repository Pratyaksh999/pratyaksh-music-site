import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import ScrollReveal from './ScrollReveal';
import { useSpotifyData } from '../hooks/useSpotifyData';
import { useAuth } from '../contexts/AuthContext';
import { isAdmin } from '../utils/adminCheck';
import InlineAboutEditor from './InlineAboutEditor';
import SpotifyStatsEditor from './SpotifyStatsEditor';
import { db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';

const About = ({ editMode = false }) => {
  const [ref, inView] = useInView({ triggerOnce: false, threshold: 0.2 });
  const { scrollYProgress } = useScroll();
  const { user } = useAuth();
  const [showEditor, setShowEditor] = useState(false);
  const [showStatsEditor, setShowStatsEditor] = useState(false);
  const [spotifyStats, setSpotifyStats] = useState({
    monthlyListeners: 0,
    followers: 0
  });
  const [aboutData, setAboutData] = useState({
    paragraph1: 'A rapper, singer, and songwriter from Dehradun, India. I started writing at age 11 in 2012 and have been creating music on YouTube since 2015. Every lyric, every melody tells a story that connects with the soul.',
    paragraph2: 'Known for my understanding of lyrical structures and soothing melodies, I aim to inspire people through music and prove that circumstances need not limit your dreams. From "Darmiyaan" to "Rebirth," each release is a chapter in this journey.',
    quote: 'Music is the universal language. I\'m speaking it through honest lyrics and melodies that heal.',
    image: '/images/artist-photo.jpg',
    location: 'Dehradun'
  });

  // Load about data from Firebase
  useEffect(() => {
    const loadAboutData = async () => {
      try {
        const docRef = doc(db, 'site-config', 'about');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setAboutData(docSnap.data());
        }
      } catch (error) {
        console.error('Error loading about data:', error);
      }
    };

    loadAboutData();
  }, []);

  // Load Spotify stats from Firebase
  useEffect(() => {
    const loadSpotifyStats = async () => {
      try {
        const docRef = doc(db, 'site-config', 'spotify-stats');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setSpotifyStats(docSnap.data());
        }
      } catch (error) {
        console.error('Error loading Spotify stats:', error);
      }
    };

    loadSpotifyStats();
  }, []);

  // Format numbers
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  // Parallax for image and cards
  const imageY = useTransform(scrollYProgress, [0.5, 0.9], [0, -100]);
  const cardY = useTransform(scrollYProgress, [0.5, 0.9], [0, 100]);
  const titleRotate = useTransform(scrollYProgress, [0.6, 0.8], [-2, 2]);

  return (
    <section id="about" className="section-padding bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-dark-bg dark:to-dark-bg relative overflow-hidden border-t border-gray-200 dark:border-theme-primary/10" ref={ref}>
      {/* Edit Buttons */}
      {editMode && isAdmin(user) && (
        <div className="absolute top-8 right-8 z-20 flex gap-3">
          <button
            onClick={() => setShowStatsEditor(true)}
            className="px-4 py-2 bg-purple-500 text-white rounded-full font-semibold hover:bg-purple-600 transition-all shadow-lg"
          >
            📊 Edit Stats
          </button>
          <button
            onClick={() => setShowEditor(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-full font-semibold hover:bg-blue-600 transition-all shadow-lg"
          >
            ✏️ Edit About
          </button>
        </div>
      )}

      {/* Editors */}
      <AnimatePresence>
        {showEditor && (
          <InlineAboutEditor
            about={aboutData}
            onSave={() => {
              setShowEditor(false);
              window.location.reload();
            }}
            onCancel={() => setShowEditor(false)}
          />
        )}
        {showStatsEditor && (
          <SpotifyStatsEditor
            currentStats={spotifyStats}
            onSave={() => {
              setShowStatsEditor(false);
              window.location.reload();
            }}
            onCancel={() => setShowStatsEditor(false)}
          />
        )}
      </AnimatePresence>

      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-theme-primary/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Image/Visual */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8 }}
            style={{ y: imageY }}
            className="relative"
          >
            <div className="aspect-[3/4] bg-gradient-to-br from-theme-primary/20 to-theme-secondary/20 rounded-2xl border-2 border-theme-primary/30 overflow-hidden">
              <img
                src={aboutData.image}
                alt="Pratyaksh Bharadwaj"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Floating stat cards */}
            <motion.div
              className="absolute -right-6 top-20 bg-white dark:bg-dark-card border border-theme-primary/30 rounded-xl p-6 shadow-xl"
              initial={{ opacity: 0, x: 20 }}
              animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
              transition={{ delay: 0.4 }}
              style={{ y: cardY }}
              whileHover={{ y: -5 }}
            >
              <p className="font-display font-bold text-3xl text-theme-secondary">
                {formatNumber(spotifyStats.monthlyListeners)}
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Monthly Listeners</p>
            </motion.div>

            <motion.div
              className="absolute -left-6 bottom-20 bg-white dark:bg-dark-card border border-theme-primary/30 rounded-xl p-6 shadow-xl"
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ delay: 0.6 }}
              style={{ y: useTransform(scrollYProgress, [0.5, 0.9], [0, -100]) }}
              whileHover={{ y: -5 }}
            >
              <p className="font-display font-bold text-3xl text-theme-secondary">
                {formatNumber(spotifyStats.followers)}
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Spotify Followers</p>
            </motion.div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            <ScrollReveal direction="right">
              <p className="text-theme-secondary font-semibold tracking-widest text-sm mb-3">
                THE ARTIST
              </p>
              <motion.h2
                className="font-display font-black text-5xl md:text-6xl mb-6"
                style={{ rotate: titleRotate }}
              >
                Beyond the <span className="text-gradient fire-glow">Sound</span>
              </motion.h2>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.2}>
              <div className="space-y-6 text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                <p>
                  {aboutData.paragraph1}
                </p>
                <p>
                  {aboutData.paragraph2}
                </p>
                <blockquote className="border-l-4 border-theme-primary pl-6 italic text-gray-900 dark:text-white/90">
                  "{aboutData.quote}"
                </blockquote>
              </div>
            </ScrollReveal>

            {/* Key Highlights */}
            <div className="grid grid-cols-2 gap-6 pt-6">
              {[
                { icon: '🎤', label: 'Rapper' },
                { icon: '🎵', label: 'Singer' },
                { icon: '✍️', label: 'Songwriter' },
                { icon: '🏔️', label: aboutData.location },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-dark-card rounded-xl border border-theme-primary/20"
                  whileHover={{ scale: 1.05, borderColor: 'var(--theme-primary)' }}
                >
                  <span className="text-3xl">{item.icon}</span>
                  <span className="font-semibold">{item.label}</span>
                </motion.div>
              ))}
            </div>

            <motion.a
              href="#contact"
              className="inline-block px-8 py-4 bg-gradient-to-r from-theme-primary to-theme-secondary text-white font-bold rounded-full hover:shadow-xl hover:shadow-theme-primary/50 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get In Touch
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
