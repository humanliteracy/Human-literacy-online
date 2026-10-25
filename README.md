# Human Literacy Online

Free, interactive life-skills lessons designed to be accessible without creating an account. Learners can practice everyday skills at their own pace.

## Where the site lives

- `index.html` — public lesson library and homepage.
- `lessons/01/index.html` through `lessons/10/index.html` — ten interactive lessons.
- `simulator/01/index.html` — optional workplace roleplay and private expression/rehearsal.
- Each page contains its own HTML, styling, and JavaScript. No application backend, authentication service, or database exists in the tracked site code reviewed on October 24, 2026.

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

At the time of review, the six tracked HTML pages contain no application API calls for submitting answers, no login flow, and no application code using cookies, `localStorage`, or `sessionStorage` to retain progress. Refreshing the lesson resets its in-memory progress.

**Privacy boundary:** This describes the application source, not all behavior of the hosting platform, browser, network, or optional future integrations. Hosting providers may process access logs such as IP addresses. Do not promise that every website visit is completely untracked.

## Security and maintenance

- Enable strong GitHub account security (prefer passkeys or two-factor authentication).
- Give repository write access only to people or integrations that need it.
- Review repository visibility, branch protections, deployment configuration, and authorized GitHub Apps in GitHub settings. These settings cannot be verified solely from this repository's HTML files.
- Keep credentials out of commits, screenshots, lesson content, and published pages. If a future workflow needs secrets, use an appropriate protected secret store and never send secret values to the browser.
- Review changes before publication; preserve working lessons and test navigation, keyboard access, mobile layout, choices, feedback, scoring, and completion.
- If user accounts, analytics, server-side progress storage, or third-party scripts are added later, revise this document and review privacy and security before release.

## Optional private expression and rehearsal

The simulator's **Express → Listen Back → Rehearse** panel is closed by default and can be skipped entirely. Write a first reaction, optionally record and listen back, then draft a response in your own words. Private expression is never graded. Roleplay has no visible grade by default; numerical feedback requires choosing **Show optional communication score**.

Microphone recording requires both an explicit consent checkbox and pressing **Record**. Audio remains in page memory with a 90-second limit; it is not uploaded, transcribed, or sent to a speech service. Delete, withdrawing consent, closing the panel, or leaving the page releases the microphone and discards audio. Hiding the page stops an active recording or cancels a pending microphone request. **Clear all private practice** also clears the private writing. The browser independently controls microphone permission, and a deployed site needs HTTPS for recording (loopback HTTP works for local development).

Only **Move draft to simulator** copies the rehearsal draft into the roleplay reply. It does not send it; the learner reviews the reply and chooses **Say this** separately. A completed roleplay starts over when a draft is moved. Clearing private practice does not erase a reply already copied to the simulator.

This interaction uses local browser recording and authored roleplay rules. There is no provider integration or provider API key in client code.

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

The suite starts its own local server on port 8765, which must be free. Run just the browser suite with `npm run test:browser`, or the existing static audit with `npm run audit`. The HTML report is written to `playwright-report/`; failed tests retain traces in `test-results/`. These generated files are ignored by Git.

Regression coverage includes every lesson's library navigation, practice feedback and gating, quiz submission, completion, restart, mobile layout, and home navigation; both approved videos; and simulator consent, playback, cleanup, recording races, written fallback, explicit draft transfer, keyboard access, and scoring defaults. Audio tests use Chromium's synthetic microphone, not a person's voice. Permission and race failures are simulated. Physical microphone quality and other browsers still need manual checks.

GitHub Actions runs the static audit and browser suite on pushes and pull requests. The static audit currently reports ten missing-static-H1 warnings because lesson headings are created by JavaScript; the browser tests require visible rendered headings.

## Educational and reuse notes

Lessons support reflection and practice; they are not psychological diagnosis or individualized professional advice.

## Open reuse and licensing

**Software code:** Original HTML, CSS, and JavaScript are released under the [MIT License](LICENSE). Preserve the required license and copyright notice when redistributing substantial portions of that code.

**Educational content:** Original Human Literacy lesson narratives, scenarios, questions, answers, feedback, and other educational prose are dedicated to the public domain under [CC0 1.0 Universal](CONTENT-LICENSE.md), to the extent the project owns or controls the relevant rights. That content may be copied, adapted, translated, and redistributed, including commercially, without seeking permission or giving credit. Attribution is appreciated but not required.

These permissions do not grant rights in third-party material, trademarks, or someone else’s identity. Material with its own license or attribution notice remains subject to that notice. See [CONTENT-LICENSE.md](CONTENT-LICENSE.md) for scope and caveats.

Do not assume new external contributions are covered by these terms unless contributors hold the necessary rights and clearly agree to them.

## Review scope

Reviewed the repository's `main` branch on October 24, 2026: `index.html` and all five `lessons/*/index.html` files. This is a source-code architecture review, not a penetration test or verification of GitHub account security, GitHub Pages settings, network logs, or any unpublished services.
