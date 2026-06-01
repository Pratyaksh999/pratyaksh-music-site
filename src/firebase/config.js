import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyALbayK-O5cm2_tC878AmTGp_m2DqM27wQ",
  authDomain: "pratyaksh-music-site-3c8b1.firebaseapp.com",
  projectId: "pratyaksh-music-site-3c8b1",
  storageBucket: "pratyaksh-music-site-3c8b1.firebasestorage.app",
  messagingSenderId: "838058263776",
  appId: "1:838058263776:web:ec733e80ad84d90d86bc85"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
