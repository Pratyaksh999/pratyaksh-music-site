import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { db } from '../firebase/config';
import { updateDoc, deleteDoc, doc, addDoc, collection } from 'firebase/firestore';

const InlineCatalogEditor = ({ release, onSave, onDelete, isNew = false, onCancel }) => {
  const [formData, setFormData] = useState({
    title: release?.title || '',
    type: release?.type || 'Single',
    year: release?.year || new Date().getFullYear().toString(),
    image: release?.image || '',
    url: release?.url || '',
    streams: release?.streams || '',
    tracks: release?.tracks || []
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (isNew) {
        await addDoc(collection(db, 'spotify-releases'), {
          ...formData,
          category: 'spotify',
          order: 999,
          createdAt: new Date()
        });
      } else {
        const releaseRef = doc(db, 'spotify-releases', release.id);
        await updateDoc(releaseRef, {
          ...formData,
          updatedAt: new Date()
        });
      }
      onSave();
    } catch (error) {
      console.error('Error saving release:', error);
      alert('Error saving release');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this release?')) return;

    setSaving(true);
    try {
      await deleteDoc(doc(db, 'spotify-releases', release.id));
      onDelete();
    } catch (error) {
      console.error('Error deleting release:', error);
      alert('Error deleting release');
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="absolute inset-0 bg-black/90 backdrop-blur-sm rounded-xl z-10 p-4 flex flex-col justify-center overflow-y-auto"
    >
      <form onSubmit={handleSave} className="space-y-3">
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Title"
          required
          className="w-full px-3 py-2 bg-white dark:bg-dark-card rounded-lg text-sm font-semibold outline-none"
        />

        <div className="flex gap-2">
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="flex-1 px-3 py-2 bg-white dark:bg-dark-card rounded-lg text-sm outline-none"
          >
            <option value="Single">Single</option>
            <option value="EP">EP</option>
            <option value="Album">Album</option>
          </select>

          <input
            type="text"
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
            placeholder="Year"
            required
            className="w-24 px-3 py-2 bg-white dark:bg-dark-card rounded-lg text-sm outline-none"
          />
        </div>

        <input
          type="url"
          value={formData.url}
          onChange={(e) => setFormData({ ...formData, url: e.target.value })}
          placeholder="Spotify URL"
          required
          className="w-full px-3 py-2 bg-white dark:bg-dark-card rounded-lg text-sm outline-none"
        />

        <input
          type="url"
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          placeholder="Album Art URL"
          required
          className="w-full px-3 py-2 bg-white dark:bg-dark-card rounded-lg text-sm outline-none"
        />

        <input
          type="text"
          value={formData.streams}
          onChange={(e) => setFormData({ ...formData, streams: e.target.value })}
          placeholder="Streams (e.g., 18.6K+)"
          className="w-full px-3 py-2 bg-white dark:bg-dark-card rounded-lg text-sm outline-none"
        />

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-all disabled:opacity-50 text-sm"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition-all text-sm"
          >
            Cancel
          </button>
          {!isNew && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={saving}
              className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-all disabled:opacity-50 text-sm"
            >
              Delete
            </button>
          )}
        </div>
      </form>
    </motion.div>
  );
};

export default InlineCatalogEditor;
