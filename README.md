# ⭐ FK Crvena Zvezda Match Calendar

[![PWA](https://img.shields.io/badge/PWA-Enabled-c8102e?style=for-the-badge&logo=progressive-web-apps)](https://web.dev/progressive-web-apps/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)
[![Language](https://img.shields.io/badge/Lang-EN%2F%20SR-ffd700?style=for-the-badge)]()

**FK Red Star Belgrade match calendar Progressive Web App (PWA)** with live statistics, bilingual support (English/Serbian), dark mode, push notifications, and offline functionality.

![FK Red Star Calendar Preview](https://img.shields.io/badge/🔴⚪-Navijači%2C%20zajedno%20do%20titule!-c8102e?style=for-the-badge)

<img width="1229" height="1766" alt="fkcz" src="https://github.com/user-attachments/assets/a641e862-c625-49fb-af57-1c622248fd56" />

## 🌟 Features

### 📅 Calendar
- ✅ **Custom calendar** (no Google Calendar iframe embed)
- ✅ Fetches matches directly from Google Calendar iCal feed
- ✅ Monday-first week layout (European standard)
- ✅ Month navigation with quick "Today" jump
- ✅ Click any date to view match details
- ✅ Mobile-optimized list view
- ✅ Add matches to your personal calendar
- ✅ Share match details

### 🎨 User Experience
- 🌙 **Dark/Light mode** toggle with persistence
- 🗣️ **Bilingual interface** (English/Serbian)
- 📱 **Fully responsive** design (mobile, tablet, desktop)
- ⌨️ Keyboard shortcut: Press `C` to focus calendar
- 🎯 Clean, modern UI with Red Star branding

### 📊 Live Statistics
- Current league position & standings
- Season record (W-D-L) & points
- Goals for/against statistics
- Current form indicator
- Top scorers panel with player positions

### 🔔 Notifications & PWA
- 🔔 Browser push notifications for match reminders
- 📲 **Installable PWA** - add to home screen
- 💾 Offline support via Service Worker
- ⚡ Fast loading with cached assets

### 🔒 Privacy
- No user data collection
- No analytics tracking
- All data stored locally in browser
- Public Google Calendar feed only

### ☁️ Live Demo

[Click here to try it live](https://vojislav77.github.io/redstar-calendar/)

## 🚀 Quick Start

### Option 1: Use Directly
Simply open `index.html` in any modern web browser. No build process required!

### Option 2: Local Development
```bash
# Clone the repository
git clone https://github.com/vojislav77/redstar-calendar.git
cd redstar-calendar

# Run a local server (Python)
python3 -m http.server 8000

# Or use Node.js (http-server)
npx http-server -p 8000
