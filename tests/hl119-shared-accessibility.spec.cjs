const { test, expect } = require('@playwright/test');

// HL-119/B01 shared renderer regression: real browser at narrow layout and 200% root text.
for (let lesson = 1; lesson <= 10; lesson++) {
  const number = String(lesson).padStart(2, '0');
  test('HL-119 shared accessibility: lesson ' + number + ' reflows with keyboard focus', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 700 });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('/lessons/' + number + '/');
    await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });

    const reflow = async label => {
      const width = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(width, 'Horizontal overflow at ' + label + ' in lesson ' + number).toBeLessThanOrEqual(320);
      await expect(page.locator('#app h1')).toBeVisible();
    };

    await reflow('See It');
    await page.locator('#app > button.action').first().click();
    await reflow('Understand It');
    await page.locator('#app > button.action').first().click();

    for (let scene = 0; scene < 3; scene++) {
      await reflow('Practice It scenario ' + (scene + 1));
      const options = page.locator('button.option');
      await expect(options).toHaveCount(3);
      await options.first().focus();
      await page.keyboard.press('Enter');
      await expect(options.first()).toBeFocused();
      await expect(options.first()).toHaveAttribute('aria-pressed', 'true');
      await options.nth(1).click();
      await options.nth(2).click();
      await page.getByRole('button', { name: scene === 2 ? 'Continue to Remember It' : 'Next situation', exact: true }).click();
    }

    for (let i = 0; i < 3; i++) {
      await reflow('Remember It question ' + (i + 1));
      const forward = page.getByRole('button', { name: 'Forward →', exact: true });
      await expect(forward).toBeDisabled();
      const option = page.locator('button.option').first();
      await option.focus();
      await page.keyboard.press('Enter');
      await expect(option).toBeFocused();
      await page.getByRole('button', { name: 'Submit answer', exact: true }).click();
    }

    await reflow('Results');
    await page.getByRole('button', { name: 'Continue to Live It' }).click();
    await reflow('Live It');
    expect(errors).toEqual([]);
  });
}
