import { db } from '../firebase/config';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';

const hardcodedMilestones = [
  {
    date: '2012',
    title: 'The Beginning',
    description: 'Started writing lyrics at age 11',
    icon: '✍️',
    highlight: false,
    order: 0
  },
  {
    date: '2015',
    title: 'First Upload',
    description: 'Started creating music on YouTube',
    icon: '🎬',
    highlight: false,
    order: 1
  },
  {
    date: '2023',
    title: 'Eleven Seasons',
    description: 'Released debut album - A journey through emotions',
    icon: '💿',
    highlight: true,
    order: 2
  },
  {
    date: '2024',
    title: 'Breakthrough Year',
    description: '4 major releases including The Lost Cassette',
    icon: '🚀',
    highlight: true,
    order: 3
  },
  {
    date: '2025',
    title: 'Rising Star',
    description: 'Darmiyaan hits 18.6K+ streams',
    icon: '⭐',
    highlight: true,
    order: 4
  },
  {
    date: '2026',
    title: 'Rebirth',
    description: 'Latest album - Evolution and transformation',
    icon: '🔥',
    highlight: true,
    order: 5
  },
  {
    date: 'Future',
    title: 'The Journey Continues',
    description: 'More music, more stories to tell',
    icon: '🎵',
    highlight: false,
    order: 6
  }
];

export const restoreTimelineEvents = async () => {
  try {
    // Add all hardcoded milestones to Firebase
    const promises = hardcodedMilestones.map(milestone =>
      addDoc(collection(db, 'timeline-events'), {
        ...milestone,
        createdAt: new Date()
      })
    );

    await Promise.all(promises);
    console.log('✅ Timeline events restored successfully');
    return true;
  } catch (error) {
    console.error('❌ Error restoring timeline events:', error);
    return false;
  }
};

export const clearTimelineEvents = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'timeline-events'));
    const deletePromises = querySnapshot.docs.map(docSnap =>
      deleteDoc(doc(db, 'timeline-events', docSnap.id))
    );
    await Promise.all(deletePromises);
    console.log('✅ Timeline events cleared');
    return true;
  } catch (error) {
    console.error('❌ Error clearing timeline events:', error);
    return false;
  }
};

export const clearAndRestoreTimeline = async () => {
  console.log('🔄 Clearing and restoring timeline events...');
  await clearTimelineEvents();
  await restoreTimelineEvents();
  console.log('✅ Timeline reset complete!');
};
