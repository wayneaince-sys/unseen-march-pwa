# Unseen March — iOS Build Log

iOS (Capacitor) build-out to TestFlight parity with the live Google Play Android (Bubblewrap TWA) app. Owner: Wayne Ince, Breaking Ranks Books.

- **Wrap:** Capacitor (iOS), bundled web content
- **Bundle id:** `com.bigsarge.unseenmarch` (matches Android)
- **Targets:** iPhone (lead) + iPad
- **Base branch:** `master` · feature branches per phase
- **Parked fallback:** branch `ios-build` (earlier PWABuilder WKWebView attempt — not merged)

---

## Milestone Summaries

### PHASE 0 — Recon
- DATE: 2026-05-18
- COMMIT: n/a (no code changes)
- BRANCH: n/a (recon only)
- WHAT SHIPPED:
  - Confirmed stack: prebuilt React static site, no package.json/build step in repo
  - Confirmed Android wrap is Bubblewrap TWA (Android-only) — Capacitor added fresh
  - Mapped PWA capabilities; 6 manifest features have no iOS equivalent
  - Identified ios/ path collision with parked PWABuilder branch; clean path defined
  - Resolved 4 open questions with Wayne (bundle id, branch base, bundled, iPad scope)
- WHAT'S NEXT: Phase 1 — add Capacitor iOS platform on feature/ios-phase-1-wrap
- BLOCKERS: none (Xcode/CocoaPods install still pending for build steps)
- SCREENSHOTS: n/a
- HIG/RESOURCE REFERENCES: HIG — Home Screen Quick Actions, Layout, Launching

### PHASE 1 — iOS Wrap Scaffolding
- DATE: 2026-05-18
- COMMIT: 7c7415b (scaffold) + log commit
- BRANCH: feature/ios-phase-1-wrap (off master)
- WHAT SHIPPED:
  - Added Capacitor 8 iOS platform — uses Swift Package Manager, so CocoaPods is NOT required (one less blocker)
  - App identity wired: name "Unseen March", bundle id com.bigsarge.unseenmarch (matches the live Android app), universal iPhone + iPad, supports iOS 15+ (older iPhones, fits the veteran audience)
  - Bundled the existing web app into the native project; added a one-command build that rewrites the website's /unseen-march-pwa/ paths to work inside the app (the live website is left untouched)
  - Native project generated cleanly; node_modules and generated folders kept out of version control
- WHAT'S NEXT: Phase 2 — App Store identity, signing, and capabilities in Xcode
- BLOCKERS: Full Xcode.app still required to open/build/archive (only Command Line Tools installed). Capacitor scaffolding itself succeeded without it
- SCREENSHOTS: n/a (Phase 3 simulator pass)
- HIG/RESOURCE REFERENCES: HIG — Launching (launch screen), Layout (safe areas, universal iPhone/iPad). Service workers do not run under Capacitor's iOS scheme — offline-cache parity will use Capacitor's native mechanisms, addressed in a later phase
