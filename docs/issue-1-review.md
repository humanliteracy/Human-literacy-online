# Communication Coach: founder simplification review

Draft PR: <https://github.com/humanliteracy/Human-literacy-online/pull/2> · [Changed files](https://github.com/humanliteracy/Human-literacy-online/pull/2/files).

Work continues on `feat/issue-1-communication-coach`. The checkout was clean and its local/remote head matched `e9c9042d251502505b4f32efd69d22a1deaab4a6` before editing. Issue #4 preview work remains committed separately on `design/issue-4-independent-preview`; it was not reset, merged, or overwritten.

The founder reported successful Chromebook access and a complicated experience, referencing E18 in the Master Project Register. This revision applies the six requirements supplied with that review. The register itself was not available through this checkout or connected tools; its original wording has not been independently retrieved. Founder acceptance of this updated revision remains pending.

## Resulting experience

1. **Reply:** one suggested response, with all remaining authored responses under **More responses**. Own wording is always available. **Help me draft** starts the optional Coach.
2. **Express:** one private text field and **Next**. No recording, reflection field, or rehearsal draft competes with this question.
3. **Goal:** confirm or change the communication path and editable goal. **Why this suggestion?** retains the literal expression, tentative reading and rejection option. Unknown wording requires the learner to clarify; no intent is inferred.
4. **Wording:** one editable suggestion. **More responses (2)** retains both alternatives; **Change goal** and **Edit first reaction** remain available. Editing the goal invalidates stale suggestions.
5. **Reply and send:** **Use this wording** fills the reply, closes private drafting and focuses the reply. Nothing is sent until the learner chooses **Say this**. A second conversational turn remains available.
6. **Finish:** one relevant takeaway and one optional practical action. **What remains open** retains consequences/questions and goal detail; the transcript is available separately on request.

Only one primary question is shown at a time. Jordan's question can be reopened as reference while drafting. The original illustration, transcript, existing optional feedback settings, recording/listening, browser dictation, rehearsal and detailed privacy explanation remain accessible through native keyboard-operable disclosures. No functionality is replaced by a screenshot or a mock service.

All seven learner-selected paths remain: refusal/boundaries, resignation, scope, support, pause, recovery and custom. There is no forced agreement. Scoring stays off by default; the existing opt-in remains tucked away. No new scoring, account, backend, AI service, provider key or dependency is introduced.

## Resignation correction

Previously, typing **I am confirming my decision to resign.** could fall through the direct script to a generic request for a project plan. The direct final resignation reply also asked the learner to confirm again. The exact confirmation now follows the resignation branch and Jordan explicitly acknowledges it, discusses notice/pay/timing/handover and does not accept the assignment on the learner's behalf. The coached response also stops asking for repeated confirmation. Direct and coached-then-edited confirmation are both tested.

## Before/after: visible work and interaction effort

Baseline is the previous PR revision `e9c9042`. The same synthetic resignation example, Chromium, fonts and 844px viewport height were used. Counts include only rendered controls, excluding closed-disclosure descendants. [Raw measurements and definitions](founder-simple-metrics.json).

| Moment | Before | After |
| --- | --- | --- |
| Open private drafting | Reply plus Express, Listen Back and Rehearse stacked together; 6 visible fields | One expression question; 1 visible field |
| Review goal | Earlier work areas remain, with 8 visible fields | One goal question; path and editable goal, 2 visible fields |
| Choose wording | Earlier work areas remain, with 7 visible fields | One editable suggestion, 1 visible field |
| Return to reply | Private stack remains open | Drafting closes; reply receives focus |
| Finish | Multiple reflection prompts and open drafting stack | One takeaway, one optional action; details and drafting folded |
| Required decisions for this example | 6 clicks and 1 text entry | 6 clicks and 1 text entry |

The six clicks are Help me draft → Next → Use my goal → Use this wording → Say this → follow-up response. This revision reduces concurrent reading, fields and scrolling; it does **not** claim fewer required decision clicks. Explicit transfer and sending remain separate. No optional disclosure must be opened for this default example.

| Width | Open expression area | Wording area | Completion card |
| --- | --- | --- | --- |
| 320px | 2922 → 568px (81% shorter) | 3626 → 890px (75% shorter) | 934 → 666px (29% shorter) |
| 390px | 2534 → 568px (78% shorter) | 3168 → 819px (74% shorter) | 760 → 519px (32% shorter) |

Area heights cover the full private drafting disclosure, including its visible optional menus; completion heights cover the completion card. Revealing tools, alternatives, long custom wording or goal detail intentionally adds space.

## Screenshots

[Before: 390px stacked expression](screenshots/founder-before-express-390.png) · [After: one expression question](screenshots/founder-simple-express-390.png) · [Goal question](screenshots/founder-simple-goal-390.png) · [Initial reply](screenshots/founder-simple-entry-390.png).

[Desktop wording](screenshots/founder-simple-wording-1120.png) · [320px wording](screenshots/founder-simple-wording-320.png) · [390px wording](screenshots/founder-simple-wording-390.png).

[Desktop reflection](screenshots/founder-simple-reflection-1120.png) · [320px reflection](screenshots/founder-simple-reflection-320.png) · [390px reflection](screenshots/founder-simple-reflection-390.png).

All captured inputs are synthetic. No founder answers, private register contents or raw audio are included.

## Verification

On 26 October 2026: **85 browser tests passed, 0 failed, 0 skipped, 2.7 minutes**, with no retries. Thirteen shipped scripts parsed. The static audit found 13 pages, zero broken links/errors, and the ten existing lesson static-heading warnings; live lesson headings are checked in the browser. Four negative preview identity/integrity checks passed. `git diff --check` and protected-path comparisons passed. Exact independently downloaded preview verification is recorded in the founder handoff. Reproduce application checks with:

```sh
BROWSER_EXECUTABLE_PATH=/usr/bin/chromium npm test
python3 review/check_integrity.py
```

The existing 77 cases remain, with disclosure-opening steps adapted to the simplified UI. Eight focused cases were added: two mobile sequential/keyboard journeys, two explicit resignation confirmations, two pending-microphone close paths, and two dictation cancellation paths. These cover desktop and 320px/390px reflow, focus, alternatives, explicit sending, unscored defaults, all seven decisions, local media lifecycle, ten complete lesson workflows and approved videos. Tests fail on browser JavaScript exceptions.

Reopening **Change goal** keeps native disclosure focus; Tab reaches the goal selector without a delayed focus change. A Chrome 156 CI run exposed that timing bug after Chrome 154 passed locally; it was corrected before the final handoff. CSS switches the visible question immediately, and the keyboard regression checks retain their fast Enter → Tab sequence.

The tools disclosure cancels pending/active microphone use and dictation when closed; late results cannot restart or refill it. Advancing to goal review also stops live dictation/recording. The 90-second limit, consent withdrawal, delete, page hiding/navigation cleanup, playback, no uploads and no persistent response storage remain tested.

The local review wrapper is reused from Issue #4 in [review/local_preview.py](../review/local_preview.py), parameterized for an immutable candidate SHA and independently supplied archive checksum. Its small founder launch block verifies the wrapper itself before execution, then verifies the source archive. It binds only loopback, requires a fresh HttpOnly/SameSite session, rejects foreign Host/Origin and writes, serves an immutable in-memory allowlist, and adds an unreleased/full-source-SHA banner only to HTTP responses. Lesson source bytes are unchanged.

Limits: automated Chromium with synthetic microphone and mocked speech-provider lifecycle; no live external speech service, physical microphone/phone or screen-reader software is claimed as tested. Founder Chromebook access succeeded for the earlier revision; this updated candidate still needs the founder's own opening and interaction confirmation. This is not a full accessibility audit.

## Release boundary

All ten approved lesson files, both approved videos, homepage, unrelated work, dependency declarations and shared browser/CI configuration are preserved. GitHub Pages remains configured to publish `main`; updating this draft branch does not publish the site. No merge, production deploy, paid service, account or billing activation is authorized. Next gate: founder tests the exact unreleased candidate; any later release requires separate explicit approval.
