# TEAL v0.1-rc1 — bounded release candidate

Prepared for the founder's separate final publication decision. PR #5 stays **draft, open and unmerged**. No production change, promotion, external posting, purchase or service activation is authorized or performed by this revision.

The founder's creative/content acceptance covers `9bcdda0934c76a44477560865c161794c585be49`; E85 documented the release corrections. This candidate preserves that accepted artwork, both founding-letter articles and all three humanitarian-goal articles. The exact revised commit, current main, CI links and rollback rehearsal result are recorded in the PR revision description and the existing Master Project Register. Recheck those identifiers at the decision; do not approve an unspecified future head.

## What changed

| E85 blocker | Bounded correction |
| --- | --- |
| Draft/noindex shipping state | Removed review strip, unpublished/proposed release labels and noindex from the two product reading pages. Opening height compensates for the removed strip; artwork and editorial composition are retained. Philosophy/evidence caveats remain. |
| Canonical sharing | Real HTTPS TEAL route and its `index.html` form share only the fixed canonical `/Human-literacy-online/teal/` URL. No query, fragment, preview address, or similarly named host can be shared. Preview/file/HTTP locations remain text-only. No approval flag falsely asserts release permission. |
| Homepage entry | One ordinary, keyboard-accessible TEAL link after the existing homepage introduction. No existing headline, lesson/simulator link, functionality or dependency changed. |
| Malformed plain text | Standard-library exporter preserves paragraph and explicit line breaks, decodes HTML text and omits footnote digits. `founding-letter.txt` matches the accepted HTML's wording. Run `python3 review/teal/export-letter.py --check`. |
| Maintenance owner | Shawn, TEAL founder, is the named accountable resource/corrections editor in `sources.json` and the page. His separate publication decision accepts that responsibility; this does not claim prior acceptance of new recurring work. |
| Final verification | Focused preservation/sharing checks, existing static/syntax checks, targeted browser review and fresh exact-head GitHub regression CI. Results and limits must be read together. |

## Resource and correction ownership

**Accountable editor and publication/rollback decision owner: Shawn, TEAL founder.** Assistants can perform requested checks and prepare changes; no other person, volunteer, partner or permanent monitoring service has been appointed. No automatic reminder, account, collection or recurring expense was created.

Four official public entry pages were rechecked on October 28, 2026 (America/Chicago): [211](https://211.org/), [HRSA's health-center explanation](https://bphc.hrsa.gov/about-health-center-program/what-health-center), [OpenLearn's course catalogue](https://www.open.edu/openlearn/free-courses), and [UNHCR HELP](https://help.unhcr.org/). The landing pages were readable; no local search, call, intake, appointment or course completion was submitted. Existing geographical, eligibility, cost and account limitations remain unchanged. Rechecking landing pages does not prove assistance is currently available to a particular person.

The editor's bounded procedure:

1. Before release, on a reported problem, and at least every 90 days while listed, open each official page and check destination, stated audience, access/cost caveats and material changes. Proposed next review is January 26, 2027; no reminder was scheduled.
2. Record checker/date, official URL, scope, result and limits in `sources.json`. Never advance a checked date automatically or label an untested local service verified.
3. A correction can use the existing public GitHub tracker, clearly identified as public and account-required. No sensitive personal, medical or financial details belong there. Receiving help does not depend on filing an issue or joining TEAL.
4. Pause/remove a broken, misleading or materially changed referral until reverified. If capacity to maintain it is unavailable, remove the entry or explicitly mark the dated information unavailable for current reliance. No fixed response time is promised.
5. Prepare a small reviewed correction PR and obtain normal publishing approval. Record what changed and why; do not silently rewrite approved philosophy or claim provider endorsement.

The founder should include acceptance of this editor role in the final publication decision, or name another willing verified owner before release. This is the only proposed accountable owner; no outside outreach is implied.

## Targeted human accessibility and device checks

These are concrete instructions, **not completed human-test claims**. The desktop QA helper cannot establish physical-phone, ChromeVox/TalkBack or native share-sheet behavior. Do not claim WCAG 2.2 AA certification. Keep Issue #4 separate.

Use the exact candidate checkout in a browser. For a local route, use the repository's existing preview instructions or the existing authenticated loopback launcher after verifying it serves this exact checkout; this revision does not change that launcher or assert a new delivery setup. A local Chrome server is sufficient for keyboard/zoom; native sharing may need an actual secure permitted review environment. Do not publish a staging site to obtain these results without authorization. An obscure/public preview URL is not private.

| Human check | Steps | Pass condition / record |
| --- | --- | --- |
| Physical Chromebook keyboard | Open homepage; Tab to the single TEAL entry and press Enter. Tab to skip link, symbol and alternative link; activate each. Navigate back to the symbol, open one reflection and one evidence disclosure, then follow LEARN and PRACTICE. | Visible focus; logical order; letter heading is reachable/announced and not covered by navigation; no trap; original lesson list and simulator still work. Record browser/OS, route and result. |
| Physical phone | Open portrait and landscape; scroll through full letter, goals, action choices and footer. Tap symbol, alternative link, simple reading view, homepage return and one lesson. | No clipped essential wording, overlap, obstructed control or unintended sideways page scrolling. The symbol retains all three hearts. Record device/browser and screenshots only if useful and non-sensitive. |
| ChromeVox or TalkBack | Enable the device's screen reader. Read page title, landmarks and headings. Activate the named symbol link and alternate text link. Expand one disclosure; reach resource caveats and sharing fallback. | Meaningful link names, correct heading order, no duplicate decorative-image narration, focus/expanded-state announcements and usable controls. Do not equate a DOM accessibility tree with this physical test. |
| 200% text / zoom and narrow reflow | On Chromebook use browser zoom to 200%; also test a narrow window near 320 CSS px. On phone enlarge text using the supported browser/device control. | Complete message and all controls remain reachable; no two-direction page scrolling for prose, overlap or navigation hiding the focused target. Helper root-font testing is supporting evidence only. |
| Reduced motion / contrast mode | Enable real OS/browser reduced-motion preference, reload, activate entry. If available, check high-contrast/forced-colors mode. | No required animation; instant/comfortable navigation; symbol has a usable text alternative and visible focus. The QA motion override is not proof of the OS preference. |
| Sharing and cancellation | In an allowed review environment choose Copy and Share. Cancel the native sheet. Deny clipboard permission if practical; use manual selection. On previews confirm text only. | No unexpected send, retry or preview URL; cancellation is respected; selectable text fallback works. Public canonical URL behavior is covered synthetically before release and must be smoke-checked after authorized deployment. |

Record: candidate SHA, date, tester/device/OS/browser (no unnecessary identity), test name, pass/fail/not-run, concise observation and any fix. A blocking access failure keeps publication on hold. Do not recruit testers, send invitations, collect personal stories or enable analytics as part of this assignment.

## Current engineering verification and limits

- Local correction-pass results: **27 focused checks passed**; the existing audit scanned **16 HTML pages with 0 broken local links/errors**, retaining the 10 existing dynamic-lesson H1 warnings; **16 scripts parsed**. Real-browser QA passed the homepage entry, simple reading route, alternative-entry focus (settled heading top ~96px below 74px navigation), copy fallback, all ten lesson links and simulator loading. Reflow measurements passed 320/390/768/1440px content widths and 200% root text at 320px; no-JavaScript disclosure state and responsive image loading were verified. These results apply to this source tree; the PR record binds it to the final remote SHA.
- The focused checker covers 27 preservation, faithful-export, resource, privacy and public/preview/spoofed sharing cases. It proves 87 original files unchanged plus only the specified homepage block; all seven approved art assets and both founding articles are preserved.
- The existing static audit and JavaScript parser are rerun for this revision; retain the ten known dynamic-lesson H1 warnings as historical, without relabeling them fixed. CI runs the unchanged 356-test browser suite. Final counts, links and exact head belong in the PR revision record after completion.
- Browser QA checks homepage placement/routing, symbol/alternative focus, simple letter, clipboard fallback, source/asset loading and 320/390/768/1440 content-width reflow. Desktop frames are not physical devices. Canonical-host success/error/cancellation behavior uses synthetic capabilities because the candidate is not deployed.
- Existing canonical/OG metadata points to the intended final route and unchanged 1200 × 630 social artwork. Verify local asset delivery, image dimensions and meta values now. Real Facebook/other destination crawler rendering, final public response/headers, actual-phone native sharing and production performance cannot be certified before deployment. These are explicitly pending release/smoke-check items; no social upload or announcement is needed or authorized here.

## Verified rollback method and owner

**Owner: Shawn, founder/repository owner; an authorized repository maintainer may prepare the revert.** No maintainer other than the founder is presumed appointed. Any production revert/merge still requires the applicable explicit founder instruction; this task does not execute one.

Baseline verified before this correction pass:

```text
main commit: 442e813e8ff81abe53f32e01fd4bc6210cb06b15
main tree:   6f289e92a0e857d9066dcf0ab24286bb40fd4e70
accepted TEAL v0.1 head: 9bcdda0934c76a44477560865c161794c585be49
```

The local rehearsal uses the candidate's complete binary-capable diff against this baseline in a disposable detached worktree. It reverse-applies that diff, stages the result, and compares the **entire Git tree** to the baseline. This checks removal of TEAL additions and exact homepage restoration, including asset bytes. It performs no merge, main reset/force-push, deployment or public rollback. Exact candidate-tree and restoration results are recorded with the final revision.

Reproduce from a clean checkout; `CANDIDATE_SHA` must be the verified PR #5 head, `rollback_check` must be a new disposable directory, and the patch belongs outside the source tree:

```sh
git diff --binary --full-index 442e813e8ff81abe53f32e01fd4bc6210cb06b15 "$CANDIDATE_SHA" > /tmp/teal-release-change.patch
git worktree add --detach rollback_check "$CANDIDATE_SHA"
git -C rollback_check apply --reverse --check /tmp/teal-release-change.patch
git -C rollback_check apply --reverse /tmp/teal-release-change.patch
git -C rollback_check add -A
git -C rollback_check write-tree
```

Expected tree: `6f289e92a0e857d9066dcf0ab24286bb40fd4e70`. Do not copy these commands onto production `main` or an existing working directory with unrelated changes. Remove only the specifically created disposable worktree after inspection; do not prune or delete other worktrees.

After a separately authorized production release, if a serious regression occurs:

1. Record the actual merged PR/merge method, merge SHA, deployment and current main. Stop further publishing. If anything later changed, preserve it; do not reset main to the old baseline.
2. Prefer GitHub's **Revert** for the released PR to open a new rollback PR. Inspect its inverse diff; run relevant checks. For a merge commit, an authorized maintainer can prepare `git revert -m 1 ACTUAL_MERGE_SHA` on a new branch; for a squash use the actual squash commit. Do not guess these IDs or select the wrong parent.
3. If no intervening changes exist, the rollback tree must equal the verified baseline. With later work, require a scoped TEAL inverse that retains those changes; a blanket baseline reset is prohibited.
4. Obtain the required founder rollback merge/Pages authority, then verify the reverted public homepage, all ten lesson links, lesson navigation, simulator/Coach, support and media. Confirm the TEAL entry is gone; account for browser/CDN caching and record the actual post-revert revision.

The rehearsal verifies source restoration, **not a real GitHub merge/revert or Pages recovery**. No public rollback was run.

## Public source inventory and final decision

If this candidate is later approved and merged, the public diff contains the one homepage entry, `teal/` pages/artwork, `docs/teal/` source and release records, and `review/teal/` QA/export helpers. The viewport helper remains explicitly noindex and is a test tool, not a visitor step. Historical proposal/quality docs stay labeled by revision; private register records and personal data are not copied here. Noindex does not make any source private.

Immediately before an authorized publication action, re-read PR head/base, draft status, current main, diff and all checks. If any head, base or content changes, stop and rebind the decision to the new exact revision. Record remaining human-test results and owner acceptance. The founder's explicit final statement must identify the exact release SHA and authorize merging into `main`, understanding that GitHub Pages publishes automatically. Keep PR #5 in draft until that separate instruction; no promotion, external messages, translations, analytics or spending follows implicitly.
