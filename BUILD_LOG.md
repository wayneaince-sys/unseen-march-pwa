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

### PHASE 2 — App Store Identity & Signing
- DATE: 2026-05-18
- COMMIT: 82b1df6 (+ version commit 6214ac0)
- BRANCH: feature/ios-phase-2-signing (stacked on Phase 1)
- WHAT SHIPPED:
  - Xcode 26.5 confirmed as the active toolchain
  - Version set to 1.0.0 / build 1 (matches the live Android app)
  - App icon installed at 1024×1024 with transparency removed (App Store requirement); launch screen set to brand dark so there's no white flash on open; status bar set to light text for the dark UI
  - Capability decision documented: NO push/associated-domains entitlements for v1.0 — matches what the Android app actually does (push has no server; asset-link is a TWA-internal check) and keeps first TestFlight signing friction-free. Opt-in steps recorded for later.
- WHAT'S NEXT: Phase 3 — Simulator pass (after iOS platform SDK installed)
- BLOCKERS:
  1. Signing needs Wayne's Apple ID in Xcode + team selected (interactive; App ID auto-created by automatic signing on first archive)
  2. Clean "Any iOS Device" build not yet verified: Xcode 26.5 has no iOS platform SDK. SPM graph resolved cleanly; no project errors. Needs `xcodebuild -downloadPlatform iOS`
- USER ACTIONS REQUIRED:
  - `sudo xcodebuild -license accept`
  - `sudo xcodebuild -runFirstLaunch`
  - `xcodebuild -downloadPlatform iOS` (large; also enables Phase 3 simulators)
  - In Xcode: open `ios/App/App.xcodeproj`, target App → Signing & Capabilities → Automatic, select Apple Developer team
- SCREENSHOTS: n/a (Phase 3)
- HIG/RESOURCE REFERENCES: HIG — App Icons (no alpha, 1024), Launching, Status Bars. Apple — Associated Domains (requires App ID capability + AASA; intentionally deferred)
