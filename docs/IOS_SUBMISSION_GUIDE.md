# Unseen March — iOS App Store Submission Guide

Companion app for *The Unseen March* by Wayne Ince (Breaking Ranks Books).
This guide takes the generated `ios/` project from "scaffolded" to "live on the App Store".

- **Project:** `ios/Unseen March.xcworkspace`
- **Bundle ID:** `com.bigsarge.unseenmarch` (same as Google Play — platforms are separate namespaces, reuse is fine)
- **Version / build:** `1.0.0` / `1` (parity with Android `appVersionName 1.0.0`, `appVersionCode 1`)
- **Live web content:** https://wayneaince-sys.github.io/unseen-march-pwa
- **Type:** PWABuilder WKWebView shell — the app loads the live PWA, so future content updates ship by updating the website, not the app (except native config / store metadata).

---

## 0. Recommended before you submit (from the accessibility audit)

See `docs/ACCESSIBILITY_AUDIT.md`. At minimum, fix the **Critical** item in the PWA before review — it is the most likely App Review accessibility flag:

- In `assets/app.css`, remove `text-size-adjust:100%` (or set to `auto`) so iOS **Larger Text / Dynamic Type** works.
- Add `env(safe-area-inset-top/left/right)` padding to the app shell so content clears the notch/Dynamic Island.

These are website changes (push to the PWA repo / GitHub Pages); the iOS app picks them up automatically — no rebuild needed.

---

## 1. One-time machine setup (the Xcode blocker)

This Mac currently has **Command Line Tools only**. You must install full Xcode:

1. **Install Xcode** from the Mac App Store (~7 GB, search "Xcode"). Open it once, accept the license, let it install components.
2. Point the toolchain at it:
   ```
   sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
   xcodebuild -version
   ```
3. **Install CocoaPods** (the project ships a `Podfile`):
   ```
   sudo gem install cocoapods
   ```
4. In a terminal:
   ```
   cd "ios"
   pod install
   ```
   From now on **always open `Unseen March.xcworkspace`**, never the `.xcodeproj`.

---

## 2. Apple Developer / App Store Connect setup

You have an Apple Developer account. Do this once:

1. **App ID** — developer.apple.com → Certificates, IDs & Profiles → Identifiers → `+`
   - Bundle ID (explicit): `com.bigsarge.unseenmarch`
   - Capabilities to enable: **Associated Domains**, **Push Notifications** (the shell ships these entitlements; if you do not want push, see §4).
2. **App record** — appstoreconnect.apple.com → My Apps → `+` → New App
   - Platform: iOS
   - Name: **The Unseen March** (App Store listing name; the home-screen icon shows "Unseen March")
   - Primary language: English (U.S.)
   - Bundle ID: select `com.bigsarge.unseenmarch`
   - SKU: `unseen-march-ios-001`

---

## 3. Signing in Xcode

1. Open `ios/Unseen March.xcworkspace`.
2. Select the **Unseen March** target → **Signing & Capabilities**.
3. Check **Automatically manage signing**.
4. **Team:** select your Apple Developer team (this fills the empty `DEVELOPMENT_TEAM`).
5. Confirm **Associated Domains** shows `applinks:wayneaince-sys.github.io` and `webcredentials:wayneaince-sys.github.io`, and the Push Notifications capability is present (or remove it per §4).

---

## 4. If you do NOT want Push Notifications at launch

The shell ships push scaffolding (`aps-environment`, `remote-notification` background mode). Apple will ask why if it is unused. Either:
- **Keep it:** be ready to explain push usage in review notes, or
- **Remove it:** in Signing & Capabilities delete the Push Notifications capability; in `ios/Unseen March/Info.plist` remove `remote-notification` from `UIBackgroundModes`; in `Entitlements.plist` remove the `aps-environment` key. (Recommended for a v1.0 that has no push server.)

---

## 5. Build, archive, upload

1. In Xcode, set the run destination to **Any iOS Device (arm64)**.
2. **Product → Archive**. Wait for the build.
3. In the Organizer window that opens: **Distribute App → App Store Connect → Upload**.
4. Accept the defaults (automatic signing, upload symbols). Finish.
5. The build appears in App Store Connect under **TestFlight → Builds** after ~10–30 min of processing.

---

## 6. App Store Connect metadata

Use this copy (drawn from the manifest and book positioning):

- **Subtitle (30 char max):** `PTSD recovery companion`
- **Promotional text:** `Grounding tools, mood tracking, crisis resources, and journaling for veterans, first responders, and trauma survivors.`
- **Description:**
  > Unseen March is the wellness companion to *The Unseen March* by Wayne Ince. Built for veterans, first responders, and trauma survivors, it puts evidence-informed self-regulation tools one tap away: 5-4-3-2-1 and box-breathing grounding, a 1–10 mood check-in with trigger logging, Chapter 5 journaling worksheets, and an always-available crisis screen with the Veterans Crisis Line (988), Crisis Text Line, and a 6-step safety plan. Journal entries are stored only on your device. This app supports recovery; it does not replace professional care.
- **Keywords:** `PTSD,veterans,grounding,mental health,trauma,first responder,breathing,journal,crisis,recovery`
- **Support URL:** `https://big-sarge.blog`
- **Marketing URL:** `https://wayneaince-sys.github.io/unseen-march-pwa`
- **Category:** Primary **Health & Fitness** (or Medical); Secondary Lifestyle
- **Privacy Policy URL:** `https://wayneaince-sys.github.io/unseen-march-pwa/privacy-policy.html`

### App Privacy (App Store Connect questionnaire)
- Data collection: **None** — journal entries live in on-device `localStorage`/IndexedDB and are never transmitted. Declare "Data Not Collected" unless you later add analytics.

### Age rating
- Likely **17+** or **12+** with "Infrequent/Mild Medical/Treatment Information". Answer the questionnaire honestly re: mental-health/medical content; there is no objectionable content.

### Screenshots (required: 6.7" and 6.5"/6.1")
- The repo already has narrow screenshots in `screenshots/` (home, grounding, mood, journal, crisis) and there are device-frame sets in `~/Downloads/screenshot_unseen_march*`. Confirm they match current UI; resize/frame to the exact App Store pixel dimensions for at least one required device size.

### App Review notes
> This is a mental-health companion to a published nonfiction book. It provides grounding exercises, a mood journal stored locally on device, and links to public crisis resources (988 Veterans Crisis Line, Crisis Text Line). No account or login is required. No data leaves the device. The app wraps a public PWA at https://wayneaince-sys.github.io/unseen-march-pwa.

If review flags "minimal functionality" (common for web-wrapper apps): emphasize the native iOS shortcuts, offline service worker, on-device journaling, and that it is a genuine companion utility to a published work — not just a website bookmark.

---

## 7. Version control / release hygiene

- Work stays on branch `ios-build`. Merge to `master` when validated.
- Bump rule: each App Store upload needs a unique build number. For 1.0.x web-content changes you usually do **not** resubmit (PWA updates are live); only resubmit when native config, entitlements, icons, or metadata change. When you do: bump `CURRENT_PROJECT_VERSION` (build) and, for user-facing releases, `MARKETING_VERSION`.
- Record every submission in `docs/ACTIVITY_LOG.md` (version, build, date, what changed).

---

## 8. Quick checklist

- [ ] Xcode + CocoaPods installed, `pod install` run
- [ ] Accessibility Critical fix (`text-size-adjust`) pushed to PWA
- [ ] App ID created with Associated Domains (+ Push or removed)
- [ ] App record created in App Store Connect
- [ ] Signing team set in Xcode
- [ ] Archive uploaded
- [ ] Metadata, privacy (Data Not Collected), age rating, screenshots entered
- [ ] Submitted for review; logged in ACTIVITY_LOG.md
