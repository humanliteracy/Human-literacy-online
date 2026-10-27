const { reveal } = require('./review-helpers.cjs');
const { test, expect } = require('@playwright/test');

async function understand(page, words = 'The expectations are unreasonable. I quit') {
  await reveal(page, 'expressStudio');
  if (!await page.locator('#expressWords').isVisible()) await page.locator('#coachEditExpression').click();
  await page.locator('#expressWords').fill(words);
  await page.locator('#coachUnderstand').click();
  await expect(page.locator('#coachUnderstandingTitle')).toBeFocused();
}
async function confirm(page) {
  await page.locator('#coachConfirm').click();
  await expect(page.locator('#coachChoicesTitle')).toBeFocused();
  await expect(page.locator('.coach-option:visible')).toHaveCount(1);
  await expect(page.locator('#coachReview')).not.toHaveAttribute('open');
}
async function readableActions(page) {
  const controls = await page.locator('.actions button:visible, .actions a:visible, #coachUnderstand:visible, .coach-option button:visible').evaluateAll(nodes => nodes.map(node => {
    const range = document.createRange(); range.selectNodeContents(node);
    const lines = [];
    for (const rect of range.getClientRects()) {
      if (rect.width && rect.height && !lines.some(top => Math.abs(top - rect.top) < 3)) lines.push(rect.top);
    }
    return { text: node.textContent.trim(), lines: lines.length, height: node.getBoundingClientRect().height, clipped: node.scrollWidth > node.clientWidth };
  }));
  expect(controls.length).toBeGreaterThan(0);
  for (const control of controls) {
    expect(control, 'Action text stays on one line').toMatchObject({ lines: 1, clipped: false });
    expect(control.height, control.text).toBeGreaterThanOrEqual(44);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
}

for (const width of [320, 390]) {
  test.describe(`${width}px mobile review`, () => {
    test.use({ viewport: { width, height: 844 } });
    test.beforeEach(async ({ page }) => {
      page.errors = [];
      page.on('pageerror', error => page.errors.push(error.message));
      await page.goto('/simulator/01/');
      await page.locator('#openPractice').click();
    });
    test.afterEach(async ({ page }) => { expect(page.errors).toEqual([]); });

    test('one suggestion first; every alternative remains readable, editable, and reusable', async ({ page }) => {
      await understand(page);
      await confirm(page);
      await expect(page.locator('.coach-option')).toHaveCount(3);
      await expect(page.locator('#coachWording1')).toBeHidden();
      await expect(page.locator('#coachWording2')).toBeHidden();
      const collapsed = await page.locator('#coachFlow').evaluate(n => n.getBoundingClientRect().height);
      await page.locator('#coachMore > summary').click();
      await expect(page.locator('.coach-option:visible')).toHaveCount(3);
      await expect.poll(() => page.locator('.coach-option textarea').evaluateAll(nodes => nodes.every(n => n.scrollHeight <= n.clientHeight))).toBe(true);
      await page.locator('#coachWording1').fill('I am resigning. I want to discuss notice and any handover.');
      await page.locator('#coachMore > summary').click();
      await expect(page.locator('.coach-option:visible')).toHaveCount(1);
      await page.locator('#coachMore > summary').click();
      await expect(page.locator('#coachWording1')).toHaveValue('I am resigning. I want to discuss notice and any handover.');
      const expanded = await page.locator('#coachFlow').evaluate(n => n.getBoundingClientRect().height);
      expect(expanded - collapsed).toBeGreaterThan(200);
      expect(collapsed).toBeLessThan(1200);
      await readableActions(page);
      await page.locator('#expressStudio > summary').click();
      await page.setViewportSize({ width: width === 320 ? 390 : 320, height: 844 });
      await page.locator('#expressStudio > summary').click();
      await expect.poll(() => page.locator('.coach-option textarea').evaluateAll(nodes => nodes.every(n => n.scrollHeight <= n.clientHeight))).toBe(true);
      await expect(page.locator('#coachWording1')).toHaveValue('I am resigning. I want to discuss notice and any handover.');
      await readableActions(page);
      await expect(page.locator('#yourReply')).toHaveValue('');
      await expect(page.locator('#sceneProgress')).toHaveText('SCENE 1 OF 2');
    });

    test('keyboard reaches hidden alternatives, submits only by choice, and focuses completion and replay', async ({ page }) => {
      await understand(page);
      await confirm(page);
      await page.locator('.coach-option button').first().focus();
      await page.keyboard.press('Tab');
      await expect(page.locator('#coachMore > summary')).toBeFocused();
      await page.keyboard.press('Enter');
      await page.keyboard.press('Tab');
      await expect(page.locator('#coachWording1')).toBeFocused();
      await page.keyboard.press('ControlOrMeta+A');
      await page.keyboard.type('I am resigning. I need to clarify notice.');
      await page.keyboard.press('Tab');
      await expect(page.getByRole('button', { name: /Use this wording: Explain without accepting/ })).toBeFocused();
      await page.keyboard.press('Space');
      await expect(page.locator('#yourReply')).toBeFocused();
      await expect(page.locator('#yourReply')).toHaveValue('I am resigning. I need to clarify notice.');
      await expect(page.locator('#sceneProgress')).toHaveText('SCENE 1 OF 2');
      await page.keyboard.press('Tab');
      await expect(page.locator('#send')).toBeFocused();
      await page.keyboard.press('Enter');
      await expect(page.locator('#sceneProgress')).toHaveText('SCENE 2 OF 2');
      await expect(page.locator('#replyHeading')).toBeFocused();
      await page.keyboard.press('Tab');
      await expect(page.locator('#yourReply')).toBeFocused();
      await page.keyboard.press('Tab');await expect(page.locator('#send')).toBeFocused();
      await page.keyboard.press('Tab');await expect(page.locator('#openPractice')).toBeFocused();
      if(await page.locator('#finishHere').isVisible()){await page.keyboard.press('Tab');await expect(page.locator('#finishHere')).toBeFocused();}
      await page.keyboard.press('Tab');await expect(page.locator('#choices button').first()).toBeFocused();
      await page.keyboard.press('Enter');
      await expect(page.locator('#yourReply')).toBeFocused();
      await page.keyboard.press('Tab');
      await page.keyboard.press('Enter');
      await expect(page.locator('#completionTitle')).toBeFocused();
      await page.keyboard.press('Tab');
      await expect(page.locator('#reflectionReview > summary')).toBeFocused();
      await page.keyboard.press('Enter');
      await expect(page.locator('#reflectionBasis')).toBeHidden();
      await page.keyboard.press('Tab');
      await expect(page.locator('#feedbackEvidencePanel > summary')).toBeFocused();
      await page.keyboard.press('Enter');
      await expect(page.locator('#reflectionBasis')).toBeVisible();
      await page.keyboard.press('Tab');
      await expect(page.locator('#replay')).toBeFocused();
      await page.keyboard.press('Enter');
      await expect(page.locator('#replyHeading')).toBeFocused();
      await page.keyboard.press('Tab');
      await expect(page.locator('#yourReply')).toBeFocused();
      await page.keyboard.press('Tab');await expect(page.locator('#send')).toBeFocused();
      await page.keyboard.press('Tab');await expect(page.locator('#openPractice')).toBeFocused();
      if(await page.locator('#finishHere').isVisible()){await page.keyboard.press('Tab');await expect(page.locator('#finishHere')).toBeFocused();}
      await page.keyboard.press('Tab');await expect(page.locator('#choices button').first()).toBeFocused();
    });

    test('short action labels fit at each stage without narrow multi-line buttons', async ({ page }) => {
      await readableActions(page);
      await reveal(page, 'speechPanel');
      await readableActions(page);
      await understand(page);
      await readableActions(page);
      await confirm(page);
      await readableActions(page);
      await page.locator('#coachMore > summary').click();
      await readableActions(page);
    });

    test('every learner-chosen path can use the last alternative and keeps relevant consequences', async ({ page }) => {
      const paths = [
        ['boundary', 'refusal or limit', 'decline'],
        ['resign', 'leave the job', 'resignation statement'],
        ['scope', 'clarify', 'one question'],
        ['help', 'need for support', 'support'],
        ['pause', 'pause', 'asking for a pause'],
        ['recovery', 'recovery plan', 'what remains'],
        ['custom', 'clarify', 'one question'],
      ];
      for (const [path, consequence, action] of paths) {
        await understand(page, 'I want to choose what I communicate.');
        await page.locator('#coachPath').selectOption(path);
        await page.locator('#coachGoal').fill('My own decision: ' + path);
        await confirm(page);
        await page.locator('#coachMore > summary').click();
        await page.locator('.coach-option button').last().click();
        await expect(page.locator('#yourReply')).toBeFocused();
        await expect(page.locator('#sceneProgress')).toHaveText('SCENE 1 OF 2');
        await page.locator('#send').click();
        if(path==='pause') {await expect(page.locator('#inputPanel')).toBeHidden();await expect(page.locator('#history .mine')).toHaveCount(1);}
        else {await page.locator('#choices button').first().click();await page.locator('#send').click();}
        await expect(page.locator('#outcome')).toContainText(consequence);
        await expect(page.locator('#reflectionBasis')).toContainText('My own decision: '+path);
        if(path==='scope')await expect(page.locator('#history .mine').last()).toContainText('Please confirm the agreed scope');
        await expect(page.locator('#unresolved')).not.toBeEmpty();
        await expect(page.locator('#realWorldPractice')).toContainText(action);
        await expect(page.locator('#scoreArea')).toBeHidden();
        await page.locator('#replay').click();
      }
    });

    test('goal review can be reopened by keyboard, edited or rejected, without losing the expression', async ({ page }) => {
      await understand(page);
      await confirm(page);
      await page.locator('#coachReview > summary').focus();
      await page.keyboard.press('Enter');
      await page.keyboard.press('Tab');
      await expect(page.locator('#coachPath')).toBeFocused();
      await expect(page.locator('#coachChoices')).toBeHidden();
      await page.keyboard.press('Tab');
      await expect(page.locator('#coachGoal')).toBeFocused();
      await page.keyboard.press('ControlOrMeta+A');
      await page.keyboard.type('I want to leave after clarifying notice.');
      await expect(page.locator('#coachChoices')).toBeHidden();
      await page.keyboard.press('Tab');
      await page.keyboard.press('Enter');
      await expect(page.locator('#coachChoicesTitle')).toBeFocused();
      await expect(page.locator('#coachChosenGoal')).toContainText('clarifying notice');
      await expect(page.locator('#coachMore')).not.toHaveAttribute('open');
      await page.locator('#coachReview > summary').click();
      await reveal(page, 'readingDetails');
      await page.locator('#coachReject').click();
      await expect(page.locator('#coachPath')).toBeFocused();
      await expect(page.locator('#coachGoal')).toHaveValue('');
      await expect(page.locator('#coachOptions')).toBeEmpty();
      await expect(page.locator('#expressWords')).toHaveValue('The expectations are unreasonable. I quit');
    });

    test('clearing private practice removes hidden alternatives and prevents private goal resurfacing', async ({ page }) => {
      await understand(page);
      await page.locator('#coachGoal').fill('Private goal: make a change for my family.');
      await confirm(page);
      await page.locator('#coachMore > summary').click();
      await page.locator('#coachWording2').fill('I am resigning. This is my decision.');
      await page.locator('#coachMore > summary').click();
      await page.locator('.coach-option button').first().click();
      await page.locator('#send').click();
      await reveal(page, 'expressStudio');
      await page.locator('#practiceClear').click();
      await page.locator('#returnToReply').click();
      await expect(page.locator('#coachOptions')).toBeEmpty();
      await expect(page.locator('#coachMore')).toHaveCount(0);
      await page.locator('#choices button').first().click();
      await page.locator('#send').click();
      await page.locator('#reflectionReview > summary').click();
      await expect(page.locator('#reflectionBasis')).not.toContainText('my family');
      await expect(page.locator('#reflectionBasis')).toContainText('private goal wording was cleared');
      await expect(page.locator('#recordConsent')).not.toBeChecked();
      await expect(page.locator('#speechConsent')).not.toBeChecked();
    });

    test('completion shows consequences, open questions and a next step without repeating the takeaway', async ({ page }) => {
      await understand(page);
      await confirm(page);
      await page.locator('.coach-option button').first().click();
      await page.locator('#send').click();
      await page.locator('#choices button').first().click();
      await page.locator('#send').click();
      await expect(page.locator('#completionTitle')).toBeFocused();
      await expect(page.locator('#outcome')).toBeVisible();
      await expect(page.locator('#outcome')).toContainText('assignment is not accepted');
      await expect(page.locator('#unresolved')).toBeHidden();
      await expect(page.locator('#unresolved')).toContainText('final pay');
      await expect(page.locator('#realWorldPractice')).toBeVisible();
      await expect(page.locator('#realWorldPractice')).toContainText('resignation statement');
      await expect(page.locator('#takeaway')).toHaveCount(0);
      await expect(page.locator('#madeClear')).toBeHidden();
      await expect(page.locator('#reflectionReview')).not.toHaveAttribute('open');
      expect(await page.locator('#endPanel').evaluate(n => n.getBoundingClientRect().height)).toBeLessThan(1200);
      await readableActions(page);
      await page.locator('#reflectionReview > summary').click();
      await expect(page.locator('#madeClear')).toContainText('decision to leave the job');
      await expect(page.locator('#reflectionBasis')).toContainText('I want to resign');
    });

    test('declining microphone access leaves alternatives and custom drafts usable without uploads', async ({ page }) => {
      await page.addInitScript(() => {
        window.micRequests = 0;
        navigator.mediaDevices.getUserMedia = () => { micRequests++; return Promise.reject(new DOMException('Declined', 'NotAllowedError')); };
      });
      await page.reload();
      await page.locator('#openPractice').click();
      const requests = [];
      page.on('request', r => requests.push({ method: r.method(), url: r.url() }));
      await understand(page);
      await confirm(page);
      await page.locator('#coachMore > summary').click();
      expect(await page.evaluate(() => micRequests)).toBe(0);
      await reveal(page, 'recordingPanel');
      await page.locator('#recordConsent').check();
      await page.locator('#recordStart').click();
      await expect(page.locator('#recordStatus')).toContainText('permission was declined');
      await page.locator('#recordConsent').uncheck();
      await expect(page.locator('.coach-option:visible')).toHaveCount(3);
      await reveal(page, 'rehearsalPanel');
      await page.locator('#practiceWords').fill('I choose my own words and boundaries.');
      await reveal(page, 'rehearsalPanel');
      await page.locator('#practiceTransfer').click();
      await expect(page.locator('#yourReply')).toHaveValue('I choose my own words and boundaries.');
      await expect(page.locator('#sceneProgress')).toHaveText('SCENE 1 OF 2');
      await expect(page.locator('#recordConsent')).not.toBeChecked();
      await expect(page.locator('#speechConsent')).not.toBeChecked();
      await expect(page.getByRole('checkbox', { name: /score|grade/i })).toHaveCount(0);
      expect(requests.every(r => r.method === 'GET' && new URL(r.url).origin === 'http://127.0.0.1:8765')).toBe(true);
      expect(await page.evaluate(() => [document.cookie, localStorage.length, sessionStorage.length])).toEqual(['', 0, 0]);
    });
  });
}
