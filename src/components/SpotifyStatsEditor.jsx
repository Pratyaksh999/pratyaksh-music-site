import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { db } from '../firebase/config';
import { doc, setDoc } from 'firebase/firestore';

const SpotifyStatsEditor = ({ currentStats, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    monthlyListeners: currentStats?.monthlyListeners || 0,
    followers: currentStats?.followers || 0,
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Save to Firebase
      const docRef = doc(db, 'site-config', 'spotify-stats');
      await setDoc(docRef, {
        monthlyListeners: parseInt(formData.monthlyListeners),
        followers: parseInt(formData.followers),
        updatedAt: new Date()
      });

      console.log('Spotify stats saved successfully');
      onSave();
    } catch (error) {
      console.error('Error saving spotify stats:', error);
      alert('Failed to save. Check console for details.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-dark-card rounded-2xl shadow-2xl border-2 border-theme-primary/30 p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <h2 className="text-3xl font-display font-black mb-6 text-gradient">
          Edit Spotify Stats
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Monthly Listeners */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Monthly Listeners
            </label>
            <input
              type="number"
              value={formData.monthlyListeners}
              onChange={(e) => setFormData({ ...formData, monthlyListeners: e.target.value })}
              placeholder="e.g., 50000"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-theme-primary outline-none transition-colors"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Current: {currentStats?.monthlyListeners?.toLocaleString() || '0'}
            </p>
          </div>

          {/* Spotify Followers */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Spotify Followers
            </label>
            <input
              type="number"
              value={formData.followers}
              onChange={(e) => setFormData({ ...formData, followers: e.target.value })}
              placeholder="e.g., 5000"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-theme-primary outline-none transition-colors"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Current: {currentStats?.followers?.toLocaleString() || '0'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <motion.button
              type="submit"
              disabled={saving}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-theme-primary to-theme-secondary text-white font-bold rounded-xl hover:shadow-lg hover:shadow-theme-primary/50 transition-all disabled:opacity-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </motion.button>

            <motion.button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancel
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default SpotifyStatsEditor;
