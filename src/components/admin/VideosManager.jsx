import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../../firebase/config';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy } from 'firebase/firestore';

const VideosManager = ({ isHomepage = true }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    year: new Date().getFullYear().toString(),
    videoId: '',
    thumbnail: '',
    showOnHomepage: isHomepage
  });

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const q = query(collection(db, 'videos'), orderBy('order', 'asc'));
      const querySnapshot = await getDocs(q);
      const videosData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })).filter(video => video.showOnHomepage === isHomepage);
      setVideos(videosData);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleAddVideo = async (e) => {
    e.preventDefault();

    const videoId = extractVideoId(formData.url);
    if (!videoId) {
      alert('Invalid YouTube URL');
      return;
    }

    try {
      await addDoc(collection(db, 'videos'), {
        title: formData.title,
        url: formData.url,
        year: formData.year,
        videoId: videoId,
        thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        showOnHomepage: isHomepage,
        order: videos.length,
        createdAt: new Date()
      });

      setFormData({ title: '', url: '', year: new Date().getFullYear().toString(), videoId: '', thumbnail: '', showOnHomepage: isHomepage });
      setShowAddForm(false);
      fetchVideos();
    } catch (error) {
      console.error('Error adding video:', error);
      alert('Error adding video');
    }
  };

  const handleUpdateVideo = async (e) => {
    e.preventDefault();

    try {
      const videoRef = doc(db, 'videos', editingVideo.id);
      const videoId = extractVideoId(formData.url);

      await updateDoc(videoRef, {
        title: formData.title,
        url: formData.url,
        year: formData.year,
        videoId: videoId,
        thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        updatedAt: new Date()
      });

      setEditingVideo(null);
      setFormData({ title: '', url: '', year: '', videoId: '', thumbnail: '' });
      fetchVideos();
    } catch (error) {
      console.error('Error updating video:', error);
      alert('Error updating video');
    }
  };

  const handleDeleteVideo = async (videoId) => {
    if (!confirm('Are you sure you want to delete this video?')) return;

    try {
      await deleteDoc(doc(db, 'videos', videoId));
      fetchVideos();
    } catch (error) {
      console.error('Error deleting video:', error);
      alert('Error deleting video');
    }
  };

  const startEdit = (video) => {
    setEditingVideo(video);
    setFormData({
      title: video.title,
      url: video.url,
      year: video.year,
      videoId: video.videoId,
      thumbnail: video.thumbnail,
      showOnHomepage: video.showOnHomepage
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
            {isHomepage ? 'Homepage Videos' : 'Video Directory'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {isHomepage
              ? `Manage videos shown on homepage (${videos.length}/8 videos)`
              : `Manage all directory videos (${videos.length} total)`
            }
          </p>
        </div>
        <button
          onClick={() => {
            setShowAddForm(!showAddForm);
            setEditingVideo(null);
            setFormData({ title: '', url: '', year: new Date().getFullYear().toString(), videoId: '', thumbnail: '', showOnHomepage: isHomepage });
          }}
          className="px-6 py-3 bg-gradient-to-r from-theme-primary to-theme-secondary text-white font-bold rounded-xl hover:shadow-lg transition-all"
        >
          {showAddForm ? 'Cancel' : '+ Add Video'}
        </button>
      </div>

      {/* Add/Edit Form */}
      <AnimatePresence>
        {(showAddForm || editingVideo) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8 overflow-hidden"
          >
            <form onSubmit={editingVideo ? handleUpdateVideo : handleAddVideo} className="bg-white dark:bg-dark-card rounded-xl border-2 border-theme-primary/20 p-6">
              <h3 className="font-bold text-xl mb-4">
                {editingVideo ? 'Edit Video' : 'Add New Video'}
              </h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Video Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-theme-primary outline-none"
                    placeholder="e.g., Tu Hi Bata"
                  />
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

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold mb-2">YouTube URL</label>
                  <input
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-theme-primary outline-none"
                    placeholder="https://youtu.be/..."
                  />
                  <p className="text-xs text-gray-500 mt-1">Paste the full YouTube video URL</p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-theme-primary to-theme-secondary text-white font-bold rounded-lg hover:shadow-lg transition-all"
                >
                  {editingVideo ? 'Update Video' : 'Add Video'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingVideo(null);
                    setFormData({ title: '', url: '', year: '', videoId: '', thumbnail: '', showOnHomepage: isHomepage });
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

      {/* Videos List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <motion.div
            key={video.id}
            layout
            className="bg-white dark:bg-dark-card rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 hover:border-theme-primary transition-all"
          >
            {/* Thumbnail */}
            <div className="aspect-video relative group">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <a
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                  title="Watch on YouTube"
                >
                  <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Info */}
            <div className="p-4">
              <h3 className="font-bold text-lg mb-1 line-clamp-1">{video.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Year: {video.year}</p>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(video)}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all text-sm font-semibold"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteVideo(video.id)}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all text-sm font-semibold"
                >
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {videos.length === 0 && (
        <div className="text-center py-12 bg-gray-50 dark:bg-dark-bg rounded-xl">
          <p className="text-gray-500 dark:text-gray-400 mb-4">No videos yet</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-6 py-3 bg-gradient-to-r from-theme-primary to-theme-secondary text-white font-bold rounded-xl hover:shadow-lg transition-all"
          >
            Add Your First Video
          </button>
        </div>
      )}
    </div>
  );
};

export default VideosManager;
