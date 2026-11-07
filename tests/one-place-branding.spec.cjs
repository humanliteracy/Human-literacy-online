const { test, expect } = require('@playwright/test');

// Existing OP-104 scope: real routes and learner behavior, never publication acceptance.
for (const width of [1366, 320]) {
  test(`ONE PLACE root: all 18 areas and 72 solution views work at ${width}px`, async ({ page }) => {
    test.setTimeout(120000);
    await page.setViewportSize({ width, height: 844 });
    const errors = [], failures = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('response', r => { if (new URL(r.url()).origin === 'http://127.0.0.1:8765' && r.status() >= 400) failures.push(r.url()); });
    await page.goto('/');
    await expect(page).toHaveTitle(/^ONE PLACE/);
    await expect(page.getByRole('heading', { name: 'Explore every part of life' })).toBeVisible();
    await expect(page.locator('.grid > a.tile')).toHaveCount(18);
    const areas = await page.locator('.grid > a.tile').evaluateAll(links => links.map(a => a.getAttribute('href')));
    const solutions = [];
    for (const area of areas) {
      await page.goto('/' + area);
      await expect(page.locator('.offers > a.offer')).toHaveCount(4);
      solutions.push(...await page.locator('.offers > a.offer').evaluateAll(links => links.map(a => a.getAttribute('href'))));
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    }
    expect(new Set(solutions).size).toBe(72);
    for (const solution of solutions) {
      await page.goto('/' + solution);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await expect(page.getByRole('link', { name: 'One Place home', exact: true })).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    }
    expect(errors).toEqual([]);
    expect(failures).toEqual([]);
  });

  test(`ONE PLACE navigation and return destinations work at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('/');
    const nav = page.getByRole('navigation', { name: 'One Place navigation' });
    const cases = [
      ['Learning home', /\/human-literacy\/$/],
      ['All lessons', /\/human-literacy\/index\.html#choose$/],
      ['Life Simulator', /\/simulator\/01\/$/],
      ['TEAL foundation (draft)', /\/teal\/$/],
      ['Money & Bills', /\/one-place\/money-bills\.html$/],
      ['Family & Caregiving', /\/one-place\/family-handoff\.html$/],
    ];
    for (const [name, url] of cases) {
      await nav.getByRole('link', { name, exact: true }).click();
      await expect(page).toHaveURL(url);
      await page.getByRole('link', { name: /One Place Home/i }).first().click();
      await expect(page).toHaveTitle(/^ONE PLACE/);
      await expect(page.getByRole('heading', { name: 'Explore every part of life' })).toBeVisible();
    }
  });
}

test('ONE PLACE: legacy catalog queries and learning bookmarks keep their destinations', async ({ page }) => {
  for (const query of ['?area=Money%20%26%20Bills', '?service=s001', '?team', '?impact']) {
    await page.goto('/one-place/index.html' + query);
    await expect(page).toHaveURL('http://127.0.0.1:8765/index.html' + query);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  }
  await page.goto('/#choose');
  await expect(page).toHaveURL(/\/human-literacy\/index\.html#choose$/);
  await expect(page.getByRole('heading', { name: 'Choose a lesson' })).toBeFocused();
  await expect(page.getByRole('link', { name: /^Start Lesson \d{2}$/ })).toHaveCount(10);
});

test('ONE PLACE: every lesson returns to the site and the component library', async ({ page }) => {
  for (let number = 1; number <= 10; number++) {
    await page.goto(`/lessons/${String(number).padStart(2, '0')}/`);
    await expect(page).toHaveTitle(/ONE PLACE/);
    const nav = page.getByRole('navigation', { name: 'One Place and lessons' });
    await nav.getByRole('link', { name: 'All Lessons', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Choose a lesson' })).toBeVisible();
    await page.getByRole('link', { name: '← One Place Home', exact: true }).click();
    await expect(page).toHaveTitle(/^ONE PLACE/);
  }
});

test('ONE PLACE: keyboard skip and search reach useful content', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content', exact: true })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
  const search = page.getByRole('searchbox', { name: 'Search every service' });
  await search.fill('caregiving');
  await search.press('Enter');
  await expect(page).toHaveURL(/service=s\d{3}/);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

test('ONE PLACE: fictional tool edits stay local and root adds no tracking or accounts', async ({ page }) => {
  const outbound = [], writes = [];
  page.on('request', r => {
    if (!r.url().startsWith('http://127.0.0.1:8765/') && !r.url().startsWith('blob:')) outbound.push(r.url());
    if (!['GET', 'HEAD'].includes(r.method())) writes.push(r.url());
  });
  await page.goto('/');
  await expect(page.locator('input[type=password],input[type=email]')).toHaveCount(0);
  await page.getByRole('navigation', { name: 'One Place navigation' }).getByRole('link', { name: 'Money & Bills', exact: true }).click();
  await page.locator('#sample').click();
  await page.locator('#cash').fill('450');
  await page.locator('#tab-plan').click();
  await expect(page.locator('#panel-plan')).toBeVisible();
  await page.getByRole('link', { name: 'One Place Home', exact: true }).click();
  await page.getByRole('navigation', { name: 'One Place navigation' }).getByRole('link', { name: 'Family & Caregiving', exact: true }).click();
  await page.locator('#sample').click();
  await page.locator('#person').fill('Fictional person');
  expect(await page.evaluate(() => Object.keys(localStorage))).toEqual([]);
  expect(outbound).toEqual([]);
  expect(writes).toEqual([]);
});

for (const prefix of ['Human-literacy-online', 'One-Place']) {
  test(`ONE PLACE: relative navigation stays under simulated project prefix ${prefix}`, async ({ page }) => {
    // Model the same static files under a project-site mount without changing Pages.
    const mount = '/' + prefix + '/';
    await page.route('http://127.0.0.1:8765/**', route => {
      const url = new URL(route.request().url());
      if (url.pathname.startsWith(mount)) {
        url.pathname = '/' + url.pathname.slice(mount.length);
        return route.continue({ url: url.href });
      }
      return route.abort();
    });
    await page.goto(mount);
    const nav = page.getByRole('navigation', { name: 'One Place navigation' });
    await nav.getByRole('link', { name: 'All lessons', exact: true }).click();
    await expect(page).toHaveURL(new RegExp(mount + 'human-literacy/index\\.html#choose$'));
    await page.getByRole('link', { name: 'Start Lesson 01', exact: true }).click();
    await expect(page).toHaveURL(new RegExp(mount + 'lessons/01/'));
    await expect(page.locator('h1')).toBeVisible();
    await page.getByRole('navigation', { name: 'One Place and lessons' }).getByRole('link', { name: 'One Place Home', exact: true }).click();
    await expect(page).toHaveURL(new RegExp(mount + 'index\\.html$'));
    await nav.getByRole('link', { name: 'Money & Bills', exact: true }).click();
    await expect(page).toHaveURL(new RegExp(mount + 'one-place/money-bills\\.html$'));
  });
}
