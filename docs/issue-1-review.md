# Unreleased Missed Deadline: decisions, endings and founder acceptance

[Draft PR #2](https://github.com/humanliteracy/Human-literacy-online/pull/2) · [Changed files](https://github.com/humanliteracy/Human-literacy-online/pull/2/files). One coordinated continuation of the existing static, scripted prototype. The public website is unchanged. No model, account, backend, service, dependency or payment was added.

## Ownership and consolidated acceptance

Work began with a clean `feat/issue-1-communication-coach` at `edb50d3b3c6abfae7f21e5cd8f4a19c30ed782e5`, identical to the open draft PR. No other agent was active. The previous task's dialogue, 265 browser tests, evidence and latest authenticated local-review route were inspected and reused. The preceding duplicate CI job subsequently completed successfully; it is no longer pending. Issue #4's separate local branch remains `04a6f1c9871bca4cc440e8c3e99b0e713c30df7e`. No competing implementation or preview service was created.

The root defect was the assumption that every exchange requires two learner submissions. A clear stop or pause must actually end the exchange, while employment resignation, refusal of an assignment and negotiation remain distinct. The accepted earlier requirements remain: free typing and explicit **Say this**, one optional suggestion first, learner-owned private goals, no numerical grades, meaningful feedback, optional audio with separate consent, useful navigation, all ten approved lessons/media unchanged, draft PR and no public release.

| Requirement | Result and representative coverage |
| --- | --- |
| Stop / be left alone | “Please leave me alone”, “Stop talking to me”, “I want to end this conversation”, and direct dismissals close immediately; no clarification or second reply required |
| Pause versus leaving employment | Break, minute, later and “for now” variants end the discussion without inferring resignation or another work commitment |
| Definitive resignation | Formal declarations, submitting/tendering resignation, a final decision, leaving the company and immediate resignation lead to offboarding; never a conditional task refusal |
| Refusal and different conditions | Firm no requires no alternative help or invitation to reconsider. Time-limited refusal retains its timing; explicitly different terms remain negotiable without agreement |
| Unexpected language | Supported topic changes, vulgar reactions and personal attacks remain distinct. Unfamiliar/nonsensical wording gets at most the bounded clarification flow, with script limitations in coaching rather than Jordan's voice |
| Explanation / accountability / planning | Existing explanation-before-planning, risks/support acknowledgement, no invented admissions and realistic proposal checks remain tested |
| Coaching and goals | Goals are editable/rejectable and private. Stop drafts preserve the ending; unconditional refusals do not acquire conditions, help offers or commitments |
| Navigation and replay | Back/Forward restore endings and drafts without sending. Explicit resubmission replaces only dependent progress. Replay resets the conversation |
| Optional audio and privacy | Local recording/playback, stopping/deletion and consent cleanup remain. Dictation stays separate, optional and disclosed as browser-provider processing |
| Review / release protection | Exact immutable source, authenticated local preview, synthetic screenshots/report, accessibility checks and founder approval; no merge/deploy/spending |

## Resulting behavior

Stop requests and temporary pauses now reach a genuine completion state after one reply. Jordan acknowledges the boundary and ends without a question. “Fuck off” or “Shut up” used as direct dismissals also end the interaction rather than asking the learner to explain. A personal attack without a stop request meets a professional boundary. Threats stop the exchange; a later project-plan phrase cannot silently repair them.

A resignation is an employment decision. Jordan acknowledges it and points to formal offboarding: the applicable notice process, final pay, equipment return and any separately agreed handover. He does not ask whether it is final, invite negotiation or assume the learner will finish the assignment. The script does not establish legal rights or a particular employer's policy.

A firm refusal is acknowledged without demanding alternative help. Explicitly conditional or time-limited refusal stays conditional or time-limited; it is not converted into resignation or a promise to work later. Stop and resignation in the same message preserve both. Later stop requests preserve an earlier resignation in the takeaway. Reported words, negation and a later direct decision are checked separately so a quotation does not create a false contradiction or override an explicit ending.

A remaining follow-up is optional. **Finish here** ends it without submitting unfinished writing. Back restores that draft, Forward restores completion, and a new **Say this** explicitly replaces later progress. Natural endings, single-reply completions and ordinary two-reply practice share the same navigation history; no restart is needed to review them.

Feedback follows the actual submitted decision and ending. Stop feedback does not ask for a reason. Resignation feedback concerns offboarding, never conditional refusal. The main takeaway remains one concise outcome and one optional action; constructive wording, possible difficulty, why Jordan responded and one improvement sit inside optional reflection. Matching details, examples and another interpretation remain under a second optional disclosure. There is no numerical score or unsupported ability assessment.

## Control and instruction audit

| Controls / text | Decision |
| --- | --- |
| Main reply textbox and Say this | Free typing is first in visual and keyboard order. Only Say this submits; choosing wording never sends |
| Suggested replies and More responses | One optional shortcut remains below the main actions. All alternatives stay accessible; selected text is editable and a displaced draft is restorable |
| Help me draft / Private drafting | Optional. One question at a time; editable private purpose remains distinct from spoken wording |
| Goal dropdown and goal-edit controls | One existing selector inside optional coaching; no new dropdown. Native keyboard selection, reject/change goal, edit reaction and exact transfer retained |
| Finish here | One purposeful action on an optional follow-up; avoids a forced second message and preserves unfinished writing |
| Back / Forward / Try again / Home | Separate review from restarting. Closed-state restoration, explicit replacement and cleanup are tested |
| Recording, dictation, rehearsal and privacy disclosures | Closed by default. Each media mode retains its own controls, status, consent and cleanup; no new permission or service |
| Completion / reflection / wording detail | One takeaway and optional practical action first; detailed learning and technical evidence stay optional |
| Scenario / illustration / About | The workplace exchange remains visible in the main journey. Illustration and prototype/privacy explanation stay optional. The scripted label remains clear |
| Instruction paragraphs | Shortened the introductory copy and removed repeated choose/edit/send directions. Follow-up text explicitly says it is optional and unsent writing stays a draft |

The packet contains 39 synthetic before/after screenshots (18 before, 21 after) at 1120px, 320px and 390px. Introductory copy fell from 36 to 20 words; the main textbox moved above suggestions. No dropdown or disclosure was added (one optional goal selector and 15 disclosures remain). Before/after screenshots and capture metrics use the same viewport and synthetic inputs. The main reply now precedes the first suggested wording. Stop/pause effort falls from the forced two-message pattern to **one submission**, with no explanation required. Reading why Jordan responded still needs only one optional reflection disclosure.

## Automated verification

Both official GitHub runs for tested source `4dffe995250963aab28e74fb0dc7eee6b0d38dfc` passed **318 tests, 0 failed, 0 skipped**, with the unchanged two-worker, zero-retry workflow: [PR run](https://github.com/humanliteracy/Human-literacy-online/actions/runs/40566454798) and [push run](https://github.com/humanliteracy/Human-literacy-online/actions/runs/40566444938). Their source SHAs, status, log SHA-256 values and result excerpts are in the packet. The searchable case report is derived from all 318 individually observed passing rows in the verified official PR log. It is explicitly labelled **CI-derived**, not a native local Playwright report.

The cloud environment became unavailable during the last local full run; no complete local pass is claimed. The saved log ends after case 199, and the running process did not survive. The earlier six targeted checks passed, including corrected keyboard ordering, the historical stop case, draft transfer and the previously timed-out support/pause cases. Completed CI results are reused here; the full development suite was not rerun for delivery.

All 265 existing cases remain, with expectations updated only for the intentional closure semantics, firm-refusal wording and typing-first keyboard order. Tests that previously forced a second message after pause/threat now assert immediate completion and one learner message; they do not silently skip the behavior. Internal threat-context protection remains checked too. No time limit, retry, shared configuration, dependency or CI workflow was relaxed.

The 53 added browser cases cover stop/dismissal variants; temporary pauses; formal/final resignation; firm refusal and different terms; reported/denied/hypothetical wording; resignation plus stop; a later stop preserving resignation; unexpected questions, vulgarity and nonsense; private stop/refusal drafts; update-only versus all-work refusal; time-limited drafts; quoted words followed by a direct decision; and 320px/390px typing-first keyboard navigation, saved unsent drafts, endings, Back/Forward, replacement and replay.

The full suite also retains constructive/accountability and recovery planning, explanations before commitments, custom/changed goals, every generated alternative, feedback differences, historical grade regressions, injection-like input, privacy cleanup, zero answer storage, focus/contrast samples, reduced motion, 200% text, all ten full lesson workflows and approved media. Recording tests actually encode, play and delete audio from Chromium's synthetic microphone, release tracks/revoke URLs, enforce the 90-second limit and cancel late permission/finalization callbacks. Browser dictation uses deterministic provider simulations and separate explicit consent.

Static checks: 14 shipped scripts parse; 13 pages have zero broken-link/errors. Ten pre-existing static H1 warnings concern JavaScript-created lesson headings, whose live behavior is exercised by browser tests. Seven integrity rejection cases cover bad identities/checksums, corrupt/truncated archives, tampered packet, traversal and missing manifests before opening a socket/browser.

An exploratory run was stopped after identifying old forced-second-turn/wording expectations. Another intermediate run was stopped when a targeted mixed-statement probe found quoted words overriding a later direct decision; that defect was fixed and given three regressions. These are development diagnostics, not reported as complete passes. Final CI counts and the local interruption are separately recorded; discovery failures/interruption are not hidden or relabelled. CI also caught a selected-goal control preceding the reply textbox in keyboard order and a historical stop case still expecting a second reply; the UI ordering and test were corrected before the 318-case passing runs.

Reproduce using the unchanged setup:

```sh
npm ci
npx playwright install --with-deps chromium
npm test
python3 review/check_integrity.py
```

System Chromium option: `BROWSER_EXECUTABLE_PATH=/usr/bin/chromium npx playwright test`. The interrupted resource-limited local run used `--workers=1`; shared CI stayed at two workers with zero retries.

## One private founder preview

Use the pinned Python block in PR #2 or the founder handoff, in the Chromebook's existing Linux Terminal. Open its printed private link in Chrome **on that same Chromebook**, then choose **Open the simulator**. The prominent **UNRELEASED · LOCAL REVIEW** banner shows the exact full source revision. Keep Terminal running; Ctrl+C stops it. No GitHub login, npm install, new permission, public hosting or CI-artifact access is required.

The latest Issue #4 launcher/security implementation is unchanged. Its bytes and SHA-256 are verified separately, then it verifies the full immutable source archive before opening. Binding is loopback-only, with an immutable in-memory allowlist, fresh HttpOnly/SameSite session, Host/Origin/cross-site/write rejection and nested packet integrity checks. The download contains only existing public project source and synthetic evidence; no founder answers, private register, recordings or credentials are included.

**View the review packet** opens the before/after desktop/320px/390px/reflection screenshots, searchable CI-derived case report, official CI evidence, runtime hashes, limitations and typed-only trace in that same authenticated local session. No extraction or file:// access is needed. A [ZIP copy](../review/evidence.zip) is optional. The report's harmless theme preference is isolated from the simulator's zero answer-storage checks. Existing CI failure artifacts retain their seven-day policy; no hosting/artifact workflow changed.

The founder handoff records the exact delivery SHA, launcher SHA-256, complete downloaded source-archive SHA-256 and the independent browser verification results. The exact paste block is checked in two fresh processes/browser sessions, with the served full-SHA banner, source bytes, all ten lesson routes, critical CSS/JS, media, packet integrity/report filtering, desktop/320px/390px keyboard flows, stop closure, formal offboarding, Finish here, unsent draft restoration, no external browser requests/answer storage, and shutdown. Captured runtime hashes must match the pinned delivery revision, whose runtime and tests are unchanged from `4dffe99`.

The founder previously opened an older Chromebook preview. Acceptance of this exact revision remains pending; no physical Chromebook access or new founder session is claimed from automation.

## Architecture, limits and final acceptance

This remains bounded authored dialogue, not unrestricted natural-language understanding. Tested expressions and their variations are documented in the cases. Arbitrary paraphrases, complex reported/conditional clauses, sarcasm, unrelated questions and multilingual input can still be unrecognized. Unknown wording is not graded or treated as proof of poor communication; an actual person may understand it. Jordan stays in character while optional coaching identifies the script limitation. The short scenario does not establish actual workplace facts, manager decisions, employment rights or guaranteed agreement.

General conversation understanding or a larger open-ended simulation would require a separate architectural decision: expanded authored scenarios/rules, a different local language system, or an explicitly reviewed AI service. A service could add infrastructure, ongoing cost and new data processing; none was implemented or activated. No provider key belongs in client code.

Physical microphone quality, live browser speech recognition, real screen-reader output and full WCAG conformance need human validation. Browser dictation is optional, can send live speech to the browser's provider and may fail/stop early; it is not external transcription of saved local audio. Typing and local listen-back require no dictation service.

Only three short founder checks:

1. Say “Please leave me alone.” Confirm it ends without clarification, then use Back/Forward.
2. Submit a final resignation. Check offboarding, choose Finish here and read the takeaway.
3. Try one private drafting goal, or optionally local recording/listen-back; confirm wording does not send until Say this.

Then stop for founder approval. PR #2 stays draft with no auto-merge. All ten approved lessons/media, homepage/support, dependencies, shared test configuration and CI workflow are unchanged. Public main remains `bcb4e4f0a2b1f363b829a47c8c78e59bec4d2e10`. No merge, public release, deployment or spending is authorized.
