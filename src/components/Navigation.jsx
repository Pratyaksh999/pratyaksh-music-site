import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import SearchBar from './SearchBar';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../firebase/config';
import { signOut } from 'firebase/auth';
import LoginModal from './LoginModal';
import { cleanupAllDuplicates, clearAllData } from '../utils/cleanupDuplicates';
import { clearAndRestoreVideos } from '../utils/restoreVideos';
import { clearAndRestoreTimeline } from '../utils/restoreTimeline';
import { isAdmin as checkIsAdmin } from '../utils/adminCheck';

const Navigation = ({ scrollY, onSearchOpen, searchQuery, onSearchChange, editMode, setEditMode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const adminMenuRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const { user } = useAuth();
  const location = useLocation();

  // Admin check
  const isAdmin = checkIsAdmin(user);

  // Close admin menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (adminMenuRef.current && !adminMenuRef.current.contains(event.target)) {
        setShowAdminMenu(false);
      }
    };

    if (showAdminMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showAdminMenu]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      if (editMode) setEditMode(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navLinks = [
    { name: 'Latest', href: '/#latest', isRoute: false },
    { name: 'Catalog', href: '/#catalog', isRoute: false },
    { name: 'Videos', href: '/#videos', isRoute: false },
    { name: 'Lyrics', href: '/lyrics', isRoute: true },
    { name: 'About', href: '/#about', isRoute: false },
    { name: 'Contact', href: '/#contact', isRoute: false },
  ];

  // Add Analytics to nav links if user is admin
  const dynamicNavLinks = isAdmin
    ? [...navLinks.slice(0, 4), { name: 'Analytics', href: '/analytics', isRoute: true }, ...navLinks.slice(4)]
    : navLinks;

  const isScrolled = scrollY > 100;

  // Parallax effect for logo
  const logoScale = useTransform(scrollYProgress, [0, 0.1], [1, 0.9]);
  const logoRotate = useTransform(scrollYProgress, [0, 1], [0, 360]);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'bg-white/95 dark:bg-dark-bg/95 backdrop-blur-md shadow-lg shadow-theme-primary/10' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/">
            <motion.div
              className="flex items-center relative"
              style={{ scale: logoScale }}
              whileHover={{ scale: 1.15, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.img
                src="/logo.png"
                alt="Pratyaksh Bharadwaj"
                className="h-16 md:h-20 w-auto relative z-10"
              />
            </motion.div>
          </Link>

          {/* Search Bar - Center */}
          <div className="hidden md:block flex-1 max-w-md">
            <SearchBar
              searchQuery={searchQuery}
              onSearchChange={onSearchChange}
              onFocus={onSearchOpen}
            />
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {dynamicNavLinks.map((link, index) => (
              link.isRoute ? (
                <Link key={link.name} to={link.href}>
                  <motion.div
                    className="text-sm font-medium tracking-wide hover:text-theme-secondary transition-colors"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -2 }}
                  >
                    {link.name}
                  </motion.div>
                </Link>
              ) : (
                <motion.a
                  key={link.name}
                  href={link.href}
                  className="text-sm font-medium tracking-wide hover:text-theme-secondary transition-colors"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -2 }}
                >
                  {link.name}
                </motion.a>
              )
            ))}

            {/* Auth Buttons */}
            {user ? (
              <>
                {/* Admin Controls - Only for admin */}
                {isAdmin && (
                  <>
                    {/* Edit Mode Toggle */}
                    <motion.button
                      onClick={() => setEditMode(!editMode)}
                      className={`px-4 py-2 rounded-full font-semibold text-sm transition-all ${
                        editMode
                          ? 'bg-gradient-to-r from-theme-primary to-theme-secondary text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {editMode ? '✓ Editing' : '✏️ Edit'}
                    </motion.button>

                    {/* Admin Tools Dropdown */}
                    <div className="relative" ref={adminMenuRef}>
                      <motion.button
                        onClick={() => setShowAdminMenu(!showAdminMenu)}
                        className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full font-semibold text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        ⚙️ Tools
                      </motion.button>

                      {/* Dropdown Menu */}
                      {showAdminMenu && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute right-0 top-12 bg-white dark:bg-dark-card rounded-xl shadow-2xl border-2 border-theme-primary/20 p-2 min-w-[200px] z-50"
                        >
                          <button
                            onClick={() => { clearAndRestoreVideos(); setShowAdminMenu(false); }}
                            className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-sm font-medium flex items-center gap-2 transition-colors"
                          >
                            🔄 Restore Videos
                          </button>
                          <button
                            onClick={() => { clearAndRestoreTimeline(); setShowAdminMenu(false); }}
                            className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-sm font-medium flex items-center gap-2 transition-colors"
                          >
                            🔄 Restore Timeline
                          </button>
                          <button
                            onClick={() => { cleanupAllDuplicates(); setShowAdminMenu(false); }}
                            className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-sm font-medium flex items-center gap-2 transition-colors"
                          >
                            🧹 Cleanup Duplicates
                          </button>
                          <div className="h-px bg-gray-200 dark:bg-gray-700 my-2" />
                          <button
                            onClick={() => { if(confirm('Clear all Firebase data?')) clearAllData(); setShowAdminMenu(false); }}
                            className="w-full text-left px-4 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-medium flex items-center gap-2 text-red-600 dark:text-red-400 transition-colors"
                          >
                            🗑️ Clear All Data
                          </button>
                        </motion.div>
                      )}
                    </div>
                  </>
                )}

                {/* User Profile Picture */}
                {user?.photoURL && (
                  <motion.div
                    className="relative"
                    whileHover={{ scale: 1.05 }}
                  >
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'User'}
                      className="w-10 h-10 rounded-full border-2 border-theme-primary/50 object-cover"
                      title={user.displayName || user.email}
                    />
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-dark-bg" />
                  </motion.div>
                )}

                {/* Logout Button */}
                <motion.button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 text-white rounded-full font-semibold text-sm hover:bg-red-600 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Logout
                </motion.button>
              </>
            ) : (
              <>
                <motion.button
                  onClick={() => setShowLoginModal(true)}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-full font-semibold text-sm transition-all border-2 border-gray-300 dark:border-gray-600"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  🔐 Login
                </motion.button>

                <motion.a
                  href="/#latest"
                  className="px-6 py-2.5 bg-gradient-to-r from-theme-primary to-theme-secondary text-white font-semibold rounded-full hover:shadow-lg hover:shadow-theme-primary/50 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Listen Now
                </motion.a>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden relative w-10 h-10 flex items-center justify-center"
          >
            <div className="flex flex-col gap-1.5">
              <span className={`block h-0.5 w-6 bg-white transition-all ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block h-0.5 w-6 bg-white transition-all ${isMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 w-6 bg-white transition-all ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-6 space-y-4 bg-white/95 dark:bg-dark-bg/95 backdrop-blur-md rounded-b-2xl shadow-lg"
          >
            {dynamicNavLinks.map((link) => (
              link.isRoute ? (
                <Link
                  key={link.name}
                  to={link.href}
                  className="block text-lg font-medium hover:text-theme-secondary transition-colors px-4 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ) : (
                <a
                  key={link.name}
                  href={link.href}
                  className="block text-lg font-medium hover:text-theme-secondary transition-colors px-4 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </a>
              )
            ))}

            {/* Mobile Auth Buttons */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 px-4 space-y-3">
              {user ? (
                <>
                  {isAdmin && (
                    <button
                      onClick={() => {
                        setEditMode(!editMode);
                        setIsMenuOpen(false);
                      }}
                      className={`w-full px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                        editMode
                          ? 'bg-gradient-to-r from-theme-primary to-theme-secondary text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {editMode ? '✓ Editing' : '✏️ Edit Mode'}
                    </button>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full px-4 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-all"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setShowLoginModal(true);
                    setIsMenuOpen(false);
                  }}
                  className="w-full px-4 py-3 bg-gradient-to-r from-theme-primary to-theme-secondary text-white font-semibold rounded-xl"
                >
                  🔐 Login
                </button>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* Login Modal */}
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </motion.nav>
  );
};

export default Navigation;
