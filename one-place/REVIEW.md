# ONE PLACE — single-screen founder review (draft only)

**Unpublished concept | no sales | no bookings | no personal-data collection.**

This revision retains all 18 areas and 72 offerings (36 free starting points, 18 paid digital-product concepts, 18 future assisted-service concepts), but reorganizes them for much faster discovery.

## Page structure
- `one-place/index.html`: compact homepage displaying all 18 life areas at once on many standard screen sizes. On short screens or at high zoom, natural scrolling is allowed rather than cutting off content or reducing accessibility.
- `one-place/index.html?area=...`: one focused page per area, listing precisely four offering choices.
- `one-place/index.html?service=s001` ... `s072`: one focused solution page per offering, including working sample input/output for six product concepts.
- `one-place/index.html?team`: clear authorship and responsibility statement: one human founder, ChatGPT and other AI tools; human leads and approves, AI assists in design, research, writing, code and prototyping. No implication AI is a person or licensed specialist.
- Search on the homepage links to the matching one-page solution.

## What is / is not active
Free entries contain general starting guidance and external resource links. The links are illustrative and must be individually reverified before launch. Planned digital products are **not for sale** and service concepts are **not bookable**. No payment buttons, user accounts, submissions, tracking pixels, analytics, database, or backend are installed. Enter fictional information in demo tools.

Existing Human Literacy lessons, simulator and approved artwork remain untouched; draft PR #5 is separate.

## Founder review
1. In GitHub, select this PR's branch `concept/one-place-whole-life-prototype` and download `one-place/index.html` to open in Chrome (GitHub's file viewer does not execute the page). The same HTML file uses query-string routes for the area and service views. Alternatively, use the downloadable companion prototype package provided in ChatGPT.
2. Confirm all 18 areas can be seen without scrolling on a normal laptop and phone; verify that very short screens and 200% zoom remain usable with scrolling as needed.
3. Open each area and test its four choices, including a free outside resource and one mock paid offering.
4. Test search for `debt`, `caregiving`, `business`, and `jobs`.
5. Test the pricing, budget, family handoff, application, home maintenance, and legacy demonstrations with fictional data.
6. Open the team disclosure and evaluate the language and prominence.
7. Run keyboard-only (Tab, Enter) and screen-reader acceptance checks before any release.

## Security, publishing and rollback
The development branch and draft PR are in a **public GitHub repository**; code is visible to people browsing GitHub even though the changed site is not deployed. No changes have been merged into `main`. Do not create public staging, deploy, publish, take payments, collect user information, or spend money without explicit founder approval.

Do not use GitHub Pages as the production home for a primarily commercial storefront or SaaS. Future paid operations need separate commercial hosting and appropriate terms, refunds, support, tax, privacy and accessibility checks. To abandon the prototype, close this draft PR; the live site remains unchanged.

## 2026-10-30 — tighter navigation, own-built resources, public accountability

The branch prototype was revised to keep the 18-area home view compact; every area opens a focused one-page view and every solution has a dedicated one-page route. Each area and solution includes an original on-device action-plan tool, in addition to the six pre-existing interactive sample calculators/workflows.

A public-accountability interface is accessible through **one-place/index.html?impact**. It allows drill-down from site to area to individual service and distinguishes visits, gross earnings, refunds, operating costs, giving, and profit after giving. **All figures say “Not measured” because no site analytics or financial bookkeeping integrations have been installed.** Counts, profit, donation claims and recipients must never be invented. Before launch, establish privacy-conscious traffic aggregates, accounting reconciliation, reporting periods, corrections policy, and appropriate disclosure of affiliate/paid relationships. No customer payments, donations, merchant account, user tracking, external APIs, or professional service fulfillment is activated.

The separate downloadable founder ZIP contains a modular version with additional quality-assurance checks. The GitHub implementation is an independent compact single-file prototype; both convey the concept but are not byte-identical. The modular version was browser-tested; this latest GitHub revision was confirmed in the repository but still requires a separate browser acceptance test before any merge. Zoom, accessibility and manual provider reviews remain pending.

**Safeguards:** no merge, deployment, purchase, booking, analytics enablement, or spending. Draft PR #5 remains independent. Public GitHub branch code is visible to repository visitors even though GitHub Pages still serves main. Long-term commercial hosting must move off GitHub Pages.
