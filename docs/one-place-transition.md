# ONE PLACE — draft rebranding, integration and repository transition

Reviewed November 7, 2026. Existing OP-104, draft PR #9 only. The repository,
Pages address, main branch, release locks and other project priorities are unchanged.
This document records the authorized implementation and a future migration procedure;
it does not approve a rename, purchase or release.

## Integrated source inventory

| Experience | Draft route | What is preserved |
| --- | --- | --- |
| ONE PLACE | `index.html` | Existing 18 life areas, 72 offering records, search, free action kits, six demonstrations, honest preview and unmeasured-impact labels |
| Human Literacy | `human-literacy/index.html` | Complete prior learning landing; ten lesson shortcuts, Explore / All 10 lessons / Our mission views |
| Ten lessons | `lessons/01/` through `lessons/10/` | Five learning experiences, approved prose/choices, HL-119 quiz guard, shared learning records and video controls |
| Life Simulator | `simulator/01/` | Existing unscored scripted Jordan / Communication Coach, private drafting, rehearsal, Back/Forward and finish controls |
| TEAL | `teal/` and `teal/letter.html` | Existing approved invitation, artwork, principles, resources, share safeguards and reading view |
| Practical tools | `one-place/money-bills.html`, `one-place/family-handoff.html` | Existing calculations, fictional examples, editing, export/reset and privacy warnings |
| Mission | `support/` | Existing mission content; return to One Place Home |

Existing `one-place/index.html?...` links redirect to the root with query and
fragment intact. Older root `#choose`, `#lessons`, and `#mission` bookmarks open
the corresponding Human Literacy view. Relative links retain the repository
project prefix. There is one catalog implementation, now at the root.

The current repo has no standalone Everyday Mentor / Universal Life Mentor
application, live AI model, or approved server integration. It has practical
resource guidance plus the bounded scripted Coach. The broader mentor, private
B07 materials, private Trinity RC2, consolidated TEAL-101 document and TEAL-114
future category are not silently published or marked delivered by this rebrand.
A separate private Explore & Experience concept also exists outside the repo;
its prior integration/publication gates remain intact. These are inventory gaps,
not removed components. All original IDs, priorities and approvals are preserved.

## Privacy and accessibility requirements

No login, form submission backend, tracking, payments or AI service is added.
Tool data remains in page memory. Existing optional lesson reflection fields
save automatically in local browser storage when used; shared-device warnings,
clear/export controls and all original behavior remain. Browser speech may use
an outside provider only through its existing separate opt-in; leave voice off
for this founder preview. External resource destinations have their own policies.

The root has a keyboard skip target, labeled navigation and search. Automated
checks cover all 18 areas / 72 views, major return paths, ten lessons, 320px
reflow, keyboard search and local-only tool requests. Existing full regression
and video/recording/privacy tests still apply. Passing browser automation is not
physical Chromebook/phone, ChromeVox/TalkBack, full WCAG or learning-effectiveness
acceptance. Recheck changed navigation with the founder before release.

## Current public baseline

The deployed URL still opens the Human Literacy title and learning homepage.
Main baseline: `442e813e8ff81abe53f32e01fd4bc6210cb06b15`.
The existing draft snapshot reviewed before this change was
`07f93005ef48a869ca413e3c97e8bd9014da7627`; original PRs #5–#8 are preserved.
Per the existing release checklist, main/root is the Pages publication source;
merging to main can publish automatically. No hosted founder preview is activated
by this work. Use the authenticated checksum-pinned local launcher for the
complete source tree; a standalone HTML file cannot reproduce these routes.

## Proposed repository rename — NOT EXECUTED

| Concern | Assessment / required future change |
| --- | --- |
| Repository | Proposed `humanliteracy/One-Place`; check name availability and admin authority at decision time |
| Website address | Current `https://humanliteracy.github.io/Human-literacy-online/`; expected default after rename `https://humanliteracy.github.io/One-Place/`. The latter is a proposed address, not a working preview |
| Old public links | GitHub documents that repository redirects exclude project-site URLs. Do not assume existing Pages bookmarks redirect |
| Local navigation | Relative component URLs preserve either prefix; regression coverage simulates both mounts. This does not prove a real Pages migration |
| Canonical sharing | Update the fixed canonical URL AND exact-path/origin allowlist in `teal/teal.js` together only when the approved destination is live; preview sharing must continue omitting unpublished addresses |
| Review delivery | `review/local_preview.py` contains the repository download URL and ZIP root name. Both must change together, with newly verified archive/launcher hashes and a new pinned handoff; old pinned packets remain historical |
| Workflows | Current CI uses external `actions/*`, not a self-hosted action at this repository name. Main remains the publication source; inspect Pages settings, branch rules, app integrations and badges at migration time |
| Docs and links | Update current-operating README, release instructions and live links. Keep historical PR/evidence URLs and dated source snapshots intact |
| Local learning records | Existing browser storage is origin scoped, with the current lesson-number keys, not repository-path scoped. Renaming a path on the same origin does not itself erase it; test restored records and deletion. Do not silently change keys or export personal data |
| Compatibility | Guaranteeing old Pages URLs requires an independently approved compatibility or domain strategy; no new repository/domain/service is authorized here |

GitHub's official documentation says repository web/Git operations generally
redirect after renaming, but project-site URLs are excluded. It recommends a
custom domain for address stability; that is an optional later decision with
costs, not a requirement or purchase approved here. GitHub also warns against
reusing the old repository name and notes that calls to actions hosted by a
renamed repository are not redirected.

Sources checked November 7, 2026:
- https://docs.github.com/en/repositories/creating-and-managing-repositories/renaming-a-repository
- https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages

### Safest sequence after separate founder approval

1. Accept the integrated exact revision on Chromebook and a narrow viewport;
   close applicable accessibility, privacy, content and release gates. Keep the
   branding release and repository rename as separate decisions.
2. Approve any desired rebranding release at the existing address separately.
   Keeping the old repository name is a valid way to use ONE PLACE without
   breaking the established public URL.
3. Before any later rename, capture the accepted source SHA and Pages settings,
   verify the new name, inventory external links, agree an old-address strategy,
   and prepare the canonical/launcher/documentation patch and rollback revision.
4. At the explicitly approved maintenance point, rename once, apply the reviewed
   URL-specific changes, update remotes/settings as required, and verify build,
   both current and legacy deep links, media ranges, sharing and local records.
   Do not declare the old Pages address supported without direct evidence.
5. If acceptance fails, restore the prior name where available, restore the old
   canonical/launcher configuration, and rebuild the captured accepted version.
   DNS/Pages caches and naming availability make immediate recovery uncertain;
   source rollback alone does not rename the repository or guarantee old URLs.

Current draft rollback is simpler: abandon/revert the OP-104 rebranding commit
on the review branch. Main and the deployed site remain untouched. No prices,
subscriptions, API keys, user accounts, analytics or paid checkout are enabled.
