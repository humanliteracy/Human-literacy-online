# Unreleased Communication Coach: consolidated improvement review

[Draft PR #2](https://github.com/humanliteracy/Human-literacy-online/pull/2) · [Changed files](https://github.com/humanliteracy/Human-literacy-online/pull/2/files). The public site has not changed. This remains a free static, scripted two-turn prototype, without accounts, a model/API provider, backend changes or new dependencies.

## Ownership and baseline

This pass started from a clean `feat/issue-1-communication-coach` checkout at `301012dedecd600b30a31b79ce028ba82b4b097b`, matching the open draft PR. The preceding task's code, 190 browser cases, working authenticated local preview, verified founder launch route and evidence tools were inspected and reused. This work updates the same PR, without a competing implementation or preview service. Issue #4's separately owned local branch remains at `04a6f1c9871bca4cc440e8c3e99b0e713c30df7e`.

The current founder assignment supplies five synthetic utterances. They are used as test data, not represented as private founder responses. No private register, personal response or microphone recording is included in source, logs or evidence. The earlier founder Chromebook opening succeeded; acceptance of this exact updated version remains pending.

## Resulting behavior

The main journey remains: situation → select/edit or type → **Say this** → Jordan responds → one further decision → a takeaway and one optional action. A selected suggestion only fills the editable draft. Nothing submits automatically. Back/Forward restore valid conversation stages and unfinished drafts; only explicit resubmission replaces dependent later replies. The default remains one suggested response with all alternatives available on request.

Jordan now stays in character when a reply is unfamiliar. He asks a natural question instead of referring to a script or classifier. Explicit refusals prompt a discussion of unfinished work, responsibilities and the client update, without threatening invented disciplinary outcomes. Personal attacks meet a professional boundary. Refusal, resignation, privacy/treatment boundaries, pauses and uncertainty remain legitimate distinct choices. An insult does not erase a simultaneous explicit refusal; disagreement about a deadline alone is not a personal attack.

| Supplied example | Previous behavior at 301012d | Updated behavior |
| --- | --- | --- |
| “I made a mistake, but I want to explain what happened and find a fair solution.” | Accountability recognized; generic manager/feedback missed the explanation and fairness request | Acknowledges the mistake and request to explain; discusses facts before deciding what is fair. Feedback identifies those actual elements. |
| “I'm not doing any more work on this project.” | Unrecognized | Clear refusal; unfinished work, responsibilities and client communication need clarification. |
| “Your deadline is ridiculous, and you're incompetent.” | Unrecognized | Personal attack recognized; Jordan sets a professional boundary and invites a specific deadline concern. |
| “I refuse to continue working on this project, and I will not provide another update.” | Unrecognized | Both limits are retained in drafting; the roleplay acknowledges a work refusal without treating it as resignation. |
| “My favorite color is blue, and I had pancakes for breakfast.” | Generic script-level fallback | Bounded unrelated-message recognition; Jordan redirects naturally to the work or the learner's decision. |

Recognition uses conservative local phrase rules, contractions and clause guards. Reported/denied accountability, threats and personal boundaries are not automatically attributed to the learner. Unexpected ordinary phrasing can still be unrecognized; Jordan requests clarification and the separate learning feedback states the limitation. This is not human-level language understanding, mind-reading or a prediction of employment outcomes.

## Private goals and useful spoken wording

Help Me Draft now recognizes more of the actual expression and proposes an editable goal for supported cases. The learner can change/reject it or choose another path. The label **My goal (private)** distinguishes an internal purpose from a spoken reply.

An internal goal such as “I want to explain what happened and find a fair solution” becomes editable wording such as “I made a mistake. I'd like to explain what happened before we decide on a fair next step.” The admission appears only when accountability was actually expressed. Without that admission, the draft does not invent one. Every alternative has a short, associated explanation of its difference: directness, discussion, privacy, uncertainty or brevity.

The recipes preserve explicit no-further-work/no-update limits, privacy and respectful-treatment boundaries, uncertainty and resignation. They avoid inventing a missed warning, an unreasonable-workplace reason, a scope change or a delivery promise. Exact curated examples remain supported. Unsupported custom goals get clearly labelled neutral openers instead of a goal echo or a fabricated tailored rewrite. The full private goal remains editable and is never silently truncated into a different decision.

**Use this wording** transfers the chosen text accurately, including edited line breaks and punctuation. It does not submit. Only Say this makes it part of the roleplay. Jordan hears submitted words, not the private goal: a learner who selected resignation but actually asks for a pause receives a pause response. Goal/wording differences remain visible in optional detail, while the takeaway honors the submitted decision. A private goal alone never becomes a claimed resignation or work commitment. Follow-up suggestions honor the actual decision. A later explanation does not erase an earlier resignation, refusal or pause.

## Concise descriptive feedback

The default completion remains one relevant takeaway and one optional real-world action. Expanding **Why this happened and what to try** now shows five core explanations: what was communicated, what was constructive, what might cause difficulty, another possible interpretation and one improvement. The duplicated communication paragraph is removed. **Wording and practice detail** retains normalized phrase evidence, why Jordan responded, a skill, an example and the private goal basis. Unresolved practical questions remain available.

Numbers remain disabled. The UI explains that limited phrase matching cannot measure communication ability; no arbitrary formula or grade is presented. Descriptive feedback is secondary to the experience. Unrecognized wording receives no fabricated strength/ability assessment. The prior 94/88/67/56/48 input pairs remain regression cases requiring no numerical grade.

## Before/after effort and visible detail

| Task | Before | After |
| --- | --- | --- |
| Two suggested main replies | Select → Say this, twice | Unchanged: four deliberate clicks; no automatic submission |
| Supported ordinary expression in Help Me Draft | Usually needed a manual path and goal because only three exact expressions were recognized | Proposes an editable path/goal for supported wording; one confirmation remains necessary |
| A custom fair-solution goal | Goal echoed as the proposed spoken reply | Three concise spoken alternatives, with differences explained |
| A full private goal | Could be copied wholesale into the spoken draft | Retained privately; editable spoken wording is separate |
| Expanded reflection | Nine descriptive fields plus a duplicate communication paragraph | Five core fields; four supporting fields remain under optional detail |
| Review/edit earlier work | Back/Forward with saved progress | Preserved and tested with the updated dialogue/drafting |

Controlled screenshots use the same synthetic fair-solution expression, custom goal, viewport/font setup and two submitted replies at the before/after revisions. `before/before-results.json` and `after/capture-results.json` in the packet contain reflection height and visible-field measurements. Smaller screens can still scroll; long original thoughts, alternatives and optional explanations intentionally add space when requested.

| Width | Expanded completion before | After | Reduction |
| --- | --- | --- | --- |
| 1120px | 1344px | 1040px | 23% |
| 320px | 2393px | 1808px | 24% |
| 390px | 2011px | 1497px | 26% |

## Automated validation

On 27 October 2026, both independent GitHub CI runs passed **240 tests, 0 failed, 0 skipped** with Chrome for Testing 156.0.8078.4, two workers and the unchanged workflow: [push run](https://github.com/humanliteracy/Human-literacy-online/actions/runs/40526945049), [PR run](https://github.com/humanliteracy/Human-literacy-online/actions/runs/40526951281). Official API status, source revision, per-run log hashes and result excerpts are in the review packet. This repeats the full final suite independently. Source before the evidence-only delivery commit is `848cc49290f2f5409af1d0011aaf7f9416073df2`; the final pinned delivery SHA and its checks are in PR #2.

The cloud system Chromium 154 full diagnostic run had **239 passed, 1 page-loading timeout, 0 skipped** in 506.3 seconds. The affected historical-94 case timed out in `page.goto` during `beforeEach`, before scenario assertions. The unchanged isolated case passed in **2.4 seconds**. The failed diagnostic result and its trace are retained in the packet; they are not relabelled as a passing full run. No assertion, retry configuration or time limit was relaxed. Intermittent local browser/driver delays remain a development-environment limitation; managed CI completed all 240 cases, including that scenario.

Earlier validation found and corrected stale keyboard expectations for the new optional detail disclosure, uncertainty wording that did not identify the job, and feedback that treated a private goal as a spoken decision. The latter now derives consequences only from submitted wording and established spoken context, including a learner changing their mind. A genuine contradictory resignation remains unresolved. All three prepared alternatives in ten wording families are tested independently of private-goal provenance. Interim 226-case local runs passed twice before these final checks; run history is included without presenting earlier code as the final candidate.

All prior 190 browser cases remain. Assertions were reconciled with intentional changes, including treating a scope-review question as clarification rather than claiming a changed scope from a private goal: natural in-character clarification replaces script-level dialogue, private goals are no longer attributed to Jordan, custom goals stay private instead of being echoed into speech, and the single communication explanation is checked directly rather than through a duplicate quote. No assertion is removed to hide a failure. No retries, increased timeouts, disabled cases or dependency/configuration changes were added.

New complete-conversation and drafting cases cover the five supplied utterances, ordinary variants, deadline criticism versus insult, refusal plus hostility, reported/denied personal boundaries, exact transfer without sending, fair-solution alternatives, no invented admissions/reasons, uncertainty, goal privacy, relevant follow-ups, earlier-decision preservation and 320px/390px keyboard journeys. Existing tests retain all ten full lesson workflows and approved videos, historical score cases, 200% text reflow, long literal/HTML-like inputs, native focus/disclosures, navigation, clearing/replay/pagehide and simulated recording/dictation lifecycle.

The static audit checks 13 pages. Its ten existing static H1 warnings are lesson headings generated by JavaScript; live headings are exercised by browser regressions. Seven negative integrity checks cover invalid identities/checksums, corrupt source bytes, tampered packet payloads, traversal and missing packet manifests before opening a socket/browser. No client API key, tracking or new dependency was introduced.

Developer reproduction:

```sh
npm ci
npx playwright install --with-deps chromium
npm test
python3 review/check_integrity.py
```

Local system-browser alternative: `BROWSER_EXECUTABLE_PATH=/usr/bin/chromium npx playwright test --workers=1`. Shared CI remains unchanged with two workers and no retries. Final source results and the verified launch block are linked from PR #2.

## Founder review delivery

Use the pinned Python launch block in the founder handoff on the Chromebook's existing Linux Terminal. It verifies the launcher before execution, then the complete immutable source archive. No GitHub login, npm, paid service, new permission or CI-artifact access is required. Open the printed private link in Chrome **on that same Chromebook**, choose **Open the simulator**, and check the full SHA in its **UNRELEASED · LOCAL REVIEW** banner. Keep Terminal running; Ctrl+C stops it.

**View the review packet** opens the screenshots, interactive test report and silent synthetic walkthrough directly in the authenticated preview. [A ZIP copy is also available](../review/evidence.zip). Direct `file://` pages can be blocked by managed Chrome; the authenticated loopback view is the verified route. Test-report theme preferences are checked separately from the simulator's zero storage of answers. The wrapper is reused from Issue #4: loopback only, fresh HttpOnly/SameSite session, Host/Origin/cross-site/write rejection, immutable in-memory allowlist and source/packet integrity checks. No public hosting or new artifact-retention workflow was added.

The capture manifest connects each screenshot's runtime hash to exact site file hashes. The final containing commit cannot embed its own hash; the pinned launch block supplies that full delivery SHA, and independent verification compares every captured runtime file against it. All evidence is synthetic. Video is silent and traces are typed-only. No raw microphone recording or private material is exposed.

## Limits and acceptance

Automated Chromium tests target accessible labels, semantics, logical focus, keyboard access, sampled contrast, native disclosures, 320/390/768/1120px reflow and 200% text size. They do not certify full WCAG compliance or real screen-reader behavior. No physical microphone, live browser speech-provider service or new founder Chromebook interaction is claimed as tested. Browser dictation remains separately consented, optional external-browser processing; it can fail or stop early. Local recording does not transcribe; typing always remains available.

Language recognition is deliberately bounded. Some ordinary statements still need clarification. The two-turn scenario does not establish real legal rights, actual manager decisions or guaranteed agreement. No new scenarios, accounts, AI services or paid dependencies were added.

Founder acceptance requires no more than three checks, using fictional examples:

1. Complete a main conversation and use Back/Forward; read the takeaway.
2. Try a refusal, resignation or unexpected/hostile reply; check that Jordan respects the decision without fake praise or grades.
3. Use Help Me Draft once, or optionally record/listen back; check that a private goal, editable wording and Say this feel distinct and simple.

Then stop for founder approval. This PR remains draft. No merge, public release, deployment or spending is authorized. All ten approved lessons/media, homepage/support, dependencies, shared test configuration and CI workflow remain unchanged; public main remains `bcb4e4f0a2b1f363b829a47c8c78e59bec4d2e10`.
