import { db } from '../firebase/config';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { allVideos } from '../data/videos';

export const restoreHomepageVideos = async () => {
  console.log('Starting video restore for homepage...');

  try {
    // First 8 videos for homepage
    const homepageVideos = allVideos.slice(0, 8);

    for (let i = 0; i < homepageVideos.length; i++) {
      const video = homepageVideos[i];

      await addDoc(collection(db, 'videos'), {
        title: video.title,
        url: video.url,
        year: video.year,
        videoId: video.id,
        thumbnail: video.thumbnail,
        showOnHomepage: true,
        order: i,
        createdAt: new Date()
      });

      console.log(`✅ Restored: ${video.title}`);
    }

    console.log(`✅ Restore complete! Added ${homepageVideos.length} videos to homepage.`);
    alert(`Restored ${homepageVideos.length} videos successfully!`);
    window.location.reload();
  } catch (error) {
    console.error('Error restoring videos:', error);
    alert('Error during restore. Check console.');
  }
};

export const restoreAllVideos = async () => {
  console.log('Starting full video restore...');

  try {
    // All videos for directory
    for (let i = 0; i < allVideos.length; i++) {
      const video = allVideos[i];

      await addDoc(collection(db, 'videos'), {
        title: video.title,
        url: video.url,
        year: video.year,
        videoId: video.id,
        thumbnail: video.thumbnail,
        showOnHomepage: i < 8, // First 8 on homepage
        order: i,
        createdAt: new Date()
      });

      console.log(`✅ Restored: ${video.title}`);
    }

    console.log(`✅ Restore complete! Added ${allVideos.length} videos.`);
    alert(`Restored all ${allVideos.length} videos successfully!`);
    window.location.reload();
  } catch (error) {
    console.error('Error restoring videos:', error);
    alert('Error during restore. Check console.');
  }
};

export const clearAndRestoreVideos = async () => {
  if (!confirm('This will clear existing videos and restore from local data. Continue?')) {
    return;
  }

  console.log('Clearing existing videos...');

  try {
    // Clear existing videos
    const snapshot = await getDocs(collection(db, 'videos'));
    for (const docSnap of snapshot.docs) {
      await deleteDoc(doc(db, 'videos', docSnap.id));
    }
    console.log('✅ Cleared existing videos');

    // Restore all videos
    await restoreAllVideos();
  } catch (error) {
    console.error('Error:', error);
    alert('Error during clear and restore. Check console.');
  }
};
