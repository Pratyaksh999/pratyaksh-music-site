import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../firebase/config';
import { collection, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

const InlineVideoEditor = ({ video, onSave, onDelete, isNew = false, onCancel }) => {
  const [formData, setFormData] = useState({
    title: video?.title || '',
    url: video?.url || '',
    year: video?.year || new Date().getFullYear().toString()
  });
  const [saving, setSaving] = useState(false);

  const extractVideoId = (url) => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
      /youtube\.com\/embed\/([^&\n?#]+)/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return '';
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    const videoId = extractVideoId(formData.url);
    if (!videoId) {
      alert('Invalid YouTube URL');
      setSaving(false);
      return;
    }

    try {
      if (isNew) {
        await addDoc(collection(db, 'videos'), {
          title: formData.title,
          url: formData.url,
          year: formData.year,
          videoId: videoId,
          thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
          showOnHomepage: true,
          order: 999,
          createdAt: new Date()
        });
      } else {
        const videoRef = doc(db, 'videos', video.firebaseId);
        await updateDoc(videoRef, {
          title: formData.title,
          url: formData.url,
          year: formData.year,
          videoId: videoId,
          thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
          updatedAt: new Date()
        });
      }
      onSave();
    } catch (error) {
      console.error('Error saving video:', error);
      alert('Error saving video');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this video?')) return;

    setSaving(true);
    try {
      await deleteDoc(doc(db, 'videos', video.firebaseId));
      onDelete();
    } catch (error) {
      console.error('Error deleting video:', error);
      alert('Error deleting video');
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="absolute inset-0 bg-black/80 backdrop-blur-sm rounded-xl z-10 p-4 flex flex-col justify-center"
    >
      <form onSubmit={handleSave} className="space-y-3">
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Video Title"
          required
          className="w-full px-3 py-2 bg-white dark:bg-dark-card rounded-lg text-sm font-semibold outline-none"
        />
        <input
          type="url"
          value={formData.url}
          onChange={(e) => setFormData({ ...formData, url: e.target.value })}
          placeholder="YouTube URL"
          required
          className="w-full px-3 py-2 bg-white dark:bg-dark-card rounded-lg text-sm outline-none"
        />
        <input
          type="text"
          value={formData.year}
          onChange={(e) => setFormData({ ...formData, year: e.target.value })}
          placeholder="Year"
          required
          className="w-full px-3 py-2 bg-white dark:bg-dark-card rounded-lg text-sm outline-none"
        />

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-all disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition-all"
          >
            Cancel
          </button>
          {!isNew && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={saving}
              className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-all disabled:opacity-50"
            >
              Delete
            </button>
          )}
        </div>
      </form>
    </motion.div>
  );
};

export default InlineVideoEditor;
