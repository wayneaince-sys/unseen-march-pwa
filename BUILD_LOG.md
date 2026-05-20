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

#### Phase 3 follow-up — a11y merge + stack rebase + regression verification (2026-05-19)
- Wayne's call: merged both a11y branches → `master` (also deploys fixes to the live GitHub Pages site), then rebased the iOS phase stack onto master.
- `master` a1f6f2e (normal push). Rebased: phase-1 24ab5f8 → phase-2 744fdb2 → phase-3 b3e0536 (force-with-lease; master never force-pushed). `fix/a11y-*` branches now merged.
- Rebuilt the bundled app (a11y.css now ships inside the iOS bundle) and re-tested on iPhone 17 Pro Max:
  - **Safe-area top (Major): RESOLVED** — header now sits cleanly below the Dynamic Island / status bar. Evidence: docs/ios-simulator-screens/home_iPhone17ProMax_portrait_a11yfixed.png (vs the pre-fix home_iPhone17ProMax_portrait.png).
  - **Footer pill overlap (Minor): STILL OPEN** — `#app-footer{bottom:70px}` in index.html inline CSS still clips the web bottom-nav. Low priority; candidate fix: raise the offset or suppress the floating footer in standalone (privacy policy remains reachable in-app). Deferred — not a Phase 4 blocker.
- Net: the only Major layout regression from Phase 3 is fixed and verified on a device-class simulator; all 5 accessibility fixes (1 Critical + 4 Major) are now in the iOS build and the live site.

### PHASE 4 — Physical-Device Pass
- DATE: 2026-05-19
- BRANCH: feature/ios-phase-4-device (stacked on Phase 3)
- DEVICE: iPhone 17 Pro Max (iPhone18,2), iOS 26.4.2, UDID 00008150-001128AE1138401C
- INSTALL: signed build (Team FTRF39786G, automatic) via decoupled `xcodebuild generic/platform=iOS` + `xcrun devicectl device install app`; launched; opens and is interactive on real hardware. (Developer Mode + device preparation were one-time user steps; "failed to allocate rsd" = harmless CoreDevice USB tunnel hiccup; no manual cert trust needed with a Developer Program cert.)
- FIX APPLIED THIS PHASE: `UIRequiresFullScreen=true` (commit f6f37a3) — silences the all-orientations build warning; correct for portrait-only/parity.
- ON-DEVICE VERIFICATION (Wayne):
  1. Per-screen parity (Home/Ground/Mood/Journal/Crisis/Recovery, 5-4-3-2-1, Box Breathing): **PASS**
  2. Safe-area below Dynamic Island on real HW: **PASS**
  3. Dynamic Type (system Text Size scales app): **FAIL** — see finding
  4. Journal persistence across app kill: **PASS**
  5. Offline cold-launch (airplane mode): **PASS**
  6. Background resume: **PASS**
  7. Crisis path (988 / text / chat deep links): **PASS**
  - Push: N/A v1.0 by design (no APNs server; Android parity)
- FINDING — Dynamic Type (#3): `-webkit-text-size-adjust:auto` (the Critical audit fix) is necessary but not sufficient in a WKWebView; it governs Safari text-inflation, not the iOS Text Size slider. True Dynamic Type in a webview wrap requires a native bridge: read `UIContentSizeCategory` and inject a root font-size scale (the app's Tailwind rem scale keys off root, so a single root-px scale propagates app-wide).
- RESOLUTION — Dynamic Type (#3): Wayne chose to implement the native bridge now. Added to AppDelegate (commit 9db3d07): maps `preferredContentSizeCategory` → root font-size multiplier, injects into the bundled WKWebView, re-applies on the content-size notification and on becoming active. Isolated to AppDelegate; no app-logic refactor. Rebuilt, reinstalled, **re-tested on device → PASS**. Phase 4 now **7/7**.

```
PHASE: 4 — Physical-Device Pass
DATE: 2026-05-19
COMMIT: 9db3d07 (Dynamic Type) + f6f37a3 (UIRequiresFullScreen)
BRANCH: feature/ios-phase-4-device (stacked on Phase 3)
DEVICE: iPhone 17 Pro Max, iOS 26.4.2
WHAT SHIPPED:
  - App installed + runs interactively on real hardware (signed, Team FTRF39786G)
  - On-device verification 7/7: per-screen parity, safe-area, Dynamic Type, journal persistence, offline, background resume, crisis deep links
  - Fixed: portrait full-screen warning; native Dynamic Type bridge so the web UI scales with the iOS Text Size slider
WHAT'S NEXT: Phase 5 — TestFlight build (archive + upload to App Store Connect)
BLOCKERS: none. Open (deferred, non-blocking): Minor footer-pill overlap (Phase 3); push N/A v1.0 by design
SCREENSHOTS: n/a (Phase 3 holds the captures)
HIG/RESOURCE REFERENCES: HIG — Accessibility (Dynamic Type / Text Size), Layout (full screen, safe areas)
```

### PHASE 5 — TestFlight Build
- DATE: 2026-05-19
- BRANCH: feature/ios-phase-5-testflight (stacked on Phase 4)
- TAG: **v1.0.0-ios-tf1** (first TestFlight-ready build)
- VERSION: 1.0.0 (1) — build 1 kept; App Store Connect has no prior build, so it's the clean first upload
- WHAT SHIPPED (validated by me, CLI):
  - Release **ARCHIVE SUCCEEDED**; App Store **EXPORT SUCCEEDED** → distribution-signed `App.ipa`. `-allowProvisioningUpdates` auto-created the Distribution cert + App Store provisioning profile; no agreement/cert blocker hit.
  - `ITSAppUsesNonExemptEncryption=false` added (HTTPS-only = exempt) so TestFlight stops asking export compliance every build (commit 6dded92).
  - Archive placed in Xcode Organizer (`~/Library/Developer/Xcode/Archives/2026-05-19/UnseenMarch.xcarchive`) for GUI upload.
- INTERACTIVE / USER-SIDE (Apple account — cannot be automated): create the App Store Connect app record, accept Free/Paid agreements, the actual upload auth, and TestFlight internal-group setup. Runbook delivered to Wayne.
- WHAT'S NEXT: Phase 6 — listing-prep handoff (Cowork holds the manuscript / writes store copy)
- BLOCKERS: none on the build; remaining steps are Apple-account interactive
- HIG/RESOURCE REFERENCES: Apple — App Store Connect (TestFlight internal testing), Export Compliance; App Store distribution signing

#### Phase 5 upload (2026-05-19)
- Wayne ran Organizer **Validate App** (passed) then **Distribute App → App Store Connect → Upload** for **1.0.0 (2)**. Build submitted to App Store Connect; processing pending.
- Remaining (Apple-account interactive): ensure App Store Connect app record exists for com.bigsarge.unseenmarch; after processing, create internal TestFlight group + add Wayne as tester.
- Build **1.0.0 (2)** completed App Store Connect processing — App Apple ID **6770785464**, SKU unseenmarch-ios, app record live. Pipeline proven end-to-end (archive → upload → processed → Ready). Remaining: create internal TestFlight group + add tester (Wayne) to trigger the tester invite.

### PHASE 6 — Listing-Prep Handoff
- DATE: 2026-05-19
- BRANCH: feature/ios-phase-6-listing (stacked on Phase 5)
- WHAT SHIPPED:
  - docs/app-store/icon-1024.png (1024×1024, no alpha — App Store marketing icon)
  - docs/app-store/screen_iPhone69_01_home.png (1320×2868, required 6.9" iPhone, Home)
  - docs/app-store/screen_iPad13_01_home.png (2064×2752, required 13" iPad, Home)
  - docs/app-store/LISTING_BRIEF.md — app facts, URLs, category/age guidance, App Privacy = Data Not Collected, export-compliance, App Review notes, exact ASC field limits + voice guardrails for Cowork
- HANDOFF: Cowork session writes description/subtitle/promo/keywords/support copy in Wayne's voice using the manuscript. Paste the Phase 6 Milestone Summary into Cowork.
- OPEN (for Wayne/Cowork): capture Grounding/Mood/Journal/Crisis screenshots at 6.9"+13" (Home only automated); optional Apple-template framing.
- WHAT'S NEXT: listing copy in Cowork → submit for App Store review when ready (TestFlight build 1.0.0(2) already processed & tested)
- BLOCKERS: none
- HIG/RESOURCE REFERENCES: Apple Design Resources — Production Templates (1024 icon, screenshot frames); App Store Connect — App Privacy, Age Rating, App Review Guideline 4.2

#### Phase 6 follow-up — footer-pill fix + full screenshot set (2026-05-19)
- **Footer-pill (Minor) RESOLVED.** Source fix on `fix/footer-pill-native-hide` (commit 2454b3c) — detects `window.Capacitor.isNativePlatform()` and adds `.app-native` to documentElement; assets/a11y.css hides `#app-footer` for that class plus `(display-mode: standalone)`. Live website unaffected. Merged to master (deploys to live site too) and cherry-picked into phase-6. Verified clean on iPhone 17 Pro Max simulator with bundle rebuilt.
- **Full screenshot set captured.** 5 screens × 2 device classes = 10 marketing-ready PNGs in `docs/app-store/`:
  - iPhone 6.9" (1320×2868): home, grounding, mood, journal, crisis
  - iPad 13"  (2064×2752): home, grounding, mood, journal, crisis
- **Technique:** Capacitor SPA uses hash routing, not the manifest's `?screen=` convention. Discovered via bundle inspection; injected `history.replaceState({},'','#/<screen>')` into the App.app's bundled `public/index.html` before the app.js module loads, then installed/launched/screenshot per device. Canonical bundle restored after capture.
- All Phase 6 listing assets now complete and ready for Cowork to write copy against.

#### Submitted for App Store Review (2026-05-19)
- App Store Connect listing complete: App Privacy = Data Not Collected, App Information (Health & Fitness primary, Lifestyle secondary, age rating 12+ via Medical/Treatment Information: Infrequent/Mild), Pricing & Availability (Free, all territories), 1.0.0 Version (Support/Marketing URLs, copyright, build 1.0.0(2), 10 screenshots — 5×6.7" iPhone + 5×13" iPad, App Review notes including pre-emptive 4.2 rationale, **Manually release**).
- Cowork delivered Subtitle / Promo / Description / Keywords / What's New in Wayne's voice; pasted and saved.
- **Submitted for App Store Review.** Awaiting Apple decision (first review typically 24–72h for mental-health apps).
