# FK Crvena Zvezda Match Calendar

[![PWA](https://img.shields.io/badge/PWA-Enabled-c8102e?style=for-the-badge&logo=progressive-web-apps)](https://web.dev/progressive-web-apps/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)
[![Language](https://img.shields.io/badge/Lang-EN%2F%20SR-ffd700?style=for-the-badge)]()

**FK Red Star Belgrade match calendar Progressive Web App (PWA)** with live statistics, bilingual support (English/Serbian), dark mode, push notifications, and offline functionality.

![FK Red Star Calendar Preview](https://img.shields.io/badge/🔴⚪-Navijači%2C%20zajedno%20do%20titule!-c8102e?style=for-the-badge)

A lightweight, high-performance, client-side web application designed to fetch, parse, and display official match fixtures for FK Crvena Zvezda from a live Google Calendar iCal feed. The application is built entirely with standard web technologies (HTML5, CSS3, and modern JavaScript) and functions autonomously within the user's browser without the need for dedicated backend architecture.

## Features

* **Live iCalendar Synchronization**: Dynamically fetches and parses remote `.ics` feeds directly in the browser using a flexible parsing engine that handles complex property attributes and parameter variations.
* **Dual-Proxy Fallback System**: To bypass browser Cross-Origin Resource Sharing (CORS) restrictions, the application features an automated proxy rotation mechanism. If the primary proxy server fails or times out, the script instantly routes the request through a secondary fallback network.
* **Intelligent Local Caching**: Minimizes redundant network traffic and ensures rapid load times by storing parsed fixtures in local storage (`LocalStorage`) with a 1-hour Time-to-Live (TTL) expiration threshold.
* **Offline Functionality & Resilience**: If network connectivity is lost or remote servers become unavailable, the application gracefully falls back to the last successfully cached dataset rather than rendering an empty state.
* **Responsive Hybrid Layout**: Implements a dual-view system optimized for all device types:
    * **Desktop View**: A comprehensive 7-column calendar grid showing match distributions across the current month.
    * **Mobile View**: Automatically transforms into an optimized chronological timeline view for seamless vertical scrolling on smaller touch screens.
* **Localization (Internationalization)**: Full, runtime-switchable support for English and Serbian (Latin script), including precise programmatic mapping of dates, weekdays, and months.
* **Progressive Web App (PWA)**: Equipped with a service worker configuration, web manifest, and standalone display mode to support native-like installation on iOS and Android devices.
* **Calendar Integration**: Enables users to generate external deep-links to instantly add specific match events to their personal Google Calendars with populated summaries, times, and venue details.

## Project Structure

The repository maintains a flat, self-contained structure for simple static hosting deployment:

├── index.html        # Main application layout, styles, and core logic
├── manifest.json     # PWA configuration and web app manifest
├── sw.js             # Service worker handling offline caching rules
└── logo.png          # High-resolution club crest and application icon


### ☁️ Live Demo

[Click here to try it live](https://vojislav77.github.io/redstar-calendar/)

## Technical Architecture

### Core Configurations
The application logic operates under a predefined configuration object allowing straightforward updates to endpoints and behaviors:
* `icalUrl`: The public target Google Calendar iCal endpoint URL.
* `proxies`: An ordered array of public CORS proxies utilized sequentially upon fetch failures.
* `cacheTTL`: Cache validation lifespan set to 3,600,000 milliseconds (1 hour).
* `TIMEZONE`: Enforced regional timezone parameter (`Europe/Belgrade`) for consistent kickoff time representations.

### ICS Parsing Logic
The JavaScript engine bypasses common string-matching bugs by looking up indices of key properties independently of appended RFC-5545 parameter tags (such as alternative language declarations within fields like `SUMMARY`). String decoders then unescape standard iCalendar format syntaxes (e.g., control characters, escaped commas, and newlines).

## Deployment and Local Installation

Because this application operates entirely on client-side code, it requires no compilation, build tools, or specialized web servers. It can be run locally on any device by accessing the source files directly.
Running Locally on a Desktop

    Download or clone all source files (index.html, manifest.json, sw.js, and logo.png) into a single folder on your computer.

    Ensure logo.png remains in the same directory directory as index.html to prevent broken image references.

    Double-click the index.html file to launch the application instantly in your default web browser.


## Installing as a Mobile or Desktop App (PWA)

The application is structured as a Progressive Web App, meaning you can install it directly onto your device configuration for offline access and an independent window layout.

    On Desktop (Chrome, Edge, Brave): Click the installation icon located on the right side of your browser address bar, or open your browser settings menu and select "Install FK Crvena Zvezda - Match Calendar".

    On Mobile (Android/Chrome): Tap the "Install app" banner at the top of the interface, or open the browser options menu and select "Add to Home screen".

    On Mobile (iOS/Safari): Tap the "Share" button at the bottom of the screen, scroll down, and select "Add to Home Screen".
