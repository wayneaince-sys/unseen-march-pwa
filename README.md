# The Unseen March — PTSD Recovery Companion PWA

> A mental health wellness companion for veterans, first responders, and trauma survivors.  
> Built on *The Unseen March* by Wayne Aince (Big Sarge), Breaking Ranks Books.

**Live URL:** https://wayneaince-sys.github.io/unseen-march-pwa  
**Google Play ID:** `com.bigsarge.unseenmarch`  
**PWABuilder Score:** 0 errors · 0 warnings · store ready

---

## App Capabilities

### Core Screens

| Screen | Route | Description |
|--------|-------|-------------|
| Home | `/?screen=home` | Daily recovery quote, streak tracker, quick-action grid |
| Grounding Tools | `/?screen=grounding` | 5-4-3-2-1, Box Breathing, Cold Water, Muscle Relaxation |
| Mood Check-In | `/?screen=mood` | 1–10 scale, trigger logging, trend history |
| Journal | `/?screen=journal` | Chapter 5 worksheets, free-write, file open/save |
| Crisis Resources | `/?screen=crisis` | Veterans Crisis Line (988), 6-step Safety Plan |

### Note-Taking (OS Integration)
Registers as a system note provider. Creating a new note from OS quick-settings or the share sheet opens the Journal screen directly via `new_note_url`.

### File Handlers
Opens `.txt` and `.md` files natively. Double-clicking a plain-text or Markdown file on Android or Windows launches the app and loads the file into the Journal screen with `launch_type: multiple-clients`.

### Share Target
Other apps share text and URLs directly into the Journal screen via the OS share sheet using GET method.

### Protocol Handler
Registers the `web+unseenmarch://` protocol for deep linking:
- `web+unseenmarch://?action=grounding` → Grounding Tools  
- `web+unseenmarch://?action=crisis` → Crisis Resources  
- `web+unseenmarch://?action=journal` → Journal

### App Shortcuts (Long-Press / Right-Click)
| Shortcut | Destination |
|----------|-------------|
| Grounding Tools | `/?screen=grounding` |
| Mood Check-In | `/?screen=mood` |
| Crisis Resources | `/?screen=crisis` |
| Journal | `/?screen=journal` |

### Widgets
| Widget | Tag | Update Interval |
|--------|-----|-----------------|
| Daily Check-In | `daily-checkin` | Every hour |
| Grounding Quick-Launch | `grounding-launch` | Every 24 hours |
| Crisis Line | `crisis-line` | Every 24 hours |

Widget data served from `/widgets/*.json`, rendered via Adaptive Card templates at `/widgets/*-template.json`.

### Scope Extensions
Navigates to these origins without leaving the app shell:
- `https://wayneaince-sys.github.io`
- `https://big-sarge.blog`

---

## Service Worker (`sw.js`)

Scope: `/unseen-march-pwa/` — five event handlers.

### `install` — Pre-Cache
Pre-caches the app shell on first install for instant load and full offline support. Calls `skipWaiting()` to activate immediately.

Pre-cached: `index.html`, `manifest.json`, `icon-192.png`, `icon-512.png`

### `activate` — Cache Cleanup
Deletes all caches from previous versions and calls `clients.claim()` so updates take effect without a page reload.

### `fetch` — Cache-First with Network Fallback
GET requests served from cache when available. Fresh network responses cloned into cache. If offline with no cache, navigation requests fall back to `index.html` so the app shell always renders.

### `sync` — Background Sync (Offline Queue Replay)
Tag: `unseen-march-bg-sync`

When a network request fails offline, it is queued in IndexedDB. When connectivity returns the `sync` event fires and `flushPendingRequests()` replays the queue in order.

**Queue store:** IndexedDB `unseen-march-sync` → object store `pending`  
**Each item:** `{ url, method, headers, body }`

### `push` — Push Notifications
Handles incoming push payloads and displays system notifications with the app icon and badge. `notificationclick` opens the app via `clients.openWindow()`. Requires a VAPID push server key to activate delivery.

---

## Icon Sizes

| File | Size | Purpose |
|------|------|---------|
| `icon-48.png` | 48×48 | Android legacy |
| `icon-72.png` | 72×72 | Android / badge |
| `icon-96.png` | 96×96 | Shortcut icons |
| `icon-128.png` | 128×128 | Chrome Web Store |
| `icon-144.png` | 144×144 | Windows / IE |
| `icon-152.png` | 152×152 | iOS |
| `icon-192.png` | 192×192 | Android home screen (`any`) |
| `icon-256.png` | 256×256 | High-DPI displays |
| `icon-512.png` | 512×512 | Play Store splash (`maskable`) |

---

## File Structure

