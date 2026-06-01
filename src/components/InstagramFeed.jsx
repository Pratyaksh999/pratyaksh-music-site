import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const InstagramFeed = () => {
  const [ref, inView] = useInView({ triggerOnce: false, threshold: 0.1 });
  const [layout, setLayout] = useState('grid'); // 'grid' or 'carousel'
  const [currentSlide, setCurrentSlide] = useState(0);

  // Instagram profile widget
  const instagramUsername = 'bizarre_as_hell';
  const instagramUrl = 'https://www.instagram.com/bizarre_as_hell/';

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % instagramPosts.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + instagramPosts.length) % instagramPosts.length);
  };

  return (
    <section className="section-padding bg-white dark:bg-dark-bg relative overflow-hidden border-t border-gray-200 dark:border-theme-primary/10" ref={ref}>
      {/* Background decoration */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-theme-primary/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-theme-secondary font-semibold tracking-widest text-sm mb-3">
                FOLLOW ME
              </p>
              <h2 className="font-display font-black text-5xl md:text-7xl mb-4">
                <span className="text-gradient fire-glow">Instagram</span> Feed
              </h2>
              <a
                href="https://www.instagram.com/bizarre_as_hell/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400 text-lg hover:text-theme-primary transition-colors inline-flex items-center gap-2"
              >
                @bizarre_as_hell
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>

          </div>
        </motion.div>

        {/* Instagram Embed Widget */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-gradient-to-br from-white via-gray-50 to-white dark:from-dark-card dark:via-dark-bg dark:to-dark-card rounded-3xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 shadow-2xl">
            {/* Instagram Profile Embed */}
            <div className="aspect-square md:aspect-[16/10] w-full">
              <iframe
                src={`https://www.instagram.com/${instagramUsername}/embed`}
                className="w-full h-full"
                frameBorder="0"
                scrolling="yes"
                allow="encrypted-media"
                title="Instagram Profile Feed"
              />
            </div>
          </div>
        </motion.div>


        {/* Follow Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <motion.a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white font-bold rounded-full hover:shadow-xl hover:shadow-pink-500/50 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            Follow @{instagramUsername}
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default InstagramFeed;
