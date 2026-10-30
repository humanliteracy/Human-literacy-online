const { test, expect } = require('@playwright/test');
const fs = require('node:fs/promises');
async function reach(page, selector) {
  for(let step=0;step<14;step++) {
    if(await page.locator(selector).count()) return;
    await page.getByRole('button', { name: 'Forward →' }).click();
  }
  await expect(page.locator(selector)).toBeVisible();
}
for (let n = 1; n <= 10; n++) {
  const num = String(n).padStart(2, '0');
  test("lesson "+num+": reflection, plan, private export and erasure", async ({ page }) => {
    const errors = [];
    page.on('pageerror', e => errors.push(String(e)));
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/lessons/"+num+"/");
    await reach(page, '#teal-recall');
    await expect(page.locator('#teal-recall')).toBeVisible();
    await page.locator('#teal-recall').fill("My reflection on lesson "+num+": protect my limits and consider others.");
    await page.getByRole('button', { name: 'Review my reflection' }).click();
    await expect(page.locator('#teal-remember-feedback')).toContainText('consideration for other people');
    await page.getByRole('button', { name: 'Forward →' }).click();
    await expect(page.locator('#teal-plan')).toBeVisible();
    await page.locator('#teal-plan').fill('Ask a clear question before responding tomorrow.');
    await page.locator('#teal-self').fill('Keep my time limits clear.');
    await page.locator('#teal-others').fill('Listen without interrupting.');
    await page.locator('#teal-everything').fill('Preserve trust.');
    await page.getByRole('button', { name: 'Review my plan' }).click();
    await expect(page.locator('#teal-plan-feedback')).toContainText('No observed outcome has been reported');
    await page.getByRole('button', { name: 'Update my record' }).click();
    await expect(page.locator('#teal-full-report')).toContainText("My reflection on lesson "+num);
    await expect(page.locator('#teal-full-report')).toContainText('Ask a clear question');
    await expect(page.locator('#teal-full-report')).toContainText('Not reported yet');
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: 'Save as text' }).click()
    ]);
    expect(download.suggestedFilename()).toContain("TEAL_Lesson_"+num+"_Record_");
    const text=await fs.readFile(await download.path(),'utf8');
    expect(text).toContain("My reflection on lesson "+num);
    expect(text).toContain("No observed outcome");
    await page.reload();
    await reach(page, '#teal-plan');
    await expect(page.locator('#teal-plan')).toHaveValue('Ask a clear question before responding tomorrow.');
    page.once('dialog', dialog => dialog.accept());
    await page.getByRole('button', { name: 'Erase this lesson record' }).click();
    await expect(page.locator('#teal-plan')).toHaveValue('');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(errors).toEqual([]);
  });
}
test('lesson 05: print action prepares a stand-alone learning record', async ({ page }) => {
  await page.goto('/lessons/05/');
  await reach(page, '#teal-plan');
  await page.evaluate(() => { window.__printRequested = false; window.print = () => { window.__printRequested = true; }; });
  await page.getByRole('button', { name: 'Print / Save PDF' }).click();
  expect(await page.evaluate(() => window.__printRequested)).toBe(true);
  await expect(page.locator('#teal-print-sheet')).toContainText('PERSONAL LEARNING RECORD');
});

test('lesson 05: knowledge-check answers survive reloading this browser', async ({ page }) => {
  await page.goto('/lessons/05/');
  for(let i=0;i<14;i++) {
    if(await page.getByRole('button',{name:'Submit answer'}).count())break;
    await page.getByRole('button',{name:'Forward →'}).click();
  }
  await page.locator('button.option').first().click();
  await page.getByRole('button',{name:'Submit answer'}).click();
  await reach(page,'#teal-recall');
  await page.getByRole('button',{name:'Forward →'}).click();
  await expect(page.locator('#teal-full-report')).toContainText('Knowledge-check choices');
  await page.reload();
  await reach(page,'#teal-plan');
  await expect(page.locator('#teal-full-report')).toContainText('My answer:');
  await expect(page.locator('#teal-full-report')).toContainText('Saved knowledge check:');
});
