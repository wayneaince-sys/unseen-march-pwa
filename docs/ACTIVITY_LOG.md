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
