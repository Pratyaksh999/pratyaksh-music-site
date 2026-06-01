import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useAuth } from '../contexts/AuthContext';
import { isAdmin } from '../utils/adminCheck';
import InlineStatsEditor from './InlineStatsEditor';
import { db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';

const AnimatedStats = ({ editMode = false }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 });
  const { user } = useAuth();
  const [showEditor, setShowEditor] = useState(false);
  const [finalStats, setFinalStats] = useState({
    streams: 200000,
    followers: 372,
    songs: 85,
    videos: 7
  });
  const [counts, setCounts] = useState({
    streams: 0,
    followers: 0,
    songs: 0,
    videos: 0
  });

  // Load stats from Firebase
  useEffect(() => {
    const loadStats = async () => {
      try {
        const docRef = doc(db, 'site-config', 'stats');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setFinalStats(docSnap.data());
        }
      } catch (error) {
        console.error('Error loading stats:', error);
      }
    };

    loadStats();
  }, []);

  useEffect(() => {
    if (inView) {
      // Animate each counter
      const duration = 2000; // 2 seconds
      const fps = 60;
      const frames = (duration / 1000) * fps;

      Object.keys(finalStats).forEach((key) => {
        const increment = finalStats[key] / frames;
        let current = 0;
        let frame = 0;

        const counter = setInterval(() => {
          frame++;
          current += increment;

          if (frame >= frames) {
            current = finalStats[key];
            clearInterval(counter);
          }

          setCounts((prev) => ({
            ...prev,
            [key]: Math.floor(current)
          }));
        }, 1000 / fps);
      });
    }
  }, [inView]);

  const formatNumber = (num, label) => {
    if (label === 'streams' && num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M+';
    }
    if (label === 'streams' && num >= 1000) {
      return Math.floor(num / 1000) + 'K+';
    }
    if (label === 'songs' && num > 0) {
      return num + '+';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const stats = [
    {
      key: 'streams',
      label: 'Total Streams',
      icon: '🎵',
      color: 'from-purple-500 to-pink-500',
      milestone: true
    },
    {
      key: 'followers',
      label: 'Spotify Followers',
      icon: '👥',
      color: 'from-green-500 to-emerald-500'
    },
    {
      key: 'songs',
      label: 'Released Songs',
      icon: '🎼',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      key: 'videos',
      label: 'Music Videos',
      icon: '🎬',
      color: 'from-red-500 to-orange-500'
    }
  ];

  return (
    <section
      ref={ref}
      className="section-padding bg-gradient-to-b from-white via-gray-50 to-white dark:from-dark-bg dark:via-dark-card dark:to-dark-bg relative overflow-hidden border-t border-gray-200 dark:border-theme-primary/10"
    >
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-theme-primary/5 rounded-full blur-3xl" />

      {/* Edit Button */}
      {editMode && isAdmin(user) && (
        <button
          onClick={() => setShowEditor(true)}
          className="absolute top-8 right-8 z-20 px-4 py-2 bg-blue-500 text-white rounded-full font-semibold hover:bg-blue-600 transition-all shadow-lg"
        >
          ✏️ Edit Stats
        </button>
      )}

      {/* Stats Editor */}
      <AnimatePresence>
        {showEditor && (
          <InlineStatsEditor
            stats={finalStats}
            onSave={() => {
              setShowEditor(false);
              window.location.reload();
            }}
            onCancel={() => setShowEditor(false)}
          />
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-theme-secondary font-semibold tracking-widest text-sm mb-3">
            BY THE NUMBERS
          </p>
          <h2 className="font-display font-black text-5xl md:text-7xl mb-4">
            The <span className="text-gradient fire-glow">Impact</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Music that reaches across borders and connects souls
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.key}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <motion.div
                className="relative bg-white dark:bg-dark-card rounded-2xl p-8 border-2 border-theme-primary/20 hover:border-theme-primary transition-all shadow-lg hover:shadow-xl overflow-hidden group"
                whileHover={{ y: -5 }}
                animate={
                  stat.milestone && counts[stat.key] >= finalStats[stat.key]
                    ? {
                        scale: [1, 1.05, 1],
                        boxShadow: [
                          '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                          '0 20px 25px -5px rgba(var(--theme-primary-rgb), 0.3)',
                          '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                        ]
                      }
                    : {}
                }
                transition={{ duration: 0.6 }}
              >
                {/* Gradient background on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                />

                {/* Icon */}
                <motion.div
                  className="text-6xl mb-4"
                  animate={
                    stat.milestone && counts[stat.key] >= finalStats[stat.key]
                      ? { rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }
                      : {}
                  }
                  transition={{ duration: 0.5 }}
                >
                  {stat.icon}
                </motion.div>

                {/* Counter */}
                <motion.div
                  className={`font-display font-black text-5xl mb-2 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
                  animate={
                    stat.milestone && counts[stat.key] >= finalStats[stat.key]
                      ? { scale: [1, 1.1, 1] }
                      : {}
                  }
                  transition={{ duration: 0.3 }}
                >
                  {formatNumber(counts[stat.key], stat.key)}
                </motion.div>

                {/* Label */}
                <p className="text-gray-600 dark:text-gray-400 font-semibold">
                  {stat.label}
                </p>

                {/* Milestone Badge */}
                {stat.milestone && counts[stat.key] >= finalStats[stat.key] && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="absolute top-4 right-4 bg-theme-primary text-white text-xs font-bold px-3 py-1 rounded-full"
                  >
                    🔥 Milestone
                  </motion.div>
                )}

                {/* Progress bar for streams */}
                {stat.key === 'streams' && (
                  <div className="mt-4 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full bg-gradient-to-r ${stat.color}`}
                      initial={{ width: 0 }}
                      animate={{
                        width: inView ? `${(counts[stat.key] / finalStats[stat.key]) * 100}%` : '0%'
                      }}
                      transition={{ duration: 2, ease: 'easeOut' }}
                    />
                  </div>
                )}
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Fun fact */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="text-center mt-16"
        >
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            🎉 That's over{' '}
            <span className="text-theme-primary font-bold">13,000 hours</span> of music listened to!
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default AnimatedStats;
