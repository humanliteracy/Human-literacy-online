const { test, expect } = require('@playwright/test');

test('OP-104: linked learning experiences share a navigable review build', async ({page}) => {
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.setViewportSize({width:390,height:844});
  await page.goto('/');
  await expect(page.getByRole('link',{name:'Open founder prototype'})).toBeVisible();
  await expect(page.getByRole('link',{name:'Explore TEAL'})).toBeVisible();
  await page.getByRole('link',{name:'Open founder prototype'}).click();
  await expect(page).toHaveURL(/\/one-place\/index\.html$/);
  const navigation = page.getByRole('navigation',{name:'Learning and practice'});
  await expect(navigation).toBeVisible();
  await expect(navigation.getByRole('link')).toHaveCount(4);
  await navigation.getByRole('link',{name:'TEAL foundation (draft)'}).click();
  await expect(page).toHaveURL(/\/teal\/$/);
  await page.goto('/one-place/');
  await navigation.getByRole('link',{name:'Start learning'}).click();
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
