const { test, expect } = require('@playwright/test');

for (let lesson = 1; lesson <= 10; lesson++) {
  const number = String(lesson).padStart(2, '0');
  test(`lesson ${number}: library navigation, feedback, quiz, completion, restart and home`, async ({ page }) => {
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('/human-literacy/');
    await page.getByRole('link', { name: `Start Lesson ${number}`, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`/lessons/${number}/`));
    await expect(page.locator('h1')).toBeVisible();
    await page.setViewportSize({ width: 390, height: 844 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    for (let intro = 0; intro < 3 && await page.locator('button.option').count() === 0; intro++) {
      await page.locator('#app > button.action').first().click();
    }
    for (let scene = 0; scene < 3; scene++) {
      const next = page.getByRole('button', { name: scene === 2 ? 'Continue to Remember It' : 'Next situation', exact: true });
      await expect(next).toBeDisabled();
      const choices = page.locator('button.option');
      expect(await choices.count()).toBe(3);
      for (let choice = 0; choice < 3; choice++) {
        await choices.nth(choice).click();
        await expect(page.locator('.feedback').last()).toBeVisible();
      }
      await expect(next).toBeEnabled();
      await next.click();
    }
    for (const answer of [1, 2, 0]) {
      const submit = page.getByRole('button', { name: 'Submit answer', exact: true });
      await expect(submit).toBeDisabled();
      await page.locator('button.option').nth(answer).click();
      await expect(submit).toBeEnabled();
      await submit.click();
    }
    await expect(page.locator('.summary')).toContainText('(3 answered)');
    if (lesson === 1) await expect(page.locator('.summary')).toContainText('3 of 3 correct');
    await page.locator('#app > button.action').first().click();
    await page.getByRole('button', { name: 'Practice lesson again', exact: true }).click();
    await expect(page.getByRole('button', { name: '← Back', exact: true })).toBeDisabled();
    await page.getByRole('button', { name: '⌂ Home', exact: true }).click();
    await expect(page).toHaveTitle(/ONE PLACE/);
    await page.getByRole('link', { name: 'All lessons', exact: true }).click();
    await expect(page.getByRole('link', { name: 'Start Lesson 10', exact: true })).toBeVisible();
    expect(errors).toEqual([]);
  });
}

for (const lesson of ['01', '02']) {
  test(`lesson ${lesson}: approved video plays`, async ({ page }) => {
    await page.goto(`/lessons/${lesson}/`);
    const video = page.locator('video');
    await expect.poll(() => video.evaluate(v => v.readyState)).toBeGreaterThanOrEqual(1);
    expect(await video.evaluate(v => v.duration)).toBeGreaterThan(100);
    const controls = page.getByRole('group', { name: 'Video playback and download options' });
    await expect(controls.getByRole('slider', { name: 'Video position' })).toBeEnabled();
    const download = controls.getByRole('link', { name: 'Download video (MP4)' });
    await expect(download).toHaveAttribute('download', /mp4$/);
    await expect(download).toHaveAttribute('href', /mp4$/);
    await video.evaluate(v => v.play());
    await expect.poll(() => video.evaluate(v => v.currentTime)).toBeGreaterThan(0.2);
    await video.evaluate(v => v.pause());
    await controls.getByRole('button', { name: 'Forward 10 seconds →' }).click();
    await expect.poll(() => video.evaluate(v => v.currentTime)).toBeGreaterThan(8);
    await controls.getByRole('button', { name: '← Back 10 seconds' }).click();
    await expect.poll(() => video.evaluate(v => v.currentTime)).toBeLessThan(5);
    await controls.getByRole('slider', { name: 'Video position' }).evaluate(el => {
      el.value = '30';
      el.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await expect.poll(() => video.evaluate(v => v.currentTime)).toBeGreaterThan(25);
    const response = await page.request.get(await download.getAttribute('href'));
    expect(response.ok()).toBe(true);
    expect((response.headers()['content-type'] || '')).toContain('video/mp4');
    expect(await response.body()).not.toHaveLength(0);
    expect(await video.evaluate(v => v.error)).toBe(null);
  });
}


test('HL-119: unanswered Remember It cannot be bypassed with Forward', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/lessons/01/');
  await page.getByRole('button', { name: 'Continue to Understand It' }).click();
  await page.getByRole('button', { name: 'Continue to Practice' }).click();
  for (let scene = 0; scene < 3; scene++) {
    const options = page.locator('button.option');
    for (let choice = 0; choice < 3; choice++) await options.nth(choice).click();
    await page.getByRole('button', { name: scene === 2 ? 'Continue to Remember It' : 'Next situation', exact: true }).click();
  }
  const forward = page.getByRole('button', { name: 'Forward →', exact: true });
  const submit = page.getByRole('button', { name: 'Submit answer', exact: true });
  await expect(forward).toBeDisabled();
  await expect(submit).toBeDisabled();
  await page.locator('button.option').nth(1).click();
  await expect(forward).toBeDisabled();
  await submit.click();
  await expect(forward).toBeDisabled();
  await page.getByRole('button', { name: '← Back', exact: true }).click();
  await expect(forward).toBeEnabled();
  await forward.click();
  await expect(forward).toBeDisabled();
  for (const answer of [2, 0]) {
    await page.locator('button.option').nth(answer).click();
    await page.getByRole('button', { name: 'Submit answer', exact: true }).click();
  }
  await expect(page.locator('.summary')).toContainText('3 of 3 correct');
  await page.getByRole('button', { name: 'Continue to Live It' }).click();
  await expect(page.locator('h1')).toContainText('Take the skill into real life');
  expect(errors).toEqual([]);
});
