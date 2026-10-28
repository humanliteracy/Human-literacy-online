# Unreleased Communication Coach — resignation fidelity review

This continues the existing draft PR #2 on `feat/issue-1-communication-coach`. The starting workspace was clean at `52568d36983a84870384dbb3dd61a03a4395d349`; GitHub confirmed the same branch, an open draft and no auto-merge. No earlier work was overwritten. Issue #4's established local preview launcher is reused unchanged.

## What changed

The founder's goal — **resign effective immediately, without negotiating continued employment or performing further project work** — previously became a generic resignation suggestion. The automatic proposal also dropped the details, and “I am resigning effective immediately” could miss the narrow resignation pattern entirely. A secondary privacy boundary could take precedence over the employment decision.

The confirmed resignation goal now retains the original wording and conditions. All three editable suggestions preserve it; the additional options only request offboarding information. A bounded conversion from “I want to resign/quit/leave my job…” to “I am resigning…” preserves the complete suffix. No reason, handover promise, responsibility or willingness to negotiate is added. A changed written goal (including a break or stop request) takes priority over a stale resignation selector, and the transferred draft shows the actual private goal rather than just its category. Generic authored resignation examples no longer invent reasons or a willingness to hand over work.

Jordan acknowledges the employment decision before addressing another work/privacy limit. Familiar explicit timing, finality and project-work restrictions appear in his response and the final takeaway. A later confirmation, process question, work refusal or stop request retains the established resignation and conditions. Asking for a break, refusing a task, discussing different terms, ending the conversation and resigning remain distinct. Edited submitted words control the outcome even when they differ from a private drafting goal.

Feedback describes the stated decision and supported conditions, without calling resignation merely a refusal or inviting reconsideration. The comparison example no longer advises a definitive resigner to replace hypothetical uncertainty. Offboarding remains separate from accepting project work. Applicable contractual, administrative and legal obligations still need checking; the prototype does **not** determine those obligations or imply that resignation eliminates them.

## Interface and effort

| Control or step | Before → after |
| --- | --- |
| Optional goal selector | One → one; no new dropdown or forced step |
| Proposed resignation goal | Generic purpose → original wording and conditions |
| Visible wording | One suggestion, two optional alternatives → same access and keyboard order |
| Editable suggestion | Generic resignation → confirmed conditions retained in every option |
| Transfer | Use this wording fills a draft → unchanged; never sends |
| Submit | Explicit Say this → unchanged; visitor can edit or reject |
| Optional follow-up | Finish here or another reply → unchanged; confirmation retains the original conditions |
| Completion | One takeaway and optional action → same structure, specific to the submitted decision |
| Detailed feedback and media | Optional → optional; separate consent/privacy and cleanup preserved |
| Long writing | Expression allowed 2,000 characters but downstream fields allowed only 600 → goal supports 2,000, wording/reply/rehearsal support 2,400 including an optional process question |

The normal coached route still uses **Next → Use my goal → Use this wording → Say this → Finish here**: five actions after typing, one actual learner submission. The old generic proposal could require choosing the resignation path and retyping the goal; the supported explicit resignation now carries it forward. Main free typing remains the fastest route: type → Say this → Finish here. Navigation reviews progress without restarting or submitting.

The packet contains **36 synthetic screenshots**, 18 before and 18 after, at 1120px, 320px and 390px. Each width captures the proposed goal, editable wording, unsent transferred draft, manager, takeaway and optional reflection. Both versions receive the same confirmed founder scenario; the before captures use immutable `52568d3`. Screenshot manifests include exact runtime hashes, visible controls and wording, not just captions.

## Automated results

Full-suite source: `6907f72a648dfe2d60028f1ed3e3b632bbc6ad14`. Last Coach runtime change: `9af25c31f8585600ba83358e173deda2589fdaf8`. The final delivery adds review evidence only; captured runtime and tests must match this revision and the exact delivery SHA verified by the launcher.

Final full regression: **353 passed, 0 failed, 0 skipped, 0 flaky**, two workers, zero retries. This is a complete **native local Playwright run**, not the previous CI-only result. The packet includes its original searchable HTML report and per-case results. All 318 previous cases remain, with 35 focused resignation-fidelity additions. Old coaching/mobile assertions now expect the founder's actual original “I quit” goal rather than a generic resignation purpose, and the keyboard test names the new information-request alternative. Navigation assertions now check offboarding information and retained resignation rather than the superseded notice/handover suggestion.

Coverage includes:

- Effective-immediately resignation through goal proposal/confirmation, all alternatives, editable transfer, explicit send, Jordan's response, Finish here and final feedback.
- Wording variations, immediate/today/tomorrow/ISO-date timing, finality, no further project work, ordinary resignation without invented conditions, source text longer than 600 characters and unfamiliar conditions retained verbatim.
- Later confirmations, work refusals, process questions and stop requests; Back/Forward restoration and unsent drafts; changed goals, uncertainty and a pause overriding the selected resignation path.
- Distinct refusal, negotiation, pause, stop, resignation, negation, reported speech and hypothetical/conditional wording. Quoted restrictions and conditional restrictions are not attributed as unconditional finality.
- Desktop/320px/390px reflow, keyboard access to alternatives and transfer, correct focus, one visible suggestion, no horizontal overflow or automatic submission.
- Existing hostile/vulgar/unknown input, explanations before planning, accountability, realistic proposals, replay, privacy cleanup, all ten lessons/media, no grades, synthetic recording/playback/deletion, consent races and deterministic browser-dictation tests.

The first targeted diagnostic had 46 passes and two failures: the old generic-goal assertion and a later “perform further project work” phrase not recognized as refusal. The assertion now checks actual goal retention; the phrase has a bounded refusal rule and regression coverage. A subsequent focused run passed 53/53, followed by four more goal-fidelity cases. An intermediate full run was deliberately stopped after six failures: a missing offboarding label, two lost explanation-context assertions, a private-purpose conversion error, and two obsolete mobile wording/label assertions. It recorded 213 passes, two interrupted cases and 130 not run; it is a diagnostic, not a passing run. The behavior was corrected and the wording assertions updated; the affected five test files then passed 177/177. Another run was deliberately stopped with 221 passes and no observed failures to cover a newly found stale-selector edge; 130 cases were incomplete/not run, not counted as passes. The final 35-case fidelity file passed before the last full run, which also verifies the actual private goal displayed beside the transferred draft. That complete run passed 350 cases and failed three navigation checks at an obsolete suggestion-word assertion; the assertion was corrected to require offboarding information and preserved resignation before the final full run. Navigation behavior was not changed to satisfy it. No retries, time limits, shared test configuration, dependency or CI workflow were relaxed.

Static verification: all 14 shipped JavaScript scripts parse; all 13 pages have zero broken links/errors. Ten existing static H1 warnings concern lesson headings created by JavaScript; lesson behavior remains browser-tested and those approved pages are unchanged. The seven existing integrity rejection checks pass before opening any listener/browser.

## One independent local preview

Use the exact pinned launch block in draft PR #2 or the founder handoff in the Chromebook's existing Linux Terminal. It needs Python 3.9+ and internet for one public source/evidence download, but no GitHub login, npm, new service or paid dependency. Open the printed private link in Chrome **on the same Chromebook**, choose **Open the simulator**, and check the full SHA in the **UNRELEASED · LOCAL REVIEW** banner. Keep Terminal running; Ctrl+C stops the local server.

The unchanged Issue #4 launcher is separately checksummed, verifies the complete immutable source archive, then binds only to loopback. It uses an in-memory file allowlist, fresh HttpOnly/SameSiteStrict session, Host/Origin/cross-site/write rejection and nested packet hashes. It serves no credentials, repository metadata, private founder answers, raw recordings or private Master Project Register materials. The download contains existing public source and synthetic review evidence.

**View the review packet** opens the before/after desktop/mobile/reflection images, native test report, per-case results, runtime manifest and this report in the same authenticated session. No ZIP extraction or file:// access is required. A [ZIP copy](../review/evidence.zip) remains optional.

The exact handoff is independently tested in two fresh launcher processes/browser sessions. Delivery checks compare all ten lesson pages, main/support/simulator HTML, JavaScript/media and packet bytes to the pinned Git revision, validate screenshot hashes, open the report and exercise desktop/320px/390px keyboard, closure, resignation, draft restoration and no-grade behavior. The simulator stores no answers in browser storage or cookies and sends no outside browser requests during these typed checks. Stopping the launcher closes the endpoint.

## Limits and founder acceptance

This is explicitly a **scripted prototype**, not live AI or arbitrary natural-language understanding. Preserving a phrase verbatim does not mean the script understood it. Supported resignation timing covers immediately, today, tomorrow and an ISO date, with the tested declaration forms. Unsupported dates, uncommon paraphrases, complex nested conditions, sarcasm, reported speech and multilingual wording may still be missed. Unfamiliar conditions remain in the editable draft and transcript; the script does not claim to have accepted or resolved them. An actual person may understand wording the script cannot interpret.

No live AI, external transcription dependency, backend change, provider key, account or paid service was added. Broader conversational interpretation would need a separate architecture/privacy/cost decision; it is not required to review this build. Physical microphone quality, live browser speech-provider behavior, actual screen-reader output and full WCAG conformance remain human checks. Existing automation uses synthetic media and deterministic speech-provider simulations. Dictation remains separately optional and disclosed as possible browser-provider processing; typing and local recording do not require it.

Three short founder checks:

1. Help me draft: enter the explicit immediate, final resignation and no-further-project-work conditions. Confirm every suggestion retains them.
2. Use this wording, optionally edit, then Say this. Confirm Jordan acknowledges resignation and the conditions; choose Finish here and read the takeaway.
3. Use Back/Forward without sending. If you edit the reply to request a pause instead, confirm the actual submitted decision controls the outcome.

No new product, service or architecture decision is needed for this local review. Founder acceptance remains pending. PR #2 stays draft with no auto-merge; all ten approved lessons/media, homepage/support, dependencies, shared test configuration and CI workflow remain unchanged. Public main is protected. Nothing is merged, publicly deployed, released or purchased.
