# Firebase Quick Start Guide

## 🚀 Get Your Admin Panel Running in 10 Minutes

### Step 1: Create Firebase Account (2 min)
1. Go to https://console.firebase.google.com/
2. Click "Add Project" → Name it `pratyaksh-music-site`
3. Disable Google Analytics → Create Project

### Step 2: Enable Services (3 min)
**Authentication:**
- Build → Authentication → Get Started
- Enable "Email/Password"
- Add User: your-email@gmail.com + password

**Firestore:**
- Build → Firestore Database → Create Database
- Start in "production mode" → Next → Enable

**Security Rules:**
- In Firestore, go to "Rules" tab
- Paste this:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```
- Publish rules

### Step 3: Get Your Config (2 min)
1. Project Settings (gear icon) → Your apps section
2. Click Web icon `</>` 
3. Register app: `pratyaksh-music-site`
4. Copy ONLY the `firebaseConfig` object

### Step 4: Add to Your Code (2 min)
1. Open: `src/firebase/config.js`
2. Replace the placeholder config with YOUR config:
```javascript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_KEY_HERE",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_ID",
  appId: "YOUR_APP_ID"
};
```
3. Save the file

### Step 5: Start Admin Panel (1 min)
1. Make sure dev server is running: `npm run dev`
2. Go to: `http://localhost:5173/admin`
3. Login with email/password you created
4. Start managing content! 🎉

## ✅ What's Included

### Videos Manager
- Add YouTube videos with URL
- Auto-extracts video ID and thumbnail
- Edit title, year
- Delete videos
- Shows thumbnail preview

### Spotify Manager  
- Add albums, singles, EPs
- Paste Spotify URL and album art
- Add full tracklist for albums/EPs
- Track number, name, duration
- Edit and delete releases

### Timeline Manager
- Add career milestones
- Date, title, description
- Optional image
- Chronological display
- Edit and delete events

### About Manager
- Edit biography
- Update profile image
- Manage all social links (Spotify, YouTube, Instagram, Apple Music)
- Update contact info (email, location)
- Single save button for all changes

## 🔒 Security

**Your data is safe:**
- Only YOU can edit (via Firebase Authentication)
- Public can only view content
- Firebase handles all security
- No one can access admin without your password

**Never commit credentials:**
- `src/firebase/config.js` contains sensitive keys
- Add to `.gitignore` before pushing to GitHub
- Use environment variables for production

## 📊 Firebase Free Tier

You get for FREE:
- 50,000 reads/day
- 20,000 writes/day  
- 1 GB storage
- More than enough for your music site!

## 🐛 Troubleshooting

**Can't login?**
- Check email/password in Firebase Console → Authentication
- Verify Email/Password is enabled as sign-in method

**"Permission denied" error?**
- Check Firestore security rules
- Make sure you're logged in

**Changes not showing?**
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Check browser console for errors

**"Firebase not configured"?**
- Verify `src/firebase/config.js` has your actual keys
- Restart dev server after config changes

## 📱 Using the Admin Panel

### Access
- URL: `http://localhost:5173/admin`
- Production: `https://yoursite.com/admin`

### Workflow
1. Login with your credentials
2. Choose tab (Videos/Spotify/Timeline/About)
3. Click "+ Add" button
4. Fill form and submit
5. Changes appear instantly!

### Tips
- **Videos**: Just paste YouTube URL, system extracts ID
- **Spotify**: Use full Spotify URLs (open.spotify.com/...)
- **Album Art**: Right-click Spotify album → Copy Image Address
- **Tracks**: Add one by one, can reorder later
- **Timeline**: Use descriptive dates (e.g., "March 2024")
- **About**: Save button updates everything at once

## 🎯 Next Steps

1. Complete Firebase setup (follow steps above)
2. Login to `/admin`
3. Start with Videos Manager (easiest)
4. Add a few videos to test
5. Move to Spotify Manager
6. Add Timeline events
7. Update About section
8. View changes on main site!

## 💡 Pro Tips

- **Backup**: Export Firestore data regularly (Firestore → Import/Export)
- **Testing**: Use a test email first before your main admin account
- **Images**: Use CDN URLs (Spotify CDN, YouTube thumbnails) for fast loading
- **Order**: Drag and drop coming soon - for now, items order by creation date
- **Mobile**: Admin panel is mobile-responsive, manage from anywhere!

---

**All manager components are ready! Follow the steps above to complete Firebase setup and start using your CMS! 🚀**
