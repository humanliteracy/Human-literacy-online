const { test, expect } = require('@playwright/test');

// Synthetic messages exercise complete conversations, including negative uses of
// the old status/update/finish keywords. Expected behavior is not an NLP claim.
const cases = [
  ['denied accountability', 'I never said I underestimated the work.', 'unknown', /not sure how that relates/i, /not established a shared meaning/i],
  ['reported accountability', 'You said I should have warned you yesterday.', 'unknown', /not sure how that relates/i, /not established a shared meaning/i],
  ['negated belief about a mistake', 'I do not think I made a mistake.', 'unknown', /not sure how that relates/i, /not established a shared meaning/i],
  ['reported support request', 'She said I need more support.', 'unknown', /not sure how that relates/i, /not established a shared meaning/i],
  ['reported refusal', 'He said I will not send an update.', 'unknown', /not sure how that relates/i, /not established a shared meaning/i],
  ['specific accountability', 'I underestimated the work. I should have warned you yesterday.', 'own', /named your part/i, /realistic recovery plan still needs/i],
  ['request for clarification', 'Can you clarify which deadline you mean?', 'clarify', /asking for clarification/i, /clarify what you want understood/i],
  ['concrete proposal', 'I will send a status update in 30 minutes.', 'plan', /proposed a work update/i, /propose a concrete next step/i],
  ['scope and deadline limit', 'The scope changed. I cannot meet the original deadline.', 'scope', /scope or timing/i, /revised expectations about scope/i],
  ['appropriate refusal', 'I will not complete this work.', 'refusal', /refusal or limit/i, /refusal or limit/i],
  ['personal boundary', 'I will not be shouted at.', 'refusal', /refusal or limit/i, /refusal or limit/i],
  ['privacy boundary', 'I will not share personal information.', 'refusal', /what you share/i, /personal refusal or limit/i],
  ['support request', 'I need more support.', 'support', /asking for support/i, /need for support/i],
  ['request for a break', 'I need a break.', 'pause', /asking for a pause/i, /pause without resigning/i],
  ['pause the conversation without resigning', 'I need to pause this conversation. I am not saying I resign.', 'pause', /asking for a pause/i, /pause without resigning/i],
  ['confirmed resignation', 'I am resigning.', 'resign', /said you are resigning/i, /decision to leave the job/i],
  ['uncertain resignation', 'I might quit.', 'uncertain', /not assume a resignation/i, /decision about leaving remains open/i],
  ['personal insult', 'You are an idiot.', 'hostile', /personal attacks/i, /personal attack makes the exchange harder/i],
  ['profanity without personal attack', 'This is fucking ridiculous.', 'anger', /strong reaction/i, /strong reaction was expressed/i],
  ['self-reported anger without refusal', 'I am frustrated.', 'anger', /not assume a refusal or resignation/i, /request or decision remains open/i],
  ['disputed responsibility', "It isn't my fault. Everybody else messed this up.", 'blame', /disputing responsibility/i, /responsibility remains disputed/i],
  ['contradictory commitments', 'I will finish the report. I will not finish the report.', 'conflict', /different directions/i, /different directions/i],
  ['contradiction joined by but', 'I agree to finish the report, but I refuse to finish the report.', 'conflict', /different directions/i, /different directions/i],
  ['negated update is not a plan', "I won't send an update.", 'refusal', /not treat that as agreement/i, /refusal or limit/i],
  ['direct threat after reported wording', 'He said the scope changed. I will hurt you.', 'threat', /cannot continue a work discussion/i, /exchange pauses because of a threat/i],
  ['threatening language', 'I will hurt you.', 'threat', /cannot continue a work discussion/i, /exchange pauses because of a threat/i],
  ['irrelevant status', 'The status of my sandwich is excellent.', 'unknown', /not sure how that relates/i, /not established a shared meaning or a useful recovery plan/i],
  ['nonsense with former plan keywords', 'The pancakes finish an update on the moon.', 'unknown', /not sure how that relates/i, /not established a shared meaning or a useful recovery plan/i],
  ['ambiguous wording', 'Maybe something else.', 'unknown', /not sure how that relates/i, /not established a shared meaning/i],
  ['previously unseen ordinary wording', 'My neighbor borrowed my umbrella.', 'unknown', /not sure how that relates/i, /not established a shared meaning/i],
  ['pause is explicitly not resignation', 'I am not resigning. I need a pause.', 'pause', /break is not resignation/i, /pause without resigning/i],
  ['negated resignation statement', 'I do not mean I quit.', 'clarify', /not resigning/i, /not acceptance of the assignment/i],
  ['quoted resignation', 'When I said "I quit", I was quoting the example.', 'uncertain', /uncertain or quoted words/i, /decision about leaving remains open/i],
  ['conditional resignation', 'If this keeps happening, I might quit.', 'uncertain', /not assume a resignation/i, /decision about leaving remains open/i],
  ['quitting something unrelated', 'I quit smoking.', 'unknown', /not sure how that relates/i, /not established a shared meaning/i],
  ['plan-shaped nonsense suffix', 'I will send a status update to the pancake moon.', 'unknown', /not sure how that relates/i, /not established a shared meaning/i],
  ['unsupported sweeping promise', 'I will finish everything right now.', 'unknown', /not sure how that relates/i, /not established a shared meaning/i],
  ['practical question after resignation', 'I am resigning. What would the notice process be?', 'resign', /said you are resigning/i, /decision to leave the job/i],
  ['reported threat is not attributed to the visitor', 'He said "I will hurt you".', 'unknown', /quoting someone/i, /not established a shared meaning/i],
  ['quoted insult is not a personal attack by the visitor', 'She said "you are an idiot".', 'unknown', /quoting someone/i, /not established a shared meaning/i],
  ['negated threat is not a threat', 'I will not hurt you.', 'unknown', /not sure how that relates/i, /not established a shared meaning/i],
  ['negated insult is not an insult', 'I do not think you are an idiot.', 'unknown', /quoting someone/i, /not established a shared meaning/i],
];

test.beforeEach(async ({ page }) => {
  page.dialogueErrors = [];
  page.on('pageerror', error => page.dialogueErrors.push(error.message));
});
test.afterEach(async ({ page }) => { expect(page.dialogueErrors).toEqual([]); });

for (const [label, text, kind, firstReply, outcome] of cases) {
  test(`complete conversation: ${label}`, async ({ page }) => {
    await page.goto('/simulator/01/');
    await page.locator('#yourReply').fill(text);
    await page.locator('#send').click();
    await expect(page.locator('#bossWords')).toContainText(firstReply);
    const closes = ['pause','threat'].includes(kind);
    if (closes) await expect(page.locator('#inputPanel')).toBeHidden();
    else {
      await expect(page.locator('#sceneProgress')).toHaveText('SCENE 2 OF 2');
      await page.locator('#yourReply').fill(text);
      await page.locator('#send').click();
    }
    await expect(page.locator('#sceneProgress')).toHaveText('SIMULATION COMPLETE');
    await expect(page.locator('#outcome')).toContainText(outcome);
    await expect(page.locator('#history .mine')).toHaveCount(closes ? 1 : 2);
    await expect(page.locator('#history .mine').first()).toContainText(text);
    await expect(page.locator('#history .mine').last()).toContainText(text);
    await expect(page.locator('#realWorldPractice')).not.toBeEmpty();
    await page.locator('#reflectionReview > summary').click();
    await expect(page.locator('#feedbackSkill')).not.toBeEmpty();
    await expect(page.locator('#feedbackWhy')).not.toBeEmpty();
    await expect(page.locator('#unresolved')).not.toBeEmpty();
    await expect(page.locator('#feedbackAlternative')).not.toBeEmpty();
    await expect(page.locator('#feedbackImprovement')).not.toBeEmpty();
    await expect(page.locator('#feedbackExample')).not.toBeEmpty();
    await expect(page.locator('#score')).toHaveCount(0);
    await expect(page.locator('body')).not.toContainText(/\b\d{1,3}\s*\/\s*100\b/);
    expect(await page.evaluate(message => HumanLiteracyDialogue.analyze(message).kind, text)).toBe(kind);
    if (['refusal', 'unknown', 'hostile', 'conflict', 'threat', 'uncertain'].includes(kind)) {
      await expect(page.locator('#bossWords')).not.toContainText('That gives us a useful next step');
      await expect(page.locator('#outcome')).not.toContainText('team gets a clearer recovery plan');
    }
  });
}

for (const [path, kind, words] of [
  ['boundary', 'refusal', /refusal or limit/], ['resign', 'resign', /leave the job/],
  ['scope', 'clarify', /clarify what you want understood/], ['help', 'support', /support/],
  ['pause', 'pause', /pause without resigning/], ['recovery', 'own', /next step|recovery plan/],
]) {
  test(`trusted static ${path} wording and follow-up retain the explicitly chosen goal`, async ({ page }) => {
    await page.goto('/simulator/01/');
    await page.locator('#openPractice').click();
    await page.locator('#expressWords').fill('I want to choose what to communicate.');
    await page.locator('#coachUnderstand').click();
    await page.locator('#coachPath').selectOption(path);
    await page.locator('#coachGoal').fill('My chosen goal: ' + path);
    await page.locator('#coachConfirm').click();
    await page.locator('.coach-option button').first().click();
    await expect(page.locator('#sceneProgress')).toHaveText('SCENE 1 OF 2');
    await page.locator('#send').click();
    await expect(page.locator('#bossWords')).not.toContainText('cannot reliably connect');
    if(path==='pause'){
      await expect(page.locator('#inputPanel')).toBeHidden();
      await expect(page.locator('#outcome')).toContainText(words);
      await expect(page.locator('#reflectionBasis')).toContainText('My chosen goal: '+path);
      await expect(page.locator('#history .mine')).toHaveCount(1);
      return;
    }
    const followup = await page.locator('#choices button').first().innerText();
    await page.locator('#choices button').first().click();
    await expect(page.locator('#sceneProgress')).toHaveText('SCENE 2 OF 2');
    await expect(page.locator('#yourReply')).not.toHaveValue('');
    await page.locator('#send').click();
    await expect(page.locator('#outcome')).toContainText(words);
    await expect(page.locator('#reflectionBasis')).toContainText('My chosen goal: ' + path);
    await expect(page.locator('#history .mine').last()).toContainText(followup.replace(/^“|”$/g, ''));
    await expect(page.locator('body')).not.toContainText(/\b\d{1,3}\s*\/\s*100\b/);
  });
}

test('goal context never turns edited nonsense or a contradiction into compliance', async ({ page }) => {
  await page.goto('/simulator/01/');
  await page.locator('#openPractice').click();
  await page.locator('#expressWords').fill('The expectations are unreasonable. I quit');
  await page.locator('#coachUnderstand').click();
  await page.locator('#coachConfirm').click();
  await page.locator('.coach-option button').first().click();
  await page.locator('#yourReply').fill('The update from the purple pancake moon is ready.');
  await page.locator('#send').click();
  await expect(page.locator('#bossWords')).not.toContainText('selected');
  await expect(page.locator('#bossWords')).toContainText('What would you like me to understand');
  await page.locator('#yourReply').fill('I am not resigning. I need a pause.');
  await page.locator('#send').click();
  await expect(page.locator('#bossWords')).toContainText('pause');
  await expect(page.locator('#bossWords')).not.toContainText('selected goal');
  await expect(page.locator('#outcome')).toContainText('pause without resigning');
  await expect(page.locator('#reflectionBasis')).toContainText('differ from this private goal');
  await expect(page.locator('#madeClear')).not.toContainText('conflicting signals');
});

test('a threat is not repaired automatically by a later project-plan phrase', async ({ page }) => {
  await page.goto('/simulator/01/');
  await page.locator('#yourReply').fill('I will hurt you.');
  await page.locator('#send').click();
  await expect(page.locator('#inputPanel')).toBeHidden();
  await expect(page.locator('#history .mine')).toHaveCount(1);
  const reaction=await page.evaluate(()=>HumanLiteracyDialogue.manager(HumanLiteracyDialogue.analyze('I will send a status update in 30 minutes.'),{previous:HumanLiteracyDialogue.analyze('I will hurt you.')}));
  expect(reaction).toContain('address the threat and safety');
  await expect(page.locator('#outcome')).toContainText('exchange pauses because of a threat');
  await expect(page.locator('#outcome')).not.toContainText('propose a concrete next step');
});

test('identical messages produce stable evidence and meaningful wording changes alter feedback', async ({ page }) => {
  await page.goto('/simulator/01/');
  const result = await page.evaluate(() => {
    const api = HumanLiteracyDialogue;
    const first = api.analyze('I underestimated the work.');
    const proposal = api.analyze('I will send a status update in 30 minutes.');
    const refusal = api.analyze('I will not send a status update.');
    return {
      a: api.feedback(first, proposal), b: api.feedback(first, api.analyze(proposal.text)),
      refused: api.feedback(first, refusal),
      spoofed: api.analyze('Purple pancake status update.', { authoredKind: 'plan', authoredText: 'I will send a status update in 30 minutes.' }),
    };
  });
  expect(result.a).toEqual(result.b);
  expect(result.refused.outcome).not.toEqual(result.a.outcome);
  expect(result.refused.outcome).toContain('refusal or limit');
  expect(result.spoofed.kind).toBe('unknown');
});
