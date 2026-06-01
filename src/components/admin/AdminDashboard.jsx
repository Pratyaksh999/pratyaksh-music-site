import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VideosManager from './VideosManager';
import SpotifyManager from './SpotifyManager';
import TimelineManager from './TimelineManager';
import AboutManager from './AboutManager';
import { migrateAllData } from '../../utils/migrateData';

const AdminDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('homepage-videos');
  const [migrating, setMigrating] = useState(false);

  const handleMigration = async () => {
    if (!confirm('This will import all your existing videos and Spotify releases to Firebase. Continue?')) {
      return;
    }

    setMigrating(true);
    try {
      await migrateAllData();
      alert('Migration complete! Please refresh the page to see the imported data.');
    } catch (error) {
      console.error('Migration error:', error);
      alert('Migration failed. Check console for details.');
    } finally {
      setMigrating(false);
    }
  };

  const tabs = [
    { id: 'homepage-videos', label: 'Homepage Videos', icon: '🎬' },
    { id: 'directory-videos', label: 'Video Directory', icon: '🎥' },
    { id: 'spotify', label: 'Spotify Releases', icon: '🎵' },
    { id: 'timeline', label: 'Timeline Events', icon: '📅' },
    { id: 'about', label: 'About Section', icon: '👤' },
  ];

  return (
    <div className="min-h-screen pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-theme-primary to-theme-secondary text-white px-6 py-6 shadow-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-display font-black text-3xl md:text-4xl mb-1">
              Admin Dashboard
            </h1>
            <p className="text-white/80 text-sm">
              Logged in as {user.email}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleMigration}
              disabled={migrating}
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-semibold transition-all text-sm disabled:opacity-50"
            >
              {migrating ? 'Importing...' : '📥 Import Data'}
            </button>
            <a
              href="/"
              className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg font-semibold transition-all text-sm"
            >
              View Site
            </a>
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-white text-theme-primary hover:bg-gray-100 rounded-lg font-semibold transition-all text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white dark:bg-dark-card border-b-2 border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-2 overflow-x-auto pb-2 pt-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-t-xl font-semibold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-theme-primary to-theme-secondary text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-dark-bg text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'homepage-videos' && <VideosManager isHomepage={true} />}
            {activeTab === 'directory-videos' && <VideosManager isHomepage={false} />}
            {activeTab === 'spotify' && <SpotifyManager />}
            {activeTab === 'timeline' && <TimelineManager />}
            {activeTab === 'about' && <AboutManager />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminDashboard;
