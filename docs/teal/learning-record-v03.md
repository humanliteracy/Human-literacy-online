# TEAL learning record v0.3 — founder review

**Status:** Separate development branch and draft PR only. No deployment, publication, merge, promotion, spending, or changes to founding-invitation PR #5.

This proposes the same optional local-first reflection system across Lessons 01–10 using one shared JavaScript and CSS pair. Existing videos, scenarios, knowledge checks, navigation and approved artwork remain intact.

## Learner experience

- **Remember It:** Keep the existing knowledge check. After the results, add written reflection and a real-life application. Offer keyword-assisted reflection prompts, explicitly not a moral score.
- **Live It:** Add action plan; optional Self, Others, Everything considerations; and an optional **observed outcome**. A plan is not proof an action occurred.
- **Finish:** View a record; download a text file, copy, or use the device print dialog for Print / Save PDF.
- **Privacy:** No requests to a server from this feature. Use browser localStorage where available, with erasure and warnings about shared devices. Export is possible even if browser storage is blocked.
- **Review:** No AI or backend interpretation. Prompts are limited and not a diagnosis or validated assessment.

## Quality gates

Automated tests cover ten lessons, summaries, exported download, persistence after reload, erasure, and printing. Keep all existing tests. Physical device print, screen reader, private browsing, and shared-device privacy checks still require human verification.

## Founder decision

Review on an isolated branch or local preview. **Do not merge** without explicit approval of the exact tested commit and remaining device/accessibility checks. PR #5 remains independent and unchanged.
