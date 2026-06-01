# Lyrics System Setup Guide

## ✅ What's Been Created

I've built a complete lyrics system with:

1. **LyricsViewer Component** - Main lyrics display page
2. **LyricsEditor Component** - Admin interface to add/edit lyrics
3. **Search functionality** - Search across songs, artists, and lyrics
4. **Genius-style annotations** - Hover over lines to see annotations
5. **Spotify player integration** - Play songs while reading lyrics
6. **Fully editable** - When logged in with edit mode

## 🎵 Features

### For Visitors:
- Browse all songs with lyrics
- Search by song title, artist, or lyric text
- Click any song to view full lyrics
- Hover over lines with 💭 to see annotations
- Listen to song on Spotify while reading
- Highlighted search results

### For Admin (You):
- Add new songs with lyrics
- Edit existing lyrics
- Delete songs
- Add annotations to explain lines
- Embed Spotify player for each song

## 📝 How to Add Lyrics

### Step 1: Access Lyrics Page

Go to: `http://localhost:3007/lyrics` (or your site URL + `/lyrics`)

### Step 2: Login & Enable Edit Mode

1. Click **🔐 Login** in navigation
2. Login with Google
3. Click **✏️ Edit** to enable edit mode

### Step 3: Add New Song

1. Click **➕ Add New Song Lyrics** button
2. Fill in the form:
   - **Song Title**: e.g., "Darmiyaan"
   - **Artist**: "Pratyaksh Bharadwaj" (or featuring artists)
   - **Album**: e.g., "Rebirth"
   - **Producers**: e.g., "XYZ Beats"
   - **Spotify Track ID**: Get from Spotify URL (explained below)
   - **Lyrics**: Full lyrics with formatting

### Step 4: Format Lyrics

Use this format:

```
Verse 1 line 1
Verse 1 line 2
[This is an annotation explaining something about the verse]

Chorus line 1
Chorus line 2
[Annotation for chorus]

Verse 2 line 1
Verse 2 line 2
```

**Rules:**
- Separate verses/sections with **double line breaks**
- Add annotations on a new line in **[square brackets]**
- Annotations will show when hovering over the line above them

### Step 5: Get Spotify Track ID

1. Open song on Spotify
2. Click **Share** → **Copy Song Link**
3. URL looks like: `https://open.spotify.com/track/3n3Ppam7vgaVa1iaRUc9Lp`
4. Copy **only the ID part**: `3n3Ppam7vgaVa1iaRUc9Lp`
5. Paste in "Spotify Track ID" field

### Step 6: Save

Click **Save Lyrics** - the page will reload and your song will appear!

## 🎯 Example Lyrics Format

```
Main jo kehta hoon woh sach hota hai
Har sapna dekha maine aaj hota hai
[This opening line establishes the artist's commitment to authenticity and manifestation]

Raat din mehnat karta hoon main
Apne sapno ko sach karta hoon main
[These lines reference his work ethic and dedication to his craft]

Darmiyaan tere mere
Hai ek raabta gehra
Dil se dil tak chalta hai
[The chorus explores the deep connection between souls]
```

## 🔍 Search Features

The search box finds matches in:
- Song titles
- Artist names
- Lyrics text

Results are highlighted in **yellow** in the lyrics display.

## 💡 Annotation Tips

Use annotations to explain:
- References to other songs, artists, or events
- Wordplay or double meanings
- Cultural context
- Personal stories behind lines
- Production notes
- Hidden messages

## 📱 How It Works

1. Songs stored in Firebase `lyrics` collection
2. Each song has:
   - Metadata (title, artist, album, etc.)
   - Array of line objects with text + optional annotation
   - Spotify track ID for embedded player
3. Searchable in real-time
4. No page reloads when switching songs

## 🎨 Navigation

The "Lyrics" link has been added to your main navigation menu!

## 🚀 Next Steps

1. Start adding your most popular songs
2. Add annotations for deeper engagement
3. Share lyrics page URL on social media
4. Fans can read along while listening on Spotify

Your lyrics are now live at: **yoursite.com/lyrics** 🎉
