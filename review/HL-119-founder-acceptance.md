# HL-119 — Lesson 01 founder acceptance packet

**Prepared:** 2026-11-01 Central. **Private local test only.**  
**Existing actions:** HL-119 (P0, in progress), HL-102 (P0, curriculum), OP-103 (P0, separate founder review), OP-104 (P0, integrated draft).  
**Verified application revision:** `ead60168822be3741b5cdde2d4ca6c3c41d0af40` in [draft PR #9](https://github.com/humanliteracy/Human-literacy-online/pull/9).  
**Automated evidence:** [GitHub Actions run 41367924003](https://github.com/humanliteracy/Human-literacy-online/actions/runs/41367924003): **419/419 Chromium tests passed**; 0 broken links/errors. Eleven static missing-heading warnings are associated with JS-rendered pages; the corresponding 11 runtime heading checks passed. These are **not** physical-device or screen-reader certification.

## 1. Launch a reproducible local review without publishing

On the founder's **Chromebook Linux Terminal** (after turning on Linux and Git if necessary), use a **new separate folder** so existing work remains unchanged:

```sh
git clone --single-branch --branch review/op-104-integrated-founder-v1 \
  https://github.com/humanliteracy/Human-literacy-online.git \
  ~/op104-hl119-founder-review
cd ~/op104-hl119-founder-review
git switch --detach ead60168822be3741b5cdde2d4ca6c3c41d0af40
git rev-parse HEAD
python3 review/static_range_server.py 8765
```

The printed SHA must match `ead60168822be3741b5cdde2d4ca6c3c41d0af40`. Leave this terminal open while reviewing. The server binds only to **127.0.0.1**, supports MP4 byte-range requests, and does not make the preview public. Open **http://127.0.0.1:8765/lessons/01/** in Chrome. Do **not** open the public Pages site for this acceptance test because it uses a different revision.

If localhost refuses the connection, first confirm the terminal still displays the server startup message. If the folder already exists from an earlier attempt, **do not overwrite it**; use a new folder name. Stop the server with Ctrl+C after testing. If a different local service occupies port 8765, use 8766 in both the command and browser URL.

**Preview boundaries:** No merge, public deployment, new services, spending, telemetry, live payments, passwords, private family stories, or personal health details. Use fictional learning examples. Lesson reflections may be retained locally by the browser; review and delete them as part of privacy testing.

## 2. Seven founder checks, consolidated into one final session

Use these existing acceptance IDs in the **Acceptance** tab of the One Place master register; record observed **PASS / FAIL / BLOCKED**, device, exact SHA, and a screenshot or specific symptom. Do not infer success from the earlier browser run.

| ID | Review feature | Founder observation to capture |
|---|---|---|
| **HL-119-FINAL-01** | Entry/version | Lesson 01 opens at the pinned revision; One Place Home and All Lessons routes are clear; page is readable |
| **HL-119-FINAL-02** | **See It** video | Actual Play starts, timeline advances, back/forward 10-second controls and seek bar work; MP4 download opens; determine whether captions or an accessible text alternative are sufficient |
| **HL-119-FINAL-03** | **Understand It** | Text differentiates what happened, feelings, and interpretations accurately, respectfully and legibly |
| **HL-119-FINAL-04** | **Practice It** | Three choices in each of three scenes give meaningful feedback; Next requires the compared choices; keyboard focus remains usable |
| **HL-119-FINAL-05** | **Remember It** | Three questions require selection and submission; Forward cannot bypass unanswered questions or reveal correct answers early; Back/Forward revisit works |
| **HL-119-FINAL-06** | **Live It / return** | Results, real-world action, restart and navigation to One Place work; the action is voluntary and non-coercive |
| **HL-119-FINAL-07** | **Device & accessibility signoff** | Actual phone plus Chromebook keyboard and ChromeVox if available; check 320-pixel viewport, 200% text, horizontal overflow, button/heading announcements, and exit routes; record remaining limitations and explicit founder decision |

**Distinguish:** Chrome DevTools' 320px viewport is a useful emulation, not a physical mobile-device test; Playwright heading checks are not a screen-reader test. Natural vertical scrolling is acceptable. Do not mark a check passed if it is blocked or not observed.

## 3. Decision and endpoint

The original HL-119 endpoint remains **one complete, functional, mobile-friendly Lesson 01 with five experiences, choice-specific feedback, protected knowledge checks, independent navigation, real-world action, accessibility evidence and founder acceptance.** A passing browser suite is necessary but not sufficient.

The separate **HL-102** curriculum consistency issue remains: Lessons 03–10 currently lack a standalone Understand It screen in the reviewed source. Do not silently expand HL-119 or fabricate founder-approved content to resolve that issue.

After one combined founder session, enter seven outcomes in the existing register. Fix any **reproduced** failures in a review branch, rerun exact-head CI, then request one **final acceptance decision**. A final founder approval of the prototype **does not authorize merge or publication**. Only explicit release authorization may change `main` or public Pages.

**Release lock:** Draft PR #9 remains unmerged. No production changes or spending authorized.
