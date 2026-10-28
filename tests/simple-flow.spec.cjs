const { test, expect } = require('@playwright/test');
const { reveal } = require('./review-helpers.cjs');

for (const width of [320, 390]) {
  test.describe(`${width}px simple drafting`, () => {
    test.use({ viewport: { width, height: 844 } });
    test('one primary question at a time; optional controls stay closed and keyboard choices remain explicit', async ({ page }) => {
      const errors = [], uploads = [];
      page.on('pageerror', e => errors.push(e.message));
      page.on('request', r => { if (r.method() !== 'GET') uploads.push(r.url()); });
      await page.goto('/simulator/01/');
      await expect(page.locator('#choices button:visible')).toHaveCount(1);
      await page.locator('#replyMore > summary').focus();
      await page.keyboard.press('Enter');
      await expect(page.locator('#choices button:visible')).toHaveCount(4);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await page.locator('#openPractice').click();
      await expect(page.locator('#inputPanel')).toBeHidden();
      await expect(page.locator('#expressWords')).toBeFocused();
      await expect(page.locator('#expressionQuestion')).toBeVisible();
      await expect(page.locator('#coachUnderstanding')).toBeHidden();
      for (const id of ['recordConsent', 'recordStart', 'recordPlayer', 'speechConsent', 'practiceWords', 'rehearsedWords']) {
        await expect(page.locator('#' + id)).toBeHidden();
      }
      await page.keyboard.type('The expectations are unreasonable. I quit');
      await page.keyboard.press('Tab');
      await expect(page.locator('#coachUnderstand')).toBeFocused();
      await page.keyboard.press('Enter');
      await expect(page.locator('#coachUnderstandingTitle')).toBeFocused();
      await expect(page.locator('#expressionQuestion')).toBeHidden();
      await expect(page.locator('#coachChoices')).toBeHidden();
      await expect(page.locator('#readingDetails')).not.toHaveAttribute('open');
      await page.keyboard.press('Tab');
      await expect(page.locator('#coachPath')).toBeFocused();
      await page.keyboard.press('Tab');
      await expect(page.locator('#coachGoal')).toBeFocused();
      await page.keyboard.press('Tab');
      await page.keyboard.press('Enter');
      await expect(page.locator('#coachChoicesTitle')).toBeFocused();
      await expect(page.locator('#coachUnderstandingTitle')).toBeHidden();
      await expect(page.locator('.coach-option:visible')).toHaveCount(1);
      await page.keyboard.press('Tab');
      await expect(page.locator('#coachWording0')).toBeFocused();
      await page.keyboard.press('Tab');
      await page.keyboard.press('Enter');
      await expect(page.locator('#expressStudio')).not.toHaveAttribute('open');
      await expect(page.locator('#yourReply')).toBeFocused();
      await expect(page.locator('#sceneProgress')).toHaveText('SCENE 1 OF 2');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Enter');
      await expect(page.locator('#sceneProgress')).toHaveText('SCENE 2 OF 2');
      await expect(page.locator('#choices button:visible')).toHaveCount(1);
      await page.locator('#choices button').first().click();
      await page.locator('#send').click();
      await expect(page.locator('#completionTitle')).toBeFocused();
      await expect(page.locator('#outcome')).toBeVisible();
      await expect(page.locator('#realWorldPractice')).toBeVisible();
      await expect(page.locator('#unresolved')).toBeHidden();
      await expect(page.locator('#scoreArea')).toBeHidden();
      await expect(page.locator('#history')).toBeHidden();
      await page.keyboard.press('Tab');
      await page.keyboard.press('Enter');
      await expect(page.locator('#unresolved')).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      expect(errors).toEqual([]); expect(uploads).toEqual([]);
    });
  });
}

for (const coached of [false, true]) {
  test(`explicit resignation confirmation receives resignation-specific response (${coached ? 'coached then edited' : 'own words'})`, async ({ page }) => {
    await page.goto('/simulator/01/');
    if (coached) {
      await page.locator('#openPractice').click();
      await page.locator('#expressWords').fill('The expectations are unreasonable. I quit');
      await page.locator('#coachUnderstand').click();
      await page.locator('#coachConfirm').click();
      await page.locator('.coach-option button').first().click();
    } else await page.locator('#yourReply').fill('I am resigning.');
    await page.locator('#send').click();
    await page.locator('#yourReply').fill('I am confirming my decision to resign.');
    await page.locator('#send').click();
    await expect(page.locator('#bossWords')).toContainText('confirmed that you are resigning');
    await expect(page.locator('#bossWords')).toContainText('not treat this as agreement');
    await expect(page.locator('#bossWords')).not.toContainText('specific plan');
    await expect(page.locator('#bossWords')).not.toContainText('whether');
    await expect(page.locator('#outcome')).toContainText('leave the job');
    await expect(page.locator('#realWorldPractice')).toContainText('resignation statement');
    await expect(page.locator('#scoreArea')).toBeHidden();
  });
}

for (const closeId of ['recordingPanel', 'practiceTools']) {
test(`closing ${closeId} cancels pending permission and ignores its late stream`, async ({ page, context }) => {
  await context.grantPermissions(['microphone']);
  await page.addInitScript(() => {
    const acquire = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
    navigator.mediaDevices.getUserMedia = constraints => new Promise(resolve => {
      window.finishPermission = async () => {
        window.reviewStream = await acquire(constraints);
        resolve(window.reviewStream);
      };
    });
  });
  await page.goto('/simulator/01/');
  await page.locator('#openPractice').click();
  await reveal(page, 'recordingPanel');
  await page.locator('#recordConsent').check();
  await page.locator('#recordStart').click();
  await expect(page.locator('#recordStatus')).toContainText('Waiting');
  await page.locator('#' + closeId + ' > summary').click();
  await expect(page.locator('#recordConsent')).not.toBeChecked();
  await page.evaluate(() => finishPermission());
  await expect.poll(() => page.evaluate(() => reviewStream.getTracks().every(t => t.readyState === 'ended'))).toBe(true);
  await expect(page.locator('#recordPlayer')).not.toHaveAttribute('src');
  await expect(page.locator('#expressWords')).toBeVisible();
});
}
