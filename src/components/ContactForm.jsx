import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { db } from '../firebase/config';
import { collection, addDoc } from 'firebase/firestore';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    inquiryType: 'general',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState('idle'); // idle, sending, success, error

  const inquiryTypes = [
    { value: 'booking', label: '🎤 Booking Inquiry', description: 'Live shows, events, performances' },
    { value: 'collaboration', label: '🤝 Collaboration', description: 'Feature requests, production work' },
    { value: 'fan', label: '💜 Fan Message', description: 'Just saying hi, feedback' },
    { value: 'general', label: '📧 General Inquiry', description: 'Other questions' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    try {
      // Save to Firebase
      await addDoc(collection(db, 'contact-submissions'), {
        ...formData,
        submittedAt: new Date(),
        read: false
      });

      // Send auto-response email (optional - can use Google Apps Script)
      // This would be similar to the newsletter signup

      setStatus('success');
      setFormData({
        name: '',
        email: '',
        inquiryType: 'general',
        subject: '',
        message: ''
      });

      // Reset status after 5 seconds
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <section id="contact" className="section-padding bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-dark-bg dark:via-purple-950/20 dark:to-dark-bg">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2
            className="font-display font-black text-4xl md:text-5xl mb-4"
            animate={{
              backgroundPosition: ['0%', '100%', '0%']
            }}
            transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
          >
            <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-[length:200%_auto]">
              Get In Touch
            </span>
          </motion.h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Let's create something amazing together
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Inquiry Types */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="font-bold text-xl mb-4">What can I help with?</h3>
            {inquiryTypes.map((type, index) => (
              <motion.div
                key={type.value}
                className="p-4 bg-white/60 dark:bg-dark-card/60 backdrop-blur-xl rounded-xl border border-gray-200/50 dark:border-gray-700/50"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="font-semibold text-sm mb-1">{type.label}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{type.description}</div>
              </motion.div>
            ))}

            {/* Social Links */}
            <motion.div
              className="p-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl text-white mt-8"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <h4 className="font-bold mb-3">Find me on social</h4>
              <div className="space-y-2 text-sm">
                <a href="#" className="block hover:underline">📸 Instagram</a>
                <a href="#" className="block hover:underline">🎵 Spotify</a>
                <a href="#" className="block hover:underline">🐦 Twitter</a>
                <a href="#" className="block hover:underline">▶️ YouTube</a>
              </div>
            </motion.div>
          </div>

          {/* Contact Form */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <form onSubmit={handleSubmit} className="bg-white/60 dark:bg-dark-card/60 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-purple-500 outline-none transition-all"
                    placeholder="John Doe"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Your Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-purple-500 outline-none transition-all"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              {/* Inquiry Type */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">
                  Inquiry Type *
                </label>
                <select
                  value={formData.inquiryType}
                  onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-purple-500 outline-none transition-all"
                >
                  {inquiryTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              {/* Subject */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-purple-500 outline-none transition-all"
                  placeholder="What's this about?"
                />
              </div>

              {/* Message */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">
                  Message *
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-purple-500 outline-none transition-all resize-none"
                  placeholder="Tell me more..."
                />
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={status === 'sending'}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                  status === 'success'
                    ? 'bg-green-500 text-white'
                    : status === 'error'
                    ? 'bg-red-500 text-white'
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:shadow-purple-500/50'
                }`}
                whileHover={status === 'idle' ? { scale: 1.02 } : {}}
                whileTap={status === 'idle' ? { scale: 0.98 } : {}}
              >
                {status === 'sending' && '✈️ Sending...'}
                {status === 'success' && '✅ Message Sent!'}
                {status === 'error' && '❌ Failed to Send'}
                {status === 'idle' && 'Send Message'}
              </motion.button>

              {status === 'success' && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 text-center text-green-600 dark:text-green-400 text-sm"
                >
                  Thanks for reaching out! I'll get back to you soon.
                </motion.p>
              )}

              {status === 'error' && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 text-center text-red-600 dark:text-red-400 text-sm"
                >
                  Something went wrong. Please try again or email directly.
                </motion.p>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
