const {test, expect} = require('@playwright/test');
const {reveal} = require('./review-helpers.cjs');

async function say(page, text) {
  await page.locator('#yourReply').fill(text);
  await page.locator('#send').click();
}
test.beforeEach(async ({page}) => {
  page.errors = []; page.on('pageerror', error => page.errors.push(error.message));
  await page.goto('/simulator/01/');
});
test.afterEach(async ({page}) => expect(page.errors).toEqual([]));

for (const [name, words, topic] of [
  ['my part', 'I want to explain my part before we agree on next steps.', /your part/],
  ['my role', 'Let me explain my role in what happened.', /your part/],
  ['risks', 'I can explain the risks before we decide.', /the risks/],
  ['needed support', 'I want to explain what support I need.', /what support is needed/],
  ['risks and support', 'I will explain the risks and what support is needed so we can agree on next steps.', /the risks and what support is needed/],
  ['curly contraction', 'I’d like to explain my part before deciding.', /your part/],
  ['permission to explain', 'Can I explain my part before we decide?', /your part/],
  ['accountability without a fair-solution phrase', 'I underestimated the work. I want to explain my part.', /your part/],
]) test(`hear the explanation first: ${name}`, async ({page}) => {
  await say(page, words);
  await expect(page.locator('#bossWords')).toContainText(topic);
  await expect(page.locator('#bossWords')).toContainText(/Go ahead/);
  await expect(page.locator('#bossWords')).not.toContainText(/what can you realistically offer|checking the facts before|missed warning|you promised|script|software/i);
  await expect(page.locator('#choices button').first()).toContainText('which part of the timeline');
  await say(page, words); await reveal(page, 'reflectionReview');
  await expect(page.locator('#madeClear')).toContainText(topic);
  await expect(page.locator('#feedbackWhy')).toBeVisible();
  await expect(page.locator('#feedbackWhy')).toContainText(/invites/);
  await expect(page.locator('#feedbackDifficulty')).toContainText('details have not yet been heard');
  await expect(page.locator('#feedbackEvidence')).toBeHidden();
  await expect(page.locator('#madeClear')).not.toContainText(/promised|should have warned|all your fault/);
  await expect(page.locator('#score')).toHaveCount(0);
});

for (const words of [
  'I do not want to explain my part.',
  'He said I will explain the risks.',
  'I never said I want to explain what support I need.',
  'If I can explain my part, perhaps we can agree.',
  'She said I was waiting for client approval.',
  'I never said the approval arrived late.',
]) test(`do not invent an explanation from denied or reported wording: ${words}`, async ({page}) => {
  await say(page, words);
  await expect(page.locator('#bossWords')).not.toContainText(/Go ahead|Thanks for explaining|you named your part/i);
  await expect(page.locator('#bossWords')).toHaveAttribute('data-dialogue-kind', 'unknown');
  await say(page, words); await reveal(page, 'reflectionReview');
  await expect(page.locator('#madeClear')).toContainText('cannot reliably determine');
  await expect(page.locator('#feedbackDifficulty')).toContainText('may be clear to a person');
});

test('an offered explanation continues to an account, not invented blame or delivery', async ({page}) => {
  await say(page, 'I want to explain my part.');
  await say(page, 'I was waiting for client approval. The approval arrived after the agreed handoff.');
  await expect(page.locator('#bossWords')).toContainText('your account of the delay');
  await expect(page.locator('#bossWords')).not.toContainText(/your fault|should have warned|agreed to finish|software|script/i);
  await reveal(page, 'reflectionReview');
  await expect(page.locator('#madeClear')).toContainText('your account, not a verified cause');
  await expect(page.locator('#feedbackConstructive')).toContainText('timeline detail');
  await expect(page.locator('#outcome')).toContainText('no work agreement');
});

for (const [decision, context] of [
  ['I am resigning.', /chose to leave the job/],
  ['I will not complete this work.', /earlier refusal or limit/],
  ['I need to pause this conversation.', /asked for a pause/],
]) test(`explaining does not erase the earlier decision: ${decision}`, async ({page}) => {
  await say(page, decision); await say(page, 'I want to explain my part.');
  await expect(page.locator('#bossWords')).toContainText(context);
  await expect(page.locator('#bossWords')).toContainText('Go ahead and explain');
  await expect(page.locator('#outcome')).toContainText(/leave the job|refusal or limit|pause without resigning/);
  await page.locator('#conversationBack').click(); await page.locator('#conversationForward').click();
  await expect(page.locator('#bossWords')).toContainText(context);
  await expect(page.locator('#history .mine')).toHaveCount(2);
});

for (const [literal, goal, topic] of [
  ['I want to explain my part.', 'I want to explain my part.', /my part/],
  ['I can explain the risks.', 'I want to explain the risks.', /the risks/],
  ['I need help.', 'I want to explain what support I need.', /what support is needed/],
  ['I will explain the risks and what support is needed.', 'I want to explain the risks and what support is needed.', /the risks and what support is needed/],
]) test(`private goal becomes relevant editable wording: ${goal}`, async ({page}) => {
  await page.locator('#openPractice').click(); await page.locator('#expressWords').fill(literal);
  await page.locator('#coachUnderstand').click(); await page.locator('#coachPath').selectOption('custom');
  await page.locator('#coachGoal').fill(goal); await page.locator('#coachConfirm').click();
  const drafts = await page.locator('.coach-option textarea').evaluateAll(nodes => nodes.map(n => n.value));
  expect(drafts).toHaveLength(3);
  for (const words of drafts) {
    expect(words).toMatch(topic); expect(words).not.toMatch(/I made a mistake|should have warned|I will finish|My goal/);
    expect(await page.evaluate(w => HumanLiteracyDialogue.manager(HumanLiteracyDialogue.analyze(w)), words)).toMatch(/Go ahead/);
  }
  await expect(page.locator('.coach-option:visible')).toHaveCount(1);
  await page.locator('.coach-option button').first().click();
  await expect(page.locator('#history .mine')).toHaveCount(0);
  await expect(page.locator('#yourReply')).toHaveValue(drafts[0]);
  await page.locator('#send').click(); await expect(page.locator('#history .mine')).toHaveCount(1);
});

test('accountability drafts preserve the stated action instead of inventing a different admission', async ({page}) => {
  await page.locator('#openPractice').click(); await page.locator('#expressWords').fill('I forgot to send the report.');
  await page.locator('#coachUnderstand').click(); await page.locator('#coachPath').selectOption('recovery');
  await page.locator('#coachGoal').fill('I want to explain my part.'); await page.locator('#coachConfirm').click();
  await expect(page.locator('#coachWording0')).toHaveValue(/^I forgot to send the report\./);
  const words = await page.locator('.coach-option textarea').evaluateAll(nodes => nodes.map(n => n.value));
  expect(words.join(' ')).not.toMatch(/I made a mistake|should have warned|flagged the risk/);
});

for (const width of [320,390]) test(`${width}px explanation flow uses keyboard, preserves drafts and restores progress`, async ({page}) => {
  await page.setViewportSize({width,height:844}); await page.locator('#openPractice').click();
  await page.locator('#expressWords').fill('I want to explain my part.');
  await page.locator('#coachUnderstand').focus(); await page.keyboard.press('Enter');
  await expect(page.locator('#coachGoal')).toHaveValue('I want to explain my part.');
  await page.locator('#coachConfirm').focus(); await page.keyboard.press('Enter');
  await expect(page.locator('#coachWording0')).toHaveValue(/explain my part/);
  await page.locator('#coachReview>summary').focus(); await page.keyboard.press('Enter');
  await page.locator('#coachGoal').fill('I want to explain the risks and what support is needed.');
  await page.locator('#coachConfirm').focus(); await page.keyboard.press('Enter');
  await expect(page.locator('#coachWording0')).toHaveValue(/risks and what support is needed/);
  await page.locator('.coach-option button').first().focus(); await page.keyboard.press('Enter');
  await expect(page.locator('#yourReply')).toBeFocused(); await expect(page.locator('#history .mine')).toHaveCount(0);
  await page.keyboard.press('Tab'); await page.keyboard.press('Enter');
  await expect(page.locator('#replyHeading')).toBeFocused(); await expect(page.locator('#bossWords')).toContainText('Go ahead');
  await page.locator('#yourReply').fill('The approval arrived late.');
  await page.locator('#conversationBack').click(); await page.locator('#conversationForward').click();
  await expect(page.locator('#yourReply')).toHaveValue('The approval arrived late.');
  await page.locator('#send').click(); await expect(page.locator('#completionTitle')).toBeFocused();
  await page.locator('#reflectionReview>summary').focus(); await page.keyboard.press('Enter');
  await expect(page.locator('#feedbackWhy')).toBeVisible(); await expect(page.locator('#feedbackEvidence')).toBeHidden();
  await page.locator('#feedbackEvidencePanel>summary').focus(); await page.keyboard.press('Enter');
  await expect(page.locator('#feedbackAlternative')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.locator('#replay').focus(); await page.keyboard.press('Enter');
  await expect(page.locator('#replyHeading')).toBeFocused(); await expect(page.locator('#history .mine')).toHaveCount(0);
  expect(await page.evaluate(() => [localStorage.length, sessionStorage.length, document.cookie])).toEqual([0,0,'']);
});
