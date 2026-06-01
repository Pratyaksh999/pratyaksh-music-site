import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../../firebase/config';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy } from 'firebase/firestore';

const TimelineManager = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    date: '',
    title: '',
    description: '',
    image: ''
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const q = query(collection(db, 'timeline-events'), orderBy('order', 'asc'));
      const querySnapshot = await getDocs(q);
      const eventsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEvents(eventsData);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, 'timeline-events'), {
        ...formData,
        order: events.length,
        createdAt: new Date()
      });

      setFormData({ date: '', title: '', description: '', image: '' });
      setShowAddForm(false);
      fetchEvents();
    } catch (error) {
      console.error('Error adding event:', error);
      alert('Error adding event');
    }
  };

  const handleUpdateEvent = async (e) => {
    e.preventDefault();

    try {
      const eventRef = doc(db, 'timeline-events', editingEvent.id);
      await updateDoc(eventRef, {
        ...formData,
        updatedAt: new Date()
      });

      setEditingEvent(null);
      setFormData({ date: '', title: '', description: '', image: '' });
      fetchEvents();
    } catch (error) {
      console.error('Error updating event:', error);
      alert('Error updating event');
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      await deleteDoc(doc(db, 'timeline-events', eventId));
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Error deleting event');
    }
  };

  const startEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      date: event.date,
      title: event.title,
      description: event.description,
      image: event.image || ''
    });
    setShowAddForm(false);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-12 h-12 border-4 border-theme-primary border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-display font-black text-3xl mb-2">
            Timeline Events
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Manage career milestones ({events.length} total)
          </p>
        </div>
        <button
          onClick={() => {
            setShowAddForm(!showAddForm);
            setEditingEvent(null);
            setFormData({ date: '', title: '', description: '', image: '' });
          }}
          className="px-6 py-3 bg-gradient-to-r from-theme-primary to-theme-secondary text-white font-bold rounded-xl hover:shadow-lg transition-all"
        >
          {showAddForm ? 'Cancel' : '+ Add Event'}
        </button>
      </div>

      {/* Add/Edit Form */}
      <AnimatePresence>
        {(showAddForm || editingEvent) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8 overflow-hidden"
          >
            <form onSubmit={editingEvent ? handleUpdateEvent : handleAddEvent} className="bg-white dark:bg-dark-card rounded-xl border-2 border-theme-primary/20 p-6">
              <h3 className="font-bold text-xl mb-4">
                {editingEvent ? 'Edit Event' : 'Add New Event'}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Date</label>
                  <input
                    type="text"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-theme-primary outline-none"
                    placeholder="e.g., March 2024 or 2024"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-theme-primary outline-none"
                    placeholder="e.g., Released 'Rebirth' Album"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    rows="3"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-theme-primary outline-none resize-none"
                    placeholder="Describe the milestone..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Image URL (Optional)</label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-theme-primary outline-none"
                    placeholder="https://..."
                  />
                  {formData.image && (
                    <img src={formData.image} alt="Preview" className="w-32 h-32 object-cover rounded-lg mt-2" />
                  )}
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-theme-primary to-theme-secondary text-white font-bold rounded-lg hover:shadow-lg transition-all"
                >
                  {editingEvent ? 'Update Event' : 'Add Event'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingEvent(null);
                    setFormData({ date: '', title: '', description: '', image: '' });
                  }}
                  className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Events List */}
      <div className="space-y-4">
        {events.map((event) => (
          <motion.div
            key={event.id}
            layout
            className="bg-white dark:bg-dark-card rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-theme-primary transition-all p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-3 py-1 bg-theme-primary/10 text-theme-primary rounded-full text-sm font-semibold">
                    {event.date}
                  </span>
                </div>
                <h3 className="font-bold text-xl mb-2">{event.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{event.description}</p>
              </div>

              {event.image && (
                <img src={event.image} alt={event.title} className="w-24 h-24 object-cover rounded-lg" />
              )}
            </div>

            <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => startEdit(event)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all text-sm font-semibold"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteEvent(event.id)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all text-sm font-semibold"
              >
                Delete
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {events.length === 0 && (
        <div className="text-center py-12 bg-gray-50 dark:bg-dark-bg rounded-xl">
          <p className="text-gray-500 dark:text-gray-400 mb-4">No timeline events yet</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-6 py-3 bg-gradient-to-r from-theme-primary to-theme-secondary text-white font-bold rounded-xl hover:shadow-lg transition-all"
          >
            Add Your First Event
          </button>
        </div>
      )}
    </div>
  );
};

export default TimelineManager;
