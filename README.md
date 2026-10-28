# Human Literacy Online

Free, interactive life-skills lessons designed to be accessible without creating an account. Learners can practice everyday skills at their own pace.

## Where the site lives

- `index.html` — public lesson library and homepage.
- `lessons/01/index.html` through `lessons/10/index.html` — ten interactive lessons.
- `simulator/01/index.html` — optional workplace roleplay and private expression/rehearsal.
- The lesson pages contain their own HTML, styling and JavaScript. The simulator also loads `coach.js`, `dialogue.js` and `speech.js` from its own directory. There is no application backend, visitor authentication service or database in this static site.

## Publication control

GitHub Pages serves [Human Literacy Online](https://humanliteracy.github.io/Human-literacy-online/) from the repository root on **`main`**. Merging or pushing to `main` starts public deployment automatically; there is no separate manual publish step. Browser-test CI is a separate workflow and does not itself hold back Pages.

Use the [release and rollback checklist](docs/release-checklist.md) before changing `main`. Founder acceptance of PR #2 has been granted; the current release-preparation assignment does **not** authorize merging or publication. Do not change Pages settings, upload replacement videos or activate services to release this static prototype.

## Authentication: visitors versus maintainers

**Visitors:** No login, registration, password, or account is required. The application does not create user sessions or issue access tokens.

**Maintainers:** GitHub authenticates and authorizes repository changes outside this website. Depending on the maintainer's workflow, GitHub access can use a browser login, SSH credentials, personal access tokens, or GitHub App authorization. The repository files do not reveal which credential a maintainer or connected integration uses, nor how that credential is stored.

Do **not** put passwords, personal access tokens, OAuth client secrets, or private keys in this public repository or client-side JavaScript.

## How a lesson works

1. A visitor opens the homepage or a direct lesson link.
2. A static website host delivers the page's HTML, CSS, and JavaScript.
3. The visitor chooses an answer; the browser updates in-memory JavaScript variables.
4. JavaScript displays feedback, advances the lesson, and calculates a score locally.
5. Results are displayed in the browser without being attached to an account.

The 13 site HTML pages include the homepage, ten lessons, the simulator and support. The site does not submit lesson answers to an application API or retain learner progress in cookies, `localStorage` or `sessionStorage`; refreshing a lesson resets its in-memory progress. The simulator clears its conversation and private writing when leaving or refreshing. The separate local-review launcher uses an HttpOnly session cookie to control access to its loopback preview, not to save learner answers.

**Privacy boundary:** This describes the application source, not all behavior of the hosting platform, browser, network, or optional future integrations. Hosting providers may process access logs such as IP addresses. Do not promise that every website visit is completely untracked.

## Security and maintenance

- Enable strong GitHub account security (prefer passkeys or two-factor authentication).
- Give repository write access only to people or integrations that need it.
- Review repository visibility, branch protections, deployment configuration, and authorized GitHub Apps in GitHub settings. These settings cannot be verified solely from this repository's HTML files.
- Keep credentials out of commits, screenshots, lesson content, and published pages. If a future workflow needs secrets, use an appropriate protected secret store and never send secret values to the browser.
- Review changes before publication; preserve working lessons and test navigation, keyboard access, mobile layout, choices, feedback, scoring, and completion.
- If user accounts, analytics, server-side progress storage, or third-party scripts are added later, revise this document and review privacy and security before release.

## Optional private expression and rehearsal

The simulator is an **always-unscored scripted prototype**, not live AI or a measurement of communication ability. Numerical communication scoring and its opt-in control have been removed. The approved lessons' local knowledge quizzes remain unchanged.

**Type your reply** is the main route. Optional suggestions only fill an editable draft; **Say this** explicitly submits it to fictional Jordan. **Help me draft** opens **Private drafting**. Write a first reaction, use **Next** to review a tentative interpretation and editable private goal, then choose **Use my goal**. The coach combines curated examples and bounded wording rules; it cannot establish feelings, whole intentions or the meaning of arbitrary language. Learners can reject a reading or choose another path, including resignation, refusal, negotiation, support, a break or ending the conversation.

One editable suggestion is shown first; **More responses (2)** reveals the alternatives. **Change goal** reopens the goal controls, with interpretation detail under **Why this suggestion?**. Confirmed resignation conditions remain in the editable wording; preserving text does not imply the script understood every condition. No response is universally correct. Unfamiliar wording receives a transparent limitation rather than a fabricated grade.

**Use this wording** and rehearsal's **Move draft** only transfer text to the simulator. They never send it. Moving a draft after completion starts a new conversation; **Restore prior draft**, when offered, recovers displaced writing. The simulation has up to two submitted replies. Stop and pause requests can end it after one; **Finish here** ends an optional follow-up without sending unfinished writing. **Back/Forward** review saved progress without sending; explicitly choosing **Say this** on an earlier reply replaces dependent later progress. **Try again** starts a fresh conversation. **Back to all lessons** goes directly to the homepage's lesson list.

Completion shows one takeaway and one optional practical action. **Why this happened and what to try** opens meaningful feedback and unresolved questions; technical matching detail stays under **Wording and practice detail**. Jordan responds to submitted words, not a private goal. Resignation, refusal and a temporary break are distinct; no extra work, willingness to negotiate or employment/legal outcome is assumed. Scripted coverage remains limited.

**Record and listen back**, **Optional browser speech-to-text**, rehearsal and privacy controls are under **Tools and privacy**, closed by default:

- **Local recording:** both the microphone consent checkbox and **Record** are required. Audio remains in page memory for a take of at most 90 seconds; it is not uploaded or transcribed. Playback never starts automatically. Stopping, deleting, withdrawing consent, closing the relevant tools or leaving the page release recording resources as applicable; hiding the page stops recording or cancels pending permission. **Clear private** clears private writing and local audio without erasing an already transferred simulator reply or transcript. The browser separately controls microphone permission. Public recording needs HTTPS; loopback HTTP works locally.
- **Browser dictation:** separate consent plus **Dictate expression** starts optional speech-to-text where supported. The browser's speech provider may process live speech externally; this is not transcription of saved local audio. Each session is limited to 60 seconds. Text is reviewable in the private draft and is not sent to Jordan automatically. Typing protects edits by stopping dictation. Recording and dictation cancel one another so they do not run concurrently. Declining or unavailable dictation leaves typing available; local recording does not depend on a speech provider. Provider availability, processing and retention are outside this site's control.

There is no AI provider integration, backend, billing activation, or provider API key in client code. The [adapter design](docs/communication-coach-adapter.md) separates the working v1 scripted prototype from a future, explicitly consented server-side AI service. Nothing in that design is enabled in v1.

## Development and browser regression tests

The site has no runtime dependencies or build step. Serve it from the repository root:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Tests need Python 3 and Node.js 22 or newer. Install the pinned development dependencies and Chromium, then run the static audit and browser suite:

```sh
npm ci
npx playwright install chromium
npm test
```

On Linux, `npx playwright install --with-deps chromium` also installs browser system dependencies. If Chromium is already installed, use it explicitly instead of downloading a browser:

```sh
BROWSER_EXECUTABLE_PATH=/usr/bin/chromium npm test
```

The suite starts its own local server on port 8765, which must be free. Run just the browser suite with `npm run test:browser`, the static audit with `npm run audit`, or parse all shipped inline/external JavaScript with `npm run check:js`. `npm test` runs all three. The HTML report is written to `playwright-report/`; failed tests retain traces in `test-results/`. These generated files are ignored by Git.

Regression coverage includes every lesson's library navigation, practice feedback and gating, quiz submission, completion, restart, mobile layout, and home navigation; both approved videos; simulator consent, playback, cleanup, recording races, written fallback, explicit draft transfer, keyboard access and the absence of communication grades; and coaching examples, clarification, rejection, goal fidelity, editing, private cleanup, resignation/stop/refusal distinctions and path-specific reflection. The mobile suite separately checks 320px and 390px: disclosures, every alternative and goal, one-line action labels, 44px touch targets, keyboard/focus transitions, resizing, concise completion, and privacy fallbacks. Audio tests use Chromium's synthetic microphone, not a person's voice. Permission/race failures and browser dictation lifecycle use controlled simulations. Physical microphone quality, live speech-provider behavior, screen-reader software, and other browsers still need manual checks.

GitHub Actions runs the static audit and browser suite on pushes and pull requests. The static audit currently reports ten missing-static-H1 warnings because lesson headings are created by JavaScript; the browser tests require visible rendered headings.

## Educational and reuse notes

Lessons support reflection and practice; they are not psychological diagnosis or individualized professional advice.

## Open reuse and licensing

**Software code:** Original HTML, CSS, and JavaScript are released under the [MIT License](LICENSE). Preserve the required license and copyright notice when redistributing substantial portions of that code.

**Educational content:** Original Human Literacy lesson narratives, scenarios, questions, answers, feedback, and other educational prose are dedicated to the public domain under [CC0 1.0 Universal](CONTENT-LICENSE.md), to the extent the project owns or controls the relevant rights. That content may be copied, adapted, translated, and redistributed, including commercially, without seeking permission or giving credit. Attribution is appreciated but not required.

These permissions do not grant rights in third-party material, trademarks, or someone else’s identity. Material with its own license or attribution notice remains subject to that notice. See [CONTENT-LICENSE.md](CONTENT-LICENSE.md) for scope and caveats.

Do not assume new external contributions are covered by these terms unless contributors hold the necessary rights and clearly agree to them.

## Review scope

These instructions describe the accepted static application in PR #2: the homepage, all ten lessons, the simulator and support, including its external JavaScript files. The [final quality review](docs/final-quality-review.md) records 356 passing browser cases; the [release checklist](docs/release-checklist.md) records the accepted revision, verified CI and Pages state, outstanding issue scope and publication/rollback gates. Earlier review packets identify their own historical revisions and are not automatically the release candidate. Source review and synthetic browser tests are not a penetration test, account-security audit, physical-device certification or inspection of hosting logs/unpublished services.
