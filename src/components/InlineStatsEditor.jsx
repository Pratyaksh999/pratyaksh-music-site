import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { db } from '../firebase/config';
import { doc, setDoc } from 'firebase/firestore';

const InlineStatsEditor = ({ stats, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    streams: stats?.streams || 200000,
    followers: stats?.followers || 372,
    songs: stats?.songs || 85,
    videos: stats?.videos || 7
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await setDoc(doc(db, 'site-config', 'stats'), {
        ...formData,
        updatedAt: new Date()
      });
      onSave();
    } catch (error) {
      console.error('Error saving stats:', error);
      alert('Error saving stats');
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-dark-card rounded-2xl p-8 max-w-md w-full shadow-2xl border-2 border-theme-primary"
      >
        <h3 className="font-bold text-2xl mb-6">Edit Impact Stats</h3>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">
              🎵 Total Streams
            </label>
            <input
              type="number"
              value={formData.streams}
              onChange={(e) => setFormData({ ...formData, streams: parseInt(e.target.value) })}
              required
              className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-theme-primary outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              👥 Spotify Followers
            </label>
            <input
              type="number"
              value={formData.followers}
              onChange={(e) => setFormData({ ...formData, followers: parseInt(e.target.value) })}
              required
              className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-theme-primary outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              🎼 Released Songs
            </label>
            <input
              type="number"
              value={formData.songs}
              onChange={(e) => setFormData({ ...formData, songs: parseInt(e.target.value) })}
              required
              className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-theme-primary outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              🎬 Music Videos
            </label>
            <input
              type="number"
              value={formData.videos}
              onChange={(e) => setFormData({ ...formData, videos: parseInt(e.target.value) })}
              required
              className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-theme-primary outline-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-all disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-3 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default InlineStatsEditor;
