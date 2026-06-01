import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../firebase/config';
import { signOut } from 'firebase/auth';

const EditModeToggle = ({ editMode, setEditMode }) => {
  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!user) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-24 right-8 z-[60] flex items-center gap-3"
    >
      {/* Edit Mode Toggle */}
      <motion.button
        onClick={() => setEditMode(!editMode)}
        className={`px-6 py-3 rounded-xl font-bold shadow-lg transition-all flex items-center gap-2 ${
          editMode
            ? 'bg-gradient-to-r from-theme-primary to-theme-secondary text-white'
            : 'bg-white dark:bg-dark-card text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-700'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {editMode ? '✓ Editing' : '✏️ Edit Mode'}
      </motion.button>

      {/* Logout Button */}
      <motion.button
        onClick={handleLogout}
        className="px-4 py-3 bg-red-500 text-white rounded-xl font-bold shadow-lg hover:bg-red-600 transition-all"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Logout
      </motion.button>
    </motion.div>
  );
};

export default EditModeToggle;
