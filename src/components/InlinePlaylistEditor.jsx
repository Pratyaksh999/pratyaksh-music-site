import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { db } from '../firebase/config';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';

const InlinePlaylistEditor = ({ playlist, isNew = false, onSave, onDelete, onCancel }) => {
  const [formData, setFormData] = useState({
    name: playlist?.name || '',
    curator: playlist?.curator || '',
    followers: playlist?.followers || '',
    image: playlist?.image || '',
    color: playlist?.color || 'from-purple-500 to-pink-500',
    url: playlist?.url || ''
  });
  const [saving, setSaving] = useState(false);

  const colorOptions = [
    'from-purple-500 to-pink-500',
    'from-blue-500 to-cyan-500',
    'from-green-500 to-emerald-500',
    'from-red-500 to-orange-500',
    'from-yellow-500 to-amber-500',
    'from-indigo-500 to-purple-500'
  ];

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const docId = isNew ? `playlist_${Date.now()}` : playlist.id;
      await setDoc(doc(db, 'featured-playlists', docId), {
        ...formData,
        updatedAt: new Date()
      });
      onSave();
    } catch (error) {
      console.error('Error saving playlist:', error);
      alert('Error saving playlist');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this playlist?')) return;

    try {
      await deleteDoc(doc(db, 'featured-playlists', playlist.id));
      onDelete();
    } catch (error) {
      console.error('Error deleting playlist:', error);
      alert('Error deleting playlist');
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
        className="bg-white dark:bg-dark-card rounded-2xl p-8 max-w-md w-full shadow-2xl border-2 border-theme-primary my-8"
      >
        <h3 className="font-bold text-2xl mb-6">{isNew ? 'Add Playlist' : 'Edit Playlist'}</h3>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">
              Playlist Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-theme-primary outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Curator
            </label>
            <input
              type="text"
              value={formData.curator}
              onChange={(e) => setFormData({ ...formData, curator: e.target.value })}
              required
              className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-theme-primary outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Followers
            </label>
            <input
              type="text"
              value={formData.followers}
              onChange={(e) => setFormData({ ...formData, followers: e.target.value })}
              required
              placeholder="125K+"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-theme-primary outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Playlist URL
            </label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              required
              placeholder="https://open.spotify.com/playlist/..."
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
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Color Gradient
            </label>
            <select
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              required
              className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-theme-primary outline-none"
            >
              {colorOptions.map(color => (
                <option key={color} value={color}>{color}</option>
              ))}
            </select>
            <div className={`mt-2 h-8 bg-gradient-to-r ${formData.color} rounded-lg`} />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-all disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
            {!isNew && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-6 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-all"
              >
                Delete
              </button>
            )}
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default InlinePlaylistEditor;
