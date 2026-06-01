import React from 'react';
import { motion } from 'framer-motion';

const Terms = () => {
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
            Terms of <span className="text-gradient fire-glow">Service</span>
          </h1>
          <p className="text-gray-400 text-lg mb-12">
            Last updated: May 31, 2026
          </p>

          <div className="space-y-8 text-gray-300 leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Agreement to Terms</h2>
              <p>
                By accessing and using this website, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using this site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Use License</h2>
              <p className="mb-3">
                Permission is granted to temporarily access the materials on this website for personal, non-commercial viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Modify or copy the materials</li>
                <li>Use the materials for commercial purposes</li>
                <li>Attempt to reverse engineer any software on this website</li>
                <li>Remove any copyright or proprietary notations</li>
                <li>Transfer the materials to another person or mirror on another server</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Intellectual Property</h2>
              <p>
                All content on this website, including music, videos, images, text, logos, and design elements, are the property of Pratyaksh Bharadwaj or licensed to us. They are protected by copyright, trademark, and other intellectual property laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Music and Media Content</h2>
              <p className="mb-3">
                This website features links to music streaming platforms (Spotify, Apple Music, YouTube) where you can legally stream or purchase music. Please note:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Streaming music requires accounts with third-party services</li>
                <li>Downloads and purchases are subject to the terms of those platforms</li>
                <li>Unauthorized downloading, reproduction, or distribution is prohibited</li>
                <li>Each platform has its own terms of service that apply</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">User Conduct</h2>
              <p className="mb-3">You agree not to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Use this website for any unlawful purpose</li>
                <li>Attempt to gain unauthorized access to any systems or networks</li>
                <li>Interfere with or disrupt the website or servers</li>
                <li>Collect or store personal data about other users</li>
                <li>Impersonate any person or entity</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Third-Party Links</h2>
              <p>
                This website contains links to third-party websites and services (Spotify, YouTube, Apple Music, Instagram). We are not responsible for the content, privacy policies, or practices of these external sites. Your use of third-party services is at your own risk.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Newsletter and Communications</h2>
              <p>
                By subscribing to our newsletter, you consent to receive promotional emails about new music releases and exclusive content. You can unsubscribe at any time by following the instructions in the emails.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Disclaimer</h2>
              <p>
                The materials on this website are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim all other warranties including, without limitation, implied warranties of merchantability, fitness for a particular purpose, or non-infringement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Limitations of Liability</h2>
              <p>
                In no event shall Pratyaksh Bharadwaj or its representatives be liable for any damages (including, without limitation, damages for loss of data or profit) arising out of the use or inability to use this website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Accuracy of Materials</h2>
              <p>
                We strive to keep information accurate and up-to-date, but we do not guarantee the accuracy, completeness, or currentness of the materials on this website. Streaming counts, follower numbers, and other statistics are provided for informational purposes and may not reflect real-time data.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Modifications</h2>
              <p>
                We may revise these Terms of Service at any time without notice. By using this website, you agree to be bound by the current version of these terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Governing Law</h2>
              <p>
                These terms and conditions are governed by and construed in accordance with applicable laws, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Contact Information</h2>
              <p>
                If you have any questions about these Terms of Service, please contact us at:{' '}
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

export default Terms;
