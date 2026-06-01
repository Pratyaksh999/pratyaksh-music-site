import React, { useState, useEffect } from 'react';
import { motion, Reorder, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const SectionManager = ({ editMode, children }) => {
  const { user } = useAuth();
  const [sections, setSections] = useState([
    { id: 'hero', name: 'Hero', visible: true, locked: true },
    { id: 'latest', name: 'Latest Drop', visible: true, locked: false },
    { id: 'stats', name: 'The Impact', visible: true, locked: false },
    { id: 'timeline', name: 'Musical Timeline', visible: true, locked: false },
    { id: 'collabs', name: 'Featured Artists', visible: true, locked: false },
    { id: 'catalog', name: 'The Catalog', visible: true, locked: false },
    { id: 'videos', name: 'Music Videos', visible: true, locked: false },
    { id: 'instagram', name: 'Instagram Feed', visible: true, locked: false },
    { id: 'about', name: 'Beyond the Sound', visible: true, locked: false },
  ]);
  const [showManager, setShowManager] = useState(false);

  useEffect(() => {
    loadSectionConfig();
  }, []);

  const loadSectionConfig = async () => {
    try {
      const docRef = doc(db, 'site-config', 'sections');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setSections(docSnap.data().sections);
      }
    } catch (error) {
      console.error('Error loading section config:', error);
    }
  };

  const saveSectionConfig = async (newSections) => {
    try {
      await setDoc(doc(db, 'site-config', 'sections'), {
        sections: newSections,
        updatedAt: new Date()
      });
      console.log('✅ Section config saved');
    } catch (error) {
      console.error('Error saving section config:', error);
    }
  };

  const handleReorder = (newOrder) => {
    setSections(newOrder);
    saveSectionConfig(newOrder);
  };

  const toggleVisibility = (id) => {
    const updated = sections.map(s =>
      s.id === id ? { ...s, visible: !s.visible } : s
    );
    setSections(updated);
    saveSectionConfig(updated);
  };

  // Map section IDs to actual components
  const sectionComponents = {};
  React.Children.forEach(children, child => {
    if (child?.props?.sectionId) {
      sectionComponents[child.props.sectionId] = child;
    }
  });

  if (!editMode || !user) {
    // Normal view - render sections in order, only visible ones
    return (
      <>
        {sections
          .filter(s => s.visible)
          .map(section => sectionComponents[section.id])}
      </>
    );
  }

  return (
    <>
      {/* Section Manager Button */}
      <motion.button
        onClick={() => setShowManager(!showManager)}
        className="fixed top-32 right-8 z-[60] px-4 py-3 bg-purple-500 text-white rounded-xl font-bold shadow-lg hover:bg-purple-600 transition-all"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {showManager ? '✓ Done' : '📋 Manage Sections'}
      </motion.button>

      {/* Section Manager Panel */}
      <AnimatePresence>
        {showManager && (
          <motion.div
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            className="fixed top-32 right-8 z-[55] w-80 bg-white dark:bg-dark-card rounded-2xl shadow-2xl border-2 border-purple-500 p-4 max-h-[calc(100vh-200px)] overflow-y-auto"
          >
            <h3 className="font-bold text-xl mb-4">Section Order</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Drag to reorder • Click eye to hide/show
            </p>

            <Reorder.Group values={sections} onReorder={handleReorder} className="space-y-2">
              {sections.map((section) => (
                <Reorder.Item
                  key={section.id}
                  value={section}
                  className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 cursor-move"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400">⋮⋮</span>
                      <span className="font-semibold text-sm">{section.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {section.locked ? (
                        <span className="text-xs text-gray-400">🔒</span>
                      ) : (
                        <button
                          onClick={() => toggleVisibility(section.id)}
                          className="text-lg"
                        >
                          {section.visible ? '👁️' : '🚫'}
                        </button>
                      )}
                    </div>
                  </div>
                </Reorder.Item>
              ))}
            </Reorder.Group>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Render sections in edit mode with visibility */}
      {sections.map((section, index) => (
        <div
          key={section.id}
          className={`relative ${!section.visible ? 'opacity-50 pointer-events-none' : ''}`}
        >
          {/* Section Label in Edit Mode */}
          <div className="sticky top-24 z-50 flex justify-center">
            <div className="inline-flex items-center gap-2 bg-purple-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
              <span>{index + 1}.</span>
              <span>{section.name}</span>
              {!section.visible && <span>👁️‍🗨️ Hidden</span>}
            </div>
          </div>
          {sectionComponents[section.id]}
        </div>
      ))}
    </>
  );
};

export default SectionManager;
