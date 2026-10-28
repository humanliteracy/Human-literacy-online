# PR #2 — controlled release and rollback

**Preparation only. Founder product acceptance is granted. Merge, deployment and publication are not authorized by this assignment.** Keep PR #2 draft with auto-merge off until the release operator receives explicit operational authorization. No accepted application code was changed during this preparation.

## Verified release record

| Item | Verified state |
| --- | --- |
| Accepted application | PR [#2](https://github.com/humanliteracy/Human-literacy-online/pull/2), `feat/issue-1-communication-coach`, accepted head **`0f4c4f7b1485d6803a2826fcc3cf6a08f0a69a83`**. Later release-preparation changes are Markdown only; application, tests, workflow, lessons and video bytes must remain identical |
| Acceptance | Founder explicitly confirmed acceptance in the release-preparation instruction. No renewed product acceptance is required for these documentation corrections |
| Regression evidence | Both accepted-head CI runs passed **356/356** cases: [PR run](https://github.com/humanliteracy/Human-literacy-online/actions/runs/40635821621), [push run](https://github.com/humanliteracy/Human-literacy-online/actions/runs/40635816835). Logs confirm two workers, zero broken links/errors and 14 parsed scripts. Ten known static lesson-H1 warnings remain; rendered lesson workflows pass |
| PR state at inspection | Open, draft, mergeable/clean; no unresolved review threads, formal review requirement or auto-merge configured |
| Publication | GitHub Pages **legacy branch build**, `main`, root `/`; HTTPS enforced, no custom domain. [Public URL](https://humanliteracy.github.io/Human-literacy-online/). Pushing/merging to `main` automatically publishes; browser-test CI is separate and does not gate Pages |
| Live/pre-release baseline | `main` **`bcb4e4f0a2b1f363b829a47c8c78e59bec4d2e10`**, also the latest successful Pages build commit. Accepted head contains this main revision; ten approved lessons and both MP4 files are unchanged from it |
| Merge control | `main` is currently unprotected. Enforce the exact-head/green-check gate manually; do not assume GitHub prevents an unreviewed push. No settings were changed |
| Review history | Founder-accessible local preview is the older `a406b0e` baseline. The [final quality review](final-quality-review.md) and six screenshots cover the later copy/link corrections included in accepted `0f4c4f7`. `review/evidence.zip` is historical **353-case** evidence, not the latest 356-case report; its manifest verifies and contains no raw audio. Do not relabel it as the current candidate |

## Outstanding issues and release scope

- [#1 — Communication Coach](https://github.com/humanliteracy/Human-literacy-online/issues/1): implementation accepted; no unresolved release defect identified. Its original optional numerical-score language was superseded by founder instructions: the simulator has **no numerical communication grade**. Close/reconcile the issue after the authorized release; do not restore scoring.
- [#3 — wider voice accessibility](https://github.com/humanliteracy/Human-literacy-online/issues/3): explicitly planning-only and separately scoped. Spoken navigation, lesson-wide spoken answers and read-aloud are not delivered or claimed by PR #2. Keep open; no implementation, spending or new approval is needed to release the accepted scripted prototype.
- [#4 — independent review delivery](https://github.com/humanliteracy/Human-literacy-online/issues/4): founder access was achieved through the approved local route and acceptance is now granted. The broader original contract is not entirely implemented: CI uploads reports **on failure only**, retained **7 days**, rather than retaining every successful review packet; alternate Library/Drive document delivery was not added. Keep these follow-ups open and record actual coverage. They are not an unresolved founder-access blocker for this accepted release; do not claim the whole issue is complete or add infrastructure to close it.

Known accepted limits: bounded scripted language, no general AI understanding or inferred feelings; no determination of employment/legal obligations; browser dictation is separately optional and may use a browser provider. Synthetic media/recognition and accessibility checks do not certify physical microphones, live dictation, actual screen-reader output or full WCAG conformance. These limits remain disclosed; they do not create a new acceptance gate for unchanged code.

## Release checklist — only after operational authorization

1. **Freeze and verify.** Record the final PR head, whose changes since accepted `0f4c4f7` must be Markdown only. Confirm latest-head PR/push checks are green and no new review blocker appeared. Re-read `main` and the latest Pages build: if either moved from the baseline above, review intervening work and update the rollback record before proceeding. Do not silently include other application changes.
2. **Record the rollback point.** Save the actual pre-merge main SHA, approved PR head and release operator in the release record. Use **Create a merge commit** so this release has one reversible merge; record the resulting merge SHA and its first parent. No tag, new service, secret, domain, media upload or manual Pages trigger is needed.
3. **Make the deliberate publication transition.** After explicit merge/publication authorization, mark PR #2 ready for review, recheck its head/CI, and merge that exact head into `main`. This merge is the publication action and immediately starts Pages. Do not enable auto-merge, push accepted files directly to main or treat a later deploy button as a second approval gate.
4. **Verify the actual deployment.** Wait for **pages build and deployment** to succeed, then confirm the Pages build commit equals the recorded release merge SHA. Open a fresh browser session at the public URL; check homepage wording, entry into the scripted simulator, a stop/Finish here journey and the direct lesson-list return, lesson links/video, keyboard focus and mobile reflow. Confirm no grade, account prompt or automatic microphone start. Use fictional input. This is a brief host/cache/asset smoke check, not a repeat of founder acceptance. Record success or roll back on a confirmed release regression.
5. **Record the outcome.** Record deployed SHA/build URL and smoke results. Reconcile #1 and only the delivered portion of #4; keep #3 and unfinished delivery enhancements open. Retain accepted limits in release notes. Do not mark publication complete merely because a merge or test job succeeded.

**Before-publication work still outstanding:** latest documentation-head CI must be green; an operator must receive explicit merge/publication authorization, refresh the exact-head/main/rollback record, and intentionally move the draft to ready and merge. The post-deployment smoke check can only happen after that authorized publication. Product acceptance is already complete.

## Rollback checklist — procedure only, not authorized now

1. Record the failed public route/symptom and deployed SHA. Stop further release merges while investigating. Compare with the saved pre-release baseline; do not assume every Pages job failure means code must be reverted.
2. Prepare a rollback branch/PR from the **current** main. Use GitHub's **Revert** for the recorded release merge, or `git revert -m 1 <release-merge-sha>` for a true merge commit. If the operator used squash instead, revert the recorded squash commit with `git revert <squash-sha>` (no `-m`). Review conflicts and the diff; preserve unrelated later changes. Do not reset or force-push main, delete assets or change Pages settings.
3. Obtain the operational authority for rollback publication, check the rollback PR, and merge it. That merge automatically publishes the revert. Rolling back restores the pre-PR site, not the accepted new Coach; it can therefore restore that older simulator's previous behavior.
4. Verify Pages built the new rollback SHA, check public homepage/lesson/media/simulator routes in a fresh session, and record the result. Reopen the release defect, preserve the failed and rollback SHAs, and require a separately checked fix before another release.

The baseline SHA above is a reference, not a command to overwrite later main work. No merge, deployment, public release, issue closure, setting change or spending was performed during this preparation.
