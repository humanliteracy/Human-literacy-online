# TEAL — A World Worth Building · release candidate v0.1-rc1

TEAL adds one founder-directed humanitarian invitation to the existing Human Literacy website. Visitors enter through the approved three-heart identity, read the founding letter, examine evidence, reflect, and optionally explore existing lessons or the scripted simulator. Participation requires no account or payment.

The founder accepted the v0.1 creative/content experience at `9bcdda0934c76a44477560865c161794c585be49`. This revision addresses the E85 release-readiness corrections. It remains a draft PR; no merge, deployment or publication is authorized. It does not represent an established worldwide movement or verified humanitarian impact. See [release-candidate.md](release-candidate.md) for current scope, manual tests, ownership, verification limits and rollback.

## Architecture and preservation

- Additive static route: `teal/index.html`; simple reading route: `teal/letter.html`.
- Local CSS, a small optional sharing script, optimized WebP/JPEG artwork. No framework, runtime dependencies, backend, API, paid service, or build step.
- The ten lessons, simulator, support page, media, test configuration, workflows and other 87 original files are preserved byte for byte against base `442e813e8ff81abe53f32e01fd4bc6210cb06b15`. The original homepage has only one additive TEAL entry link, after its existing introduction. Removing that exact block restores the original homepage bytes.
- HELP links to the current scripted Communication Coach inside `simulator/01/`; LEARN links to `index.html#choose`; PRACTICE links to the existing simulator. The audit did not find a separate published Everyday Mentor route. Broader Everyday Mentor / Universal Life Mentor work remains separate and gated; no duplicate system was created.
- The existing Master Project Register remains the coordinating record. This is an extension of the existing website/publishing work, not a new master project, backlog, repository, or competing mentor roadmap.
- The single incoming homepage link is part of this bounded release candidate. All approved TEAL art, the founding article in both reading views, and the humanitarian goal articles are unchanged from the founder-accepted v0.1 source.

## Design specification

| Surface | Implementation |
| --- | --- |
| Mobile | Approved vertical cosmic reference, text removed from the art, contained without distortion, separate readable HTML brand/principles/aspirations, large centered symbol entrance; minimum opening height expands with text. |
| Desktop | Approved emblem-above-Earth composition, full-width cinematic scene, separate HTML typography, dark top/bottom overlays for legibility. |
| Identity | Original three-heart arrangement: two above, one below, within its rounded inner border and outer circle. No replacement icon. Adaptations remove lettering without intentionally changing the emblem. Founder visual acceptance is still required. |
| Palette | Deep navy `#04151f`; teal `#83eee0`; paper `#f6f5ef`; ink `#122f35`; dark editorial teal `#17685f`. |
| Type | System sans serif for navigation and labels; local Georgia/serif fallback for the letter and major headings. No external font request. |
| Editorial layout | Desktop letter has a quiet side column and ~700px reading measure; mobile uses one column. Three evidence rows replace a large resource directory. |
| Interaction | Ordinary anchor to the founding heading, optional smooth scrolling, explicit focus, alternative text link, native disclosures. All core content works without JavaScript. |
| Accessibility | Logical landmarks/headings, descriptive links, visible focus, 44px navigation/control targets, text enlargement/reflow, reduced-motion CSS, forced-colors fallback, printable simple letter. Target WCAG 2.2 AA; no full conformance claim. |
| Internationalization | UTF-8; `lang="en"`, `dir="ltr"`; flexible text boxes; logical spacing; no image-embedded essential wording. Reviewed RTL and script-specific layout are future acceptance work. |

The visitor journey is optional at every step: DISCOVER → UNDERSTAND → REFLECT → LEARN → ACT → SHARE. It is represented by real text, links, and disclosures; there is no registration sequence, completion score, or pressure to proceed.

## Artwork provenance

Founder-supplied reference assets were resolved as “Teal Trinity Cosmic Emblem.png” (mobile) and “Teal Emblem Above Earth’s Horizon.png” (desktop), both dated October 28, 2026. Built-in image generation edited only the text-removal brief; the three-heart identity and composition were preservation constraints. Resulting art is illustrative AI-generated imagery, not documentary Earth photography.

Final source assets live in `teal/assets/`. WebP variants: mobile 640/960px, desktop 1280/1536px. JPEG fallbacks support older browsers. The 1200 × 630 social artwork has correct wording and a corresponding metadata description. Image compression and social composition used Sharp; essential website text remains HTML.

The adaptation prompts were: remove all lettering; seamlessly fill removed regions with surrounding cosmic sky/Earth; preserve original central circle, inner rounded triangle, two upper hearts and one lower heart, placement, proportions, glow, colors, Earth and rays; add no new symbols or words. Source references remain unmodified.

## Local review and checks

Serve the repository root, then open `/teal/`. The repository's existing local review launcher remains unchanged. For this Work session the managed Sites preview is internal QA only; no hosted Site was created or deployed.

`review/teal/viewport.html` provides repeatable 320/390/768/1440px content-width checks, 200% text, a JavaScript-free sandbox, and a review-only motion override. Its own layout measurements do not constitute a complete accessibility audit. The override tests motion-free operation; it does not verify an actual OS preference change.

Run:

```sh
node review/teal/check.cjs
python3 review/teal/export-letter.py --check
npm run audit
npm run check:js
```

No existing lesson/simulator tests or shared test configuration were changed. The TEAL-focused checker now covers the one allowed homepage addition, approved-content preservation, faithful text export, maintenance ownership and canonical sharing under public, preview and spoofed locations. The plain-text exporter retains block/line boundaries and omits HTML footnote digits. Existing browser regression tests are retained; report fresh CI separately from prior results.

## Privacy and security

No analytics, forms, personal inputs, cookies, local storage, tracking pixels, third-party scripts, embeds, autoplay, microphone, browser speech, live AI, or billing integration were introduced. Sharing runs only after a button press. Only the actual `https://humanliteracy.github.io/Human-literacy-online/teal/` or equivalent `index.html` location shares the fixed canonical address; queries, fragments and preview addresses are excluded. Other locations share text only. Clipboard denial/missing support has a selectable text fallback. A cancelled share does not trigger a retry. This host check prepares release behavior; it is not publication authorization.

The page CSP prohibits network connections, objects, forms and arbitrary external scripts. This meta policy cannot supply every server security header (notably `frame-ancestors`); host configuration and account security remain separate concerns. Outbound links use a no-referrer policy. Hosting/browser/network and selected external services can process data; do not promise universally untracked browsing.

## Release boundary

`main` automatically publishes through GitHub Pages. Do not merge or push to it without explicit founder exact-revision authorization. The two product reading pages are prepared without draft/noindex labels; the review-only viewport helper intentionally remains noindex. The proposed public diff includes `teal/`, its public source docs and `review/teal` helpers, plus one homepage entry; these contain no private project records. Noindex is not access control. Founder acceptance of ongoing resource ownership, targeted human checks and final exact-head verification are separate release gates. Leave Issue #4's unrelated delivery/accessibility gates open until supported by their own evidence.

Costs: $0 new expenses targeted and no purchase, account, subscription, paid API, or domain was activated. Existing hosting/tool plan limits still apply; no promise of unlimited free future scale.

Current release record: `release-candidate.md` and `sources.json`. `communications.md` and `quality-review.md` retain the earlier v0.1 proposal/historical evidence, not fresh results for a changed head. The PR revision record binds current checks to its exact SHA. Private project records are not copied into this public repository.
