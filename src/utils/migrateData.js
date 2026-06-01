import { db } from '../firebase/config';
import { collection, addDoc } from 'firebase/firestore';
import { allVideos } from '../data/videos';
import { spotifyReleases } from '../data/spotify-releases';

export const migrateVideosToFirebase = async () => {
  console.log('Starting video migration...');
  let count = 0;

  for (const video of allVideos) {
    try {
      // First 8 videos go to homepage, rest go to directory
      const showOnHomepage = count < 8;

      await addDoc(collection(db, 'videos'), {
        title: video.title,
        url: video.url,
        year: video.year,
        videoId: video.id,
        thumbnail: video.thumbnail,
        showOnHomepage: showOnHomepage,
        order: count,
        createdAt: new Date()
      });
      count++;
      console.log(`Migrated: ${video.title} (${showOnHomepage ? 'Homepage' : 'Directory'})`);
    } catch (error) {
      console.error(`Error migrating ${video.title}:`, error);
    }
  }

  console.log(`✅ Migrated ${count} videos to Firebase!`);
  return count;
};

export const migrateSpotifyToFirebase = async () => {
  console.log('Starting Spotify migration...');
  let count = 0;

  for (const release of spotifyReleases) {
    try {
      await addDoc(collection(db, 'spotify-releases'), {
        title: release.title,
        type: release.type,
        year: release.year,
        image: release.image,
        url: release.url,
        streams: release.streams || '',
        tracks: release.tracks || [],
        category: 'spotify',
        order: count,
        createdAt: new Date()
      });
      count++;
      console.log(`Migrated: ${release.title}`);
    } catch (error) {
      console.error(`Error migrating ${release.title}:`, error);
    }
  }

  console.log(`✅ Migrated ${count} Spotify releases to Firebase!`);
  return count;
};

export const migrateAllData = async () => {
  console.log('🚀 Starting full data migration...');

  const videoCount = await migrateVideosToFirebase();
  const spotifyCount = await migrateSpotifyToFirebase();

  console.log(`
✅ Migration Complete!
- Videos: ${videoCount}
- Spotify Releases: ${spotifyCount}
- Total: ${videoCount + spotifyCount} items
  `);

  alert(`Migration complete!\n${videoCount} videos and ${spotifyCount} Spotify releases imported.`);
};
