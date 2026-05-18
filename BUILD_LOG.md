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
