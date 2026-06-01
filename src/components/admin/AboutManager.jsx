import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '../../firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const AboutManager = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    bio: '',
    profileImage: '',
    socialLinks: {
      spotify: '',
      appleMusic: '',
      youtube: '',
      instagram: ''
    },
    contactInfo: {
      email: '',
      location: ''
    }
  });

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      const docRef = doc(db, 'about', 'main');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setFormData(docSnap.data());
      }
    } catch (error) {
      console.error('Error fetching about data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const docRef = doc(db, 'about', 'main');
      await setDoc(docRef, {
        ...formData,
        updatedAt: new Date()
      });

      alert('About section updated successfully!');
    } catch (error) {
      console.error('Error saving about data:', error);
      alert('Error saving about data');
    } finally {
      setSaving(false);
    }
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
      <div className="mb-8">
        <h2 className="font-display font-black text-3xl mb-2">
          About Section
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your bio, profile, and contact information
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Bio Section */}
        <div className="bg-white dark:bg-dark-card rounded-xl border-2 border-gray-200 dark:border-gray-700 p-6">
          <h3 className="font-bold text-xl mb-4">Biography</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Profile Image URL</label>
              <input
                type="url"
                value={formData.profileImage}
                onChange={(e) => setFormData({ ...formData, profileImage: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-theme-primary outline-none"
                placeholder="https://..."
              />
              {formData.profileImage && (
                <img src={formData.profileImage} alt="Profile" className="w-32 h-32 object-cover rounded-full mt-2" />
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows="6"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-theme-primary outline-none resize-none"
                placeholder="Tell your story..."
              />
              <p className="text-xs text-gray-500 mt-1">This will appear in the About section</p>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white dark:bg-dark-card rounded-xl border-2 border-gray-200 dark:border-gray-700 p-6">
          <h3 className="font-bold text-xl mb-4">Social Links</h3>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#1DB954]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                  </svg>
                  Spotify
                </span>
              </label>
              <input
                type="url"
                value={formData.socialLinks.spotify}
                onChange={(e) => setFormData({
                  ...formData,
                  socialLinks: { ...formData.socialLinks, spotify: e.target.value }
                })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-theme-primary outline-none"
                placeholder="https://open.spotify.com/artist/..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-black dark:text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.994 6.124a9.23 9.23 0 0 0-.24-2.132c-.317-1.213-1.265-2.16-2.477-2.477A9.188 9.188 0 0 0 19.146 1.5h-14.29a9.223 9.223 0 0 0-2.133.24c-1.213.317-2.161 1.265-2.477 2.477a9.188 9.188 0 0 0-.015 2.132L0 12l.232 5.876a9.23 9.23 0 0 0 .24 2.132c.317 1.213 1.265 2.16 2.477 2.477.645.175 1.314.257 2.132.24l5.876.232 5.876-.232a9.188 9.188 0 0 0 2.132-.24c1.213-.317 2.16-1.265 2.477-2.477.175-.645.257-1.314.24-2.132L24 12l-.006-5.876zm-11.99 3.375v3.002c0 .417-.338.755-.755.755s-.755-.338-.755-.755V9.499c-1.279-.256-2.245-1.393-2.245-2.754 0-1.547 1.251-2.799 2.799-2.799s2.799 1.251 2.799 2.799c0 1.361-.966 2.498-2.245 2.754zm0-3.002c0-.417.338-.755.755-.755s.755.338.755.755-.338.755-.755.755-.755-.338-.755-.755z"/>
                  </svg>
                  Apple Music
                </span>
              </label>
              <input
                type="url"
                value={formData.socialLinks.appleMusic}
                onChange={(e) => setFormData({
                  ...formData,
                  socialLinks: { ...formData.socialLinks, appleMusic: e.target.value }
                })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-theme-primary outline-none"
                placeholder="https://music.apple.com/..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#FF0000]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"/>
                    <path fill="#fff" d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  YouTube
                </span>
              </label>
              <input
                type="url"
                value={formData.socialLinks.youtube}
                onChange={(e) => setFormData({
                  ...formData,
                  socialLinks: { ...formData.socialLinks, youtube: e.target.value }
                })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-theme-primary outline-none"
                placeholder="https://youtube.com/@..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="url(#instagram-gradient)">
                    <defs>
                      <linearGradient id="instagram-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#F58529" />
                        <stop offset="50%" stopColor="#DD2A7B" />
                        <stop offset="100%" stopColor="#8134AF" />
                      </linearGradient>
                    </defs>
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  Instagram
                </span>
              </label>
              <input
                type="url"
                value={formData.socialLinks.instagram}
                onChange={(e) => setFormData({
                  ...formData,
                  socialLinks: { ...formData.socialLinks, instagram: e.target.value }
                })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-theme-primary outline-none"
                placeholder="https://instagram.com/..."
              />
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white dark:bg-dark-card rounded-xl border-2 border-gray-200 dark:border-gray-700 p-6">
          <h3 className="font-bold text-xl mb-4">Contact Information</h3>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Email</label>
              <input
                type="email"
                value={formData.contactInfo.email}
                onChange={(e) => setFormData({
                  ...formData,
                  contactInfo: { ...formData.contactInfo, email: e.target.value }
                })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-theme-primary outline-none"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Location</label>
              <input
                type="text"
                value={formData.contactInfo.location}
                onChange={(e) => setFormData({
                  ...formData,
                  contactInfo: { ...formData.contactInfo, location: e.target.value }
                })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-theme-primary outline-none"
                placeholder="City, Country"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <motion.button
            type="submit"
            disabled={saving}
            className="px-8 py-4 bg-gradient-to-r from-theme-primary to-theme-secondary text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
            whileHover={{ scale: saving ? 1 : 1.02 }}
            whileTap={{ scale: saving ? 1 : 0.98 }}
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </span>
            ) : (
              'Save Changes'
            )}
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default AboutManager;
