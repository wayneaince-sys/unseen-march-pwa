# Accessibility audit: Unseen March — in-app web content (iOS WKWebView shell)
**Standard:** WCAG 2.1 AA + Breaking Ranks reader notes | **Date:** 2026-05-18
**Scope:** PWA content (`index.html`, `assets/app.css`, `assets/app.js`) as rendered inside the generated PWABuilder iOS shell. Static source audit — items marked *verify on device* need a VoiceOver + Larger Text pass on a physical iPhone before App Store submission.

### Summary
**Issues found:** 8 | **Critical:** 1 | **Major:** 4 | **Minor:** 3

The core experience is in good shape for a trauma-affected audience: body-text contrast is excellent (white / `#e5e7eb` on `#131c26` ≈ 15–17:1, well past the 7:1 we want for fatigued readers), `prefers-reduced-motion` is globally honored, focus rings exist, reading width is capped at `72ch`, and crisis contacts are real and actionable (`tel:988`, `sms:838255`, Crisis Text Line `741741`, VCL chat). The problems are concentrated in (1) iOS text-scaling being actively disabled, (2) the notch/safe-area top inset, (3) the tiny low-contrast footer link, and (4) accent-colored buttons.

### Findings

#### Perceivable
| Issue | WCAG | Severity | Fix |
|---|---|---|---|
| `text-size-adjust:100%` in app.css locks text scaling; combined with fixed `rem` sizing, iOS **Larger Text / Dynamic Type is not honored** — low-vision veterans cannot enlarge the UI | 1.4.4 | **Critical** | Remove `text-size-adjust:100%` (or set `auto`); allow the WKWebView to scale. Ideally adopt `font: -apple-system-body` on body copy so it tracks the iOS text-size slider |
| Footer privacy link `#607060` on `rgba(19,28,38,.85)` ≈ **3.3:1** at ~11px — below 4.5:1 | 1.4.3 | Major | Lighten to ≥ `#8a9a8a` (~4.6:1) and raise size to ≥ 0.8rem |
| Accent buttons use `background:#f59e0b` / `#06b6d4`; if label text is white/near-white the ratio is ~2:1 | 1.4.3 | Major | *Verify on device.* Use dark text (`#131c26`) on amber/cyan fills, or darken the fill |
| Secondary text at `.65rem`/`.75rem` (~10–12px) is small for TBI/visual-fatigue readers | 1.4.4 | Minor | Raise smallest tier to ≥ 0.8rem; never below 12px |

#### Operable
| Issue | WCAG | Severity | Fix |
|---|---|---|---|
| `apple-mobile-web-app-status-bar-style=black-translucent` + `viewport-fit=cover`, but CSS only sets `safe-area-inset-bottom` — top content can sit under the notch / Dynamic Island | 1.4.10 / 2.4.x | Major | Add `padding-top: env(safe-area-inset-top)` (and left/right) to the app shell container; *verify on device* — the native shell may already inset the WebView |
| No `min-height/width:44px` anywhere; footer link hit area ≈ 17px tall; utility-class buttons likely under 44×44 | 2.5.5 | Major | Enforce 44×44 CSS px minimum on every tappable control (buttons, tab bar, shortcut tiles, crisis buttons) |
| Splash screen shows a minimum 1200 ms with a spinner before content | 2.2.x | Minor | Acceptable; the global reduced-motion rule dampens the spinner. No change required |

#### Understandable
| Issue | WCAG | Severity | Fix |
|---|---|---|---|
| Clinical content (Chapter 5 worksheets, grounding instructions) reading level not verifiable from the bundle | 3.1.5 | Minor | Confirm 8th-grade reading level; flag clinical terms inline |

#### Robust
| Issue | WCAG | Severity | Fix |
|---|---|---|---|
| Custom controls present (`combobox`, `listbox`, `tablist`, `switch`, `status`, 2× `aria-live`) — good, but unverified with VoiceOver | 4.1.2 | *Verify* | VoiceOver pass on mood selector, tab bar, and journal save status before submission |

### Breaking Ranks reader checks
| Check | Result | Notes |
|---|---|---|
| Crisis-line reachable | **Pass** | Dedicated Crisis screen + home-screen shortcut + iOS quick-action shortcut; `tel:988`, `sms:838255`, `741741`, VCL chat all present and actionable |
| Trigger-warning placement | Verify | Not detectable in bundle — confirm any trauma-content warning sits above the fold |
| Line length 60–75 char | **Pass** | Reading container capped at `max-width:72ch` |
| Body font 16px+ | **Pass** | Base `1rem`; secondary tiers small (see Minor) |
| Auto-playing motion | **Pass** | Only the launch spinner; no autoplay video/carousel |
| Reduced-motion honored | **Pass** | Global `@media (prefers-reduced-motion:reduce)` zeroes animations/transitions |

### Color contrast (computed)
| Element | Foreground | Background | Ratio | Required | Pass |
|---|---|---|---|---|---|
| Body text | `#ffffff` | `#131c26` | ~17:1 | 4.5:1 | ✅ |
| Body text | `#e5e7eb` | `#131c26` | ~15:1 | 4.5:1 | ✅ |
| Secondary | `#9ca3af` | `#131c26` | ~6.7:1 | 4.5:1 | ✅ |
| Footer link | `#607060` | `#131c26` | ~3.3:1 | 4.5:1 | ❌ |
| Amber/cyan buttons w/ light text | `#ffffff` | `#f59e0b`/`#06b6d4` | ~2:1 | 4.5:1 | ❌ verify |

### iOS-shell-specific
| Concern | Status | Notes |
|---|---|---|
| Dynamic Type | ❌ | `text-size-adjust:100%` defeats iOS Larger Text — Apple App Review and low-vision users both care |
| Safe-area / notch | ⚠️ | Only bottom inset handled; verify top on a notched device |
| VoiceOver | ⚠️ verify | ARIA scaffolding present; needs a real swipe-through |
| Pull-to-refresh | OK | Enabled in `Settings.swift`; journal autosaves to `localStorage`, so an accidental refresh won't lose entries |

### Priority fixes
1. **[Critical] Remove `text-size-adjust:100%`** — it blocks iOS Larger Text/Dynamic Type. This is the single most likely accessibility-related App Review flag and directly blocks low-vision veterans. One-line CSS change.
2. **[Major] Add `env(safe-area-inset-top/left/right)`** to the shell container so content clears the notch/Dynamic Island.
3. **[Major] Enforce 44×44 tap targets** app-wide, especially crisis buttons and the tab bar — fatigue and tremor make small targets a real barrier.
4. **[Major] Fix footer link + accent-button contrast** to ≥ 4.5:1.
5. **[Minor] Raise smallest font tier to ≥ 0.8rem**; confirm clinical reading level; add/confirm trigger-warning placement.
6. Then: **VoiceOver + Larger Text pass on a physical iPhone**, ideally with a veteran reader, before submitting.
