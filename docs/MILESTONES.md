# Unseen March — v1.0.0 Milestones (Phase 5–9 Consolidation)

**App:** Unseen March (iOS)
**Version:** 1.0.0 (build 2)
**Shipping commit:** `e25ca8f` (tag `v1.0.0-ios-tf1`)
**App Store URL:** https://apps.apple.com/app/id6770785464
**App ID:** 6770785464
**Bundle ID:** `com.bigsarge.unseenmarch`
**Apple Developer team:** Wayne Ince — Individual enrollment, Team ID `FTRF39786G`
**Repo:** https://github.com/wayneaince-sys/unseen-march-pwa
**Ship target was:** 2026-06-17 — shipped 28 days early.

---

## Phase 5 — TestFlight (2026-05-19)

- Build `1.0.0 (2)` processed Ready on App Store Connect.
- App Apple ID `6770785464` registered.
- Tagged `v1.0.0-ios-tf1` on `feature/ios-phase-5-testflight`.
- Archive iterated through multiple commits before final upload: build 1 validated, build 2 uploaded to satisfy Apple's unique-build-number rule.
- Final state on App Store Connect: **1.0.0 (2) processed Ready**, distribution-signed `.ipa`, `ITSAppUsesNonExemptEncryption=false`, distribution cert + App Store profile auto-created.
- Distributed via Xcode Organizer GUI (no App Store Connect API key needed).
- TestFlight functional pass on physical iPhone 17 Pro Max. Feedback with screenshots emailed for the record.

## Phase 6 — Listing Pack (2026-05-19 → 2026-05-21)

- **App Privacy:** Data Not Collected. No transmission, no analytics SDK, no third-party trackers.
- **Export compliance:** Completed. App Review notes drafted.
- **Footer-pill a11y follow-on:** Fixed and merged to master (commit `0b31a5e`), live site updated, cherry-picked into phase-6, verified on iPhone 17 Pro Max simulator. The last deferred Phase 3 a11y item is now closed.
- **Screenshots:** 10 PNGs in `docs/app-store/` at required App Store sizes — Home / Grounding / Mood / Journal / Crisis at both 6.9" iPhone and 13" iPad.
- **Web architecture:** big-sarge.blog hub for app + book + worksheet + privacy. Hub at `/unseen-march`, privacy at `/unseen-march/privacy`.
- **Privacy + marketing hub live (2026-05-21):**
  - https://big-sarge.blog/unseen-march/ (support + marketing hub)
  - https://big-sarge.blog/unseen-march/privacy/ (privacy policy)
  - Both pages drafted in Cowork via the anti-ai-writing-style skill (advocacy register, plainspoken, zero em-dashes, no inflation words, full Pass-2 audit), then published via the WordPress.com connector.

## Phase 7 — Submitted to App Review (2026-05-19)

- Submitted to App Review with **manual release**.
- Manual release chosen so approval triggers *Pending Developer Release*: the app stays off the public Store until Wayne taps Release.

## Phase 8 — Approved (2026-05-20)

- App Review approved.
- No Resolution Center notes.
- No metadata edits requested.
- Export compliance + App Privacy accepted as submitted.

## Phase 9 — Public Release (2026-05-20)

- Release tapped 2026-05-20.
- *Unseen March* `1.0.0 (2)` **live on the App Store**.
- 28 days ahead of the 2026-06-17 ship target.
- Public URL: https://apps.apple.com/app/id6770785464

---

## Open Follow-Ons

1. **v1.0.1 backlog** — footer-pill follow-on confirmation in the wild, plus any post-launch a11y findings via TestFlight.
2. **BR-10 launch announcement** — blog + newsletter post for the public release.
3. **Listing Pack copy pass via anti-ai-writing-style** — voice-driven pass on subtitle, description, and keywords.
4. **App Review contact + pricing** — App Review contact phone, pricing and availability final.
