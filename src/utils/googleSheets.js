// Google Sheets Integration for User Login Tracking
// This logs user login details to a Google Sheet via Google Apps Script

export const logUserLogin = async (user) => {
  try {
    // Same Google Apps Script URL as newsletter (handles both)
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzxzsIyuS25KWsLhqhzdLBTy_PGxw6Z-Wv2XbESVkwGu-NFcZudh90QtYrfhZx5qvAOKg/exec';

    const loginData = {
      timestamp: new Date().toISOString(),
      email: user.email,
      displayName: user.displayName || 'N/A',
      uid: user.uid,
      photoURL: user.photoURL || 'N/A',
      lastSignInTime: user.metadata.lastSignInTime,
      creationTime: user.metadata.creationTime,
      source: 'login'
    };

    // Send to Google Sheets via Apps Script
    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginData)
    });

    console.log('Login logged to Google Sheets successfully');
  } catch (error) {
    console.error('Error logging to Google Sheets:', error);
  }
};
