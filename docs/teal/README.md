# TEAL — A World Worth Building · review candidate v0.1

TEAL adds one founder-directed humanitarian invitation to the existing Human Literacy website. Visitors enter through the approved three-heart identity, read the proposed founding letter, examine evidence, reflect, and optionally explore existing lessons or the scripted simulator. Participation requires no account or payment.

This is an unpublished proposal. It does not represent an established worldwide movement, verified humanitarian impact, or an approved release.

## Architecture and preservation

- Additive static route: `teal/index.html`; simple reading route: `teal/letter.html`.
- Local CSS, a small optional sharing script, optimized WebP/JPEG artwork. No framework, runtime dependencies, backend, API, paid service, or build step.
- The original homepage, ten lessons, simulator, support page, media, test configuration, and workflows are preserved byte for byte against base `442e813e8ff81abe53f32e01fd4bc6210cb06b15`.
- HELP links to the current scripted Communication Coach inside `simulator/01/`; LEARN links to `index.html#choose`; PRACTICE links to the existing simulator. The audit did not find a separate published Everyday Mentor route. Broader Everyday Mentor / Universal Life Mentor work remains separate and gated; no duplicate system was created.
- The existing Master Project Register remains the coordinating record. This is an extension of the existing website/publishing work, not a new master project, backlog, repository, or competing mentor roadmap.
- No incoming link was added to the existing homepage in this review candidate. Following explicit release approval, one small, separately reviewed link can make TEAL discoverable from Human Literacy. This avoids changing an approved page during prototype review.

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
npm run audit
npm run check:js
```

No existing tests or shared test configuration were changed. Existing browser regression tests are retained. Preservation evidence plus direct integration smoke checks are used for this additive change; prior simulator test reports must not be relabeled as new TEAL test runs.

## Privacy and security

No analytics, forms, personal inputs, cookies, local storage, tracking pixels, third-party scripts, embeds, autoplay, microphone, browser speech, live AI, or billing integration were introduced. Sharing runs only after a button press. During review it shares text only; it never shares the preview address. Clipboard denial/missing support has a selectable text fallback. A cancelled share does not trigger a retry.

The page CSP prohibits network connections, objects, forms and arbitrary external scripts. This meta policy cannot supply every server security header (notably `frame-ancestors`); host configuration and account security remain separate concerns. Outbound links use a no-referrer policy. Hosting/browser/network and selected external services can process data; do not promise universally untracked browsing.

## Release boundary

`main` automatically publishes through GitHub Pages. Do not merge or push to it without explicit founder authorization. Review files contain `noindex,nofollow`, an unpublished review strip, and disabled URL sharing. After approval, prepare one bounded release diff to remove review-only labels/noindex, enable canonical URL sharing, and add the approved incoming homepage link. Recheck that exact diff, sources, layouts, and metadata before requesting merge/deployment authorization. Leave Issue #4's unrelated delivery/accessibility gates open until supported by their own evidence.

Costs: $0 new expenses targeted and no purchase, account, subscription, paid API, or domain was activated. Existing hosting/tool plan limits still apply; no promise of unlimited free future scale.

See `communications.md`, `sources.json`, and `quality-review.md`. Human-facing founder acceptance materials are delivered separately; private project records are not copied into this public repository.
