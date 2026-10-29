# TEAL v0.1 quality review · October 28, 2026

Status: complete reviewable prototype, not a public-release approval or WCAG conformance certification. No publication, merge, external announcement, outreach, purchase, API activation, analytics, or personal-data collection occurred.

## Results

| Area | Evidence | Result / practical limit |
| --- | --- | --- |
| Existing project preservation | Focused checker compares all 88 previously tracked files to merge base `442e813e8ff81abe53f32e01fd4bc6210cb06b15`, including media bytes. | PASS. Original homepage, ten lessons, simulator, support, media, dependencies, workflow and tests unchanged. |
| Focused checks | `node review/teal/check.cjs` | 18 PASS: preservation, local asset resolution, review state, text order, matching reading view, privacy restrictions, critical payload budget, sharing success/denial/missing support/cancellation/failure. Sharing edge cases use a Node VM with synthetic browser capabilities; they are not a native mobile share-sheet test. |
| Static site audit | Existing `npm run audit`, run without ignored generated preview copies in the scan. | 16 HTML pages; 0 broken local links/errors. 10 pre-existing lesson static-H1 warnings remain because those headings are created by existing JavaScript. No new warning. |
| JavaScript syntax | Existing `npm run check:js` | 16 shipped scripts parsed successfully. No shared checker or test config edited. |
| Desktop entrance | Cloud Chrome at the internal managed preview. Actual screenshot inspected. | PASS: Earth artwork, original three-heart identity, separate correct HTML wording, prominent symbol, alternate link. Founder visual acceptance remains pending. |
| Entry and keyboard | Activated symbol; native Enter on named symbol link; focused heading inspected. | PASS: heading receives focus; settled desktop heading top ~96px, below 74px navigation. Smooth-scroll start can precede final position; no content is hidden behind a modal/loading gate. |
| Mobile, tablet and desktop reflow | Same-origin QA frames with measured document content widths 320, 390, 768, 1440px; full-page element-bound measurements. | PASS: document width equals viewport and no measured text/link/control overflow. These are CSS viewport checks in desktop Chrome, not physical-device tests. |
| Text enlargement | 200% root text in 320px and 1440px content-width QA frames. | PASS after fixing intrinsic sizing, long-word wrapping, and opening height. No horizontal overflow measured. Visual reading acceptance with assistive technology remains separate. |
| Artwork switching | `currentSrc` / image dimensions in browser. | PASS: mobile uses cosmic-640 WebP at tested DPR; tablet uses earth-1280; desktop earth-1536. A source-switch loading instant was rechecked after load and passed. |
| JavaScript-free use | QA iframe sandbox denies scripts; native message link, letter content, and reflection disclosure inspected. | PASS: content available, disclosure `open` attribute changes normally, manual-select sharing text present, JS-only buttons hidden. |
| Existing lesson integration | Clicked TEAL's lesson route in browser. | PASS: original “Choose a lesson” heading and ten lesson links observed. |
| Simulator integration | Clicked TEAL's simulator route in browser. | PASS: original “The Missed Deadline” heading and existing Home link observed. No personal input, voice or recording used. Existing simulator regression suite was not rerun as a new TEAL result. |
| Copy fallback | Actual insecure internal preview lacks automatic clipboard; clicked Copy invitation. | PASS: selectable invitation and explanatory status appear, with no preview address. Native secure clipboard success/cancel/error cases additionally covered by focused synthetic checks. |
| Contrast | Calculated representative solid foreground/background pairs. | Ink/paper 12.96:1; editorial teal/paper 6.04:1; signature/paper 5.44:1; body muted/night 11.33:1; principle label/background 10.32:1. This does not certify every pixel over imagery; founder/assistive-technology visual review still matters. |
| Motion | No looping animation, autoplay, video or audio. Native reduced-motion CSS removes smooth scrolling/transitions; review override available. | Source PASS. Actual OS/browser reduced-motion preference and forced-colors mode were not toggled in this environment. |
| Privacy/security | Source review, no third-party scripts/forms/media, no persistence APIs; CSP disallows connect/object/form actions; no-referrer meta policy. | PASS for added source boundaries. Hosting, browser, network and external services have independent data practices. Server headers/account settings not audited. |
| Facts/resources | Primary FAO, WHO/World Bank, UNESCO, WFP, NASA, ITU, World Bank/GEEAP and provider pages retrieved; dated records in `sources.json`. | PASS for landing-page/content verification. Local service availability, eligibility, intake, appointment capacity and destination accessibility not tested. |
| Platform guidance | Official source research, with rules separated from editorial recommendations. | Prepared. Instagram organic Help retrieval limited (429); some TikTok direct retrieval robots-denied, with official indexed source research retained. Actual account upload/link features require later preflight. |
| Full accessibility / learner outcomes | No physical screen reader, real-device matrix, representative learner study, local-resource completion or learning-transfer study. | NOT VERIFIED. Do not describe target WCAG 2.2 AA as achieved, or reading/visits as proven behavior change. |

Browser screenshots were inspected during QA; they are not evidence of founder access. The founder still needs to open the supplied prototype and assess it independently. The existing Issue #4 remains open for its separate delivery/accessibility evidence; these TEAL checks do not close it.

## Performance evidence

Production route source sizes: HTML 26,082 bytes, CSS 18,774 bytes, JS 2,622 bytes. Mobile WebP 82,022 bytes (640px) or 147,240 bytes (960px). The larger mobile candidate plus HTML/CSS/JS totals 194,718 uncompressed bytes, before protocol overhead, and uses no fonts/video/framework. Desktop 1536px WebP is 195,408 bytes. Simple letter view has no image or JavaScript request.

These are file budgets, not measured LCP, bandwidth, latency, data-plan cost, or performance on an older phone. Do not turn them into a Lighthouse score or claim universal performance. JPEG fallbacks are larger; a standalone review export can include inline assets for reliable opening and is not the production payload.

## Remaining founder / release acceptance

1. Open the complete prototype on a phone and computer; activate the symbol and alternative link; read the full letter; inspect goals and Human Literacy routes.
2. Approve or revise the message, three-heart artwork adaptations, evidence descriptions, privacy/AI note and optional participation language.
3. Complete targeted human screen-reader/keyboard and older-device checks before public release; fix blocking issues. Confirm an ongoing resource/correction owner or keep the release bounded enough to maintain.
4. Prepare a separately reviewable release diff: remove draft/noindex labels, enable only canonical public URL sharing, update review-only wording, add one approved incoming homepage link and check social previews on the intended accounts. Recheck any changed claims/resources then.
5. Obtain explicit authorization to merge that exact release commit into `main`, acknowledging that GitHub Pages deploys automatically. Social posting/outreach, translations, analytics, accounts and spending remain separate permissions.

No release decision is assumed. Rollback for an authorized additive release is removal/reversion of TEAL additions and the single incoming link, after checking current `main` and preserving later unrelated work. No rollback was executed or claimed tested here.
