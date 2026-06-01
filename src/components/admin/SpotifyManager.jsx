import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../../firebase/config';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy } from 'firebase/firestore';

const SpotifyManager = () => {
  const [releases, setReleases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingRelease, setEditingRelease] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    type: 'Single',
    year: new Date().getFullYear().toString(),
    image: '',
    url: '',
    streams: '',
    tracks: []
  });
  const [newTrack, setNewTrack] = useState({ number: 1, name: '', duration: '' });

  useEffect(() => {
    fetchReleases();
  }, []);

  const fetchReleases = async () => {
    try {
      const q = query(collection(db, 'spotify-releases'), orderBy('order', 'asc'));
      const querySnapshot = await getDocs(q);
      const releasesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setReleases(releasesData);
    } catch (error) {
      console.error('Error fetching releases:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRelease = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, 'spotify-releases'), {
        ...formData,
        category: 'spotify',
        order: releases.length,
        createdAt: new Date()
      });

      resetForm();
      fetchReleases();
    } catch (error) {
      console.error('Error adding release:', error);
      alert('Error adding release');
    }
  };

  const handleUpdateRelease = async (e) => {
    e.preventDefault();

    try {
      const releaseRef = doc(db, 'spotify-releases', editingRelease.id);
      await updateDoc(releaseRef, {
        ...formData,
        updatedAt: new Date()
      });

      setEditingRelease(null);
      resetForm();
      fetchReleases();
    } catch (error) {
      console.error('Error updating release:', error);
      alert('Error updating release');
    }
  };

  const handleDeleteRelease = async (releaseId) => {
    if (!confirm('Are you sure you want to delete this release?')) return;

    try {
      await deleteDoc(doc(db, 'spotify-releases', releaseId));
      fetchReleases();
    } catch (error) {
      console.error('Error deleting release:', error);
      alert('Error deleting release');
    }
  };

  const addTrack = () => {
    if (!newTrack.name) {
      alert('Please enter track name');
      return;
    }

    setFormData({
      ...formData,
      tracks: [...formData.tracks, { ...newTrack }]
    });
    setNewTrack({ number: formData.tracks.length + 2, name: '', duration: '' });
  };

  const removeTrack = (index) => {
    const updatedTracks = formData.tracks.filter((_, i) => i !== index);
    setFormData({ ...formData, tracks: updatedTracks });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      type: 'Single',
      year: new Date().getFullYear().toString(),
      image: '',
      url: '',
      streams: '',
      tracks: []
    });
    setNewTrack({ number: 1, name: '', duration: '' });
    setShowAddForm(false);
  };

  const startEdit = (release) => {
    setEditingRelease(release);
    setFormData({
      title: release.title,
      type: release.type,
      year: release.year,
      image: release.image,
      url: release.url,
      streams: release.streams || '',
      tracks: release.tracks || []
    });
    setShowAddForm(false);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-12 h-12 border-4 border-theme-primary border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-display font-black text-3xl mb-2">
            Spotify Releases
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Manage albums, singles, and EPs ({releases.length} total)
          </p>
        </div>
        <button
          onClick={() => {
            setShowAddForm(!showAddForm);
            setEditingRelease(null);
            resetForm();
          }}
          className="px-6 py-3 bg-gradient-to-r from-theme-primary to-theme-secondary text-white font-bold rounded-xl hover:shadow-lg transition-all"
        >
          {showAddForm ? 'Cancel' : '+ Add Release'}
        </button>
      </div>

      {/* Add/Edit Form */}
      <AnimatePresence>
        {(showAddForm || editingRelease) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8 overflow-hidden"
          >
            <form onSubmit={editingRelease ? handleUpdateRelease : handleAddRelease} className="bg-white dark:bg-dark-card rounded-xl border-2 border-theme-primary/20 p-6">
              <h3 className="font-bold text-xl mb-4">
                {editingRelease ? 'Edit Release' : 'Add New Release'}
              </h3>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-theme-primary outline-none"
                    placeholder="e.g., Rebirth"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-theme-primary outline-none"
                  >
                    <option value="Single">Single</option>
                    <option value="EP">EP</option>
                    <option value="Album">Album</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Year</label>
                  <input
                    type="text"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-theme-primary outline-none"
                    placeholder="2024"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Streams (Optional)</label>
                  <input
                    type="text"
                    value={formData.streams}
                    onChange={(e) => setFormData({ ...formData, streams: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-theme-primary outline-none"
                    placeholder="e.g., 1M+ streams"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold mb-2">Spotify URL</label>
                  <input
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-theme-primary outline-none"
                    placeholder="https://open.spotify.com/album/..."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold mb-2">Album Art URL</label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-theme-primary outline-none"
                    placeholder="https://i.scdn.co/image/..."
                  />
                  {formData.image && (
                    <img src={formData.image} alt="Preview" className="w-32 h-32 object-cover rounded-lg mt-2" />
                  )}
                </div>
              </div>

              {/* Tracks Section */}
              {(formData.type === 'Album' || formData.type === 'EP') && (
                <div className="mt-6 p-4 bg-gray-50 dark:bg-dark-bg rounded-lg">
                  <h4 className="font-bold mb-3">Tracklist</h4>

                  {/* Existing Tracks */}
                  {formData.tracks.length > 0 && (
                    <div className="space-y-2 mb-4">
                      {formData.tracks.map((track, index) => (
                        <div key={index} className="flex items-center gap-2 bg-white dark:bg-dark-card p-2 rounded">
                          <span className="text-sm font-semibold w-8">{track.number}.</span>
                          <span className="flex-1 text-sm">{track.name}</span>
                          <span className="text-sm text-gray-500">{track.duration}</span>
                          <button
                            type="button"
                            onClick={() => removeTrack(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Track Form */}
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={newTrack.number}
                      onChange={(e) => setNewTrack({ ...newTrack, number: parseInt(e.target.value) })}
                      className="w-16 px-2 py-2 bg-white dark:bg-dark-card border rounded text-sm"
                      placeholder="#"
                    />
                    <input
                      type="text"
                      value={newTrack.name}
                      onChange={(e) => setNewTrack({ ...newTrack, name: e.target.value })}
                      className="flex-1 px-3 py-2 bg-white dark:bg-dark-card border rounded text-sm"
                      placeholder="Track name"
                    />
                    <input
                      type="text"
                      value={newTrack.duration}
                      onChange={(e) => setNewTrack({ ...newTrack, duration: e.target.value })}
                      className="w-20 px-2 py-2 bg-white dark:bg-dark-card border rounded text-sm"
                      placeholder="3:45"
                    />
                    <button
                      type="button"
                      onClick={addTrack}
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm font-semibold"
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-theme-primary to-theme-secondary text-white font-bold rounded-lg hover:shadow-lg transition-all"
                >
                  {editingRelease ? 'Update Release' : 'Add Release'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingRelease(null);
                    resetForm();
                  }}
                  className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Releases Grid */}
      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
        {releases.map((release) => (
          <motion.div
            key={release.id}
            layout
            className="bg-white dark:bg-dark-card rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 hover:border-theme-primary transition-all"
          >
            <div className="aspect-square relative">
              <img
                src={release.image}
                alt={release.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-4">
              <h3 className="font-bold text-lg mb-1 line-clamp-1">{release.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                {release.type} • {release.year}
              </p>
              {release.tracks && release.tracks.length > 0 && (
                <p className="text-xs text-theme-secondary font-semibold mb-3">
                  {release.tracks.length} tracks
                </p>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(release)}
                  className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all text-sm font-semibold"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteRelease(release.id)}
                  className="flex-1 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all text-sm font-semibold"
                >
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {releases.length === 0 && (
        <div className="text-center py-12 bg-gray-50 dark:bg-dark-bg rounded-xl">
          <p className="text-gray-500 dark:text-gray-400 mb-4">No releases yet</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-6 py-3 bg-gradient-to-r from-theme-primary to-theme-secondary text-white font-bold rounded-xl hover:shadow-lg transition-all"
          >
            Add Your First Release
          </button>
        </div>
      )}
    </div>
  );
};

export default SpotifyManager;
