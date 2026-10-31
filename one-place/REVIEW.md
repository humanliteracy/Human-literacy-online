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


## 2026-10-30 — depth-first pilot milestone (founder planning; no publication)

**Decision: do not expand the 72-item catalog until a small number of solutions genuinely work.**
The one-screen Control Panel is the navigation layer, not proof that 72 services are operational. All 72 entries must clearly retain DRAFT / DEMO status until their individual evidence gates pass.

### Pilot 1 — Money & Bills: free 7-day action organizer
- User can enter fictional due dates, expenses and expected income locally, identify urgent next actions, and export a short personal plan.
- Never claim a person can afford a payment based solely on partial information. No bank connection, backend, cookies, or collection of private financial information in the prototype.
- Link to dated, verified official sources for hardship assistance. Do not present legal, debt settlement or credit advice as individualized guidance.
- Pass: a novice completes the process using only on-screen prompts, with understandable output and a clear correction/reset path.

### Pilot 2 — Family & Caregiving: free handoff builder
- User creates, previews, edits and locally downloads a concise responsibility handoff using fictional data in test runs.
- Support clear contacts, task owners, timing, uncertainties, and safe boundaries; avoid diagnoses and clinical recommendations.
- Pass: a second person can understand the handoff without an explanation from the creator.

### Pilot 3 — Small Business: job-pricing calculator
- Reconcile direct costs, time, overhead and target margin; disclose assumptions, differentiate markup from margin, and warn about omitted taxes/fees.
- Export a sample quote and cost breakdown. Label it DEMO, not for sale, until product quality and market demand are tested.
- Pass: calculator handles zero/invalid inputs correctly and agrees with independent reference calculations.

### Repeatable service contract (for every future category and subsection)
1. **Find:** one-screen entry and clear purpose; information revealed progressively, not hidden or clipped at high zoom.
2. **Understand:** whom it is for, what it does, free versus paid status, limitations and relevant safety guidance.
3. **Act:** a functional first-party tool or guided workflow, with a demonstrable end result.
4. **Keep:** readable local export or next-step plan where appropriate; no sensitive data sent externally without informed opt-in.
5. **Trust:** owner/review date, authoritative source notes, clear team disclosure, accurate pricing and refund/support terms when activated.
6. **Measure:** privacy-conscious, aggregated usage metrics (only once approved) and independently reconciled revenue, refunds, costs, profit and giving by section; missing data stays "Not measured".
7. **Verify:** keyboard, focus, small-screen, 200% zoom, screen reader, edge cases and non-English readiness checked before launch.

### Evidence gates before a paid launch or broad announcement
- Five independent usability sessions using realistic fictional scenarios; record task completion and failures. Target >=4/5 successful without coaching as a pilot threshold, not a claim of statistical reliability.
- Human review of safety-sensitive content and external resources with last-checked dates; no claims of professional licensure without evidence.
- Demand check with a specific buyer group; distinguish likes, signups, purchase intent and actual payments.
- Secure commercial hosting, payment processing, product delivery, support, refund policy, privacy notice and appropriate legal/tax handling.
- A real accounting source for income and giving; no fabricated visitor counts, prices paid, donations or impact claims.
- Founder authorization is required to merge, deploy, activate checkout, collect analytics, or spend funds.

### Current status / next step
- COMPLETE: 18-area navigation, 72 draft views, demo calculators, original basic action kits, transparency interface.
- NOT COMPLETE: three production-grade pilots, market validation, third-party resource verification, accessibility audit, real financial/visitor measurement, customer operations.
- NEXT ENGINEERING TASK: implement the Money & Bills free pilot on this draft branch, then reuse its audited interaction pattern for caregiving and pricing. Keep existing lessons, Human Literacy artwork, PR #5 and production main unchanged.

## 2026-10-30 — Money & Bills pilot implementation

**Draft implementation added** at `one-place/money-bills.html`. The Money & Bills area and each of its existing four solution views now link to the free first-party planner through a prominent call-to-action on the same draft branch. This is an additional service experience; the existing 18-area navigation, 72 concepts, Human Literacy lessons, original site, draft PR #5, and all financial-transparency prototype fields remain unchanged.

Functional scope:
- Four compact in-page tabs: Overview, Bills, Income, and My Action Plan.
- Add, mark paid, and remove unpaid bills and expected-income entries; track due/overdue amounts, 7-day upcoming bills, 7/14/30-day planning windows, and confidence of future deposits.
- Excludes uncertain income from the planning projection. Keeps fictional data marked fictional until explicitly cleared.
- Only shows an **illustrative, not verified** remaining amount after explicit user confirmations of current cash and all known commitments; never assumes cash balances or affordability from incomplete inputs.
- Detects a possible short-term cash deficit when a bill falls due before a later expected deposit; same-day payments are conservatively sequenced before same-day income.
- Generates a downloadable local text action plan. No server transmission, form submission, bank API, localStorage, accounts, payments, analytics, or visitor financial-data collection.
- Uses source-reviewed U.S. references from CFPB, 211, and USA.gov, linking to the original providers for their services.

Checks completed in local Chromium on desktop and 390px mobile: list updates, pay-status toggles, positive currency math, expected vs uncertain income, 2-check cash guard, fictional-data guard, XSS-safe displayed labels, downloadable TXT report, and a test where final-window cash looks positive but a prior bill-date deficit is detected. No browser runtime errors in scripted scenarios. Screens are responsive; scrolling is allowed on small screens or at high zoom rather than clipping text.

**Remaining before release:** direct browser acceptance of the GitHub-linked route, keyboard and screen-reader testing, 200% zoom review, 5 independent usability sessions, content/resource-date verification, and appropriate human review for financial safety. Not a financial-advice service, credit counseling, or proof of customer demand. Existing draft PR stays unmerged; no public deployment or fees.


## 2026-10-30 — Family & Caregiving working pilot

**Draft branch implementation:** one-place/family-handoff.html, linked from the Family & Caregiving area and related solution views. This is a first-party, free, browser-local coordination tool, not a medical or regulated caregiving service.

Functions: household role labels, primary and backup helpers, dates and review schedule; assign up to 30 responsibilities; mark tasks done/reopen/remove; flag unresolved needs and unassigned tasks; record logistical questions and professional follow-up; preview, copy or download a text handoff; reset; fictional test scenario stays labeled after edits. Keyboard-operated tab navigation and escaped DOM text reduce friction and injection risks.

**Privacy/safety:** no customer login, payments, backend, analytics, cookies, localStorage or form uploads. Data exists only in the open page; a downloaded text file is not encrypted. Avoid collecting diagnoses, medications, identifiers or other sensitive records. Tool provides no emergency response, clinical advice or legal authorization.

**Evidence:** NIA Sharing Caregiving Responsibilities (https://www.nia.nih.gov/health/caregiving/sharing-caregiving-responsibilities) and NIA Caregiver Worksheets (https://www.nia.nih.gov/health/caregiving/caregiver-worksheets). VA caregiver resource navigation is linked; eligibility and availability require provider verification.

**Testing:** The separately downloadable, more detailed founder HTML passed Chromium browser tests at 1440x900, 390x844, 320x700: sample labels, task state/counts, unassigned/concern flags, local text export, DOM injection escaping, keyboard tabs and no horizontal overflow. The in-repository compact variant has been written and source-checked, but has NOT passed equivalent independent browser acceptance or a full accessibility audit; it is not byte-identical to the downloadable version.

**Open:** independent caregiver usability tests, consent/privacy review, screen reader and 200% zoom acceptance, content review, international emergency guidance and localization. Do not publish, merge, deploy, collect payments/analytics, or spend funds without founder authorization.

**After this pilot:** complete a production-grade Job Pricing Calculator and usability validation of the free Money & Bills and Family & Caregiving journeys. Preserve the Human Literacy lessons, TEAL draft PR #5, and published main unchanged.
