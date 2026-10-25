const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  page.errors = [];
  page.on('pageerror', error => page.errors.push(error.message));
  await page.goto('/simulator/01/');
  await page.locator('#openPractice').click();
});
test.afterEach(async ({ page }) => { expect(page.errors).toEqual([]); });

async function understand(page, words) {
  await page.locator('#expressWords').fill(words);
  await page.getByRole('button', { name: 'Help me understand what I said', exact: true }).click();
  await expect(page.locator('#coachLiteral')).toHaveText(words);
  await expect(page.locator('#coachUnderstandingTitle')).toBeFocused();
}
async function confirm(page) {
  await page.getByRole('button', { name: 'Use my goal and show options' }).click();
  await expect(page.locator('.coach-option')).toHaveCount(3);
}
async function moveFirst(page) {
  await page.locator('.coach-option button').first().click();
  await expect(page.locator('#sceneProgress')).toHaveText('SCENE 1 OF 2');
  await expect(page.locator('#history .bubble')).toHaveCount(1);
  await expect(page.locator('#yourReply')).toBeFocused();
}
async function completeCoachedRoleplay(page) {
  await page.locator('#send').click();
  await expect(page.locator('#sceneProgress')).toHaveText('SCENE 2 OF 2');
  await page.locator('#choices button').first().click();
  await expect(page.locator('#sceneProgress')).toHaveText('SIMULATION COMPLETE');
  await expect(page.locator('#scoreArea')).toBeHidden();
}

test('strong expression has a tentative, rejectable reading and can preserve a firm refusal', async ({ page }) => {
  await understand(page, 'You all can kiss my ass');
  await expect(page.locator('#coachTentative')).toContainText('might');
  await expect(page.locator('#coachTentative')).toContainText('do not tell us your feelings');
  await expect(page.locator('#coachPath')).toHaveValue('boundary');
  await page.locator('#coachGoal').fill('I want to refuse this request while keeping my boundary.');
  await confirm(page);
  await expect(page.locator('#coachChosenGoal')).toContainText('keeping my boundary');
  await moveFirst(page);
  await expect(page.locator('#yourReply')).toHaveValue(/not accepting this request/);
  await completeCoachedRoleplay(page);
  await expect(page.locator('#madeClear')).toContainText('refusal or limit');
  await expect(page.locator('#outcome')).toContainText('refusal or limit');
  await expect(page.locator('#realWorldPractice')).toContainText('decline');
  await page.locator('#practiceScoreToggle').check();
  await expect(page.locator('#score')).toHaveText('');
  await expect(page.locator('#scoreDetails')).toContainText('No numerical rubric');
});

test('resignation is a legitimate path, keeps that decision, and receives relevant reflection', async ({ page }) => {
  await understand(page, 'The expectations are unreasonable. I quit');
  await expect(page.locator('#coachPath')).toHaveValue('resign');
  await expect(page.locator('#coachTentative')).toContainText('legitimate choice');
  await confirm(page);
  for (const input of await page.locator('.coach-option textarea').all()) {
    expect(await input.inputValue()).toMatch(/resign|leave this job/);
  }
  await moveFirst(page);
  await expect(page.locator('#yourReply')).toHaveValue(/I am resigning/);
  await page.locator('#send').click();
  await expect(page.locator('#bossWords')).toContainText('not treat that as agreement to finish');
  await expect(page.locator('#choices')).toContainText('decision to resign');
  await page.locator('#choices button').first().click();
  await expect(page.locator('#reflectionBasis')).toContainText('resign');
  await expect(page.locator('#madeClear')).toContainText('resign');
  await expect(page.locator('#unresolved')).toContainText('final pay');
  await expect(page.locator('#realWorldPractice')).toContainText('resignation statement');
  await expect(page.locator('#realWorldPractice')).not.toContainText('realistically commit');
});

test('scope-change alternatives name facts, limits and options; learner edits are preserved', async ({ page }) => {
  await understand(page, 'I need more time because the scope changed');
  await expect(page.locator('#coachPath')).toHaveValue('scope');
  await confirm(page);
  const options = await page.locator('.coach-option textarea').evaluateAll(nodes => nodes.map(n => n.value));
  expect(options[0]).toContain('cannot meet the original deadline');
  expect(options[1]).toContain('reducing the work, adjusting the deadline, or adding support');
  expect(options[2]).toContain('before I commit');
  const ownWords = 'The scope changed. I cannot do both tasks by Friday. Can we reduce the scope or extend the deadline?';
  await page.locator('.coach-option textarea').first().fill(ownWords);
  await moveFirst(page);
  await expect(page.locator('#yourReply')).toHaveValue(ownWords);
  await completeCoachedRoleplay(page);
  await expect(page.locator('#unresolved')).toContainText('scope');
  await expect(page.locator('#realWorldPractice')).toContainText('what changed');
});

test('unexpected wording asks for clarification rather than inventing an interpretation', async ({ page }) => {
  await understand(page, 'Purple umbrellas orbit the pancake moon.');
  await expect(page.locator('#coachStatus')).toContainText('Please clarify');
  await expect(page.locator('#coachHearing')).toContainText('do not have a scripted reading');
  await expect(page.locator('#coachGoal')).toHaveValue('');
  await expect(page.locator('#coachPath')).toHaveValue('');
  await expect(page.locator('#coachChoices')).toBeHidden();
  await page.locator('#coachConfirm').click();
  await expect(page.locator('#coachChoices')).toBeHidden();
  await expect(page.locator('#coachPath')).toBeFocused();
  await page.locator('#coachPath').selectOption('custom');
  await page.locator('#coachGoal').fill('I want to ask a question about the situation.');
  await confirm(page);
  await expect(page.locator('#coachWording0')).toHaveValue(/ask a question/);
});

test('unknown free-form roleplay wording does not receive a fabricated numerical score', async ({ page }) => {
  await page.locator('#yourReply').fill('flibberty pancake moon');
  await page.locator('#send').click();
  await page.locator('#yourReply').fill('purple orbital teapot');
  await page.locator('#send').click();
  await page.locator('#practiceScoreToggle').check();
  await expect(page.locator('#score')).toHaveText('');
  await expect(page.locator('#scoreDetails')).toContainText('unrecognized wording');
  await expect(page.locator('#realWorldPractice')).toContainText('one question');
});

test('rejecting an interpretation leaves the expression intact and lets the learner choose another goal', async ({ page }) => {
  await understand(page, 'You all can kiss my ass');
  await confirm(page);
  await page.locator('#coachReview > summary').click();
  await page.locator('#coachReject').click();
  await expect(page.locator('#coachChoices')).toBeHidden();
  await expect(page.locator('#coachPath')).toHaveValue('');
  await expect(page.locator('#coachGoal')).toHaveValue('');
  await expect(page.locator('#coachTentative')).toContainText('choose a different path');
  await expect(page.locator('#expressWords')).toHaveValue('You all can kiss my ass');
  await page.locator('#coachPath').selectOption('pause');
  await page.locator('#coachGoal').fill('I want a pause, not resignation.');
  await confirm(page);
  await moveFirst(page);
  await completeCoachedRoleplay(page);
  await expect(page.locator('#realWorldPractice')).toContainText('asking for a pause');
});

test('editing the goal or source expression invalidates stale suggestions', async ({ page }) => {
  await understand(page, 'The expectations are unreasonable. I quit');
  await confirm(page);
  await page.locator('#coachReview > summary').click();
  await page.locator('#coachGoal').fill('I want to leave after clarifying notice.');
  await expect(page.locator('#coachChoices')).toBeHidden();
  await confirm(page);
  await expect(page.locator('#coachChosenGoal')).toContainText('clarifying notice');
  await page.locator('#expressWords').fill('Something different');
  await expect(page.locator('#coachUnderstanding')).toBeHidden();
  await expect(page.locator('#coachOptions')).toBeEmpty();
  await expect(page.locator('#coachGoal')).toHaveValue('');
});

test('an entirely custom rehearsal is not overwritten or auto-submitted by the coach', async ({ page }) => {
  await understand(page, 'I need more time because the scope changed');
  await confirm(page);
  await page.locator('#practiceWords').fill('I will not commit before we clarify which work matters.');
  await page.locator('#practiceTransfer').click();
  await expect(page.locator('#yourReply')).toHaveValue('I will not commit before we clarify which work matters.');
  await expect(page.locator('#history .bubble')).toHaveCount(1);
});

test('coaching uses no uploads, outside requests, cookies, or persistent storage', async ({ page }) => {
  const requests = [];
  page.on('request', r => requests.push({ url: r.url(), method: r.method() }));
  await understand(page, 'I need more time because the scope changed');
  await confirm(page);
  await moveFirst(page);
  expect(requests.every(r => r.method === 'GET' && new URL(r.url).origin === 'http://127.0.0.1:8765')).toBe(true);
  expect(await page.evaluate(() => [document.cookie, localStorage.length, sessionStorage.length])).toEqual(['', 0, 0]);
  await expect(page.locator('#recordConsent')).not.toBeChecked();
  await expect(page.locator('#speechConsent')).not.toBeChecked();
});

test('literal words and custom goals are displayed as text, never interpreted as HTML', async ({ page }) => {
  const text = '<img src=x onerror="window.injected=true">';
  await understand(page, text);
  await expect(page.locator('#coachLiteral img')).toHaveCount(0);
  await page.locator('#coachPath').selectOption('custom');
  await page.locator('#coachGoal').fill(text);
  await confirm(page);
  await expect(page.locator('#coachChosenGoal img')).toHaveCount(0);
  expect(await page.locator('#coachWording0').inputValue()).toContain(text);
  expect(await page.evaluate(() => window.injected)).toBeUndefined();
});

test('clearing private practice clears coaching interpretations and drafts too', async ({ page }) => {
  await understand(page, 'The expectations are unreasonable. I quit');
  await confirm(page);
  await page.locator('#practiceClear').click();
  await expect(page.locator('#coachUnderstanding')).toBeHidden();
  await expect(page.locator('#coachLiteral')).toBeEmpty();
  await expect(page.locator('#coachGoal')).toHaveValue('');
  await expect(page.locator('#coachOptions')).toBeEmpty();
  await expect(page.locator('#expressWords')).toHaveValue('');
});

test('empty input and local recordings do not produce an invented transcription', async ({ page }) => {
  await page.locator('#coachUnderstand').click();
  await expect(page.locator('#coachStatus')).toContainText('not transcribed');
  await expect(page.locator('#expressWords')).toBeFocused();
  await expect(page.locator('#coachUnderstanding')).toBeHidden();
});

test('cleared private goal wording cannot reappear after a roleplay completes', async ({ page }) => {
  await understand(page, 'The expectations are unreasonable. I quit');
  await page.locator('#coachGoal').fill('Private reason: I need a change for my family.');
  await confirm(page);
  await moveFirst(page);
  await page.locator('#send').click();
  await page.locator('#practiceClear').click();
  await page.locator('#choices button').first().click();
  await expect(page.locator('#sceneProgress')).toHaveText('SIMULATION COMPLETE');
  await expect(page.locator('#coachGoal')).toHaveValue('');
  await expect(page.locator('#reflectionBasis')).toContainText('Leave or resign');
  await expect(page.locator('#reflectionBasis')).not.toContainText('my family');
  await expect(page.locator('#reflectionBasis')).toContainText('private goal wording was cleared');
});

test('the coach works using only the keyboard and exposes named controls', async ({ page }) => {
  await page.locator('#expressWords').focus();
  await page.keyboard.type('I need more time because the scope changed');
  for (let step = 0; step < 15 && await page.evaluate(() => document.activeElement.id !== 'coachUnderstand'); step++) await page.keyboard.press('Tab');
  await expect(page.locator('#coachUnderstand')).toBeFocused();
  await page.keyboard.press('Enter');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('combobox', { name: 'What do you want to communicate?' })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('textbox', { name: 'My goal (edit or replace this possible reading)' })).toBeFocused();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await expect(page.locator('#coachChoicesTitle')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.locator('#coachWording0')).toBeFocused();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await expect(page.locator('#yourReply')).toBeFocused();
  await expect(page.locator('#sceneProgress')).toHaveText('SCENE 1 OF 2');
});

test('expanded coach fits a 320px viewport', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await understand(page, 'The expectations are unreasonable. I quit');
  await confirm(page);
  await expect(page.locator('.coach-option:visible')).toHaveCount(1);
  await page.locator('#coachMore > summary').click();
  await expect(page.locator('.coach-option:visible')).toHaveCount(3);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await expect.poll(() => page.locator('.coach-option textarea:visible').evaluateAll(nodes => nodes.every(n => n.scrollHeight <= n.clientHeight))).toBe(true);
  await page.locator('.coach-panel').screenshot({ path: testInfo.outputPath('coach-mobile.png') });
});

for (const [path, goal, reflection] of [
  ['help', 'I want support without sharing personal details.', 'support'],
  ['recovery', 'I want to discuss my part without an unrealistic promise.', 'what remains'],
  ['custom', 'I want someone to clarify my question.', 'one question'],
]) {
  test(`learner-chosen ${path} path keeps its goal through completion and reflection`, async ({ page }) => {
    await understand(page, 'My goal needs clarification.');
    await page.locator('#coachPath').selectOption(path);
    await page.locator('#coachGoal').fill(goal);
    await confirm(page);
    await moveFirst(page);
    await completeCoachedRoleplay(page);
    await expect(page.locator('#reflectionBasis')).toContainText(goal);
    await expect(page.locator('#realWorldPractice')).toContainText(reflection);
    await page.locator('#practiceScoreToggle').check();
    await expect(page.locator('#score')).toHaveText('');
  });
}
