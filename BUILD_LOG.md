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

#### Phase 2 verification (2026-05-18, post platform install)
- iOS 26.5 platform SDK + simulator runtime installed (iPhone 17 Pro/Max/17e, iPads)
- Clean **no-signing build for "Any iOS Device" → BUILD SUCCEEDED** (xcodebuild, SPM graph resolved, no project errors). Phase 2 build requirement satisfied.
- Remaining open (non-blocking, deferred to their phases): development provisioning profile needs a registered device (Phase 4 — connect iPhone); App Store distribution profile generated at archive (Phase 5). "no devices" signing message is expected and harmless until then.

### PHASE 3 — Simulator Pass
- DATE: 2026-05-18
- COMMIT: ff14523
- BRANCH: feature/ios-phase-3-simulator (stacked on Phase 2)
- WHAT SHIPPED:
  - App builds and runs on the iOS Simulator. Bundled React PWA renders correctly — the make-or-break risk for the whole Capacitor approach is now retired
  - Verified Home screen at full Android feature parity on iPhone 17e (small), iPhone 17 Pro Max (large, Dynamic Island), iPad Pro 11: header, daily quote, streak counters, Quick Actions (Grounding / Mood / Journal / Recovery Guide), prominent Crisis Resources, bottom tab bar
  - Locked the app to portrait to match the web manifest (portrait-primary) and the Android app — prevents a broken landscape layout
  - Screenshots captured to docs/ios-simulator-screens/
- LAYOUT REGRESSIONS vs Android (found in this pass):
  1. **Safe-area top (Major, iOS-specific):** iOS status bar / Dynamic Island overlaps the app header (worst on iPhone 17 Pro Max). FIX EXISTS: `env(safe-area-inset-top)` on `.app-shell` in `assets/a11y.css` on branch `fix/a11y-majors` — not yet in the iOS phase chain (see merge note).
  2. **Footer pill overlap (Minor, iOS-specific):** the "Privacy Policy" pill (`#app-footer{bottom:70px}`) overlaps the web bottom-nav. Partially addressed by the `fix/a11y-majors` footer + bottom safe-area changes; may need a small extra offset so it clears the fixed nav.
  - Applied fix this phase: portrait lock (commit a484f79).
- MERGE NOTE (decision for Wayne): the two regressions above are already fixed on `fix/a11y-text-size-adjust` and `fix/a11y-majors` (branched off master). To get them into the iOS build, those branches need to land in the iOS phase chain — recommend merging both a11y branches → master, then rebasing the iOS phase branches on master (or cherry-picking the a11y commits into the Phase 3 branch). Flagged, not done — your call on order.
- WHAT'S NEXT: Phase 4 — physical-device pass (push/offline/auth/background; connect iPhone). The per-screen interactive walk (Grounding/Mood/Journal/Crisis) is best done here on the real device — WKWebView web buttons aren't reliably tappable via headless simulator automation, so Home was captured as proof-of-render and the rest is the Phase 4 hands-on walk.
- BLOCKERS: none for progress
- SCREENSHOTS: docs/ios-simulator-screens/home_iPhone17e_portrait.png, home_iPhone17ProMax_portrait.png, home_iPadPro11_portrait.png
- HIG/RESOURCE REFERENCES: HIG — Layout (Safe Areas / Dynamic Island), Adaptivity and Layout (orientation), iPad parity. Apple Design Resources — production templates noted for Phase 6 listing assets
