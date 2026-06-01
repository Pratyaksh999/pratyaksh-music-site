import React, { useState } from 'react';
import { motion } from 'framer-motion';

const EmailCollector = ({ source = 'newsletter', placeholder = 'Enter your email', buttonText = 'Subscribe' }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [message, setMessage] = useState('');

  // Google Apps Script Web App URL
  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzxzsIyuS25KWsLhqhzdLBTy_PGxw6Z-Wv2XbESVkwGu-NFcZudh90QtYrfhZx5qvAOKg/exec';

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate email
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email');
      return;
    }


    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // Required for Google Apps Script
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          source: source
        })
      });

      // Note: With no-cors mode, we can't read the response
      // But if no error was thrown, it likely succeeded
      setStatus('success');
      setMessage('Thanks for subscribing!');
      setEmail('');

      // Reset after 3 seconds
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 3000);

    } catch (error) {
      console.error('Email submission error:', error);
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder}
          disabled={status === 'loading'}
          className="flex-1 px-4 py-3 bg-white dark:bg-dark-card border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-theme-primary outline-none transition-all disabled:opacity-50"
        />
        <motion.button
          type="submit"
          disabled={status === 'loading'}
          className="px-6 py-3 bg-gradient-to-r from-theme-primary to-theme-secondary text-white font-bold rounded-lg hover:shadow-lg hover:shadow-theme-primary/50 transition-all disabled:opacity-50 whitespace-nowrap"
          whileHover={{ scale: status === 'loading' ? 1 : 1.05 }}
          whileTap={{ scale: status === 'loading' ? 1 : 0.95 }}
        >
          {status === 'loading' ? 'Sending...' : buttonText}
        </motion.button>
      </div>

      {message && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-2 text-sm ${
            status === 'success' ? 'text-green-500' : 'text-red-500'
          }`}
        >
          {message}
        </motion.p>
      )}
    </form>
  );
};

export default EmailCollector;
