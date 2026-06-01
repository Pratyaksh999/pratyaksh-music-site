import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

export const useVideos = (homepageOnly = false, refreshKey = 0) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'videos'), orderBy('order', 'asc'));
        const querySnapshot = await getDocs(q);
        const videosData = querySnapshot.docs.map(doc => ({
          id: doc.data().videoId,
          title: doc.data().title,
          url: doc.data().url,
          thumbnail: doc.data().thumbnail,
          year: doc.data().year,
          showOnHomepage: doc.data().showOnHomepage
        })).filter(video => homepageOnly ? video.showOnHomepage === true : true);
        setVideos(videosData);
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [homepageOnly, refreshKey]);

  return { videos, loading };
};

export const useSpotifyReleases = () => {
  const [releases, setReleases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReleases = async () => {
      try {
        const q = query(collection(db, 'spotify-releases'), orderBy('order', 'asc'));
        const querySnapshot = await getDocs(q);
        const releasesData = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        }));
        setReleases(releasesData);
      } catch (error) {
        console.error('Error fetching releases:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReleases();
  }, []);

  return { releases, loading };
};

export const useTimelineEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const q = query(collection(db, 'timeline-events'), orderBy('order', 'asc'));
        const querySnapshot = await getDocs(q);
        const eventsData = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        }));
        setEvents(eventsData);
      } catch (error) {
        console.error('Error fetching timeline events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return { events, loading };
};
