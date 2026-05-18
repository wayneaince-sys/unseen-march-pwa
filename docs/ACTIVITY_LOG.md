# Unseen March — iOS Build-Out Activity Log

Companion app for *The Unseen March* by Wayne Ince (Breaking Ranks Books).
Goal: ship an iOS App Store build alongside the existing Google Play Android (TWA) app.

- **Approach:** PWABuilder iOS (WKWebView Swift wrapper) — mirrors the Bubblewrap TWA path
- **Source PWA:** https://wayneaince-sys.github.io/unseen-march-pwa
- **Android package id:** `com.bigsarge.unseenmarch` (Google Play)
- **Distribution target:** App Store public release
- **Working branch:** `ios-build`
- **Repo:** https://github.com/wayneaince-sys/unseen-march-pwa

---

## Version history

| Version | Build | Date | Notes |
|---------|-------|------|-------|
| 1.0.0 | 1 | 2026-05-18 | Initial iOS package — parity with Android 1.0.0 |

---

## Log

### 2026-05-18

- **[setup]** Cloned repo; inspected `manifest.json`, `twa-manifest.json`, `sw.js`, `index.html`. PWA is store-ready (0 errors / 0 warnings per README).
- **[setup]** Created working branch `ios-build`; added `ios/` and `docs/` directories.
- **[setup]** Created this activity log.
- **[blocker]** Full Xcode.app not installed on build Mac (only Command Line Tools); CocoaPods absent. All non-Xcode prep proceeds; archive/upload deferred to user after Xcode install.
- **[build]** Generated iOS project from official PWABuilder iOS template (`pwa-builder/pwabuilder-ios`), applying the exact `XcodePwaShellProject` substitutions: rootUrl, allowedOrigins (`wayneaince-sys.github.io`), authOrigins (`wayneaince-sys.github.io`, `big-sarge.blog`), bundle id `com.bigsarge.unseenmarch`, app name "Unseen March", progress-bar color `#3d5c2c`, associated-domains, WKAppBoundDomains, and 4 manifest shortcuts.
- **[build]** Renamed shell folders/module: `pwa-shell` → `Unseen March`, `PWAShell` → `UnseenMarch`, `Pods_pwa_shell` → `Pods_UnseenMarch`. UA marker `PWAShell` left intact (matches PWABuilder output).
- **[build]** Generated full icon set (30 AppIcon + 5 LaunchIcon) from `icons/icon-512.png` via `sips`; produced an alpha-free 1024 marketing icon flattened onto brand `#131c26` via a CoreGraphics helper. Note: 1024 is upscaled from 512 — a true 1024 source is recommended for final polish.
- **[build]** Set `MARKETING_VERSION = 1.0.0`, `CURRENT_PROJECT_VERSION = 1`. `DEVELOPMENT_TEAM` left blank for the user to set in Xcode (automatic signing).
- **[a11y]** Ran accessibility review on the in-app web content → `docs/ACCESSIBILITY_AUDIT.md`. 1 Critical (`text-size-adjust:100%` defeats iOS Dynamic Type), 4 Major (safe-area top, 44px tap targets, footer/accent contrast). Core body contrast and reduced-motion are strong; crisis CTAs reachable.
- **[docs]** Wrote `docs/IOS_SUBMISSION_GUIDE.md` — full Xcode/App Store Connect path: machine setup, App ID, signing, archive/upload, metadata, privacy (Data Not Collected), age rating, review notes, release hygiene.
- **[vcs]** Pushed `ios-build` to origin. PR not auto-opened (no `gh`/token on machine) — open via https://github.com/wayneaince-sys/unseen-march-pwa/pull/new/ios-build
- **[log]** Created Notion page "Unseen March — iOS Build-Out Log" (https://www.notion.so/3648a82d008681e7999cde848a747196). No Slack project channel exists; left a Slack draft in the user's DM to place manually.
