import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase/config';
import { collection, getDocs, query, orderBy, limit, where } from 'firebase/firestore';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { isAdmin } from '../utils/adminCheck';

const Analytics = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSubmissions: 0,
    totalEmails: 0,
    totalSongs: 0,
    popularSongs: [],
    recentContacts: [],
    inquiryBreakdown: {}
  });

  useEffect(() => {
    if (!isAdmin(user)) return;

    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        // Fetch contact submissions
        const contactsSnapshot = await getDocs(collection(db, 'contact-submissions'));
        const contacts = contactsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Fetch email signups
        const emailsSnapshot = await getDocs(collection(db, 'email-signups'));
        const emails = emailsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Fetch lyrics with view counts
        const lyricsSnapshot = await getDocs(collection(db, 'lyrics'));
        const lyrics = lyricsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          viewCount: doc.data().viewCount || 0
        }));

        // Calculate inquiry breakdown
        const inquiryBreakdown = contacts.reduce((acc, contact) => {
          const type = contact.inquiryType || 'general';
          acc[type] = (acc[type] || 0) + 1;
          return acc;
        }, {});

        // Sort songs by view count (most viewed first)
        const popularSongs = lyrics
          .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
          .slice(0, 5);

        // Get recent contacts
        const recentContacts = contacts
          .sort((a, b) => {
            const dateA = a.submittedAt?.toDate?.() || new Date(0);
            const dateB = b.submittedAt?.toDate?.() || new Date(0);
            return dateB - dateA;
          })
          .slice(0, 5);

        setStats({
          totalSubmissions: contacts.length,
          totalEmails: emails.length,
          totalSongs: lyrics.length,
          popularSongs,
          recentContacts,
          inquiryBreakdown
        });
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [user]);

  // Redirect if not admin
  if (!isAdmin(user)) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-white">Access Denied</h1>
          <p className="text-gray-400">Admin access required to view analytics.</p>
        </div>
      </div>
    );
  }

  const StatCard = ({ title, value, icon, color = 'purple' }) => (
    <motion.div
      className={`bg-white/60 dark:bg-dark-card/60 backdrop-blur-xl rounded-xl p-6 border border-${color}-200/50 dark:border-${color}-700/50 shadow-xl`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-4xl">{icon}</span>
        <span className={`text-3xl font-bold bg-gradient-to-r from-${color}-500 to-pink-500 bg-clip-text text-transparent`}>
          {value}
        </span>
      </div>
      <h3 className="text-gray-600 dark:text-gray-400 font-semibold">{title}</h3>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30 dark:from-dark-bg dark:via-purple-950/20 dark:to-pink-950/20">
      <Navigation />

      <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-display font-black text-4xl md:text-5xl mb-3">
            <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600">
              Analytics Dashboard
            </span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your audience engagement and growth
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard
            title="Contact Submissions"
            value={stats.totalSubmissions}
            icon="📬"
            color="purple"
          />
          <StatCard
            title="Email Signups"
            value={stats.totalEmails}
            icon="✉️"
            color="pink"
          />
          <StatCard
            title="Songs with Lyrics"
            value={stats.totalSongs}
            icon="🎵"
            color="blue"
          />
          <StatCard
            title="Total Visitors"
            value="—"
            icon="👥"
            color="green"
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Inquiry Breakdown */}
          <motion.div
            className="bg-white/60 dark:bg-dark-card/60 backdrop-blur-xl rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-xl"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="font-bold text-xl mb-6 flex items-center gap-2">
              📊 Inquiry Breakdown
            </h2>
            <div className="space-y-4">
              {Object.entries(stats.inquiryBreakdown).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <span className="capitalize font-medium">{type}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${(count / stats.totalSubmissions) * 100}%` }}
                        transition={{ duration: 1, delay: 0.2 }}
                      />
                    </div>
                    <span className="font-bold text-purple-600 dark:text-purple-400 w-8 text-right">
                      {count}
                    </span>
                  </div>
                </div>
              ))}
              {Object.keys(stats.inquiryBreakdown).length === 0 && (
                <p className="text-gray-500 text-center py-4">No inquiries yet</p>
              )}
            </div>
          </motion.div>

          {/* Popular Songs */}
          <motion.div
            className="bg-white/60 dark:bg-dark-card/60 backdrop-blur-xl rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-xl"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="font-bold text-xl mb-6 flex items-center gap-2">
              🔥 Popular Songs
            </h2>
            <div className="space-y-3">
              {stats.popularSongs.map((song, index) => (
                <motion.div
                  key={song.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-dark-bg rounded-lg"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <span className="font-bold text-2xl text-purple-500">#{index + 1}</span>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{song.songTitle}</p>
                    <p className="text-xs text-gray-500">{song.artist || 'Pratyaksh Bharadwaj'}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-purple-600 dark:text-purple-400">{song.viewCount || 0}</p>
                    <p className="text-xs text-gray-500">views</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Recent Contacts */}
          <motion.div
            className="lg:col-span-2 bg-white/60 dark:bg-dark-card/60 backdrop-blur-xl rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="font-bold text-xl mb-6 flex items-center gap-2">
              📨 Recent Contact Submissions
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-semibold text-sm">Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm">Email</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm">Type</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm">Subject</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentContacts.map((contact) => (
                    <tr key={contact.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="py-3 px-4 text-sm">{contact.name}</td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{contact.email}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs capitalize">
                          {contact.inquiryType}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm truncate max-w-xs">{contact.subject}</td>
                      <td className="py-3 px-4 text-sm text-gray-500">
                        {contact.submittedAt?.toDate?.().toLocaleDateString() || 'N/A'}
                      </td>
                    </tr>
                  ))}
                  {stats.recentContacts.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-500">
                        No contact submissions yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Analytics;
