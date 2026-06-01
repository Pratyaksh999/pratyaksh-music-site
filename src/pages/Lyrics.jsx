import React, { useState } from 'react';
import Navigation from '../components/Navigation';
import LyricsViewer from '../components/LyricsViewer';
import Footer from '../components/Footer';
import ThemeToggle from '../components/ThemeToggle';

const Lyrics = () => {
  const [editMode, setEditMode] = useState(false);

  return (
    <div className="relative">
      <ThemeToggle />
      <Navigation
        scrollY={0}
        onSearchOpen={() => {}}
        searchQuery=""
        onSearchChange={() => {}}
        editMode={editMode}
        setEditMode={setEditMode}
      />
      <LyricsViewer editMode={editMode} />
      <Footer />
    </div>
  );
};

export default Lyrics;
