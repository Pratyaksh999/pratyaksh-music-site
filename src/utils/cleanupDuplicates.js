import { db } from '../firebase/config';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

export const cleanupDuplicateVideos = async () => {
  console.log('Starting video cleanup...');

  try {
    const videosRef = collection(db, 'videos');
    const snapshot = await getDocs(videosRef);

    const seen = new Map();
    const duplicates = [];

    snapshot.docs.forEach(docSnap => {
      const data = docSnap.data();
      const key = `${data.videoId}-${data.title}`;

      if (seen.has(key)) {
        // This is a duplicate
        duplicates.push(docSnap.id);
        console.log('Found duplicate:', data.title);
      } else {
        seen.set(key, docSnap.id);
      }
    });

    // Delete duplicates
    for (const id of duplicates) {
      await deleteDoc(doc(db, 'videos', id));
      console.log('Deleted duplicate:', id);
    }

    console.log(`✅ Cleanup complete! Removed ${duplicates.length} duplicate videos.`);
    alert(`Cleanup complete! Removed ${duplicates.length} duplicate videos.`);
  } catch (error) {
    console.error('Error cleaning up:', error);
    alert('Error during cleanup. Check console.');
  }
};

export const cleanupDuplicateReleases = async () => {
  console.log('Starting releases cleanup...');

  try {
    const releasesRef = collection(db, 'spotify-releases');
    const snapshot = await getDocs(releasesRef);

    const seen = new Map();
    const duplicates = [];

    snapshot.docs.forEach(docSnap => {
      const data = docSnap.data();
      const key = `${data.title}-${data.year}-${data.type}`;

      if (seen.has(key)) {
        // This is a duplicate
        duplicates.push(docSnap.id);
        console.log('Found duplicate:', data.title);
      } else {
        seen.set(key, docSnap.id);
      }
    });

    // Delete duplicates
    for (const id of duplicates) {
      await deleteDoc(doc(db, 'spotify-releases', id));
      console.log('Deleted duplicate:', id);
    }

    console.log(`✅ Cleanup complete! Removed ${duplicates.length} duplicate releases.`);
    alert(`Cleanup complete! Removed ${duplicates.length} duplicate releases.`);
  } catch (error) {
    console.error('Error cleaning up:', error);
    alert('Error during cleanup. Check console.');
  }
};

export const cleanupAllDuplicates = async () => {
  await cleanupDuplicateVideos();
  await cleanupDuplicateReleases();
  window.location.reload();
};

export const clearAllData = async () => {
  if (!confirm('⚠️ This will DELETE ALL videos, releases, and timeline events from Firebase. Are you sure?')) {
    return;
  }

  if (!confirm('⚠️ Last chance! This cannot be undone. Continue?')) {
    return;
  }

  console.log('Clearing all data...');

  try {
    // Clear videos
    const videosSnapshot = await getDocs(collection(db, 'videos'));
    for (const docSnap of videosSnapshot.docs) {
      await deleteDoc(doc(db, 'videos', docSnap.id));
    }
    console.log('✅ Videos cleared');

    // Clear releases
    const releasesSnapshot = await getDocs(collection(db, 'spotify-releases'));
    for (const docSnap of releasesSnapshot.docs) {
      await deleteDoc(doc(db, 'spotify-releases', docSnap.id));
    }
    console.log('✅ Releases cleared');

    // Clear timeline
    const timelineSnapshot = await getDocs(collection(db, 'timeline-events'));
    for (const docSnap of timelineSnapshot.docs) {
      await deleteDoc(doc(db, 'timeline-events', docSnap.id));
    }
    console.log('✅ Timeline cleared');

    alert('All data cleared! Page will reload.');
    window.location.reload();
  } catch (error) {
    console.error('Error clearing data:', error);
    alert('Error clearing data. Check console.');
  }
};
