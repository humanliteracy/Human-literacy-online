const { reveal } = require('./review-helpers.cjs');
const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  page.errors = [];
  page.on('pageerror', e => page.errors.push(e.message));
  // No real browser provider is contacted. These tests exercise API lifecycle only.
  await page.addInitScript(() => {
    window.speechInstances = [];
    window.speechStarts = 0;
    window.speechAborts = 0;
    window.SpeechRecognition = class {
      constructor() { speechInstances.push(this); }
      start() { speechStarts++; if (window.denySpeech) this.onerror(); }
      stop() { this.onend?.(); }
      abort() { speechAborts++; }
    };
    window.emitSpeech = text => speechInstances.at(-1).onresult({ results: [[{ transcript: text }]] });
  });
  await page.goto('/simulator/01/');
  await page.locator('#openPractice').click();
  await reveal(page, 'speechPanel');
});
test.afterEach(async ({ page }) => { expect(page.errors).toEqual([]); });

test('browser dictation has prominent separate consent and cannot start just by opening it', async ({ page }) => {
  await expect(page.locator('#speechPrivacy')).toContainText('send live speech');
  await expect(page.locator('#speechConsent')).not.toBeChecked();
  await expect(page.locator('#speechStart')).toBeDisabled();
  await reveal(page, 'recordingPanel');
  await page.locator('#recordConsent').check();
  await expect(page.locator('#speechStart')).toBeDisabled();
  expect(await page.evaluate(() => speechStarts)).toBe(0);
  await page.locator('#speechConsent').check();
  expect(await page.evaluate(() => speechInstances.length)).toBe(0);
  await expect(page.locator('#speechStart')).toBeEnabled();
});

test('dictation appends reviewable expression and never starts coaching or sends a reply', async ({ page }) => {
  await page.locator('#expressWords').fill('My first words.');
  await page.locator('#speechConsent').check();
  await page.locator('#speechStart').click();
  await page.evaluate(() => emitSpeech('The expectations are unreasonable. I quit'));
  await expect(page.locator('#expressWords')).toHaveValue('My first words. The expectations are unreasonable. I quit');
  await expect(page.locator('#coachUnderstanding')).toBeHidden();
  await expect(page.locator('#yourReply')).toHaveValue('');
  await expect(page.locator('#sceneProgress')).toHaveText('SCENE 1 OF 2');
  await expect(page.locator('#recordConsent')).not.toBeChecked();
  await page.locator('#speechStop').click();
  await page.evaluate(() => emitSpeech('A result after the session ended'));
  await expect(page.locator('#expressWords')).toHaveValue('My first words. The expectations are unreasonable. I quit');
  await expect(page.locator('#speechStart')).toBeEnabled();
  await expect(page.locator('#speechStop')).toBeDisabled();
});

for (const action of ['withdraw consent', 'close speech option', 'close tools', 'review goal', 'close private practice', 'clear private practice', 'hide page']) {
  test(`${action} cancels browser dictation and ignores late results`, async ({ page }) => {
    await page.locator('#speechConsent').check();
    await page.locator('#speechStart').click();
    if (action === 'withdraw consent') await page.locator('#speechConsent').uncheck();
    if (action === 'close speech option') await page.locator('#speechPanel > summary').click();
    if (action === 'close tools') await page.locator('#practiceTools > summary').click();
    if (action === 'review goal') {
      await page.locator('#expressWords').fill('The expectations are unreasonable. I quit');
      await page.locator('#coachUnderstand').click();
    }
    if (action === 'close private practice') await page.locator('#expressStudio > summary').click();
    if (action === 'clear private practice') await page.locator('#practiceClear').click();
    if (action === 'hide page') await page.evaluate(() => {
      Object.defineProperty(document, 'hidden', { configurable: true, value: true });
      document.dispatchEvent(new Event('visibilitychange'));
    });
    await expect.poll(() => page.evaluate(() => speechAborts)).toBe(1);
    await page.evaluate(() => emitSpeech('A stale private transcription'));
    await expect(page.locator('#expressWords')).toHaveValue(action === 'review goal' ? 'The expectations are unreasonable. I quit' : '');
    await expect(page.locator('#speechStop')).toBeDisabled();
  });
}

test('speech permission or service denial leaves the text workflow usable', async ({ page }) => {
  await page.evaluate(() => { window.denySpeech = true; });
  await page.locator('#speechConsent').check();
  await page.locator('#speechStart').click();
  await expect(page.locator('#speechStatus')).toContainText('declined or unavailable');
  await page.locator('#expressWords').fill('I need more time because the scope changed');
  await page.locator('#coachUnderstand').click();
  await expect(page.locator('#coachPath')).toHaveValue('scope');
});

test('unsupported speech recognition keeps writing and local recording available', async ({ page }) => {
  await page.addInitScript(() => { window.SpeechRecognition = undefined; window.webkitSpeechRecognition = undefined; });
  await page.reload();
  await page.locator('#openPractice').click();
  await reveal(page, 'speechPanel');
  await page.locator('#speechConsent').check();
  await expect(page.locator('#speechStart')).toBeDisabled();
  await expect(page.locator('#speechStatus')).toContainText('unavailable');
  await reveal(page, 'recordingPanel');
  await page.locator('#recordConsent').check();
  await expect(page.locator('#recordStart')).toBeEnabled();
  await page.locator('#expressWords').fill('Written fallback');
  await expect(page.locator('#expressWords')).toHaveValue('Written fallback');
});

test('starting local recording cancels browser dictation', async ({ page, context }) => {
  await context.grantPermissions(['microphone']);
  await page.locator('#speechConsent').check();
  await page.locator('#speechStart').click();
  await reveal(page, 'recordingPanel');
  await page.locator('#recordConsent').check();
  await page.locator('#recordStart').click();
  await expect(page.locator('#recordStatus')).toContainText('Recording…');
  expect(await page.evaluate(() => speechAborts)).toBe(1);
  await page.evaluate(() => emitSpeech('Late browser transcript'));
  await expect(page.locator('#expressWords')).toHaveValue('');
  await page.locator('#recordDelete').click();
});
