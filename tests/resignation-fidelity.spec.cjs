const {test,expect}=require('@playwright/test');
const {reveal}=require('./review-helpers.cjs');
const immediate='I am resigning effective immediately. I will not negotiate continued employment. I will not perform any further project work.';
async function say(page,words){await page.locator('#yourReply').fill(words);await page.locator('#send').click();}
async function draft(page,words=immediate){await page.locator('#openPractice').click();await page.locator('#expressWords').fill(words);await page.locator('#coachUnderstand').click();}
async function confirm(page){await page.locator('#coachConfirm').click();}
async function assertDecision(page){
 await expect(page.locator('#outcome')).toContainText('decision to leave the job effective immediately');
 await expect(page.locator('#outcome')).toContainText('ruled out negotiating continued employment');
 await expect(page.locator('#outcome')).toContainText('declined further project work');
 await reveal(page,'reflectionReview');
 await expect(page.locator('#madeClear')).toContainText('effective immediately');
 await expect(page.locator('#madeClear')).not.toContainText(/conditional refusal|refusal or limit/);
 await expect(page.locator('#unresolved')).toContainText('contractual, administrative or legal obligations');
 await expect(page.locator('#unresolved')).toContainText('does not establish that these obligations disappear');
 await expect(page.locator('#feedbackExample')).not.toContainText('Maybe I am done');
 await expect(page.locator('#score')).toHaveCount(0);
}
test.beforeEach(async({page})=>{page.errors=[];page.on('pageerror',e=>page.errors.push(e.message));await page.goto('/simulator/01/');});
test.afterEach(async({page})=>expect(page.errors).toEqual([]));

for(const width of [1120,320,390])test(`immediate final resignation retains its goal through every stage at ${width}px`,async({page})=>{
 await page.setViewportSize({width,height:844});await draft(page);
 await expect(page.locator('#coachPath')).toHaveValue('resign');await expect(page.locator('#coachGoal')).toHaveValue(immediate);
 await confirm(page);await expect(page.locator('.coach-option:visible')).toHaveCount(1);
 for(const input of await page.locator('.coach-option textarea').all()){
  expect(await input.inputValue()).toContain(immediate);
  expect(await input.inputValue()).not.toMatch(/unreasonable|I am willing|I will (?:help|finish|handover)|because/);
 }
 await page.locator('#coachMore>summary').focus();await page.keyboard.press('Enter');await page.keyboard.press('Tab');
 await expect(page.locator('#coachWording1')).toBeFocused();await page.keyboard.press('Tab');await page.keyboard.press('Enter');
 await expect(page.locator('#yourReply')).toBeFocused();await expect(page.locator('#yourReply')).toHaveValue(new RegExp('effective immediately'));
 await expect(page.locator('#history .mine')).toHaveCount(0);
 await page.locator('#send').focus();await page.keyboard.press('Enter');
 await expect(page.locator('#bossWords')).toHaveAttribute('data-dialogue-kind','resign');
 await expect(page.locator('#bossWords')).toContainText('resigning effective immediately');
 await expect(page.locator('#bossWords')).toContainText('not ask you to negotiate staying');
 await expect(page.locator('#bossWords')).toContainText('not perform further project work');
 await expect(page.locator('#bossWords')).toContainText('formal offboarding');
 await expect(page.locator('#bossWords')).not.toContainText(/refusal or limit|different conditions|what can you offer/i);
 await expect(page.locator('#choices')).toContainText(immediate);
 await page.locator('#yourReply').fill('An unsent question.');await page.locator('#finishHere').click();await assertDecision(page);
 await expect(page.locator('#realWorldPractice')).toContainText('stated conditions');
 await page.locator('#conversationBack').click();await expect(page.locator('#yourReply')).toHaveValue('An unsent question.');
 await page.locator('#conversationBack').click();await expect(page.locator('#yourReply')).toHaveValue(new RegExp('effective immediately'));
 await page.locator('#conversationForward').click();await page.locator('#conversationForward').click();await assertDecision(page);
 await expect(page.locator('#history .mine')).toHaveCount(1);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 expect(await page.evaluate(()=>[localStorage.length,sessionStorage.length,document.cookie])).toEqual([0,0,'']);
});
for(const words of [
 "I'm resigning effective immediately. My decision to resign is final. I won't do any more work on this project.",
 'I resign effective today. I am not willing to negotiate continued employment. I refuse to perform further project work.',
 'I am resigning from this job with immediate effect. I will not reconsider my decision. I will not continue working on this project.',
])test(`resignation conditions survive wording variation: ${words}`,async({page})=>{
 await draft(page,words);await expect(page.locator('#coachGoal')).toHaveValue(words);await confirm(page);
 for(const input of await page.locator('.coach-option textarea').all())expect(await input.inputValue()).toContain(words);
 await page.locator('.coach-option button').first().click();await page.locator('#send').click();
 await expect(page.locator('#bossWords')).toContainText('not ask you to negotiate staying');
 await expect(page.locator('#bossWords')).toContainText('not perform further project work');
 await page.locator('#finishHere').click();await expect(page.locator('#outcome')).toContainText('ruled out negotiating');
 await expect(page.locator('#outcome')).toContainText('declined further project work');
});
for(const followup of ['I am confirming my decision to resign.','I will not perform further project work.','Please clarify the notice process.','Please leave me alone.'])test(`later wording retains the established resignation: ${followup}`,async({page})=>{
 await say(page,immediate);await say(page,followup);
 await expect(page.locator('#bossWords')).toContainText('resigning effective immediately');await assertDecision(page);
 await expect(page.locator('#feedbackImprovement')).toContainText('offboarding');
});
test('private resignation goal retains conditions but never substitutes for submitted words',async({page})=>{
 await draft(page,'Can you clarify the deadline?');await page.locator('#coachPath').selectOption('resign');
 const goal='I want to resign effective immediately. I will not negotiate continued employment. I will not perform any further project work.';
 await page.locator('#coachGoal').fill(goal);await confirm(page);
 await expect(page.locator('#coachWording0')).toHaveValue(immediate);
 await page.locator('#coachWording0').fill('I need a break. I am not resigning.');await page.locator('.coach-option button').first().click();
 await expect(page.locator('#history .mine')).toHaveCount(0);await page.locator('#send').click();
 await expect(page.locator('#bossWords')).toHaveAttribute('data-dialogue-kind','pause');await expect(page.locator('#outcome')).toContainText('pause without resigning');
 await reveal(page,'reflectionReview');await expect(page.locator('#madeClear')).not.toContainText('effective immediately');
});
test('revising the goal replaces old conditions without reviving the original reaction',async({page})=>{
 await draft(page);await confirm(page);await page.locator('#coachReview>summary').click();
 const changed='I am resigning effective on 2026-11-01. Please send the notice requirements in writing.';
 await page.locator('#coachGoal').fill(changed);await expect(page.locator('#coachChoices')).toBeHidden();await confirm(page);
 for(const input of await page.locator('.coach-option textarea').all()){
  expect(await input.inputValue()).toContain(changed);expect(await input.inputValue()).not.toMatch(/immediately|not negotiate|further project work/);
 }
 await page.locator('.coach-option button').first().click();await page.locator('#send').click();await page.locator('#finishHere').click();
 await expect(page.locator('#outcome')).toContainText('effective on 2026-11-01');await expect(page.locator('#outcome')).not.toContainText('immediately');
});
test('unfamiliar resignation conditions remain verbatim without pretending to interpret them',async({page})=>{
 const words='I am resigning effective immediately. Please use the zephyr protocol and do not contact my project partner.';
 await draft(page,words);await confirm(page);
 for(const input of await page.locator('.coach-option textarea').all())expect(await input.inputValue()).toContain(words);
 await page.locator('.coach-option button').first().click();await expect(page.locator('#yourReply')).toHaveValue(words);
 await page.locator('#send').click();await page.locator('#finishHere').click();await reveal(page,'reflectionReview');await reveal(page,'feedbackEvidencePanel');
 await expect(page.locator('#reflectionBasis')).toContainText('zephyr protocol');await expect(page.locator('#scoreDetails')).toContainText('limited wording');
 await expect(page.locator('#outcome')).not.toContainText('protocol accepted');
});
test('a long resignation transfers without a shorter draft field truncating conditions',async({page})=>{
 const words='I am resigning effective immediately. '+('Please send the applicable information in writing. '.repeat(15))+'I will not negotiate continued employment. I will not perform any further project work.';
 expect(words.length).toBeGreaterThan(600);await draft(page,words);await confirm(page);
 await expect(page.locator('#coachWording0')).toHaveValue(words);await page.locator('.coach-option button').first().click();
 await expect(page.locator('#yourReply')).toHaveValue(words);await expect(page.locator('#practiceWords')).toHaveValue(words);
 await page.locator('#send').click();await page.locator('#finishHere').click();await assertDecision(page);
});
for(const [words,kind] of [
 ['I will not perform further project work.','refusal'],
 ['I will not continue working on this project.','refusal'],
 ['Can we discuss different conditions?','scope'],
 ['I need a break.','pause'],
 ['Please leave me alone.','stop'],
 ['If I am resigning effective immediately, what happens?','uncertain'],
 ['He said I am resigning effective immediately.','uncertain'],
 ['I am not resigning effective immediately.','clarify'],
])test(`distinct acts do not acquire a resignation from similar words: ${words}`,async({page})=>{
 await say(page,words);await expect(page.locator('#bossWords')).toHaveAttribute('data-dialogue-kind',kind);
 await expect(page.locator('#bossWords')).not.toContainText('formal offboarding');
});
test('secondary privacy wording cannot replace an explicit resignation',async({page})=>{
 const words='I am resigning effective immediately. I will not share personal information.';
 await draft(page,words);await expect(page.locator('#coachGoal')).toHaveValue(words);await confirm(page);
 await page.locator('.coach-option button').first().click();await page.locator('#send').click();
 await expect(page.locator('#bossWords')).toContainText('formal offboarding');await expect(page.locator('#bossWords')).not.toContainText('refusal or limit');
 await page.locator('#finishHere').click();await expect(page.locator('#madeClear')).toContainText('decision to leave the job');
});
test('conditional and quoted restrictions are not asserted as final resignation conditions',async({page})=>{
 const analysis=await page.evaluate(()=>HumanLiteracyDialogue.analyze('I am resigning. He said I will not negotiate continued employment. I will not perform further project work unless we agree different terms. The deadline is effective today.'));
 expect(analysis.kind).toBe('resign');expect(analysis.flags.noNegotiation).toBe(false);expect(analysis.flags.noProjectWork).toBe(false);expect(analysis.flags.resignationTiming).toBe(null);
});

for(const timing of ['immediately','today','tomorrow','on 2026-11-01'])test(`direct resignation timing is retained: ${timing}`,async({page})=>{
 await say(page,'I am resigning '+timing+'.');await expect(page.locator('#bossWords')).toHaveAttribute('data-dialogue-kind','resign');
 await expect(page.locator('#bossWords')).toContainText('resigning '+timing);await page.locator('#finishHere').click();await expect(page.locator('#outcome')).toContainText('job '+timing);
});
test('a basic resignation does not acquire timing, reasons, finality or further-work conditions',async({page})=>{
 await draft(page,'I am resigning.');await confirm(page);
 for(const input of await page.locator('.coach-option textarea').all())expect(await input.inputValue()).not.toMatch(/immediately|not negotiate|further project work|because|unreasonable|I am willing/);
 await page.locator('.coach-option button').first().click();await page.locator('#send').click();await page.locator('#finishHere').click();
 await expect(page.locator('#madeClear')).toHaveText('You stated a decision to leave the job.');
});
for(const goal of ['I might quit, but I have not decided.','I need a break. I am not resigning.'])test(`the selected resignation path cannot override a changed goal: ${goal}`,async({page})=>{
 await draft(page);await page.locator('#coachGoal').fill(goal);await confirm(page);
 for(const input of await page.locator('.coach-option textarea').all())expect(await input.inputValue()).toContain(goal);
 await page.locator('.coach-option button').first().click();await page.locator('#send').click();
 await expect(page.locator('#bossWords')).not.toContainText('formal offboarding');
});
for(const verb of ['quit','leave my job'])test(`private resignation purpose conversion keeps the full suffix: ${verb}`,async({page})=>{
 await draft(page);await page.locator('#coachGoal').fill('My goal is to '+verb+' effective immediately. I will not negotiate continued employment. I will not perform any further project work.');await confirm(page);
 await expect(page.locator('#coachWording0')).toHaveValue(immediate);
});
