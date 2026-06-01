import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, Reorder } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useTimelineEvents } from '../hooks/useFirebaseData';
import { useAuth } from '../contexts/AuthContext';
import { isAdmin } from '../utils/adminCheck';
import InlineTimelineEditor from './InlineTimelineEditor';
import { db } from '../firebase/config';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';

const Timeline = ({ editMode = false }) => {
  const [ref, inView] = useInView({ triggerOnce: false, threshold: 0.1 });
  const containerRef = useRef(null);
  const { user } = useAuth();
  const { events: firebaseEvents, loading } = useTimelineEvents();
  const [editingEventId, setEditingEventId] = useState(null);
  const [addingNew, setAddingNew] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [orderedEvents, setOrderedEvents] = useState([]);

  // Fallback to hardcoded milestones if no Firebase data
  const hardcodedMilestones = [
    {
      year: '2012',
      title: 'The Beginning',
      description: 'Started writing lyrics at age 11',
      icon: '✍️',
      highlight: false
    },
    {
      year: '2015',
      title: 'First Upload',
      description: 'Started creating music on YouTube',
      icon: '🎬',
      highlight: false
    },
    {
      year: '2023',
      title: 'Eleven Seasons',
      description: 'Released debut album - A journey through emotions',
      icon: '💿',
      highlight: true
    },
    {
      year: '2024',
      title: 'Breakthrough Year',
      description: '4 major releases including The Lost Cassette',
      icon: '🚀',
      highlight: true
    },
    {
      year: '2025',
      title: 'Rising Star',
      description: 'Darmiyaan hits 18.6K+ streams',
      icon: '⭐',
      highlight: true
    },
    {
      year: '2026',
      title: 'Rebirth',
      description: 'Latest album - Evolution and transformation',
      icon: '🔥',
      highlight: true
    },
    {
      year: 'Future',
      title: 'The Journey Continues',
      description: 'More music, more stories to tell',
      icon: '🎵',
      highlight: false
    }
  ];

  // Initialize ordered events from Firebase
  useEffect(() => {
    if (firebaseEvents.length > 0) {
      const events = firebaseEvents.map(event => ({
        year: event.date,
        title: event.title,
        description: event.description,
        icon: event.icon || '🎵',
        highlight: event.highlight || false,
        firebaseId: event.id,
        image: event.image
      }));
      setOrderedEvents(events);
    }
  }, [firebaseEvents]);

  // Use ordered events if available, otherwise use hardcoded
  const milestones = orderedEvents.length > 0 ? orderedEvents : hardcodedMilestones;

  // Handle reordering
  const handleReorder = async (newOrder) => {
    setOrderedEvents(newOrder);

    // Update order in Firebase
    try {
      const updatePromises = newOrder.map((event, index) => {
        if (event.firebaseId) {
          const eventRef = doc(db, 'timeline-events', event.firebaseId);
          return updateDoc(eventRef, { order: index });
        }
      });
      await Promise.all(updatePromises);
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  // Handle delete
  const handleDelete = async (eventId) => {
    if (!confirm('Delete this timeline event?')) return;

    try {
      await deleteDoc(doc(db, 'timeline-events', eventId));
      setOrderedEvents(prev => prev.filter(e => e.firebaseId !== eventId));
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Error deleting event');
    }
  };

  if (loading) {
    return (
      <section className="section-padding bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-dark-card dark:via-dark-bg dark:to-dark-card">
        <div className="max-w-7xl mx-auto text-center py-12">
          <div className="w-12 h-12 border-4 border-theme-primary border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </section>
    );
  }

  return (
    <section
      ref={ref}
      className="section-padding bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-dark-card dark:via-dark-bg dark:to-dark-card relative overflow-hidden border-t border-gray-200 dark:border-theme-primary/10"
    >
      {/* Background decoration */}
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-theme-secondary/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10" ref={containerRef}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-theme-secondary font-semibold tracking-widest text-sm mb-3">
            THE JOURNEY
          </p>
          <h2 className="font-display font-black text-5xl md:text-7xl mb-4">
            Musical <span className="text-gradient fire-glow">Timeline</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            From writing first lyrics to creating albums - Every step of the journey
          </p>
        </motion.div>

        {/* Horizontal scrollable timeline */}
        <div className="relative">
          {/* Scroll instruction */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center mb-8"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2">
              <span>Scroll horizontally</span>
              <motion.span
                animate={{ x: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
            </p>
          </motion.div>

          {/* Timeline container */}
          <div className="overflow-x-auto pb-8 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
            {editMode && isAdmin(user) && orderedEvents.length > 0 ? (
              <Reorder.Group
                axis="x"
                values={orderedEvents}
                onReorder={handleReorder}
                className="inline-flex gap-8 px-4 min-w-full"
              >
              {/* Add New Event Card (only in edit mode) */}
              {editMode && isAdmin(user) && (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative flex-shrink-0 w-80"
                >
                  <div className="mt-24">
                    {addingNew ? (
                      <div className="bg-white dark:bg-dark-card rounded-2xl p-6 border-2 border-dashed border-theme-primary relative min-h-[200px]">
                        <InlineTimelineEditor
                          isNew={true}
                          onSave={() => {
                            setAddingNew(false);
                            setRefreshKey(k => k + 1);
                            window.location.reload();
                          }}
                          onCancel={() => setAddingNew(false)}
                        />
                      </div>
                    ) : (
                      <button
                        onClick={() => setAddingNew(true)}
                        className="w-full h-[200px] rounded-2xl border-2 border-dashed border-theme-primary bg-gray-50 dark:bg-dark-bg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all flex flex-col items-center justify-center gap-3 group"
                      >
                        <div className="w-16 h-16 rounded-full bg-theme-primary/10 flex items-center justify-center group-hover:bg-theme-primary/20 transition-all">
                          <svg className="w-8 h-8 text-theme-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </div>
                        <p className="font-bold text-gray-700 dark:text-gray-300">Add Event</p>
                      </button>
                    )}
                  </div>
                </motion.div>
              )}

              {milestones.map((milestone, index) => {
                const Component = editMode && isAdmin(user) && milestone.firebaseId ? Reorder.Item : motion.div;
                const componentProps = editMode && isAdmin(user) && milestone.firebaseId
                  ? { value: milestone }
                  : {
                      initial: { opacity: 0, y: 50 },
                      animate: inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 },
                      transition: { duration: 0.6, delay: index * 0.15 }
                    };

                return (
                  <Component
                    key={milestone.firebaseId || index}
                    {...componentProps}
                    className="relative flex-shrink-0 w-80"
                  >
                  {/* Timeline dot */}
                  <div className="absolute left-1/2 top-0 -translate-x-1/2 flex flex-col items-center">
                    {/* Animated checkpoint */}
                    <motion.div
                      className={`relative w-16 h-16 rounded-full flex items-center justify-center ${
                        milestone.highlight
                          ? 'bg-gradient-to-br from-theme-primary to-theme-secondary'
                          : 'bg-gray-300 dark:bg-gray-700'
                      } shadow-lg`}
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      {/* Icon */}
                      <span className="text-3xl">{milestone.icon}</span>

                      {/* Pulse rings for highlights */}
                      {milestone.highlight && (
                        <>
                          <motion.div
                            className="absolute inset-0 rounded-full border-4 border-theme-primary"
                            animate={{
                              scale: [1, 1.5, 1.5],
                              opacity: [0.5, 0, 0],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: 'easeOut',
                            }}
                          />
                          <motion.div
                            className="absolute inset-0 rounded-full border-4 border-theme-secondary"
                            animate={{
                              scale: [1, 1.5, 1.5],
                              opacity: [0.5, 0, 0],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: 'easeOut',
                              delay: 1,
                            }}
                          />
                        </>
                      )}
                    </motion.div>
                  </div>

                  {/* Connecting line - positioned to not overlap with card */}
                  {index < milestones.length - 1 && (
                    <motion.div
                      className="absolute left-1/2 top-16 -translate-x-1/2 w-1 h-8 bg-gradient-to-b from-theme-primary to-theme-secondary"
                      initial={{ scaleY: 0 }}
                      animate={inView ? { scaleY: 1 } : { scaleY: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.15 + 0.3 }}
                      style={{ transformOrigin: 'top' }}
                    />
                  )}

                  {/* Card */}
                  <motion.div
                    className="mt-24 bg-white dark:bg-dark-card rounded-2xl p-6 border-2 border-theme-primary/20 hover:border-theme-primary transition-all shadow-lg hover:shadow-xl relative"
                    whileHover={{ y: -10 }}
                  >
                    {/* Edit & Delete Buttons (only visible in edit mode) */}
                    {editMode && isAdmin(user) && milestone.firebaseId && (
                      <div className="absolute top-2 right-2 z-20 flex gap-2">
                        <button
                          onClick={() => setEditingEventId(milestone.firebaseId)}
                          className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-all shadow-lg text-sm"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(milestone.firebaseId)}
                          className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-all shadow-lg text-sm"
                        >
                          🗑️
                        </button>
                      </div>
                    )}

                    {/* Drag Handle (only visible in edit mode) */}
                    {editMode && isAdmin(user) && milestone.firebaseId && (
                      <div className="absolute top-2 left-2 z-20 cursor-grab active:cursor-grabbing">
                        <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded-full flex items-center justify-center text-sm">
                          ⋮⋮
                        </div>
                      </div>
                    )}

                    {/* Inline Editor */}
                    <AnimatePresence>
                      {editingEventId === milestone.firebaseId && (
                        <InlineTimelineEditor
                          event={milestone}
                          onSave={() => {
                            setEditingEventId(null);
                            setRefreshKey(k => k + 1);
                            window.location.reload();
                          }}
                          onDelete={() => {
                            setEditingEventId(null);
                            setRefreshKey(k => k + 1);
                            window.location.reload();
                          }}
                          onCancel={() => setEditingEventId(null)}
                        />
                      )}
                    </AnimatePresence>
                    {/* Year badge */}
                    <div className={`inline-block px-4 py-2 rounded-full text-sm font-bold mb-4 ${
                      milestone.highlight
                        ? 'bg-gradient-to-r from-theme-primary to-theme-secondary text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}>
                      {milestone.year}
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-xl mb-2">{milestone.title}</h3>

                    {/* Description */}
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                      {milestone.description}
                    </p>

                    {/* Highlight indicator */}
                    {milestone.highlight && (
                      <motion.div
                        className="mt-4 flex items-center gap-2 text-theme-primary text-xs font-bold"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <span className="w-2 h-2 bg-theme-primary rounded-full" />
                        Major Milestone
                      </motion.div>
                    )}
                  </motion.div>
                </Component>
              );
              })}
              </Reorder.Group>
            ) : (
              <div className="inline-flex gap-8 px-4 min-w-full">
                {/* Add New Event Card (only in edit mode) */}
                {editMode && isAdmin(user) && (
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative flex-shrink-0 w-80"
                  >
                    <div className="mt-24">
                      {addingNew ? (
                        <div className="bg-white dark:bg-dark-card rounded-2xl p-6 border-2 border-dashed border-theme-primary relative min-h-[200px]">
                          <InlineTimelineEditor
                            isNew={true}
                            onSave={() => {
                              setAddingNew(false);
                              setRefreshKey(k => k + 1);
                              window.location.reload();
                            }}
                            onCancel={() => setAddingNew(false)}
                          />
                        </div>
                      ) : (
                        <button
                          onClick={() => setAddingNew(true)}
                          className="w-full h-[200px] rounded-2xl border-2 border-dashed border-theme-primary bg-gray-50 dark:bg-dark-bg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all flex flex-col items-center justify-center gap-3 group"
                        >
                          <div className="w-16 h-16 rounded-full bg-theme-primary/10 flex items-center justify-center group-hover:bg-theme-primary/20 transition-all">
                            <svg className="w-8 h-8 text-theme-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </div>
                          <p className="font-bold text-gray-700 dark:text-gray-300">Add Event</p>
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}

                {milestones.map((milestone, index) => (
                  <motion.div
                    key={milestone.firebaseId || index}
                    initial={{ opacity: 0, y: 50 }}
                    animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                    transition={{ duration: 0.6, delay: index * 0.15 }}
                    className="relative flex-shrink-0 w-80"
                  >
                    {/* Timeline dot and line */}
                    <div className="absolute left-1/2 top-0 -translate-x-1/2 flex flex-col items-center">
                      {/* Animated checkpoint */}
                      <motion.div
                        className={`relative w-16 h-16 rounded-full flex items-center justify-center ${
                          milestone.highlight
                            ? 'bg-gradient-to-br from-theme-primary to-theme-secondary'
                            : 'bg-gray-300 dark:bg-gray-700'
                        } shadow-lg`}
                        whileHover={{ scale: 1.2, rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        {/* Icon */}
                        <span className="text-3xl">{milestone.icon}</span>

                        {/* Pulse rings for highlights */}
                        {milestone.highlight && (
                          <>
                            <motion.div
                              className="absolute inset-0 rounded-full border-4 border-theme-primary"
                              animate={{
                                scale: [1, 1.5, 1.5],
                                opacity: [0.5, 0, 0],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: 'easeOut',
                              }}
                            />
                            <motion.div
                              className="absolute inset-0 rounded-full border-4 border-theme-secondary"
                              animate={{
                                scale: [1, 1.5, 1.5],
                                opacity: [0.5, 0, 0],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: 'easeOut',
                                delay: 1,
                              }}
                            />
                          </>
                        )}
                      </motion.div>

                    </div>

                    {/* Connecting line - positioned to not overlap with card */}
                    {index < milestones.length - 1 && (
                      <motion.div
                        className="absolute left-1/2 top-16 -translate-x-1/2 w-1 h-8 bg-gradient-to-b from-theme-primary to-theme-secondary"
                        initial={{ scaleY: 0 }}
                        animate={inView ? { scaleY: 1 } : { scaleY: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.15 + 0.3 }}
                        style={{ transformOrigin: 'top' }}
                      />
                    )}

                    {/* Card */}
                    <motion.div
                      className="mt-24 bg-white dark:bg-dark-card rounded-2xl p-6 border-2 border-theme-primary/20 hover:border-theme-primary transition-all shadow-lg hover:shadow-xl"
                      whileHover={{ y: -10 }}
                    >
                      {/* Year badge */}
                      <div className={`inline-block px-4 py-2 rounded-full text-sm font-bold mb-4 ${
                        milestone.highlight
                          ? 'bg-gradient-to-r from-theme-primary to-theme-secondary text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}>
                        {milestone.year}
                      </div>

                      {/* Title */}
                      <h3 className="font-bold text-xl mb-2">{milestone.title}</h3>

                      {/* Description */}
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                        {milestone.description}
                      </p>

                      {/* Highlight indicator */}
                      {milestone.highlight && (
                        <motion.div
                          className="mt-4 flex items-center gap-2 text-theme-primary text-xs font-bold"
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <span className="w-2 h-2 bg-theme-primary rounded-full" />
                          Major Milestone
                        </motion.div>
                      )}
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Gradient fade edges */}
          <div className="absolute top-0 left-0 bottom-0 w-20 bg-gradient-to-r from-gray-50 dark:from-dark-card to-transparent pointer-events-none" />
          <div className="absolute top-0 right-0 bottom-0 w-20 bg-gradient-to-l from-gray-50 dark:from-dark-card to-transparent pointer-events-none" />
        </div>

        {/* Stats summary */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 1 }}
          className="text-center mt-16 flex flex-wrap justify-center gap-8"
        >
          <div className="text-center">
            <p className="text-4xl font-display font-black text-theme-primary mb-2">14+</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Years of Passion</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-display font-black text-theme-secondary mb-2">85+</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Songs Released</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-display font-black text-theme-primary mb-2">200K+</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Streams</p>
          </div>
        </motion.div>
      </div>

      {/* Custom scrollbar hide styles */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default Timeline;
