import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { db } from '../firebase/config';
import { collection, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

const InlineTimelineEditor = ({ event, onSave, onDelete, isNew = false, onCancel }) => {
  const [formData, setFormData] = useState({
    date: event?.date || event?.year || '',
    title: event?.title || '',
    description: event?.description || '',
    image: event?.image || '',
    icon: event?.icon || '🎵',
    highlight: event?.highlight || false
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (isNew) {
        await addDoc(collection(db, 'timeline-events'), {
          date: formData.date,
          title: formData.title,
          description: formData.description,
          image: formData.image || '',
          icon: formData.icon || '🎵',
          highlight: formData.highlight || false,
          order: 999,
          createdAt: new Date()
        });
      } else {
        const eventRef = doc(db, 'timeline-events', event.firebaseId);
        await updateDoc(eventRef, {
          date: formData.date,
          title: formData.title,
          description: formData.description,
          image: formData.image || '',
          icon: formData.icon || '🎵',
          highlight: formData.highlight || false,
          updatedAt: new Date()
        });
      }
      onSave();
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Error saving event');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this timeline event?')) return;

    setSaving(true);
    try {
      await deleteDoc(doc(db, 'timeline-events', event.firebaseId));
      onDelete();
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Error deleting event');
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="absolute inset-0 bg-black/90 backdrop-blur-sm rounded-xl z-10 p-4 flex flex-col justify-center"
    >
      <form onSubmit={handleSave} className="space-y-3">
        <input
          type="text"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          placeholder="Date (e.g., 2024)"
          required
          className="w-full px-3 py-2 bg-white dark:bg-dark-card rounded-lg text-sm font-semibold outline-none"
        />
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Event Title"
          required
          className="w-full px-3 py-2 bg-white dark:bg-dark-card rounded-lg text-sm font-semibold outline-none"
        />
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Description"
          required
          rows={3}
          className="w-full px-3 py-2 bg-white dark:bg-dark-card rounded-lg text-sm outline-none resize-none"
        />
        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            value={formData.icon}
            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
            placeholder="Icon (emoji)"
            maxLength={2}
            className="w-full px-3 py-2 bg-white dark:bg-dark-card rounded-lg text-sm outline-none"
          />
          <label className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-dark-card rounded-lg text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={formData.highlight}
              onChange={(e) => setFormData({ ...formData, highlight: e.target.checked })}
              className="w-4 h-4"
            />
            <span>Highlight</span>
          </label>
        </div>
        <input
          type="text"
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          placeholder="Image URL (optional)"
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

export default InlineTimelineEditor;
