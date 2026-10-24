# Human Literacy Online

Free, interactive life-skills lessons designed to be accessible without creating an account. Learners can practice everyday skills at their own pace.

## Where the site lives

- `index.html` — public lesson library and homepage.
- `lessons/01/index.html` through `lessons/05/index.html` — five interactive lessons.
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

## Educational and reuse notes

Lessons support reflection and practice; they are not psychological diagnosis or individualized professional advice.

The site is free to access. As of this review, no license file was present in the repository. Public visibility alone does not grant general permission to reuse or redistribute the source or curriculum. A license decision should be made separately.

## Review scope

Reviewed the repository's `main` branch on October 24, 2026: `index.html` and all five `lessons/*/index.html` files. This is a source-code architecture review, not a penetration test or verification of GitHub account security, GitHub Pages settings, network logs, or any unpublished services.
