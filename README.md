# FK Crvena Zvezda Match Calendar

[![PWA](https://img.shields.io/badge/PWA-Enabled-c8102e?style=for-the-badge&logo=progressive-web-apps)](https://web.dev/progressive-web-apps/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

**FK Red Star Belgrade match calendar Progressive Web App (PWA)** with bilingual support (English/Serbian), dark mode, local match reminders, and offline functionality.

![FK Red Star Calendar Preview](https://img.shields.io/badge/🔴⚪-Navijači%2C%20zajedno%20do%20titule!-c8102e?style=for-the-badge)

A lightweight, high-performance, client-side web application designed to fetch, parse, and display official match fixtures for FK Crvena Zvezda from a live Google Calendar iCal feed. The application is built entirely with standard web technologies (HTML5, CSS3, and modern JavaScript) and functions autonomously within the user's browser without the need for dedicated backend architecture.

## Features

* **Live iCalendar Synchronization**: Fetches a same-origin `fixtures.ics` mirror first, then falls back to the remote Google Calendar feed and CORS relays. The mirror is refreshed automatically every hour by a GitHub Actions workflow, so the public site does not depend on third-party proxies.
* **Resilient Sync Pipeline**: Direct remote fetches work inside the Electron AppImage (CORS is lifted by the wrapper). On the web, the same-origin mirror avoids CORS entirely, with `r.jina.ai` and `api.codetabs.com` retained only as last-resort fallbacks.
* **Serbian Latin Output**: Cyrillic venue and feed text is transliterated to Serbian Latin (for example, `Рајка Митића` becomes `Rajka Mitića`) before it is displayed.
* **Intelligent Local Caching**: Minimizes redundant network traffic and ensures rapid load times by storing parsed fixtures in local storage (`LocalStorage`) with a 1-hour Time-to-Live (TTL) expiration threshold.
* **Offline Functionality & Resilience**: If network connectivity is lost or remote servers become unavailable, the application gracefully falls back to the last successfully cached dataset rather than rendering an empty state.
* **Bilingual Interface**: Full English and Serbian (Latin) support with a one-tap language toggle (🌐 button). The preferred language is remembered between sessions and applied to the entire interface, including month/day labels.
* **Match Reminders**: An opt-in notification toggle (🔔 button) that requests permission and fires a local browser notification roughly 30 minutes before a match kicks off. The scheduler runs while the app is open and is independent of any server-side push infrastructure.
* **Responsive Hybrid Layout**: Implements a dual-view system optimized for all device types:
    * **Desktop View**: A comprehensive 7-column calendar grid showing match distributions across the current month.
    * **Mobile View**: Automatically transforms into an optimized chronological timeline view for seamless vertical scrolling on smaller touch screens.
* **Progressive Web App (PWA)**: Equipped with a service worker configuration, web manifest, and standalone display mode to support native-like installation on iOS and Android devices, with all app assets (including icons) cached for full offline access.
* **Calendar Integration**: Enables users to generate external deep-links to instantly add specific match events to their personal Google Calendars with populated summaries, times, and venue details.
* **Security Hardening**: Enforces a Content-Security-Policy restricting resource origins to the application and its data proxies, mitigates stored XSS by rendering remote feed data as text nodes, and includes accessibility touches (ARIA dialog semantics, keyboard/focus management, and labeled icon buttons).


### Live Demo

[Click here to try it live](https://vojislav77.github.io/redstar-calendar/)

## Technical Architecture

### Core Configurations
The application logic operates under a predefined configuration object allowing straightforward updates to endpoints and behaviors:
* `icalUrl`: The public target Google Calendar iCal endpoint URL.
* `localUrl`: Same-origin mirror (`./fixtures.ics`) refreshed hourly by `.github/workflows/update-fixtures.yml`.
* `cacheTTL`: Cache validation lifespan set to 3,600,000 milliseconds (1 hour).
* `cacheKey`: The local-storage key used to persist the parsed fixture dataset.
* `TIMEZONE`: Enforced regional timezone parameter (`Europe/Belgrade`) for consistent kickoff time representations.
* `buildRemoteSources()`: Ordered fallback list used only when the local mirror is unavailable (direct feed, `r.jina.ai`, `api.codetabs.com`).

### Synchronization

Google's public iCal endpoint does not send `Access-Control-Allow-Origin`, so browsers cannot fetch it directly. Keyless public CORS proxies are also unreliable (the previously used `corsproxy.io` now requires an API key and `api.codetabs.com` frequently returns 522/403 errors). The app therefore fetches a same-origin mirror first:

1. `.github/workflows/update-fixtures.yml` downloads the live feed every hour, removes volatile `DTSTAMP` fields, and commits `fixtures.ics`.
2. The web app fetches `./fixtures.ics` (no CORS involved).
3. If the mirror is missing, the app falls back to the direct feed, then `r.jina.ai`, then `api.codetabs.com`.
4. The Electron AppImage fetches the live feed directly first because its wrapper adds permissive CORS headers; the bundled mirror is an offline fallback.

### ICS Parsing Logic
The JavaScript engine bypasses common string-matching bugs by looking up indices of key properties independently of appended RFC-5545 parameter tags (such as alternative language declarations within fields like `SUMMARY`). String decoders then unescape standard iCalendar format syntaxes (e.g., control characters, escaped commas, and newlines).

Date-time values are parsed defensively: both UTC (`...Z`) and `TZID`-prefixed wall-clock formats are accepted, and wall-clock times are converted to their correct instant using the configured timezone. All dates and kickoff times are then rendered exclusively through `Intl.DateTimeFormat` with the `Europe/Belgrade` timezone, so matches display at the correct local kickoff time regardless of the visitor's own timezone.

## Deployment and Local Installation

Because this application operates entirely on client-side code, it requires no compilation, build tools, or specialized web servers. It can be run locally on any device by accessing the source files directly.
Running Locally on a Desktop

    Download or clone all source files (index.html, manifest.json, sw.js, fixtures.ics, and logo.png) into a single folder on your computer.

    Ensure logo.png and fixtures.ics remain in the same directory as index.html.

    Double-click the index.html file to launch the application instantly in your default web browser.

On GitHub Pages, `.github/workflows/update-fixtures.yml` refreshes `fixtures.ics` from the live feed every hour and commits the result. Enable Actions and GitHub Pages for the repository, and the web app will stay in sync without any proxy configuration.


## Installing as a Mobile or Desktop App (PWA)

The application is structured as a Progressive Web App, meaning you can install it directly onto your device configuration for offline access and an independent window layout.

    On Desktop (Chrome, Edge, Brave): Click the installation icon located on the right side of your browser address bar, or open your browser settings menu and select "Install FK Crvena Zvezda - Match Calendar".

    On Mobile (Android/Chrome): Tap the "Install app" banner at the top of the interface, or open the browser options menu and select "Add to Home screen".

    On Mobile (iOS/Safari): Tap the "Share" button at the bottom of the screen, scroll down, and select "Add to Home Screen".

## Desktop App (Linux AppImage)

A self-contained **Linux AppImage** (x86_64) is available for desktop users. It wraps the application in a lightweight Electron shell — no Node.js, system web dependencies, or build tools required.

    Download redstar-calendar-2.0.0-x86_64.AppImage, then:

    chmod +x redstar-calendar-2.0.0-x86_64.AppImage
    ./redstar-calendar-2.0.0-x86_64.AppImage

Notes on the AppImage build:

* **Fully offline-capable**: the bundled Electron runtime ships its own rendering engine, so the app behaves identically to the browser version regardless of installed system packages.
* **Icons**: uses `logo.png` for the window titlebar, the Plasma/KDE taskbar (via `StartupWMClass=redstar-calendar`), and the launcher menu entry.
* **Window size**: opens at 1285×1215 on first launch (minimum 380×560).
* **Data fetching**: tries the iCal source directly first (CORS is lifted inside the wrapper), then the bundled `fixtures.ics` snapshot and the web relays, making it resilient to proxy outages.
* **Menu entry**: run the AppImage once, then add it to your application menu, or use the provided desktop file at `~/.local/share/applications/redstar-calendar.desktop`.
* **Fallback**: if FUSE is unavailable on your system, launch with `--appimage-extract-and-run`.

The AppImage is rebuilt by bundling the same `index.html`, `manifest.json`, `sw.js`, `fixtures.ics`, and `logo.png` used by the web version, so features (fixtures, bilingual UI, dark mode, reminders, calendar export) are identical in both editions. Build version: **2.0.0**.
