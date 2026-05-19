# Unseen March — App Store Listing Brief (Phase 6 handoff)

Factual + technical inputs for the App Store listing. **The marketing copy
(description, subtitle, promo, keywords, what's-new, support copy) is written
by the Cowork session in Wayne's voice using the manuscript** — this brief
gives Cowork the facts, constraints, and exact field limits. Nothing here is
final copy.

## App identity (decided / factual)
- **App Store name:** Unseen March  (already created in App Store Connect)
- **Bundle ID:** com.bigsarge.unseenmarch
- **App Apple ID:** 6770785464
- **SKU:** unseenmarch-ios
- **Version / build:** 1.0.0 (2) — live in TestFlight, on-device tested 7/7
- **Platforms:** iPhone (lead) + iPad, iOS 15+
- **Android counterpart:** Google Play `com.bigsarge.unseenmarch` (parity build)

## URLs
- **Marketing URL:** https://wayneaince-sys.github.io/unseen-march-pwa
- **Support URL:** https://big-sarge.blog
- **Privacy Policy URL:** https://wayneaince-sys.github.io/unseen-march-pwa/privacy-policy.html

## Category & age rating (recommendation — Wayne confirms)
- **Primary category:** Health & Fitness  ·  **Secondary:** Lifestyle
  (Medical is an alternative primary; Health & Fitness is the safer fit for a
  self-help companion and has fewer review constraints than Medical.)
- **Age rating:** answer the questionnaire honestly. The app discusses PTSD,
  trauma, and crisis resources. Expect **12+** with "Medical/Treatment
  Information: Infrequent/Mild". No objectionable content. Not legal/clinical
  advice — Wayne's call on the final answers.

## App Privacy ("nutrition labels") — Data Not Collected
Verified against the actual app: journal entries persist only in on-device
`localStorage`; there is no account, no analytics SDK, no tracking, no
network calls beyond loading the bundled web app and user-initiated outbound
links (crisis tel:/sms:, blog). Answer the App Store Connect privacy
questionnaire as:
- **Does this app collect data?** → **No**  → results in "**Data Not Collected**".
- No tracking, no third-party SDKs, no ad identifiers.
- (If Wayne later adds analytics or push, this must be revised before that release.)

## Export compliance
- Already declared in Info.plist: `ITSAppUsesNonExemptEncryption = false`
  (HTTPS only = exempt). No per-build compliance prompt.

## App Review notes (paste into "Notes for Reviewer")
> Companion app to the published nonfiction book *The Unseen March* by Wayne
> Ince (Breaking Ranks Books). Provides grounding exercises, a mood check-in,
> Chapter 5 journaling worksheets stored only on-device, and links to public
> crisis resources (988 Veterans/Suicide & Crisis Lifeline, Crisis Text Line).
> No account or login. No data leaves the device. Not a medical device and
> makes no diagnostic/treatment claims. Wraps a public PWA
> (https://wayneaince-sys.github.io/unseen-march-pwa) with Capacitor; offline
> support, portrait, and iOS Dynamic Type are implemented natively.

If review raises **4.2 (minimum functionality)** for a web-wrapper: emphasize
on-device journaling/persistence, offline use, native Dynamic Type bridge,
and that it is a genuine companion utility to a published work — not a
repackaged website.

## Copy for Cowork to write (exact App Store Connect limits)
| Field | Limit | Notes / constraints |
|---|---|---|
| Subtitle | 30 chars | Plain benefit; no medical claims |
| Promotional Text | 170 chars | Updatable without review; safe, supportive tone |
| Description | 4000 chars | Wayne's voice; companion-to-the-book framing; trauma-informed; **no** cure/treatment/guarantee language (App Store health rules); mention on-device privacy + crisis resources; not a substitute for professional care |
| Keywords | 100 chars total, comma-separated, no spaces-after-comma | e.g. domains: PTSD, veterans, grounding, trauma, mood, journal, first responder, recovery, crisis, mindfulness |
| What's New | 4000 chars | First release — short |
| Support copy | n/a | For the support URL/contact |

Voice/brand guardrails for Cowork: Wayne Ince — 23-yr USAF veteran, Breaking
Ranks Books; calm, direct, peer-to-peer, no hype, no clinical overclaiming;
honor the audience (veterans, first responders, trauma survivors, families).

## Asset inventory (this folder: docs/app-store/)
- `icon-1024.png` — 1024×1024, no alpha → **App Store marketing icon, ready**

**6.9" iPhone screenshots (1320×2868, required slot):**
- `screen_iPhone69_01_home.png` — Home (daily quote, streak counters, Quick Actions, Crisis Resources, book promo)
- `screen_iPhone69_02_grounding.png` — Grounding Tools (5‑4‑3‑2‑1, Box Breathing, Cold Water Anchor, Progressive Muscle Relaxation)
- `screen_iPhone69_03_mood.png` — Mood & Triggers (Check‑In + Arousal Ladder: Baseline/Yellow/Orange/Red)
- `screen_iPhone69_04_journal.png` — Journal (Chapter 5 worksheets + free writing; references *The Unseen March*)
- `screen_iPhone69_05_crisis.png` — Crisis Resources (Veterans Crisis Line 988, Crisis Text Line, SAMHSA, 911)

**13" iPad screenshots (2064×2752, required slot):**
- `screen_iPad13_01_home.png` … `screen_iPad13_05_crisis.png` — same five screens, iPad rendering

Captured with the footer‑pill fix landed (Privacy pill correctly hidden in the
native app). Navigation driven by the SPA's hash router (`#/grounding`,
`#/mood`, `#/journal`, `#/crisis`) — not the manifest's `?screen=` convention.
Apple production templates (developer.apple.com/design/resources) can frame
these if Cowork wants the framed marketing treatment; plain device captures
are also accepted by App Store Connect.
