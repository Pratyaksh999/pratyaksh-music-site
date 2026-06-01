# 🎨 Customization Guide - Quick Reference

## 🚀 Your Site is Live!
**Local URL:** http://localhost:3000

---

## ✏️ Quick Edits Checklist

### 1. Update Latest Release Info
**File:** `src/components/LatestRelease.jsx`

```jsx
// Line 53: Replace placeholder title
<h3 className="font-display font-bold text-4xl mb-3">
  YOUR SONG TITLE HERE
</h3>

// Line 55: Update type and year
<p className="text-gray-400 text-sm uppercase tracking-wider">
  Single • 2026
</p>

// Line 59-61: Update description
<p className="text-gray-300 text-lg leading-relaxed">
  Your song description here...
</p>

// Line 81-85: Update stats
{ label: 'Streams', value: '2.5M+' },
{ label: 'Duration', value: '3:45' },
{ label: 'BPM', value: '128' },
```

---

### 2. Add Your Music Catalog
**File:** `src/components/Catalog.jsx`

```jsx
// Line 9-16: Replace with your actual releases
const releases = [
  { 
    title: 'Your Song Name', 
    type: 'Single',      // or 'EP', 'Album'
    year: '2026', 
    streams: '1.2M' 
  },
  // Add more releases...
];
```

---

### 3. Update About Section
**File:** `src/components/About.jsx`

```jsx
// Line 52-65: Replace biography
<div className="space-y-6 text-gray-300 text-lg leading-relaxed">
  <p>
    Your story here...
  </p>
  <p>
    More about your journey...
  </p>
  <blockquote className="...">
    "Your quote here."
  </blockquote>
</div>

// Line 30-40: Update stats
<p className="font-display font-bold text-3xl text-fire-orange">10M+</p>
<p className="text-gray-400 text-sm">Total Streams</p>
```

---

### 4. Add Real Platform Links
**File:** `src/components/Hero.jsx` (Lines 59-66)
**File:** `src/components/Footer.jsx` (Lines 9-15)

```jsx
// Replace # with your actual URLs
{ 
  name: 'Spotify', 
  icon: '🎵',
  url: 'https://open.spotify.com/artist/YOUR_SPOTIFY_ID' 
},
{ 
  name: 'Apple Music', 
  icon: '🍎',
  url: 'https://music.apple.com/artist/YOUR_APPLE_ID' 
},
{ 
  name: 'YouTube', 
  icon: '▶️',
  url: 'https://youtube.com/@YourChannel' 
},
```

---

### 5. Add Real Images

#### Step 1: Create images folder
```bash
mkdir public/images
```

#### Step 2: Add your images:
- `public/images/hero-bg.jpg` - Background for hero
- `public/images/latest-release.jpg` - Album art for latest release
- `public/images/artist-photo.jpg` - Your photo for About section
- `public/images/album-1.jpg`, `album-2.jpg`, etc. - Catalog covers

#### Step 3: Update image references

**Latest Release** (`src/components/LatestRelease.jsx` ~line 31):
```jsx
<div className="w-full h-full">
  <img 
    src="/images/latest-release.jpg" 
    alt="Album Cover"
    className="w-full h-full object-cover"
  />
</div>
```

**About Section** (`src/components/About.jsx` ~line 19):
```jsx
<div className="w-full h-full">
  <img 
    src="/images/artist-photo.jpg" 
    alt="Pratyaksh Bharadwaj"
    className="w-full h-full object-cover"
  />
</div>
```

**Catalog Items** (`src/components/Catalog.jsx` ~line 38):
```jsx
<div className="w-full h-full">
  <img 
    src={`/images/album-${index + 1}.jpg`}
    alt={release.title}
    className="w-full h-full object-cover"
  />
</div>
```

---

## 🎨 Color Customization

**File:** `tailwind.config.js`

```js
colors: {
  // Change these to match your brand
  'fire-red': '#FF3D00',      // Main accent
  'fire-orange': '#FF6D00',   // Secondary accent
  'fire-yellow': '#FFB300',   // Tertiary accent
  'dark-bg': '#0A0A0A',       // Background
  'dark-card': '#151515',     // Card backgrounds
},
```

Want different colors? Try:
- **Purple/Blue**: `#8B5CF6`, `#6366F1`, `#3B82F6`
- **Green/Teal**: `#10B981`, `#14B8A6`, `#06B6D4`
- **Pink/Magenta**: `#EC4899`, `#F43F5E`, `#EF4444`

---

## 📝 Text Content Updates

### Hero Section
**File:** `src/components/Hero.jsx`
- Line 31: Subheading text
- Line 45: Main tagline

### Navigation
**File:** `src/components/Navigation.jsx`
- Lines 8-13: Menu items

### Footer
**File:** `src/components/Footer.jsx`
- Lines 18-23: Quick links
- Line 38: Newsletter description

---

## 🚀 Deploy Your Site

### Option 1: Vercel (Easiest)
```bash
npm install -g vercel
npm run build
vercel --prod
```

### Option 2: Netlify
1. Run `npm run build`
2. Go to [netlify.com](https://netlify.com)
3. Drag the `dist` folder to deploy

### Option 3: GitHub Pages
```bash
npm run build
# Push the dist folder to gh-pages branch
```

---

## 🔧 Development Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 💡 Pro Tips

1. **Replace Emojis with Icons**
   - Install: `npm install lucide-react`
   - Use: `import { Music, Play, Heart } from 'lucide-react'`

2. **Add Actual Music Player**
   - Use Spotify Embed: `<iframe src="https://open.spotify.com/embed/track/..."`
   - Or Apple Music Embed Kit

3. **SEO Optimization**
   - Update `index.html` meta tags
   - Add Open Graph tags for social sharing

4. **Analytics**
   - Add Google Analytics ID in `index.html`
   - Or use Vercel Analytics

5. **Newsletter**
   - Connect to Mailchimp, ConvertKit, or Buttondown
   - Update form action in `Footer.jsx`

---

## 🎯 Priority Updates

**Must Do First:**
1. ✅ Add real platform links (Spotify, Apple Music, YouTube)
2. ✅ Update "Latest Release" with actual song info
3. ✅ Replace placeholder catalog with your discography
4. ✅ Update About section with your story

**Nice to Have:**
- Add real images
- Customize colors
- Add tour dates section
- Connect newsletter
- Add music player embeds

---

## 📞 Need Help?

- **Framer Motion Docs:** https://www.framer.com/motion/
- **Tailwind CSS:** https://tailwindcss.com/docs
- **React:** https://react.dev

---

**Your site is ready to customize! Start with the "Must Do First" items above.** 🔥
