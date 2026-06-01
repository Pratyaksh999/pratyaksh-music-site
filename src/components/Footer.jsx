import React from 'react';
import { motion } from 'framer-motion';
import { SpotifyIcon, YouTubeIcon, InstagramIcon, AppleMusicIcon } from './icons';
import EmailCollector from './EmailCollector';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { name: 'Spotify', Icon: SpotifyIcon, url: 'https://open.spotify.com/artist/4xwROKTcnt5K1GmLitjPz4', colorClass: 'social-icon-spotify' },
    { name: 'Apple Music', Icon: AppleMusicIcon, url: 'https://music.apple.com/us/artist/pratyaksh-bharadwaj/1550185242', colorClass: 'social-icon-apple' },
    { name: 'YouTube', Icon: YouTubeIcon, url: 'https://youtube.com/@pratyakshbharadwaj', colorClass: 'social-icon-youtube' },
    { name: 'Instagram', Icon: InstagramIcon, url: 'https://instagram.com/bizarre_as_hell', colorClass: 'social-icon-instagram' },
  ];

  const quickLinks = [
    { name: 'Latest Release', url: '#latest' },
    { name: 'Full Catalog', url: '#catalog' },
    { name: 'Lyrics', url: '/lyrics' },
    { name: 'Analytics', url: '/analytics' },
    { name: 'About', url: '#about' },
    { name: 'Press Kit', url: '/press-kit' },
  ];

  return (
    <footer id="contact" className="bg-gradient-to-b from-gray-200 to-gray-100 dark:bg-[#151515] border-t-2 border-gray-300 dark:border-theme-primary/20 pb-32 md:pb-16">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-16">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <h3 className="font-display font-black text-3xl mb-4">
              <span className="text-gradient">PRATYAKSH BHARADWAJ</span>
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Official music site. Stream, discover, and stay connected.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((link) => {
                const { Icon } = link;
                return (
                  <motion.a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group w-10 h-10 flex items-center justify-center bg-white dark:bg-dark-bg rounded-full border border-theme-primary/30 hover:border-transparent transition-all duration-300 ${link.colorClass}`}
                    whileHover={{ scale: 1.1, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    title={link.name}
                  >
                    <Icon className="w-5 h-5 text-gray-900 dark:text-white group-hover:text-white transition-colors" />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-theme-secondary">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.url}
                    className="text-gray-400 hover:text-theme-secondary transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-theme-secondary">Stay Updated</h4>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Get notified about new releases and exclusive content.
            </p>
            <EmailCollector
              source="footer"
              placeholder="your@email.com"
              buttonText="→"
            />
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-theme-primary/20 flex flex-col md:flex-row items-center justify-between gap-4 text-gray-500 dark:text-gray-500 text-sm">
          <p>
            © {currentYear} Pratyaksh Bharadwaj. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="/privacy" className="hover:text-theme-secondary transition-colors">
              Privacy Policy
            </a>
            <a href="/terms" className="hover:text-theme-secondary transition-colors">
              Terms of Service
            </a>
            <a href="mailto:pratyakshbharadwaj@gmail.com" className="hover:text-theme-secondary transition-colors">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
