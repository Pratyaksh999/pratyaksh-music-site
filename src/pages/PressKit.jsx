import React from 'react';
import { motion } from 'framer-motion';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

const PressKit = () => {
  const stats = [
    { label: 'Monthly Listeners', value: '100K+', icon: '🎧' },
    { label: 'Total Streams', value: '5M+', icon: '▶️' },
    { label: 'Social Followers', value: '50K+', icon: '👥' },
    { label: 'Released Tracks', value: '25+', icon: '🎵' }
  ];

  const photos = [
    { id: 1, title: 'Press Photo 1', url: 'https://via.placeholder.com/800x600/9333ea/ffffff?text=Press+Photo+1', resolution: '4000x3000' },
    { id: 2, title: 'Press Photo 2', url: 'https://via.placeholder.com/800x600/ec4899/ffffff?text=Press+Photo+2', resolution: '4000x3000' },
    { id: 3, title: 'Press Photo 3', url: 'https://via.placeholder.com/800x600/8b5cf6/ffffff?text=Press+Photo+3', resolution: '4000x3000' },
    { id: 4, title: 'Logo - Light', url: 'https://via.placeholder.com/400x400/9333ea/ffffff?text=Logo', resolution: '2000x2000' },
    { id: 5, title: 'Logo - Dark', url: 'https://via.placeholder.com/400x400/000000/9333ea?text=Logo', resolution: '2000x2000' },
    { id: 6, title: 'Album Cover', url: 'https://via.placeholder.com/600x600/ec4899/ffffff?text=Album+Art', resolution: '3000x3000' }
  ];

  const pressReleases = [
    {
      date: '2025-03-15',
      title: 'Pratyaksh Bharadwaj Drops New Single "Whatever 2.0"',
      excerpt: 'Rising hip-hop artist collaborates with Utkarsh Kushwaha on highly anticipated duet version...'
    },
    {
      date: '2025-02-01',
      title: 'Artist Surpasses 5 Million Total Streams',
      excerpt: 'Independent artist reaches major milestone with fan-favorite tracks Fantasy and Roll Kar...'
    },
    {
      date: '2024-12-20',
      title: 'Year in Review: Breaking Records and Building Community',
      excerpt: 'A look back at the breakthrough year with sold-out shows and viral moments...'
    }
  ];

  const downloadableAssets = [
    { name: 'Full Press Kit (PDF)', size: '2.5 MB', type: 'PDF', icon: '📄' },
    { name: 'High-Res Photos (ZIP)', size: '45 MB', type: 'ZIP', icon: '🖼️' },
    { name: 'Logo Pack', size: '5 MB', type: 'ZIP', icon: '🎨' },
    { name: 'Bio & Fact Sheet', size: '500 KB', type: 'PDF', icon: '📝' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30 dark:from-dark-bg dark:via-purple-950/20 dark:to-pink-950/20">
      <Navigation />

      <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.h1
            className="font-display font-black text-5xl md:text-7xl mb-4"
            animate={{
              backgroundPosition: ['0%', '100%', '0%']
            }}
            transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
          >
            <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-[length:200%_auto]">
              Press Kit
            </span>
          </motion.h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-6">
            Official press materials, photos, and information
          </p>
          <motion.a
            href="#downloads"
            className="inline-block px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl shadow-lg"
            whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(168, 85, 247, 0.4)' }}
            whileTap={{ scale: 0.95 }}
          >
            📥 Download Press Kit
          </motion.a>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="bg-white/60 dark:bg-dark-card/60 backdrop-blur-xl rounded-xl p-6 text-center border border-gray-200/50 dark:border-gray-700/50 shadow-xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-4xl mb-2">{stat.icon}</div>
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 font-semibold">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bio Section */}
        <motion.div
          className="mb-16 bg-white/60 dark:bg-dark-card/60 backdrop-blur-xl rounded-2xl p-8 md:p-12 border border-gray-200/50 dark:border-gray-700/50 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="font-display font-bold text-3xl mb-6 flex items-center gap-3">
            <span className="text-4xl">📝</span> Artist Bio
          </h2>

          <div className="prose dark:prose-invert max-w-none space-y-4 text-gray-700 dark:text-gray-300">
            <p className="text-lg leading-relaxed">
              <strong>Pratyaksh Bharadwaj</strong> is an independent hip-hop artist, producer, and songwriter known for his introspective lyrics, versatile flow, and genre-blending production. Based in [Location], Pratyaksh has been making waves in the independent music scene with his authentic storytelling and innovative sound.
            </p>

            <p className="leading-relaxed">
              Since breaking onto the scene in [Year], Pratyaksh has released over 25 tracks, accumulating millions of streams across all platforms. His music explores themes of ambition, relationships, mental health, and the journey of self-discovery, resonating deeply with a growing fanbase.
            </p>

            <p className="leading-relaxed">
              Notable releases include "Whatever," "Fantasy," "Roll Kar," and "Taamjhaam," each showcasing his ability to craft catchy hooks while maintaining lyrical depth. His collaborations with artists like KartikK, Srishti Chauhan, Ananya Pandey, and Utkarsh Kushwaha demonstrate his versatility and collaborative spirit.
            </p>

            <p className="leading-relaxed">
              With a DIY approach to his career, Pratyaksh handles everything from songwriting and production to marketing and distribution, building a sustainable independent music career in the digital age. His transparent approach to the creative process and direct engagement with fans has cultivated a loyal community.
            </p>

            <div className="mt-8 p-6 bg-purple-50 dark:bg-purple-900/20 rounded-xl border-l-4 border-purple-500">
              <p className="font-semibold italic text-purple-900 dark:text-purple-200">
                "Music is my therapy, my journal, and my way of connecting with people who feel the same things I do. Every song is a piece of my journey."
              </p>
              <p className="text-sm text-purple-700 dark:text-purple-300 mt-2">— Pratyaksh Bharadwaj</p>
            </div>
          </div>
        </motion.div>

        {/* Press Photos */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="font-display font-bold text-3xl mb-8 flex items-center gap-3">
            <span className="text-4xl">📸</span> Press Photos
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {photos.map((photo, index) => (
              <motion.div
                key={photo.id}
                className="group relative bg-white/60 dark:bg-dark-card/60 backdrop-blur-xl rounded-xl overflow-hidden border border-gray-200/50 dark:border-gray-700/50 shadow-xl"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <img
                  src={photo.url}
                  alt={photo.title}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                  <p className="text-white font-bold mb-1">{photo.title}</p>
                  <p className="text-white/80 text-sm mb-3">{photo.resolution}</p>
                  <motion.button
                    className="px-4 py-2 bg-white text-purple-600 rounded-lg font-semibold text-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Download High-Res
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Press Releases */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="font-display font-bold text-3xl mb-8 flex items-center gap-3">
            <span className="text-4xl">📰</span> Recent Press Releases
          </h2>
          <div className="space-y-4">
            {pressReleases.map((release, index) => (
              <motion.div
                key={index}
                className="bg-white/60 dark:bg-dark-card/60 backdrop-blur-xl rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-xl"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      {new Date(release.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                    <h3 className="font-bold text-xl mb-2">{release.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{release.excerpt}</p>
                  </div>
                  <motion.button
                    className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg font-semibold text-sm whitespace-nowrap"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Read More
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Downloadable Assets */}
        <motion.div
          id="downloads"
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="font-display font-bold text-3xl mb-8 flex items-center gap-3">
            <span className="text-4xl">📦</span> Downloadable Assets
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {downloadableAssets.map((asset, index) => (
              <motion.div
                key={index}
                className="bg-white/60 dark:bg-dark-card/60 backdrop-blur-xl rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-xl flex items-center justify-between"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{asset.icon}</div>
                  <div>
                    <h3 className="font-bold text-lg">{asset.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {asset.type} · {asset.size}
                    </p>
                  </div>
                </div>
                <motion.button
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-bold"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Download
                </motion.button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contact for Press */}
        <motion.div
          className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-8 md:p-12 text-center text-white"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7 }}
        >
          <h2 className="font-display font-bold text-3xl mb-4">Press Inquiries</h2>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            For interviews, features, or additional press materials, please reach out to our press team.
          </p>
          <motion.a
            href="/#contact"
            className="inline-block px-8 py-4 bg-white text-purple-600 font-bold rounded-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Contact Press Team
          </motion.a>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default PressKit;
