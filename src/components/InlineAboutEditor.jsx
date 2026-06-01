import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { db } from '../firebase/config';
import { doc, setDoc } from 'firebase/firestore';

const InlineAboutEditor = ({ about, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    paragraph1: about?.paragraph1 || 'A rapper, singer, and songwriter from Dehradun, India. I started writing at age 11 in 2012 and have been creating music on YouTube since 2015. Every lyric, every melody tells a story that connects with the soul.',
    paragraph2: about?.paragraph2 || 'Known for my understanding of lyrical structures and soothing melodies, I aim to inspire people through music and prove that circumstances need not limit your dreams. From "Darmiyaan" to "Rebirth," each release is a chapter in this journey.',
    quote: about?.quote || 'Music is the universal language. I\'m speaking it through honest lyrics and melodies that heal.',
    image: about?.image || '/images/artist-photo.jpg',
    location: about?.location || 'Dehradun'
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await setDoc(doc(db, 'site-config', 'about'), {
        ...formData,
        updatedAt: new Date()
      });
      onSave();
    } catch (error) {
      console.error('Error saving about section:', error);
      alert('Error saving about section');
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
        <h3 className="font-bold text-2xl mb-6">Edit About Section</h3>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">
              First Paragraph
            </label>
            <textarea
              value={formData.paragraph1}
              onChange={(e) => setFormData({ ...formData, paragraph1: e.target.value })}
              required
              rows={4}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-theme-primary outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Second Paragraph
            </label>
            <textarea
              value={formData.paragraph2}
              onChange={(e) => setFormData({ ...formData, paragraph2: e.target.value })}
              required
              rows={4}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-theme-primary outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Quote
            </label>
            <textarea
              value={formData.quote}
              onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
              required
              rows={2}
              placeholder="An inspiring quote..."
              className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-theme-primary outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
              placeholder="Dehradun"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-theme-primary outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Artist Image Path
            </label>
            <input
              type="text"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              required
              placeholder="/images/artist-photo.jpg"
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

export default InlineAboutEditor;
