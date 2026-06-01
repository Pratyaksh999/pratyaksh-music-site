import React from 'react';
import { motion } from 'framer-motion';

const Privacy = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-white dark:bg-dark-bg text-gray-900 dark:text-white"
    >
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-dark-bg/95 backdrop-blur-md border-b border-theme-primary/20"
      >
        <div className="max-w-4xl mx-auto px-6 md:px-12 py-6">
          <a href="/" className="text-2xl font-display font-black">
            <span className="text-gradient fire-glow">PB</span>
          </a>
        </div>
      </motion.header>

      {/* Content */}
      <div className="pt-32 pb-20 px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="font-display font-black text-5xl md:text-7xl mb-4">
            Privacy <span className="text-gradient fire-glow">Policy</span>
          </h1>
          <p className="text-gray-400 text-lg mb-12">
            Last updated: May 31, 2026
          </p>

          <div className="space-y-8 text-gray-300 leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Introduction</h2>
              <p>
                Welcome to Pratyaksh Bharadwaj's official music website. This Privacy Policy explains how we collect, use, and protect your personal information when you visit our site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Information We Collect</h2>
              <p className="mb-3">We may collect the following types of information:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Email addresses provided through our newsletter signup</li>
                <li>Usage data and analytics (page views, clicks, device information)</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">How We Use Your Information</h2>
              <p className="mb-3">We use the collected information for:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Sending updates about new music releases and exclusive content</li>
                <li>Improving our website and user experience</li>
                <li>Analyzing site traffic and user behavior</li>
                <li>Responding to your inquiries and requests</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Third-Party Services</h2>
              <p className="mb-3">
                Our website integrates with third-party services including:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Spotify:</strong> For streaming music and displaying live metrics</li>
                <li><strong>YouTube:</strong> For hosting and displaying music videos</li>
                <li><strong>Apple Music:</strong> For music streaming links</li>
                <li><strong>Instagram:</strong> For social media integration</li>
              </ul>
              <p className="mt-3">
                These services have their own privacy policies and may collect data when you interact with embedded content.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Cookies</h2>
              <p>
                We use cookies to enhance your browsing experience, cache Spotify data, and analyze site usage. You can disable cookies in your browser settings, though some features may not function properly.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Data Security</h2>
              <p>
                We implement reasonable security measures to protect your personal information. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Your Rights</h2>
              <p className="mb-3">You have the right to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Access the personal information we hold about you</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of marketing communications</li>
                <li>Object to data processing</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Children's Privacy</h2>
              <p>
                Our website is not directed to children under 13. We do not knowingly collect personal information from children under 13. If you believe we have collected such information, please contact us immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated revision date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at:{' '}
                <a href="mailto:pratyakshbharadwaj@gmail.com" className="text-fire-orange hover:underline">
                  pratyakshbharadwaj@gmail.com
                </a>
              </p>
            </section>
          </div>

          {/* Back Button */}
          <motion.a
            href="/"
            className="inline-flex items-center gap-2 mt-12 px-8 py-4 bg-gradient-to-r from-fire-red to-fire-orange text-white font-bold rounded-full hover:shadow-lg hover:shadow-fire-red/50 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ← Back to Home
          </motion.a>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Privacy;
