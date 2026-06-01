import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NewsletterModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [phone, setPhone] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hasShownOnce, setHasShownOnce] = useState(false);

  const countryCodes = [
    { code: '+91', country: '🇮🇳 India' },
    { code: '+1', country: '🇺🇸 USA' },
    { code: '+44', country: '🇬🇧 UK' },
    { code: '+61', country: '🇦🇺 Australia' },
    { code: '+971', country: '🇦🇪 UAE' },
    { code: '+65', country: '🇸🇬 Singapore' },
    { code: '+81', country: '🇯🇵 Japan' },
    { code: '+86', country: '🇨🇳 China' },
  ];

  useEffect(() => {
    // Check if user already dismissed or subscribed
    const dismissed = localStorage.getItem('newsletter_dismissed');
    const subscribed = localStorage.getItem('newsletter_subscribed');

    if (dismissed || subscribed) return;

    // Timer trigger: Show after 10 seconds
    const timer = setTimeout(() => {
      // Double-check before showing
      const stillDismissed = localStorage.getItem('newsletter_dismissed');
      const stillSubscribed = localStorage.getItem('newsletter_subscribed');
      if (!stillDismissed && !stillSubscribed && !hasShownOnce) {
        setIsOpen(true);
        setHasShownOnce(true);
      }
    }, 10000);

    // Exit intent detection
    const handleMouseLeave = (e) => {
      // Check before showing
      const stillDismissed = localStorage.getItem('newsletter_dismissed');
      const stillSubscribed = localStorage.getItem('newsletter_subscribed');
      if (e.clientY <= 0 && !stillDismissed && !stillSubscribed && !hasShownOnce) {
        setIsOpen(true);
        setHasShownOnce(true);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('newsletter_dismissed', 'true');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Google Apps Script URL
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzxzsIyuS25KWsLhqhzdLBTy_PGxw6Z-Wv2XbESVkwGu-NFcZudh90QtYrfhZx5qvAOKg/exec';

    const fullPhone = phone ? `${countryCode}${phone}` : '';

    // Send to Google Sheets
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          phone: fullPhone,
          source: 'newsletter_modal'
        })
      });
    } catch (error) {
      console.error('Error saving to Google Sheets:', error);
    }

    setIsSubmitted(true);
    localStorage.setItem('newsletter_subscribed', 'true');

    // Close after 2 seconds
    setTimeout(() => {
      setIsOpen(false);
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999]"
            onClick={handleClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-md my-auto"
              onClick={(e) => e.stopPropagation()}
            >
            <div className="bg-white dark:bg-dark-card rounded-3xl shadow-2xl overflow-hidden border-2 border-theme-primary/30">
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 z-10"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {!isSubmitted ? (
                <>
                  {/* Header with gradient */}
                  <div className="relative bg-gradient-to-br from-theme-primary to-theme-secondary p-8 text-white">
                    {/* Animated background elements */}
                    <motion.div
                      className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                    <motion.div
                      className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-2xl"
                      animate={{
                        scale: [1.2, 1, 1.2],
                        opacity: [0.5, 0.3, 0.5],
                      }}
                      transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                    />

                    {/* Icon */}
                    <motion.div
                      className="text-6xl mb-4"
                      animate={{
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.1, 1],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      🔔
                    </motion.div>

                    <h2 className="font-display font-black text-3xl mb-2 relative z-10">
                      Never Miss a Beat!
                    </h2>
                    <p className="text-white/90 relative z-10">
                      Get early access to new releases
                    </p>
                  </div>

                  {/* Form */}
                  <div className="p-8">
                    {/* Incentive */}
                    <div className="flex items-center gap-3 mb-6 p-4 bg-theme-primary/10 rounded-xl">
                      <span className="text-2xl">🎵</span>
                      <div>
                        <p className="font-bold text-theme-primary text-sm">First to hear new drops</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Exclusive early access + behind-the-scenes</p>
                      </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* Email input */}
                      <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your@email.com"
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-theme-primary outline-none transition-colors text-gray-900 dark:text-white"
                        />
                      </div>

                      {/* Phone input (optional) */}
                      <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                          Phone Number <span className="text-gray-400 font-normal">(Optional)</span>
                        </label>
                        <div className="flex gap-2">
                          {/* Country code dropdown */}
                          <select
                            value={countryCode}
                            onChange={(e) => setCountryCode(e.target.value)}
                            className="px-3 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-theme-primary outline-none transition-colors text-gray-900 dark:text-white cursor-pointer"
                          >
                            {countryCodes.map((item) => (
                              <option key={item.code} value={item.code}>
                                {item.country} {item.code}
                              </option>
                            ))}
                          </select>

                          {/* Phone number input */}
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="1234567890"
                            className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-theme-primary outline-none transition-colors text-gray-900 dark:text-white"
                          />
                        </div>
                      </div>

                      {/* Submit button */}
                      <motion.button
                        type="submit"
                        className="w-full py-4 bg-gradient-to-r from-theme-primary to-theme-secondary text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:shadow-theme-primary/50 transition-all"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        🎧 Subscribe Now
                      </motion.button>

                      {/* Privacy note */}
                      <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                        We respect your privacy. Unsubscribe anytime.
                      </p>
                    </form>

                    {/* Dismiss link */}
                    <button
                      onClick={handleClose}
                      className="block text-center w-full mt-4 text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      No thanks, I'll miss out
                    </button>
                  </div>
                </>
              ) : (
                /* Success message */
                <div className="p-12 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 10, stiffness: 200 }}
                    className="text-7xl mb-4"
                  >
                    ✅
                  </motion.div>
                  <h3 className="font-display font-black text-2xl mb-2">
                    You're In!
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Welcome to the exclusive list. Get ready for new drops! 🎵
                  </p>
                </div>
              )}
            </div>
          </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NewsletterModal;
