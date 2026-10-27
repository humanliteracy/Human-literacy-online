# Unreleased Communication Coach review candidate

Draft PR: <https://github.com/humanliteracy/Human-literacy-online/pull/2> · [Changed files](https://github.com/humanliteracy/Human-literacy-online/pull/2/files). This is a scripted, static prototype. It has no AI model, backend, account, paid runtime dependency or automatic assessment service.

## Ownership and previous work

The resumed checkout was `feat/simulator-quality-review`, based on PR #2 head `e43dbe71008b97cf649c513db66e0d23d20f109a`, with substantial uncommitted work from the previous quality review. Its saved serial regression run completed **178 passed**. Earlier saved runs included 174/176 (two real state/phrase bugs, corrected), and 175/178 (two local browser-driver timeouts and one case-sensitive expectation). The implementation, original 85-case suite, speech/a11y/state additions and capture tools were inspected and reused. No competing agent or worktree was active. Following the latest founder instruction, logical commits continue in the existing draft PR #2 by fast-forwarding its head; no competing Coach PR is created. The prior task's wall-clock duration is not an independent acceptance result; the saved changes and machine-readable test artifacts establish what completed.

Issue #4's separately owned local branch `design/issue-4-independent-preview` remains at `04a6f1c9871bca4cc440e8c3e99b0e713c30df7e`. Its loopback preview wrapper is reused, rather than introducing hosting or a competing preview platform. The founder confirmed Chromebook access to the earlier revision, but reported complexity. Acceptance of this exact updated candidate is still pending. E18's interpretation here comes from the founder's supplied review; the private Master Project Register has not been independently retrieved or included in public evidence.

## Changes and audit findings

| Priority | Finding | Result |
| --- | --- | --- |
| High | Main suggestions submitted automatically | Selection now only fills and focuses an editable draft. Only **Say this** submits. The same rule applies to optional Coach transfers. |
| High | “I will not send an update” could trigger praise and a 94/100 grade | Conservative phrase matching recognizes refusal; unrelated/ambiguous wording gets an honest clarification fallback. Unsupported numerical scoring and its opt-in control are removed. |
| High | Resignation, refusal or privacy boundaries could be treated as recovery-plan agreement | Explicit decisions remain context. Resignation confirmation is acknowledged; no forced agreement, disclosure or acceptance of work. Follow-ups reflect the selected or established path. |
| High | Reported/denied statements could be praised as accountability | Matching checks the phrase's own clause. Denied/reported responsibility, requests and refusals do not become the visitor's admission; a direct threat in a later clause is still recognized. |
| High | Lost draft edits, stale goal wording and silent turn resets | Cached goal/alternative drafts survive backward editing; changed paths update proposed goals. Transfers during turn two retain that conversation. An overwritten reply can be restored. Explicitly clearing a goal is respected. |
| High | Dictation could duplicate final results, overwrite later typing or hang | Final result indices are consumed once per session; typing cancels recognition; stale callbacks cannot refill fields. Clear errors, no-word recovery, a 60-second dictation cap and bounded stop wait retain typing access. |
| High | Focus visibility/control contrast and long-goal reflow | Darker focus/borders, hover text and speaker text; wrapping for long literals. Empty replies expose an associated accessible error. Logical focus after advancing and restoring progress. |
| Medium | No conversation Back/Forward | In-memory snapshots restore prior replies, unfinished drafts and completion. Forward never sends. Editing an earlier draft preserves valid later progress until **Say this** deliberately replaces its dependent replies. |
| Medium | Too much concurrent reading | One question, one suggested response, alternatives on request. Recording, dictation, rehearsal, interpretation and detailed feedback remain optional disclosures. Finish shows one takeaway and one optional practical action. |

A threat pauses the exchange; a later work-plan phrase does not erase it. Profanity alone is separated from a personal attack. Scope disputes, help requests, breaks, contradictions, uncertainty, blame, boundary-setting and unfamiliar wording have distinct limited responses. Exact authored options can supply provenance only when the wording still matches; edited/custom wording is not trusted merely because it contains a keyword. This remains bounded scripted interpretation, not natural-language understanding or prediction of real employment outcomes.

Optional feedback explains communicated wording, normalized phrase evidence, a constructive element, possible difficulty, why Jordan responds, a skill, another possible interpretation and a comparison example. It retains unresolved questions and possible consequences. It does not grade ability/personality, guarantee success, or require agreement. Qualitative feedback is available to all; numerical grades are disabled entirely.

## Before and after: revision e43dbe7

| Task | Before | Updated candidate |
| --- | --- | --- |
| Choose a main suggestion | Immediately submits; cannot review first | Fills an editable draft, then **Say this** submits |
| Default two-reply route | 2 clicks, both implicit submissions | 4 deliberate clicks: select → Say this, twice |
| Type both replies | Two text entries + 2 Say this clicks | Unchanged |
| Coached two-reply route | Help → Next → Use goal → Use wording → Say this → follow-up (auto-sends) | Same route plus explicit Say this for the follow-up: 7 clicks + expression entry |
| Review prior work | Restart/re-enter or inspect transcript | Back/Forward restore saved stages and drafts, without sending |
| First-turn visible response choices | One suggestion plus expandable alternatives | Preserved; follow-up suggestions now reflect earlier decisions |
| Reflection | Takeaway/action, with optional numeric grade | Takeaway/action; optional evidence and consequences, no numerical grade |
| Negated “update” example | False recovery-plan praise and 94/100 | Refusal is acknowledged; no work agreement inferred |

The extra deliberate sending click is intentional consent, not an efficiency regression to hide. Back/Forward are shown only after a reply is submitted. Advanced features are unnecessary for the default journey. All alternatives remain accessible through native disclosures. Historical 94/88/67/56/48 inputs are preserved in focused complete-conversation regressions, now requiring explanatory feedback and no grade.

## Automated validation

On 27 October 2026, two complete serial Chromium 154 runs each passed **190 tests, 0 failed, 0 skipped**: 203.7s and 238.5s. No retries. Both used final runtime code frozen at `cbe6217f7e80577bc2d10234bea81a71507b624f`. An intermediate repeat had **189 passed, 1 total-test timeout, 0 skipped** (276.7s). Its trace shows widespread local browser/driver delays, including simple field reads taking 3–5 seconds; correct resignation states and no JavaScript exception were observed before the 30-second budget expired. That diagnostic is retained. Assertions, retries and time limits were unchanged. This local instability is reported rather than counted as a pass.

Both independent GitHub CI runs also passed **190/190** with Chrome for Testing **156.0.8078.4**, two workers and the unchanged workflow: [push run](https://github.com/humanliteracy/Human-literacy-online/actions/runs/40499293838) and [PR run](https://github.com/humanliteracy/Human-literacy-online/actions/runs/40499297402). Fourteen shipped scripts parsed; static audit and four negative preview-integrity checks passed. Full results and the interactive HTML report are in the packet. Final delivery checks are linked from PR #2; runtime hashes connect the captured/tested code to that exact delivery revision.

Developer reproduction: `npm ci`, `npx playwright install --with-deps chromium`, `npm test`. To use the installed system browser locally: `BROWSER_EXECUTABLE_PATH=/usr/bin/chromium npx playwright test --workers=1`. Founder preview needs only Python, not this development toolchain.

Original 85 browser cases are retained. Their intentional changes replace automatic-choice submission with selection plus Say this, and numerical expectations with meaningful qualitative fields. No test is skipped or weakened to hide an unresolved failure; no retries or increased timeouts were added. New coverage includes complete speech-act conversations, selected/typed equivalence, decision context, privacy cleanup including hidden feedback, cached edits, long goals, draft restoration, navigation, negative speech-provider lifecycle, keyboard access, contrast samples, reduced motion, injection literals and mobile reflow.

The static audit checks 13 pages with zero broken links/errors. Its ten pre-existing static H1 warnings are from lesson headings created by JavaScript; full lesson workflows and live headings are covered in browser tests. Four preview negative checks reject malformed identities/checksums and corrupt/truncated bytes before binding or opening. Dependency audit: zero known vulnerabilities; no package/lockfile/workflow or runtime dependency change.

Accessibility checks target WCAG 2.2 AA behavior: labels, landmarks, unique IDs, accessible errors/status, visible focus, keyboard-operable disclosures and navigation, sampled contrast, reduced motion, 44px control targets and wrapping at 320/390/768/1120px including 200% root text size. These are focused automated checks, not certification. Browser zoom/assistive technology combinations and real screen-reader output need human evaluation.

## Review packet and independent preview

[Download the committed review packet](../review/evidence.zip). Unzip it and open `index.html`: desktop/tablet/320px/390px screenshots, labelled before/after evidence, test results, Playwright HTML report, a synthetic typed-only trace, a silent walkthrough, runtime integrity manifest, limitations and the three founder checks. Screenshots display an unreleased identity; simulated voice failures are explicitly marked simulated. No founder responses, private register material or microphone recordings are included. The trace records only synthetic typed work.

Use the pinned launch block in the founder handoff on the Chromebook's existing Linux Terminal with Python 3.9+. It verifies the wrapper SHA-256 before executing, then checks the complete immutable GitHub source archive against a separately supplied SHA-256. No GitHub authentication, npm, account, paid hosting, CI artifact download or new permissions are needed. Keep Terminal running; open its printed link in Chrome on that same Chromebook. The browser shows **UNRELEASED · LOCAL REVIEW** and the full source revision. Ctrl+C stops it. The first download needs internet access to public GitHub; the loaded simulator itself makes no external request unless separately consented browser dictation is chosen.

The wrapper binds only `127.0.0.1`, with a fresh launch token and HttpOnly/SameSite=Strict session, foreign Host/Origin/cross-site rejection, read-only methods, no-cache headers and an immutable in-memory allowlist. Only the source site and synthetic evidence are served. No git metadata, credentials, arbitrary filesystem or private materials are exposed. The response-only revision badge does not alter lesson bytes. Recordings are local, consent-based, time-limited, never automatically played or transcribed, deleted on closing the tools/navigation, and never uploaded by the site. Browser dictation is separately consented and may use the browser provider's service; it is not a local recorder or an AI service added by this project.

The source archive is the persistent review delivery route; this packet does not require a new CI workflow or artifact charge. Existing CI failure artifacts retain their existing seven-day policy. It is not described as a new persistent CI artifact. Library/Drive delivery is unavailable in this environment; verified GitHub source plus a locally served/downloadable packet provides the independent route.

## Limits and founder acceptance

Automated Chromium and simulated media/provider events do not demonstrate physical microphone quality, actual Chromebook speech recognition, live speech service reliability or screen-reader output. Record and listen back remains usable independently of dictation; typing is always available. No end-to-end live speech claim is made. Scripted language coverage is deliberately limited, so unfamiliar language can trigger clarification even when a person would understand it. The simulator has two conversational decisions; it is not a general conversation engine or employment adviser.

Only three founder checks are requested, using synthetic examples:

1. Complete one main conversation. Select wording, edit if desired, explicitly Say this, use Back/Forward, finish and read the takeaway.
2. Retry with a refusal/resignation or unexpected/hostile phrase. Confirm the response respects the decision and does not invent a grade or agreement.
3. Try one optional Coach or recording/listen-back feature. Check that the distinction between a private draft and a submitted reply is clear.

Report only whether these felt simple and whether any behavior was wrong; no repeated feature-by-feature technical testing is required. Engineering checks precede founder acceptance; later merge/public release requires separate explicit authorization.

## Release status

Unreleased draft review only. All ten approved lessons, both videos, homepage/support, shared test configuration, dependencies and CI workflow remain byte-for-byte unchanged from e43dbe7. Public `main` remains `bcb4e4f0a2b1f363b829a47c8c78e59bec4d2e10`; GitHub Pages remains on main. No merge, public deployment, paid service or spending is authorized or performed.
