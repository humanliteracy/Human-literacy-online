const {test,expect}=require('@playwright/test');
const {reveal}=require('./review-helpers.cjs');
test.beforeEach(async({page})=>{page.qualityErrors=[];page.on('pageerror',e=>page.qualityErrors.push(e.message));await page.goto('/simulator/01/');});
test.afterEach(async({page})=>{expect(page.qualityErrors).toEqual([]);});
async function send(page,words){await page.locator('#yourReply').fill(words);await page.locator('#send').click();}
async function goal(page,path='resign',words='The expectations are unreasonable. I quit'){
 await page.locator('#openPractice').click();await page.locator('#expressWords').fill(words);await page.locator('#coachUnderstand').click();
 if(path!=='resign')await page.locator('#coachPath').selectOption(path);
 if(path==='custom')await page.locator('#coachGoal').fill('I want to clarify one question.');
 await page.locator('#coachConfirm').click();
}
const own='I underestimated the work. I should have warned you yesterday. Here is what remains.';
const plan='I can send a written status update in 30 minutes, with a realistic delivery time.';
for(const item of [
 [94,own,plan],
 [88,'The client changed the scope. I need us to agree on what is realistic.','I can meet the priority, but we need to adjust the scope or deadline.'],
 [67,"It isn't my fault. Everybody else messed this up.",plan],
 [56,"I'm tired of this conversation. Leave me alone.",plan],
 [48,own,"Whatever. I don't care what happens."],
]){
 test(`historical ${item[0]}/100 conversation now has explanatory feedback without a numerical grade`,async({page})=>{
  await send(page,item[1]);await send(page,item[2]);await expect(page.locator('#sceneProgress')).toHaveText('SIMULATION COMPLETE');
  await reveal(page,'reflectionReview');await expect(page.locator('#score')).toHaveCount(0);
  await expect(page.locator('body')).not.toContainText(/\b\d{1,3}\s*\/\s*100\b/);
  for(const id of ['madeClear','feedbackConstructive','feedbackDifficulty','feedbackWhy','feedbackSkill','feedbackAlternative','feedbackImprovement','feedbackExample','unresolved','realWorldPractice'])await expect(page.locator('#'+id)).not.toBeEmpty();
  await expect(page.locator('#history .mine')).toHaveCount(2);
  await expect(page.locator('#history')).toContainText(item[1]);await expect(page.locator('#history')).toContainText(item[2]);
 });
}

test('selecting a suggestion fills an editable draft and never sends or advances automatically',async({page})=>{
 await page.locator('#choices button').first().click();await expect(page.locator('#yourReply')).toHaveValue(own);await expect(page.locator('#yourReply')).toBeFocused();
 await expect(page.locator('#sceneProgress')).toHaveText('SCENE 1 OF 2');await expect(page.locator('#history .mine')).toHaveCount(0);
 await page.locator('#yourReply').fill('I will not send an update.');await page.locator('#send').click();await expect(page.locator('#bossWords')).toContainText('refusal or limit');
 await expect(page.locator('#bossWords')).not.toContainText('proposed a work update');
});

test('identical authored words receive identical feedback when typed or selected',async({page})=>{
 const snapshots=[];
 for(const useButton of [false,true]){
  await page.goto('/simulator/01/');
  if(useButton){await page.locator('#choices button').first().click();await page.locator('#send').click();}else await send(page,own);
  await send(page,plan);await reveal(page,'reflectionReview');
  snapshots.push(await page.locator('#endPanel').innerText());
 }
 expect(snapshots[0]).toBe(snapshots[1]);
});

test('replacing a user draft permits restoring it without sending either version',async({page})=>{
 await page.locator('#yourReply').fill('My own draft that I want to keep.');await page.locator('#choices button').first().click();
 await expect(page.locator('#restoreReplyDraft')).toBeVisible();await page.locator('#restoreReplyDraft').click();
 await expect(page.locator('#yourReply')).toHaveValue('My own draft that I want to keep.');await expect(page.locator('#history .mine')).toHaveCount(0);
});

test('editing a transferred draft preserves the explicit goal, exposes a mismatch, and permits clearing it',async({page})=>{
 await goal(page);await page.locator('.coach-option button').first().click();
 await page.locator('#yourReply').fill('I need a break. I am not resigning.');await expect(page.locator('#replyGoal')).toContainText('Leave or resign');
 await page.locator('#send').click();await expect(page.locator('#bossWords')).toContainText('pause');await expect(page.locator('#bossWords')).not.toContainText('selected goal');
 await expect(page.locator('#inputPanel')).toBeHidden();await page.locator('#conversationBack').click();
 await page.locator('#clearReplyGoal').click();await expect(page.locator('#replyGoalPanel')).toBeHidden();
 await send(page,'I need a break. I am not resigning.');await expect(page.locator('#outcome')).toContainText('pause');
 await expect(page.locator('#outcome')).not.toContainText('You state a decision to leave');
});

test('returning to expression and reconfirming unchanged goal retains every edited alternative',async({page})=>{
 await goal(page);await page.locator('#coachMore>summary').click();
 await page.locator('#coachWording1').fill('My edited alternative: I am resigning and need notice information.');
 await page.locator('#coachEditExpression').click();await expect(page.locator('#expressWords')).toHaveValue('The expectations are unreasonable. I quit');
 await page.locator('#coachUnderstand').click();await page.locator('#coachConfirm').click();await page.locator('#coachMore>summary').click();
 await expect(page.locator('#coachWording1')).toHaveValue('My edited alternative: I am resigning and need notice information.');
});

test('changing paths updates the proposed goal without silently retaining resignation under pause',async({page})=>{
 await goal(page);await page.locator('#coachReview>summary').click();await page.locator('#coachPath').selectOption('pause');
 await expect(page.locator('#coachGoal')).toHaveValue(/pause.*not resign/);await page.locator('#coachConfirm').click();
 await page.locator('.coach-option button').first().click();await page.locator('#send').click();await expect(page.locator('#bossWords')).toContainText('pause');
 await expect(page.locator('#inputPanel')).toBeHidden();await expect(page.locator('#history .mine')).toHaveCount(1);await expect(page.locator('#outcome')).toContainText('without resigning');
});

test('moving a draft during turn two retains the conversation instead of silently starting over',async({page})=>{
 await send(page,'Can you clarify the deadline?');await expect(page.locator('#sceneProgress')).toHaveText('SCENE 2 OF 2');
 await page.locator('#openPractice').click();await reveal(page,'rehearsalPanel');await page.locator('#practiceWords').fill('I need support with this situation.');
 await page.locator('#practiceTransfer').click();await expect(page.locator('#sceneProgress')).toHaveText('SCENE 2 OF 2');await expect(page.locator('#history .mine')).toHaveCount(1);
 await page.locator('#send').click();await expect(page.locator('#sceneProgress')).toHaveText('SIMULATION COMPLETE');await expect(page.locator('#history .mine')).toHaveCount(2);
});

test('private cleanup removes cached goals and alternatives as well as visible private fields',async({page})=>{
 await goal(page);await page.locator('#coachWording0').fill('Private draft that must be forgotten');await page.locator('#practiceClear').click();
 await page.locator('#expressWords').fill('The expectations are unreasonable. I quit');await page.locator('#coachUnderstand').click();await page.locator('#coachConfirm').click();
 await expect(page.locator('#coachWording0')).not.toHaveValue('Private draft that must be forgotten');
});

test('pagehide clears roleplay text, transcript, private fields and any restorable draft',async({page})=>{
 await page.locator('#yourReply').fill('Synthetic sensitive draft');await page.locator('#choices button').first().click();
 await page.evaluate(()=>dispatchEvent(new PageTransitionEvent('pagehide',{persisted:true})));
 await expect(page.locator('#yourReply')).toHaveValue('');await expect(page.locator('#restoreReplyDraft')).toBeHidden();await expect(page.locator('#history')).not.toContainText('Synthetic sensitive');
 await expect(page.locator('#sceneProgress')).toHaveText('SCENE 1 OF 2');
});

test('a 600-character custom goal is preserved without truncating its final decision',async({page})=>{
 await goal(page,'custom','My own goal.');await page.locator('#coachReview>summary').click();
 const ending=' I am not agreeing to this assignment.';const text='A'.repeat(600-ending.length)+ending;
 await page.locator('#coachGoal').fill(text);await page.locator('#coachConfirm').click();await expect(page.locator('#coachGoal')).toHaveValue(text);
 await expect(page.locator('#coachWording0')).toHaveValue(/not accepting/);await expect(page.locator('#coachWording0')).not.toHaveValue(text);
});

test('pagehide erases submitted matched phrases from hidden educational feedback too',async({page})=>{
 await send(page,'I forgot to notify Morgan about the risk.');await send(page,'I need a break.');await reveal(page,'reflectionReview');
 await expect(page.locator('#feedbackEvidence')).toContainText('i forgot to notify');
 await page.evaluate(()=>dispatchEvent(new PageTransitionEvent('pagehide',{persisted:true})));
 await expect(page.locator('#feedbackEvidence')).toBeEmpty();await expect(page.locator('#history .mine')).toHaveCount(0);await expect(page.locator('#outcome')).toBeEmpty();
});
