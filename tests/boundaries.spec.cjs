const {test,expect}=require('@playwright/test');
const {reveal}=require('./review-helpers.cjs');
async function say(page,text){await page.locator('#yourReply').fill(text);await page.locator('#send').click();}
test.beforeEach(async({page})=>{page.errors=[];page.on('pageerror',e=>page.errors.push(e.message));await page.goto('/simulator/01/');});
test.afterEach(async({page})=>expect(page.errors).toEqual([]));

for(const text of ['Please leave me alone.','Leave me alone!','Please stop.','Stop talking to me.','I want to end this conversation.','I do not want to discuss this any further.','Please do not contact me.','Fuck off.','Shut up.'])test(`a stop request ends the exchange without clarification: ${text}`,async({page})=>{
 await say(page,text);await expect(page.locator('#completionTitle')).toBeFocused();
 await expect(page.locator('#inputPanel')).toBeHidden();await expect(page.locator('#bossWords')).not.toContainText('?');
 await expect(page.locator('#bossWords')).toContainText(/stop|leave you alone/);
 await expect(page.locator('#bossWords')).not.toContainText(/what do you mean|clarify|script|software|resigning/i);
 await expect(page.locator('#history .mine')).toHaveCount(1);
 await expect(page.locator('#outcome')).toContainText('ended the conversation');
 await reveal(page,'reflectionReview');await expect(page.locator('#madeClear')).toContainText('stop the interaction');
 await expect(page.locator('#feedbackImprovement')).toContainText('needs no further explanation');
 await expect(page.locator('#feedbackEvidence')).not.toContainText('Reply 2');
 await page.locator('#conversationBack').click();await expect(page.locator('#yourReply')).toHaveValue(text);
 await page.locator('#conversationForward').click();await expect(page.locator('#completionTitle')).toBeFocused();
 await expect(page.locator('#history .mine')).toHaveCount(1);await expect(page.locator('#inputPanel')).toBeHidden();
});

for(const text of ['I need a break.','Please pause.','Can we pick this up later?','Leave me alone for now.','I need a minute.','I would like to take a break.'])test(`a temporary pause closes without inventing resignation: ${text}`,async({page})=>{
 await say(page,text);await expect(page.locator('#inputPanel')).toBeHidden();
 await expect(page.locator('#bossWords')).toContainText('stop here');await expect(page.locator('#bossWords')).not.toContainText('?');
 await expect(page.locator('#outcome')).toContainText('pause without resigning');
 await expect(page.locator('#madeClear')).toContainText('break from the conversation');
 await expect(page.locator('#feedbackImprovement')).toContainText('no additional explanation');
 await expect(page.locator('#history .mine')).toHaveCount(1);
});

for(const text of ['Please accept this as my resignation.','I am submitting my resignation.','My decision to resign is final.','I hereby resign.','I resign effective immediately.','I am leaving the company.','I resign and would like notice information.','I have decided to quit my job.'])test(`final employment resignation leads to offboarding: ${text}`,async({page})=>{
 await say(page,text);await expect(page.locator('#bossWords')).toHaveAttribute('data-dialogue-kind','resign');
 await expect(page.locator('#bossWords')).toContainText('formal offboarding');
 await expect(page.locator('#bossWords')).toContainText(/notice.*final pay.*equipment.*handover/);
 await expect(page.locator('#bossWords')).not.toContainText(/Is this final|different conditions|reconsider|\?/);
 await expect(page.locator('#finishHere')).toBeVisible();await page.locator('#finishHere').click();
 await expect(page.locator('#outcome')).toContainText('decision to leave the job');
 await expect(page.locator('#madeClear')).not.toContainText(/conditional refusal|refusal or limit/);
 await expect(page.locator('#feedbackImprovement')).toContainText('offboarding');
 await expect(page.locator('#history .mine')).toHaveCount(1);
});

for(const text of ['I decline this assignment.','I will not do it.','I am not willing to work on this project.','I do not agree to take this on.'])test(`a respectful refusal requires no alternative help: ${text}`,async({page})=>{
 await say(page,text);await expect(page.locator('#bossWords')).toHaveAttribute('data-dialogue-kind','refusal');
 await expect(page.locator('#bossWords')).not.toContainText(/Is this final|conditions you would discuss|What can you offer|\?/);
 await expect(page.locator('#choices')).not.toContainText(/under the current conditions|open to discussing/);
 await page.locator('#finishHere').click();await expect(page.locator('#outcome')).toContainText('refusal or limit');
 await expect(page.locator('#feedbackAlternative')).toContainText('not a resignation');
});

for(const text of ['Can we discuss different conditions?','I am willing to discuss revised terms.','I will not accept this request under these conditions.'])test(`negotiation remains a choice distinct from final resignation: ${text}`,async({page})=>{
 await say(page,text);await expect(page.locator('#bossWords')).toContainText(/different terms|scope or timing/);
 await expect(page.locator('#bossWords')).not.toContainText('formal offboarding');
 await page.locator('#finishHere').click();await expect(page.locator('#outcome')).not.toContainText('decision to leave the job');
});

for(const text of ['He said please leave me alone.','I never said I want to end this conversation.','If I resign, what would happen?','I do not accept this as my resignation.','Please do not leave me alone.','Do not stop talking to me.','I was told to accept my resignation.'])test(`reported, denied and hypothetical wording does not force an ending or resignation: ${text}`,async({page})=>{
 await say(page,text);await expect(page.locator('#inputPanel')).toBeVisible();
 await expect(page.locator('#bossWords')).not.toHaveAttribute('data-dialogue-kind','resign');
 await expect(page.locator('#bossWords')).not.toContainText("I'll leave you alone");
});

test('resignation plus a stop request preserves offboarding and ends without more questions',async({page})=>{
 await say(page,'I am resigning. Please leave me alone.');
 await expect(page.locator('#inputPanel')).toBeHidden();await expect(page.locator('#bossWords')).toContainText('formal offboarding');
 await expect(page.locator('#bossWords')).not.toContainText('?');await expect(page.locator('#outcome')).toContainText('decision to leave the job');
 await expect(page.locator('#madeClear')).toContainText('decision to leave the job');
});

test('a stop request after resignation ends the exchange while the resignation stands',async({page})=>{
 await say(page,'I hereby resign.');await say(page,'Please leave me alone.');
 await expect(page.locator('#inputPanel')).toBeHidden();await expect(page.locator('#outcome')).toContainText('Your resignation stands');
 await expect(page.locator('#unresolved')).toContainText('offboarding');
});

for(const [text,kind] of [
 ['She said you are an idiot. Please leave me alone.','stop'],
 ['He said I am not resigning. I am resigning.','resign'],
 ['She said you are an idiot. I hereby resign.','resign'],
])test(`a direct decision is distinct from earlier quoted words: ${text}`,async({page})=>{
 await say(page,text);await expect(page.locator('#bossWords')).toHaveAttribute('data-dialogue-kind',kind);
 if(kind==='stop'){await expect(page.locator('#inputPanel')).toBeHidden();await expect(page.locator('#madeClear')).toContainText('stop the interaction');}
 else{await expect(page.locator('#bossWords')).toContainText('formal offboarding');await page.locator('#finishHere').click();await expect(page.locator('#outcome')).toContainText('decision to leave the job');}
 await expect(page.locator('#madeClear')).not.toContainText(/conflicting|cannot reliably determine/);
});

for(const text of ['What is your favorite color?','Why is the sky blue?','Can we talk about dinner?','Purple pancakes orbit the status moon.','Bullshit.','You are incompetent.'])test(`unexpected wording gets bounded feedback and an optional ending: ${text}`,async({page})=>{
 await say(page,text);await expect(page.locator('#bossWords')).not.toContainText(/script|software|classifier|API/);
 await page.locator('#finishHere').click();await expect(page.locator('#history .mine')).toHaveCount(1);
 await expect(page.locator('#outcome')).not.toContainText(/successful recovery|communication ability|score/);
 await expect(page.locator('#feedbackImprovement')).not.toBeEmpty();await expect(page.locator('#score')).toHaveCount(0);
});

test('coach stop wording and firm refusal options do not add offers or conditions',async({page})=>{
 for(const [literal,path,goal,kind] of [['Please leave me alone.','custom','I want to end this conversation.','stop'],['I decline this assignment.','boundary','I want to refuse this request.','refusal']]){
  const options=await page.evaluate(args=>HumanLiteracyCoach.wordingFor(args).options,{literal,path,goal});
  for(const [,words] of options){expect(words).not.toMatch(/under these conditions|different conditions|willing to|I can help|I will send|resign/);expect(await page.evaluate(w=>HumanLiteracyDialogue.analyze(w).kind,words)).toBe(kind);}
 }
 await page.locator('#openPractice').click();await page.locator('#expressWords').fill('Please leave me alone.');await page.locator('#coachUnderstand').click();
 await expect(page.locator('#coachPath')).toHaveValue('custom');await expect(page.locator('#coachGoal')).toHaveValue('I want to end this conversation.');
 await page.locator('#coachConfirm').click();await page.locator('.coach-option button').first().click();
 await expect(page.locator('#yourReply')).toHaveValue('Please leave me alone.');await expect(page.locator('#history .mine')).toHaveCount(0);
 await page.locator('#send').click();await expect(page.locator('#inputPanel')).toBeHidden();
});

test('refusing only an update does not become refusing all work in drafting',async({page})=>{
 const words=await page.evaluate(()=>HumanLiteracyCoach.wordingFor({literal:'I will not provide another update.',path:'boundary',goal:'I want to refuse this request.'}).options.map(o=>o[1]));
 expect(words.join(' ')).toContain('will not provide another update');expect(words.join(' ')).not.toMatch(/not continue working|not doing any more work/);
});

test('a time-limited refusal retains its timing in coaching, conversation and feedback',async({page})=>{
 const words=await page.evaluate(()=>HumanLiteracyCoach.wordingFor({literal:'I will not do it today.',path:'boundary',goal:'I want to refuse this request.'}).options.map(o=>o[1]));
 for(const w of words){expect(w).toContain('today');expect(w).not.toMatch(/resign|I will help|I can send|under these conditions/);}
 await say(page,'I will not do it today.');await expect(page.locator('#bossWords')).toContainText('time-limited refusal');
 await expect(page.locator('#choices button').first()).toContainText('today');await page.locator('#finishHere').click();
 await expect(page.locator('#outcome')).toContainText('not resignation or agreement to later work');
 await expect(page.locator('#madeClear')).toContainText('time-limited refusal');
});

for(const width of [320,390])test(`${width}px free typing comes first; ending saves drafts and supports keyboard navigation`,async({page})=>{
 await page.setViewportSize({width,height:844});await page.locator('#replyHeading').focus();await page.keyboard.press('Tab');
 await expect(page.locator('#yourReply')).toBeFocused();
 await say(page,'I am submitting my resignation.');await page.locator('#yourReply').fill('Unsent practical question.');
 await page.locator('#finishHere').focus();await page.keyboard.press('Enter');await expect(page.locator('#completionTitle')).toBeFocused();
 await expect(page.locator('#history')).not.toContainText('Unsent practical question');
 await page.locator('#conversationBack').focus();await page.keyboard.press('Enter');await expect(page.locator('#yourReply')).toHaveValue('Unsent practical question.');
 await page.locator('#conversationForward').focus();await page.keyboard.press('Enter');await expect(page.locator('#completionTitle')).toBeFocused();
 await page.locator('#conversationBack').click();await say(page,'Please leave me alone.');
 await expect(page.locator('#inputPanel')).toBeHidden();await expect(page.locator('#outcome')).toContainText('Your resignation stands');
 await page.locator('#replay').click();await say(page,'Please stop.');
 await page.locator('#conversationBack').click();await say(page,'Can you clarify the deadline?');
 await expect(page.locator('#inputPanel')).toBeVisible();await expect(page.locator('#conversationForward')).toBeDisabled();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 expect(await page.evaluate(()=>[localStorage.length,sessionStorage.length,document.cookie])).toEqual([0,0,'']);
});
