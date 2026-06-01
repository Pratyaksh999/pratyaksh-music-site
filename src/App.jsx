import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import ThemeWrapper from './components/ThemeWrapper';
import PageTransition from './components/PageTransition';
import Navigation from './components/Navigation';
import SectionManager from './components/SectionManager';
import Hero from './components/Hero';
import LatestRelease from './components/LatestRelease';
import Catalog from './components/Catalog';
import YouTubeVideos from './components/YouTubeVideos';
import About from './components/About';
import Footer from './components/Footer';
import ScrollIndicator from './components/ScrollIndicator';
import FloatingElements from './components/FloatingElements';
import FloatingActionButtons from './components/FloatingActionButtons';
import KeyboardShortcuts from './components/KeyboardShortcuts';
import EasterEgg from './components/EasterEgg';
import SectionNav from './components/SectionNav';
import MusicVisualizer from './components/MusicVisualizer';
import ThemeToggle from './components/ThemeToggle';
import StickyMusicPlayer from './components/StickyMusicPlayer';
import AnimatedStats from './components/AnimatedStats';
import Timeline from './components/Timeline';
import FeaturedCollabs from './components/FeaturedCollabs';
import InstagramFeed from './components/InstagramFeed';
import NewsletterModal from './components/NewsletterModal';
import SearchModal from './components/SearchModal';
import LoadingScreen from './components/LoadingScreen';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Directory from './pages/Directory';
import Lyrics from './pages/Lyrics';
import Analytics from './pages/Analytics';
import PressKit from './pages/PressKit';
import ContactForm from './components/ContactForm';
import GoogleAnalytics from './components/GoogleAnalytics';

function HomePage({ scrollY }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editMode, setEditMode] = useState(false);

  return (
    <PageTransition>
      <div className="relative">
        <FloatingElements />
        <MusicVisualizer />
        <ScrollIndicator />
        <ThemeToggle />
        <StickyMusicPlayer />
        <NewsletterModal />
        <SearchModal
          isOpen={isSearchOpen}
          setIsOpen={setIsSearchOpen}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        <Navigation
          scrollY={scrollY}
          onSearchOpen={() => setIsSearchOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          editMode={editMode}
          setEditMode={setEditMode}
        />
        <SectionManager editMode={editMode}>
          <Hero sectionId="hero" />
          <LatestRelease editMode={editMode} sectionId="latest" />
          <AnimatedStats editMode={editMode} sectionId="stats" />
          <Timeline editMode={editMode} sectionId="timeline" />
          <FeaturedCollabs editMode={editMode} sectionId="collabs" />
          <Catalog editMode={editMode} sectionId="catalog" />
          <YouTubeVideos editMode={editMode} sectionId="videos" />
          <InstagramFeed sectionId="instagram" />
          <About editMode={editMode} sectionId="about" />
          <ContactForm sectionId="contact" />
        </SectionManager>
        <Footer />
        <FloatingActionButtons />
        <KeyboardShortcuts />
        <EasterEgg />
        <SectionNav />
      </div>
    </PageTransition>
  );
}

function AnimatedRoutes({ scrollY }) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage scrollY={scrollY} />} />
        <Route path="/directory" element={<Directory />} />
        <Route path="/lyrics" element={<PageTransition><Lyrics /></PageTransition>} />
        <Route path="/analytics" element={<PageTransition><Analytics /></PageTransition>} />
        <Route path="/press-kit" element={<PageTransition><PressKit /></PageTransition>} />
        <Route path="/privacy" element={<PageTransition><Privacy /></PageTransition>} />
        <Route path="/terms" element={<PageTransition><Terms /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const [scrollY, setScrollY] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AuthProvider>
      <ThemeProvider>
        <ThemeWrapper>
          {isLoading && <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />}
          {!isLoading && (
            <Router>
              <GoogleAnalytics />
              <AnimatedRoutes scrollY={scrollY} />
            </Router>
          )}
        </ThemeWrapper>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
