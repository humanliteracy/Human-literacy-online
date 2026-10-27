# Unreleased Missed Deadline: coordinated founder review

[Draft PR #2](https://github.com/humanliteracy/Human-literacy-online/pull/2) · [Changed files](https://github.com/humanliteracy/Human-literacy-online/pull/2/files). This is the existing static, scripted two-turn prototype. The public website is unchanged. No model, service, backend, account, dependency or payment was added.

## Ownership and continuity

This pass began with a clean `feat/issue-1-communication-coach` at `8d43901bb0936d38b07d8f28bd7e01a4594342c5`, identical to the open draft PR. No other agent was active. The previous changes, evidence, native timing diagnostic, 240 regression tests and local-only preview route were inspected and reused. This is one continuation of PR #2, with no competing implementation. Issue #4's separate local branch remains `04a6f1c9871bca4cc440e8c3e99b0e713c30df7e`.

The founder previously opened an older preview on a Chromebook. Acceptance of this exact updated revision is still pending. Evidence uses only fictional typed inputs and synthetic microphone/provider tests; no founder answers, private register or raw microphone recording are included.

## Conversation corrections

The remaining defect was that a request to explain **my part**, or an offer to explain **risks and needed support**, could fall through to generic clarification or checking facts before a commitment. Jordan now acknowledges those actual topics and invites the explanation before discussing a plan. This does not establish an admission or agreement to work.

| Same learner wording | Before at 8d43901 | This update |
| --- | --- | --- |
| “I want to explain my part.” | Generic unfamiliar-message response | “You want to explain your part in what happened. Go ahead…” |
| “I underestimated the work. I want to explain my part.” | Asked what remains and what the learner can offer next | Hears the explanation before asking for next steps; feedback retains the actual accountability |
| “I will explain the risks and what support is needed so we can agree on next steps.” | Direct wording was unfamiliar; selecting the authored recovery follow-up produced a generic facts/commitment response | Names both risks and support, then invites the explanation |
| “I was waiting for client approval.” | Unfamiliar | Acknowledges this as the learner's account, asks to check the timeline, and does not assign blame or invent a promise |

These are bounded local phrase rules, including contractions and clause guards, not general language understanding. Reported, denied or hypothetical explanations are not attributed to the learner. Unknown wording still gets a natural clarification question from Jordan. Separate educational feedback explains that a person might understand wording this limited script cannot interpret. An unrecognized message is not a failed communication grade.

Refusal, resignation, privacy/treatment boundaries, frustration, personal attacks, threats, pauses and unrelated messages retain their distinct behavior from the prior update. An explanation after resignation, refusal or a pause does not erase that earlier decision. Threats still stop the exchange. Private drafting goals never determine Jordan's response or fabricate spoken commitments.

## Coaching, feedback and simplicity

Help me draft proposes editable goals for the supported explanation topics and supplies three relevant wording alternatives. Only one is initially visible. Choosing wording fills the main draft; only **Say this** submits it. A goal change updates the alternatives without sending. Learners may edit, reject, change direction, refuse or leave.

Accountability drafts reuse the actual action the learner named. For example, “I forgot to send the report” stays that action, rather than becoming an invented missed warning or a different admission. Merely selecting an accountability goal does not establish an admission. Unknown goals retain transparent neutral openers.

Primary feedback inside the optional reflection now shows what the wording communicated, what helped, possible difficulty, **why Jordan might respond that way**, and one improvement. Another interpretation, practice examples and technical matching details remain optional under **Wording and practice detail**. Numerical grades remain disabled. Offers to explain are distinguished from an explanation already supplied; a learner's account is distinguished from independently verified facts. Feedback and the optional action change with the actual submitted wording.

The journey remains two explicit submissions, one takeaway and one optional action. There is no added required screen, dropdown, consent gate or account. Explanation follow-ups ask which part needs explaining instead of immediately suggesting a recovery plan. Optional coaching, recording, rehearsal and detailed feedback stay closed until requested.

| Interaction effort | Before | After |
| --- | --- | --- |
| Type and send a main conversation | Two replies, two explicit **Say this** actions | Same |
| Suggestions | One visible; alternatives on request; selecting fills only | Same |
| Explain my part | Learner needed to rephrase or investigate why it was unfamiliar | Recognized directly; Jordan invites the explanation |
| Explain risks/support using the offered follow-up | Generic facts/commitment response despite the chosen words | Both topics acknowledged; no additional navigation |
| Read why Jordan responded | Open reflection, then open wording detail | Open reflection once |
| Technical matching explanation | Visible before the core reflection fields | Available only inside wording detail |
| Back/Forward, draft transfer, replay | Saved progress and explicit submission | Preserved and tested |

Screenshots show the same synthetic explanation and follow-up at 1120px, 320px and 390px. Before captures carry the full baseline SHA; after captures carry a runtime hash. The capture manifest is checked against the final pinned source archive, not inferred from screenshots. Long optional detail can still require scrolling.

## Automated verification

On 27 October 2026, the full local Chromium suite passed **265 tests, 0 failures, 0 skipped, 0 flaky**, with two workers and zero retries in 266.0 seconds. The 25 new focused cases also passed before the full suite. Both independent standard GitHub CI runs passed all **265 tests, 0 failures, 0 skipped** on runtime source `e943fe25dfeaf4e56fe96a2685283e5a9e258474`: [PR run](https://github.com/humanliteracy/Human-literacy-online/actions/runs/40555369175) and [push run](https://github.com/humanliteracy/Human-literacy-online/actions/runs/40555359190). The review packet includes the native HTML report, per-case results, official CI status and log checksums/excerpts. Evidence-only delivery changes do not alter those runtime files; the final source is independently compared byte for byte.

The prior pass's 239-pass/one-page-load-timeout diagnostic remains historical; it is not this run. The current complete local run has no test failures. During screenshot preparation, a capture helper tried to replay an unfinished scene; the helper now starts that independent capture with a fresh page. No application, browser assertion or time limit was changed for that tooling correction.

The suite preserves all 240 prior cases and adds 25 focused browser cases for explaining a part/role, risks and support, permission and contractions, accountability plus explanation, reported/denied/hypothetical wording, actual account versus verified facts, earlier resignation/refusal/pause, every prepared explanation alternative without goal provenance, exact stated accountability, goal changes, explicit submission, 320px/390px keyboard access, reflow, Back/Forward and replay.

The existing full suite also checks constructive conversations, custom goals, refusals and boundaries, hostility/nonsense, feedback differences, historical score regressions, injection-like input, zero answer storage, focus, contrast samples, reduced motion, 200% text, all ten lesson workflows and approved media. Recording tests use Chromium's synthetic microphone to actually encode, play and delete local audio, end tracks, revoke URLs, stop at 90 seconds, cancel delayed permissions and finalization, and clean up on consent withdrawal, navigation and closure. Browser speech recognition uses deterministic provider simulations; separate consent and external-browser processing disclosure remain unchanged.

Static verification: 14 shipped JavaScript scripts parse; 13 HTML pages have zero broken-link/errors. Ten pre-existing static H1 warnings refer to JavaScript-created lesson headings, whose live behavior is exercised by browser tests. Seven negative preview integrity checks reject invalid identities/checksums, corrupt/truncated source, tampered packet, traversal and missing manifests before opening a socket/browser. No assertions, time limits, retries, test configuration, dependencies or workflow were relaxed.

Developer reproduction:

```sh
npm ci
npx playwright install --with-deps chromium
npm test
python3 review/check_integrity.py
```

System-browser alternative: `BROWSER_EXECUTABLE_PATH=/usr/bin/chromium npx playwright test`. The shared suite remains two workers, zero retries.

## One independent local review

Use the pinned Python launch block in PR #2 or the founder handoff on the Chromebook's existing Linux Terminal. Open its printed private link in Chrome **on that same Chromebook**, then choose **Open the simulator**. The prominent **UNRELEASED · LOCAL REVIEW** banner shows the exact full revision. Keep Terminal running; Ctrl+C stops the preview. There is no public preview deployment, GitHub login, package install, new permission or paid service.

The existing Issue #4 launcher is unchanged: full-SHA source pinning, launcher and archive SHA-256 checks, immutable in-memory allowlist, loopback-only binding, fresh per-launch HttpOnly/SameSite session, Host/Origin/cross-site/write rejection, and nested review-packet checks before opening. A cloud-local localhost link cannot open on the founder's Chromebook; the verified launch route creates the link on that Chromebook instead.

**View the review packet** opens the before/after desktop/mobile/reflection images, interactive browser report, result counts, source hashes and silent synthetic walkthrough in the same authenticated local session. No extraction or file:// pages are needed. Report theme preference is isolated from the simulator's zero response-storage checks. [A ZIP copy](../review/evidence.zip) is optional. No new hosting or artifact-retention workflow was introduced; existing CI failure artifacts retain their seven-day policy.

Independent delivery verification runs the exact founder paste block twice in separate Python processes/browser sessions. It checks the authenticated entry route, exact source bytes and all ten lessons, JS/CSS and media, review-packet checksums and rendered report, desktop/320px/390px keyboard and interaction flows, absence of external simulator requests/answer storage, and endpoint shutdown. The resulting full-SHA verification report and archive checksum are recorded with the final handoff in PR #2. Founder acceptance of that exact revision remains pending.

## Limits and three founder checks

This remains a two-turn scripted example. Arbitrary unfamiliar language, actual workplace facts, legal rights and real manager reactions cannot be interpreted or predicted reliably. Typing always works without microphone consent. Local recording never transcribes or uploads. Optional browser dictation is separate and may send live speech to the browser provider; it can fail or stop early. No physical microphone, live dictation provider, real screen-reader session, complete WCAG certification or founder test of this exact revision is claimed.

Only a short final acceptance check is requested:

1. Say “I want to explain my part,” then explain a fictional timeline. Check Jordan listens; use Back/Forward and read the takeaway.
2. Try one refusal or confirmed resignation. Check it stays your choice, without a forced commitment or score.
3. Change a private drafting goal to explaining risks/support. Check the wording, explicit **Say this**, and optionally record/listen back.

Then stop for founder review. PR #2 stays draft; no merge, public release, deployment or spending is authorized. All ten approved lessons/media, homepage/support, dependencies, shared tests configuration and CI workflow are unchanged. Public main remains `bcb4e4f0a2b1f363b829a47c8c78e59bec4d2e10`.
