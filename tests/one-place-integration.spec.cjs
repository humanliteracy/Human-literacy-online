const { test, expect } = require('@playwright/test');

test('OP-104: linked learning experiences share a navigable review build', async ({page}) => {
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.setViewportSize({width:390,height:844});
  await page.goto('/human-literacy/');
  await expect(page.getByRole('link',{name:'← One Place Home'})).toBeVisible();
  await expect(page.getByRole('link',{name:'Explore TEAL'})).toBeVisible();
  await expect(page.getByRole('link',{name:'Open founder prototype'})).toHaveCount(0);
  await page.getByRole('link',{name:'← One Place Home'}).click();
  await expect(page).toHaveURL(/\/index\.html$/);
  const navigation = page.getByRole('navigation',{name:'One Place navigation'});
  await expect(navigation).toBeVisible();
  await expect(navigation.getByRole('link')).toHaveCount(7);
  await expect(navigation.getByRole('link',{name:'Explore life areas'})).toHaveAttribute('href','index.html');
  await expect(navigation.getByRole('link',{name:'All lessons'})).toHaveAttribute('href','human-literacy/index.html#choose');
  await expect(navigation.getByRole('group',{name:'Human Literacy: learning'})).toBeVisible();
  await page.goto('/one-place/index.html?area=Money%20%26%20Bills');
  await navigation.getByRole('link',{name:'Explore life areas'}).click();
  await expect(page).toHaveURL(/\/index\.html$/);
  await expect(page.getByRole('heading',{name:'Explore every part of life'})).toBeVisible();
  await navigation.getByRole('link',{name:'All lessons'}).click();
  await expect(page).toHaveURL(/\/human-literacy\/index\.html#choose$/);
  await expect(page.getByRole('heading',{name:'Choose a lesson'})).toBeVisible();
  await page.goto('/one-place/');
  await navigation.getByRole('link',{name:'TEAL foundation (draft)'}).click();
  await expect(page).toHaveURL(/\/teal\/$/);
  await page.goto('/one-place/');
  await navigation.getByRole('link',{name:'Learning home'}).click();
  await page.getByRole('link',{name:'Start Lesson 01',exact:true}).click();
  await expect(page).toHaveURL(/\/lessons\/01\/$/);
  await expect(page.locator('script[src="../../shared/lesson-record.js"]')).toHaveCount(1);
  await page.goto('/one-place/');
  await navigation.getByRole('link',{name:'Life Simulator'}).click();
  await expect(page).toHaveURL(/\/simulator\/01\/$/);
  expect(errors).toEqual([]);
});

test('OP-104 + HL-119: Lesson 01 record and quiz guard coexist',async({page})=>{
  const errors = [];
  page.on('pageerror',e=>errors.push(e.message));
  await page.setViewportSize({width:390,height:844});
  await page.goto('/lessons/01/');
  await expect(page.locator('script[src="../../shared/lesson-record.js"]')).toHaveCount(1);
  await page.getByRole('button',{name:'Continue to Understand It'}).click();
  await page.getByRole('button',{name:'Continue to Practice'}).click();
  for(let scene=0;scene<3;scene++){
    for(let i=0;i<3;i++)await page.locator('button.option').nth(i).click();
    await page.getByRole('button',{name:scene===2?'Continue to Remember It':'Next situation',exact:true}).click();
  }
  await expect(page.getByRole('button',{name:'Forward →',exact:true})).toBeDisabled();
  await page.locator('button.option').nth(1).click();
  await expect(page.getByRole('button',{name:'Forward →',exact:true})).toBeDisabled();
  await page.getByRole('button',{name:'Submit answer',exact:true}).click();
  await expect(page.getByRole('button',{name:'Forward →',exact:true})).toBeDisabled();
  expect(errors).toEqual([]);
});


test('OP-104 / TEAL: founding flow reflows and keyboard entry is meaningful', async ({ page }) => {
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  for (const width of [320, 390, 768]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('/teal/');
    await expect(page).toHaveTitle(/TEAL/);
    await expect(page.getByText('Trinity Equals Amazing Love', { exact: true })).toBeVisible();
    await expect(page.locator('a.symbol-entry')).toHaveAttribute('href', '#message-title');
    await expect(page.locator('a.alternative-entry')).toHaveAttribute('href', '#message-title');
    await expect.poll(async () => page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth
    )).toBe(true);
    const link = page.locator('a.alternative-entry');
    await link.focus();
    await expect(link).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('#message-title')).toBeFocused();
    await expect(page.locator('h1#message-title')).toContainText('To humanity');
  }
  expect(errors).toEqual([]);
});

test('OP-104 / TEAL: private review share text excludes unpublished address', async ({ page }) => {
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('/teal/');
  const share = page.locator('#share-invitation');
  const copy = page.locator('#copy-invitation');
  await expect(share).toBeVisible();
  await expect(copy).toBeVisible();
  const value = await page.locator('#invitation-text').inputValue();
  expect(value).toContain('TEAL');
  expect(value).not.toContain('https://humanliteracy.github.io/Human-literacy-online/teal/');
  await page.locator('a[href="letter.html"]').first().click();
  await expect(page).toHaveURL(/\/teal\/letter\.html$/);
  await expect(page.locator('article.founding-letter h1')).toContainText('To humanity');
  await page.getByRole('link', { name: /Return to the full experience/ }).click();
  await expect(page).toHaveURL(/\/teal\/index\.html$/);
  expect(errors).toEqual([]);
});


test('OP-104: TEAL headings have names rather than decorative section numbering',async({page})=>{
 await page.goto('/teal/');
 const kickers=page.locator('.section-kicker > span:first-child');
 expect(await kickers.allTextContents()).toEqual(expect.arrayContaining([
  'THE FOUNDING INVITATION','UNDERSTAND THE CAUSE','THREE SHARED ESSENTIALS',
  'HUMAN LITERACY ONLINE','REFLECT & ACT','TRUST & OPEN QUESTIONS'
 ]));
 for(const text of await kickers.allTextContents()){
  expect(text).not.toMatch(/^[0-9][0-9] *[/]/);
 }
 await expect(page.locator('.share-section .eyebrow')).toContainText('AN INVITATION YOU CAN PASS ALONG');
 await expect(page.locator('.share-section .eyebrow')).not.toContainText('06 /');
 await expect(page.locator('.goals-section .number')).toHaveCount(0);
 await expect(page.locator('.principles-grid .number')).toHaveCount(0);
 await expect(page.locator('.site-nav')).toHaveCSS('background-color','rgb(4, 21, 31)');
});


test('OP-104-MOBILE-320: all four planner tabs fit and switch at 320px', async ({page}) => {
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.setViewportSize({width:320,height:633});
  await page.goto('/one-place/money-bills.html');
  const tabs = page.getByRole('tablist', {name:'Money and bills steps'});
  await expect(tabs).toBeVisible();
  const geometry = await tabs.evaluate(el => ({
    overflows: el.scrollWidth > el.clientWidth + 1,
    buttons: [...el.querySelectorAll('[role="tab"]')].map(button => {
      const rect = button.getBoundingClientRect();
      return {left:rect.left, right:rect.right,
        textOverflows:button.scrollWidth > button.clientWidth + 1};
    })
  }));
  expect(geometry.overflows).toBe(false);
  expect(geometry.buttons).toHaveLength(4);
  for (const b of geometry.buttons) {
    expect(b.left).toBeGreaterThanOrEqual(0);
    expect(b.right).toBeLessThanOrEqual(320);
    expect(b.textOverflows).toBe(false);
  }
  for (const [name, panel] of [
    ['1. Overview', '#panel-overview'], ['2. Bills', '#panel-bills'],
    ['3. Income', '#panel-income'], ['4. My action plan', '#panel-plan']
  ]) {
    const tab = tabs.getByRole('tab', {name,exact:true});
    await tab.click();
    await expect(tab).toHaveAttribute('aria-selected','true');
    await expect(page.locator(panel)).toBeVisible();
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
  expect(errors).toEqual([]);
});
