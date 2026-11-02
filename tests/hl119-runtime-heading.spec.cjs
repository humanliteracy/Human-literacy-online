const { test, expect } = require('@playwright/test');

// The HTML is an interactive shell. Static source scanners cannot see headings created at render time.
// Runtime evidence complements the static source audit; it does not certify screen-reader output.
async function checkPageHeading(page, label) {
  await expect(page.getByRole('main')).toHaveCount(1);
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  const heading = page.getByRole('heading', { level: 1 });
  await expect(heading).toBeVisible();
  expect((await heading.innerText()).trim(), label).not.toBe('');
}

for (let lesson = 1; lesson <= 10; lesson++) {
  const number = String(lesson).padStart(2, '0');
  test('HL-119 runtime semantics: lesson ' + number + ' has an accessible heading after navigation', async ({page}) => {
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.setViewportSize({width:320,height:700});
    await page.goto('/lessons/' + number + '/');
    await checkPageHeading(page, 'lesson ' + number + ' entry');

    for (let step = 0; step < 3 && (await page.locator('button.option').count()) === 0; step++) {
      await page.locator('#app > button.action').first().click();
      await checkPageHeading(page, 'lesson ' + number + ' opening step ' + step);
    }
    await expect(page.locator('button.option')).toHaveCount(3);
    await checkPageHeading(page, 'lesson ' + number + ' Practice It');
    await page.locator('button.option').first().click();
    await checkPageHeading(page, 'lesson ' + number + ' feedback');
    expect(errors).toEqual([]);
  });
}

test('OP-104 runtime semantics: One Place has one main heading in core routes', async ({page}) => {
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  for (const route of ['/one-place/', '/one-place/index.html?team', '/one-place/index.html?area=Money%20%26%20Bills', '/one-place/index.html?service=money-1']) {
    await page.setViewportSize({width:320,height:700});
    await page.goto(route);
    await checkPageHeading(page, 'One Place ' + route);
  }
  expect(errors).toEqual([]);
});
