import React, { useState } from 'react';
import { motion } from 'framer-motion';

const AdminLogin = ({ onGoogleLogin }) => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);

    try {
      await onGoogleLogin();
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="bg-white dark:bg-dark-card rounded-3xl shadow-2xl border-2 border-theme-primary/20 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-display font-black text-4xl mb-2">
              <span className="text-gradient">Admin</span> Login
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Content Management System
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl"
            >
              <p className="text-red-600 dark:text-red-400 text-sm font-semibold">
                {error}
              </p>
            </motion.div>
          )}

          {/* Google Login Button */}
          <div className="space-y-4">
            <motion.button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full py-4 bg-white dark:bg-dark-bg border-2 border-gray-200 dark:border-gray-700 hover:border-theme-primary rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-theme-primary border-t-transparent rounded-full animate-spin" />
                  <span className="text-gray-900 dark:text-white">Signing in...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="text-gray-900 dark:text-white">Continue with Google</span>
                </>
              )}
            </motion.button>

            <p className="text-xs text-center text-gray-500 dark:text-gray-400">
              Sign in with your Google account to access admin panel
            </p>
          </div>

          {/* Back to Home */}
          <div className="mt-8 text-center">
            <a
              href="/"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-theme-primary transition-colors inline-flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </a>
          </div>
        </div>

        {/* Setup Instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl"
        >
          <p className="text-blue-600 dark:text-blue-400 text-xs">
            <strong>Setup Required:</strong> Configure Firebase in src/firebase/config.js and create an admin user in Firebase Authentication.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
