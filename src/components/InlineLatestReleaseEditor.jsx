import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { db } from '../firebase/config';
import { doc, setDoc } from 'firebase/firestore';

const InlineLatestReleaseEditor = ({ release, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: release?.title || 'Rebirth',
    type: release?.type || 'Album',
    year: release?.year || '2026',
    description: release?.description || 'The latest chapter in Pratyaksh Bharadwaj\'s musical journey. A collection of tracks that showcase lyrical depth and soothing melodies, inspiring listeners through authentic storytelling and emotional resonance.',
    spotifyUrl: release?.spotifyUrl || 'https://open.spotify.com/album/5F5BHw4uM2cyJ78phQDQtC',
    youtubeUrl: release?.youtubeUrl || 'https://youtube.com/@pratyakshbharadwaj',
    image: release?.image || '/images/albums/rebirth.jpg'
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await setDoc(doc(db, 'site-config', 'latest-release'), {
        ...formData,
        updatedAt: new Date()
      });
      onSave();
    } catch (error) {
      console.error('Error saving latest release:', error);
      alert('Error saving latest release');
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4 overflow-y-auto"
      onClick={onCancel}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-dark-card rounded-2xl p-8 max-w-2xl w-full shadow-2xl border-2 border-theme-primary my-8"
      >
        <h3 className="font-bold text-2xl mb-6">Edit Latest Release</h3>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">
              Release Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-theme-primary outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                required
                className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-theme-primary outline-none"
              >
                <option value="Single">Single</option>
                <option value="EP">EP</option>
                <option value="Album">Album</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Year
              </label>
              <input
                type="text"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                required
                className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-theme-primary outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={4}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-theme-primary outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Spotify URL
            </label>
            <input
              type="url"
              value={formData.spotifyUrl}
              onChange={(e) => setFormData({ ...formData, spotifyUrl: e.target.value })}
              required
              placeholder="https://open.spotify.com/..."
              className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-theme-primary outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              YouTube URL
            </label>
            <input
              type="url"
              value={formData.youtubeUrl}
              onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
              required
              placeholder="https://youtube.com/..."
              className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-theme-primary outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Image Path
            </label>
            <input
              type="text"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              required
              placeholder="/images/albums/..."
              className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-theme-primary outline-none"
            />
            {formData.image && (
              <div className="mt-2">
                <img src={formData.image} alt="Preview" className="w-32 h-32 object-cover rounded-lg" />
              </div>
            )}
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

export default InlineLatestReleaseEditor;
