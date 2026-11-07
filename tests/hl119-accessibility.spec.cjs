const { test, expect } = require('@playwright/test');

test('HL-119: keyboard choice retains useful focus after feedback updates', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto('/lessons/01/');
  await page.getByRole('button', { name: 'Continue to Understand It' }).click();
  await page.getByRole('button', { name: 'Continue to Practice' }).click();
  const firstChoice = page.locator('button.option').first();
  await firstChoice.focus();
  await expect(firstChoice).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('.feedback').last()).toBeVisible();
  await expect(page.locator('button.option').first()).toBeFocused();
  await expect(page.locator('button.option').first()).toHaveAttribute('aria-pressed', 'true');
  expect(errors).toEqual([]);
});

test('HL-119: Lesson 01 remains readable at narrow width and enlarged text', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto('/lessons/01/');
  await expect(page.locator('h1')).toContainText('See It');
  await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
  const reflow = async () => {
    const geometry = await page.evaluate(() => ({
      viewport: window.innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      overflowers: [...document.querySelectorAll('body *')]
        .filter(el => el.getBoundingClientRect().right > window.innerWidth + 1)
        .slice(0, 12)
        .map(el => ({ tag: el.tagName.toLowerCase(), className: String(el.className),
          text: (el.textContent || '').trim().slice(0, 60),
          right: Math.round(el.getBoundingClientRect().right),
          width: Math.round(el.getBoundingClientRect().width) }))
    }));
    expect(geometry.scrollWidth, JSON.stringify(geometry)).toBeLessThanOrEqual(geometry.viewport);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'One Place and lessons' })).toBeVisible();
  };
  await reflow();
  await page.getByRole('button', { name: 'Continue to Understand It' }).click();
  await reflow();
  await page.getByRole('button', { name: 'Continue to Practice' }).click();
  await reflow();
  await expect(page.locator('button.option')).toHaveCount(3);
  await expect(page.getByRole('button', { name: 'Next situation' })).toBeDisabled();
});
