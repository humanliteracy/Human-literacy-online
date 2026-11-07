const {test, expect} = require('@playwright/test');
const fs = require('node:fs/promises');

// OP-104 regression: expected income arriving after a bill's due date must
// never obscure a dated, earlier cash shortage.
async function enterBill(page, name, amount, date) {
  await page.getByRole('tab', {name: '2. Bills'}).click();
  await page.locator('#billName').fill(name);
  await page.locator('#billAmount').fill(String(amount));
  if (date) await page.locator('#billDate').fill(date);
  await page.locator('#billForm button[type="submit"]').click();
}

async function enterIncome(page, name, amount, date) {
  await page.getByRole('tab', {name: '3. Income'}).click();
  await page.locator('#incomeName').fill(name);
  await page.locator('#incomeAmount').fill(String(amount));
  if (date) await page.locator('#incomeDate').fill(date);
  await page.locator('#incomeForm button[type="submit"]').click();
}

test('due-before-paycheck shows the $50 shortage, not a misleading $850 headline, across outputs', async ({page}) => {
  await page.goto('/one-place/money-bills.html');
  const dueDate = await page.locator('#billDate').inputValue();
  const paycheckDate = await page.locator('#incomeDate').inputValue();
  await page.locator('#cash').fill('450');
  await page.locator('#confirmed').check();
  await page.locator('#complete').check();
  await enterBill(page, 'rent', 500);
  await enterIncome(page, 'paycheck', 900);
  await expect(page.locator('#cashLabel')).toContainText('Estimated shortfall by ' + dueDate);
  await expect(page.locator('#cashResult')).toHaveText('$50.00 short');
  await expect(page.locator('#cashHelp')).toContainText(paycheckDate);
  await page.getByRole('tab', {name: '4. My action plan'}).click();
  await expect(page.locator('#planLines')).toContainText('Estimated shortfall by ' + dueDate);
  await expect(page.locator('#planLines')).toContainText('$50.00');
  await expect(page.locator('#planLines')).toContainText('Conditional balance');
  await expect(page.locator('#planLines')).toContainText('$850.00');
  await expect(page.locator('#planWarning')).toContainText('Estimated $50.00 cash shortfall');
  await expect(page.locator('#nextActions')).toContainText('Contact the bill provider before the due date');
  const downloadPromise = page.waitForEvent('download');
  await page.locator('#exportPlan').click();
  const download = await downloadPromise;
  const txt = await fs.readFile(await download.path(), 'utf8');
  expect(txt).toContain('Estimated shortfall by ' + dueDate + ': $50.00');
  expect(txt).toContain('Conditional balance after dated entries through ' + paycheckDate);
  expect(txt).toContain('NOT spendable now');
  await page.emulateMedia({media:'print'});
  await expect(page.locator('#planLines')).toContainText('Estimated shortfall by ' + dueDate);
});

test('future income is excluded from any available-cash headline when verification is incomplete', async ({page}) => {
  await page.goto('/one-place/money-bills.html');
  await page.locator('#cash').fill('450');
  await enterBill(page, 'rent', 500);
  await enterIncome(page, 'paycheck', 900);
  await expect(page.locator('#cashResult')).toHaveText('Not assessed');
  await page.getByRole('tab', {name:'4. My action plan'}).click();
  await expect(page.locator('#planLines')).not.toContainText('Conditional balance');
  await expect(page.locator('#planWarning')).toContainText('Not an affordability assessment');
});

test('same-day cumulative bills report the full first-day shortage', async ({page}) => {
  await page.goto('/one-place/money-bills.html');
  const billDate = await page.locator('#billDate').inputValue();
  await page.locator('#cash').fill('450');
  await page.locator('#confirmed').check();
  await page.locator('#complete').check();
  await enterBill(page, 'rent', 500);
  await enterBill(page, 'electric', 100, billDate);
  await expect(page.locator('#cashResult')).toHaveText('$150.00 short');
});
