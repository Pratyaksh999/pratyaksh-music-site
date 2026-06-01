import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { db } from '../firebase/config';
import { doc, setDoc, deleteDoc, addDoc, collection } from 'firebase/firestore';

const LyricsEditor = ({ songId, song, isNew = false, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    songTitle: song?.songTitle || '',
    artist: song?.artist || 'Pratyaksh Bharadwaj',
    album: song?.album || '',
    albumArt: song?.albumArt || '',
    spotifyTrackId: song?.spotifyTrackId || '',
    producers: song?.producers || '',
    lyrics: song?.lines?.map(l => `${l.text}${l.annotation ? `\n[${l.annotation}]` : ''}`).join('\n\n') || ''
  });
  const [saving, setSaving] = useState(false);

  const parseLyrics = (text) => {
    // Split by double newlines to get verses/sections
    const sections = text.split('\n\n');
    const lines = [];

    sections.forEach(section => {
      const sectionLines = section.split('\n');
      let currentAnnotation = '';

      sectionLines.forEach(line => {
        // Check if line is an annotation (wrapped in [])
        if (line.trim().startsWith('[') && line.trim().endsWith(']')) {
          currentAnnotation = line.trim().slice(1, -1);
        } else if (line.trim()) {
          const lineObj = {
            text: line.trim()
          };
          // Only add annotation if it exists
          if (currentAnnotation) {
            lineObj.annotation = currentAnnotation;
          }
          lines.push(lineObj);
          currentAnnotation = '';
        }
      });

      // Add empty line between sections (no annotation field if not needed)
      lines.push({ text: '' });
    });

    return lines;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const lyricsData = {
        songTitle: formData.songTitle.trim(),
        artist: formData.artist.trim() || 'Pratyaksh Bharadwaj',
        lines: parseLyrics(formData.lyrics),
        updatedAt: new Date()
      };

      // Only add optional fields if they have values
      if (formData.album.trim()) {
        lyricsData.album = formData.album.trim();
      }
      if (formData.albumArt.trim()) {
        lyricsData.albumArt = formData.albumArt.trim();
      }
      if (formData.spotifyTrackId.trim()) {
        lyricsData.spotifyTrackId = formData.spotifyTrackId.trim();
      }
      if (formData.producers.trim()) {
        lyricsData.producers = formData.producers.trim();
      }

      if (isNew) {
        await addDoc(collection(db, 'lyrics'), {
          ...lyricsData,
          createdAt: new Date()
        });
      } else {
        await setDoc(doc(db, 'lyrics', songId), lyricsData, { merge: true });
      }

      onSave();
    } catch (error) {
      console.error('Error saving lyrics:', error);
      alert('Error saving lyrics');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this song and its lyrics?')) return;

    setSaving(true);
    try {
      await deleteDoc(doc(db, 'lyrics', songId));
      onSave();
    } catch (error) {
      console.error('Error deleting lyrics:', error);
      alert('Error deleting lyrics');
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-start justify-center p-4 overflow-y-auto"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-dark-card rounded-2xl p-6 md:p-8 max-w-4xl w-full shadow-2xl border-2 border-theme-primary my-8 max-h-[90vh] overflow-y-auto"
      >
        <h3 className="font-bold text-3xl mb-6">
          {isNew ? 'Add New Song Lyrics' : 'Edit Lyrics'}
        </h3>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Song Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Song Title *
              </label>
              <input
                type="text"
                value={formData.songTitle}
                onChange={(e) => setFormData({ ...formData, songTitle: e.target.value })}
                required
                className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-theme-primary outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Artist
              </label>
              <input
                type="text"
                value={formData.artist}
                onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-theme-primary outline-none"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Album
              </label>
              <input
                type="text"
                value={formData.album}
                onChange={(e) => setFormData({ ...formData, album: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-theme-primary outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Album Art URL
              </label>
              <input
                type="url"
                value={formData.albumArt}
                onChange={(e) => setFormData({ ...formData, albumArt: e.target.value })}
                placeholder="https://example.com/album-cover.jpg"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-theme-primary outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Producers
            </label>
            <input
              type="text"
              value={formData.producers}
              onChange={(e) => setFormData({ ...formData, producers: e.target.value })}
              placeholder="Producer names"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-theme-primary outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Spotify Track ID
            </label>
            <input
              type="text"
              value={formData.spotifyTrackId}
              onChange={(e) => setFormData({ ...formData, spotifyTrackId: e.target.value })}
              placeholder="e.g., 3n3Ppam7vgaVa1iaRUc9Lp (from Spotify track URL)"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-theme-primary outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              Find it in the Spotify URL: spotify.com/track/<strong>THIS_PART</strong>
            </p>
          </div>

          {/* Lyrics Textarea */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Lyrics *
            </label>
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-2 text-sm">
              <p className="font-semibold mb-1">💡 Formatting Tips:</p>
              <ul className="space-y-1 text-xs text-gray-700 dark:text-gray-300">
                <li>• Separate verses/sections with <strong>double line breaks</strong></li>
                <li>• Add annotations on the next line in <strong>[square brackets]</strong></li>
                <li>• Example:</li>
              </ul>
              <pre className="mt-2 text-xs bg-white dark:bg-dark-bg p-2 rounded">
{`Main jo kehta hoon woh sach hota hai
[This line references his commitment to authenticity]

Sapne dekhta hoon main raat bhar`}
              </pre>
            </div>
            <textarea
              value={formData.lyrics}
              onChange={(e) => setFormData({ ...formData, lyrics: e.target.value })}
              required
              rows={20}
              placeholder="Enter lyrics here... (Use double line breaks to separate verses)"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-theme-primary outline-none font-mono text-sm"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-all disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Lyrics'}
            </button>
            {!isNew && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={saving}
                className="px-6 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-all disabled:opacity-50"
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

export default LyricsEditor;
