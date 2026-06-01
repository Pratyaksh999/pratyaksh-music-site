import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { db } from '../firebase/config';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';

const InlineCollabEditor = ({ collab, isNew = false, onSave, onDelete, onCancel }) => {
  const [formData, setFormData] = useState({
    track: collab?.track || '',
    featuring: collab?.featuring || '',
    type: collab?.type || 'feat.',
    year: collab?.year || new Date().getFullYear().toString(),
    image: collab?.image || '',
    url: collab?.url || '',
    color: collab?.color || 'from-purple-500 to-indigo-500'
  });
  const [saving, setSaving] = useState(false);

  const colorOptions = [
    'from-pink-500 to-rose-500',
    'from-purple-500 to-indigo-500',
    'from-blue-500 to-cyan-500',
    'from-orange-500 to-red-500',
    'from-green-500 to-emerald-500',
    'from-yellow-500 to-amber-500'
  ];

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const docId = isNew ? `collab_${Date.now()}` : collab.id;
      await setDoc(doc(db, 'featured-artists', docId), {
        ...formData,
        updatedAt: new Date()
      });
      onSave();
    } catch (error) {
      console.error('Error saving collaboration:', error);
      alert('Error saving collaboration');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this collaboration?')) return;

    try {
      await deleteDoc(doc(db, 'featured-artists', collab.id));
      onDelete();
    } catch (error) {
      console.error('Error deleting collaboration:', error);
      alert('Error deleting collaboration');
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
        <h3 className="font-bold text-2xl mb-6">{isNew ? 'Add Collaboration' : 'Edit Collaboration'}</h3>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">
              Track Name
            </label>
            <input
              type="text"
              value={formData.track}
              onChange={(e) => setFormData({ ...formData, track: e.target.value })}
              required
              className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-theme-primary outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Featured Artist
            </label>
            <input
              type="text"
              value={formData.featuring}
              onChange={(e) => setFormData({ ...formData, featuring: e.target.value })}
              required
              className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-theme-primary outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Type
              </label>
              <input
                type="text"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                required
                placeholder="feat."
                className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-theme-primary outline-none"
              />
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
              Spotify/Track URL
            </label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              required
              placeholder="https://open.spotify.com/..."
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

export default InlineCollabEditor;
