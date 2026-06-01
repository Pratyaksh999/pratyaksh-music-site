# 🎵 Pratyaksh Bharadwaj - Official Music Site

A modern, cinematic music fan site inspired by world-class athlete sites with smooth animations, parallax effects, and bold fire-themed aesthetics.

## 🔥 Features

- **Cinematic Hero Section** - Full-screen animated landing with floating particles
- **Latest Release Showcase** - Highlight your newest music with stats
- **Complete Catalog** - Interactive discography grid with hover effects
- **About Section** - Tell your story with animated stats and visual elements
- **Smooth Animations** - Framer Motion powered transitions and scroll effects
- **Bold Fire Theme** - Black background with red/orange/yellow fire accents
- **Fully Responsive** - Mobile-first design that looks great on all devices
- **Modern Stack** - React 18 + Vite + Tailwind CSS

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Installation

```bash
# Navigate to project
cd pratyaksh-music-site

# Install dependencies
npm install

# Start dev server
npm run dev
```

The site will open at `http://localhost:3000`

## 📁 Project Structure

```
pratyaksh-music-site/
├── src/
│   ├── components/
│   │   ├── Navigation.jsx      # Sticky nav with scroll effects
│   │   ├── Hero.jsx            # Landing section with animations
│   │   ├── LatestRelease.jsx   # Featured release
│   │   ├── Catalog.jsx         # Discography grid
│   │   ├── About.jsx           # Artist story
│   │   ├── Footer.jsx          # Footer with links
│   │   └── ScrollIndicator.jsx # Progress bar
│   ├── App.jsx                 # Main app component
│   ├── main.jsx               # React entry point
│   └── index.css              # Global styles + Tailwind
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

## 🎨 Customization Guide

### 1. Replace Placeholder Content

**Latest Release** (`src/components/LatestRelease.jsx`):
- Replace `[Your Latest Single]` with actual title
- Add real album artwork (replace emoji placeholder)
- Update streaming stats

**Catalog** (`src/components/Catalog.jsx`):
- Update `releases` array with your actual discography
- Replace emoji placeholders with album art

**About Section** (`src/components/About.jsx`):
- Update biography text
- Replace stats (streams, listeners)
- Add your photo

### 2. Add Real Links

Update platform links in:
- `src/components/Hero.jsx` - Social icons
- `src/components/Footer.jsx` - All social links

Replace `#` with actual URLs:
```jsx
{ name: 'Spotify', url: 'https://open.spotify.com/artist/YOUR_ID' }
```

### 3. Color Customization

Edit `tailwind.config.js`:
```js
colors: {
  'fire-red': '#FF3D00',      // Change main accent
  'fire-orange': '#FF6D00',   // Change secondary
  'fire-yellow': '#FFB300',   // Change tertiary
}
```

### 4. Add Real Images

1. Create `public/images/` directory
2. Add your images:
   - `hero-bg.jpg` - Hero background
   - `latest-album.jpg` - Latest release art
   - `artist-photo.jpg` - About section
   - Album covers for catalog

3. Update image paths in components:
```jsx
<img src="/images/latest-album.jpg" alt="Album" />
```

## 🚢 Deployment

### Deploy to Vercel (Recommended)

```bash
npm run build
npx vercel --prod
```

### Deploy to Netlify

```bash
npm run build
# Drag the `dist` folder to Netlify
```

## 🎯 Modern Features Implemented

✅ Scroll-triggered animations (Intersection Observer)
✅ Framer Motion smooth transitions
✅ Parallax floating particles
✅ Glassmorphism navigation
✅ Hover glow effects
✅ Custom fire-gradient scrollbar
✅ Responsive grid layouts
✅ Touch-friendly mobile design
✅ SEO-ready meta tags
✅ Performance optimized

## 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari 14+
- Mobile Safari
- Chrome Mobile

## 🛠️ Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool (super fast)
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Animation library
- **React Intersection Observer** - Scroll animations

## 📝 To-Do

- [ ] Add actual music player integration
- [ ] Connect to Spotify/Apple Music APIs
- [ ] Add tour dates section
- [ ] Implement blog/news section
- [ ] Add merchandise store
- [ ] Email newsletter integration

## 🎓 Learn More

- [Framer Motion Docs](https://www.framer.com/motion/)
- [Tailwind CSS](https://tailwindcss.com)
- [React](https://react.dev)

## 📄 License

MIT License - Feel free to use for your own music site!

---

**Made with 🔥 by Pratyaksh Bharadwaj**
