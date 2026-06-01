import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/config';
import { signInWithPopup, GoogleAuthProvider, setPersistence, browserLocalPersistence } from 'firebase/auth';
import AdminLogin from '../components/admin/AdminLogin';
import PageTransition from '../components/PageTransition';
import { useAuth } from '../contexts/AuthContext';

const Admin = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Set persistence to local storage
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        console.log('Persistence set to local');
      })
      .catch((error) => {
        console.error('Persistence error:', error);
      });
  }, []);

  // Redirect to homepage if already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      console.log('Login successful:', result.user.email);
      // Will redirect automatically via useEffect
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  if (loading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white dark:from-dark-bg dark:to-dark-card flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-theme-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        </div>
      </PageTransition>
    );
  }

  // If user is logged in, they'll be redirected to homepage
  // Show login form only if not logged in
  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white dark:from-dark-bg dark:to-dark-card">
        <AdminLogin onGoogleLogin={handleGoogleLogin} />
      </div>
    </PageTransition>
  );
};

export default Admin;
