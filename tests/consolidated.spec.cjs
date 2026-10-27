const {test,expect}=require('@playwright/test');
const {reveal}=require('./review-helpers.cjs');
const cases=[
 ['founder accountability',"I made a mistake, but I want to explain what happened and find a fair solution.",'own',/acknowledged a mistake.*fair solution/i,/acknowledged a mistake.*fair solution/i],
 ['founder no more work',"I'm not doing any more work on this project.",'refusal',/refusal or limit.*client/i,/refusal or limit/i],
 ['founder personal attack',"Your deadline is ridiculous, and you're incompetent.",'hostile',/personal attacks are not acceptable/i,/personal attack/i],
 ['founder explicit refusal','I refuse to continue working on this project, and I will not provide another update.','refusal',/refusal or limit.*client/i,/refusal or limit/i],
 ['founder unrelated facts','My favorite color is blue, and I had pancakes for breakfast.','unrelated',/doesn't explain what happened with the project/i,/personal facts/i],
 ['curly apostrophe refusal','I’m not doing any more work on this project.','refusal',/refusal or limit/i,/refusal or limit/i],
 ['continuing work refusal','I will not continue working on this project.','refusal',/refusal or limit/i,/refusal or limit/i],
 ['ordinary help request','Can I get some help with this project?','support',/asking for support/i,/support/i],
 ['ordinary clarification','What do you need from me?','clarify',/clarification/i,/asked for information/i],
 ['changed requirements','The requirements changed. I need more time for this work.','scope',/scope or timing/i,/scope/i],
 ['deadline criticism is not a personal attack','Your deadline is ridiculous.','scope',/scope or timing/i,/scope/i],
 ['refusal plus insult retains the refusal','I refuse to continue working on this project. You are incompetent.','refusal',/refusal or limit.*Personal attacks/i,/refusal or limit/i],
 ['reported privacy is not the learners boundary','He said I will not share personal information.','unknown',/not sure how that relates/i,/cannot reliably determine/i],
 ['denied treatment boundary is not attributed','I never said I will not be shouted at.','unknown',/not sure how that relates/i,/cannot reliably determine/i],
 ['negated fairness is not a constructive proposal','I will not find a fair solution.','unknown',/not sure how that relates/i,/cannot reliably determine/i],
 ['third-person fairness is not the learner intention','Jordan wants to find a fair solution.','unknown',/not sure how that relates/i,/cannot reliably determine/i],
 ['contradictory resignation stays unresolved','I resign. I am not resigning.','conflict',/different directions/i,/conflicting signals/i],
 ['ordinary unfamiliar wording stays in character','The previous handoff took a different route.','unknown',/What would you like me to understand/i,/cannot reliably determine/i],
];
test.beforeEach(async({page})=>{page.newErrors=[];page.on('pageerror',e=>page.newErrors.push(e.message));await page.goto('/simulator/01/');});
test.afterEach(async({page})=>expect(page.newErrors).toEqual([]));
async function send(page,text){await page.locator('#yourReply').fill(text);await page.locator('#send').click();}
async function draft(page,literal,goal,path='custom'){
 await page.locator('#openPractice').click();await page.locator('#expressWords').fill(literal);await page.locator('#coachUnderstand').click();
 await page.locator('#coachPath').selectOption(path);await page.locator('#coachGoal').fill(goal);await page.locator('#coachConfirm').click();
}
for(const [name,text,kind,reaction,feedback] of cases)test(`complete ordinary-language conversation: ${name}`,async({page})=>{
 await send(page,text);await expect(page.locator('#bossWords')).toContainText(reaction);
 await expect(page.locator('#bossWords')).not.toContainText(/script|prototype|classifier|selected goal|cannot reliably/i);
 await expect(page.locator('#bossWords')).toHaveAttribute('data-dialogue-kind',kind);
 await send(page,text);await expect(page.locator('#sceneProgress')).toHaveText('SIMULATION COMPLETE');
 await expect(page.locator('#bossWords')).not.toContainText(/script|prototype|classifier|selected goal|cannot reliably/i);
 await reveal(page,'reflectionReview');await expect(page.locator('#madeClear')).toContainText(feedback);
 await expect(page.locator('#madeClear')).toHaveCount(1);await expect(page.locator('#feedbackImprovement')).not.toBeEmpty();await expect(page.locator('#feedbackAlternative')).not.toBeEmpty();
 await expect(page.locator('#history .mine')).toHaveCount(2);await expect(page.locator('#history .mine').first()).toContainText(text);
 await expect(page.locator('#score')).toHaveCount(0);await expect(page.locator('#practiceScoreToggle')).toHaveCount(0);
 if(['refusal','hostile','unrelated','unknown'].includes(kind))await expect(page.locator('#outcome')).not.toContainText(/team gets a clearer|useful next step established|successful recovery/i);
});

test('actual thoughts and a fair-solution goal become three usable alternatives rather than goal echoes',async({page})=>{
 const literal=cases[0][1],goal='I want to explain what happened and find a fair solution.';
 await draft(page,literal,goal);
 const words=await page.locator('.coach-option textarea').evaluateAll(nodes=>nodes.map(n=>n.value));
 expect(new Set(words).size).toBe(3);expect(words.every(w=>w!==goal&&!/^My goal|Before I make a commitment: I want/i.test(w))).toBe(true);
 expect(words[0]).toContain('I made a mistake.');expect(words[0]).toContain('fair next step');
 await expect(page.locator('.coach-option:visible')).toHaveCount(1);
 await expect(page.locator('#coachWording0Difference')).toContainText('without accepting all blame');
 await page.locator('.coach-option button').first().click();await expect(page.locator('#yourReply')).toHaveValue(words[0]);await expect(page.locator('#history .mine')).toHaveCount(0);
 await page.locator('#send').click();await expect(page.locator('#bossWords')).toContainText('Tell me what happened');
});

test('explaining a fair solution does not invent an admission absent from the actual thoughts',async({page})=>{
 await draft(page,'The situation needs discussion.','I want to explain what happened and find a fair solution.');
 const words=await page.locator('.coach-option textarea').evaluateAll(nodes=>nodes.map(n=>n.value));expect(words.join(' ')).not.toMatch(/I made a mistake|my fault|I apologize/);
 await page.locator('.coach-option button').first().click();await page.locator('#send').click();await expect(page.locator('#bossWords')).toContainText('You want to explain what happened');
});

test('drafts retain both a work refusal and the refusal to provide another update',async({page})=>{
 await draft(page,cases[3][1],'I refuse to continue working on this project, and I will not provide another update.');
 const options=await page.locator('.coach-option textarea').evaluateAll(nodes=>nodes.map(n=>n.value));
 for(const text of options){expect(text).toMatch(/will not continue working.*or provide another update/);expect(text).not.toMatch(/resign|I can send|I will send/);}
 await page.locator('.coach-option button').first().click();await page.locator('#send').click();await expect(page.locator('#bossWords')).toContainText('refusal or limit');
 await expect(page.locator('#choices')).toContainText('My decision is still no');
});

for(const [name,literal,goal,path,required] of [
 ['privacy','I will not share personal information.','I want to keep my personal information private.','boundary',/not share personal information/],
 ['treatment','I will not be shouted at.','I want to set a limit on being shouted at.','boundary',/will not be shouted at/],
 ['uncertainty','I might quit.','I might quit, but I have not decided.','custom',/haven't decided/],
 ['clarifying','What do you need from me?','I want to ask a question about the situation.','custom',/clarify what you need/],
])test(`Help me draft preserves ${name} without inventing agreement`,async({page})=>{
 await draft(page,literal,goal,path);await expect(page.locator('#coachWording0')).toHaveValue(required);
 await expect(page.locator('#coachGoal')).toHaveValue(goal);await expect(page.locator('#coachWording0')).not.toHaveValue(goal);
 await page.locator('.coach-option button').first().click();await expect(page.locator('#history .mine')).toHaveCount(0);
 await page.locator('#send').click();await expect(page.locator('#bossWords')).not.toContainText(/selected goal|script/i);
});

test('edited wording transfers exactly, including whitespace, line breaks and curly punctuation',async({page})=>{
 await draft(page,'I want to clarify a limit.','I want to refuse this request.','boundary');
 const own='  I’m not doing any more work on this project.\nI will not provide another update.  ';
 await page.locator('#coachWording0').fill(own);await page.locator('.coach-option button').first().click();
 await expect(page.locator('#yourReply')).toHaveValue(own);await expect(page.locator('#history .mine')).toHaveCount(0);
 await page.locator('#send').click();await expect(page.locator('#history .mine')).toHaveCount(1);await expect(page.locator('#bossWords')).toContainText('refusal or limit');
});

test('private goals do not leak into Jordan or override a submitted pause decision',async({page})=>{
 await draft(page,'The expectations are unreasonable. I quit','I want to resign rather than accept these expectations.','resign');
 await page.locator('.coach-option button').first().click();await send(page,'I need a pause. I am not resigning.');
 await expect(page.locator('#bossWords')).toContainText('pause');await expect(page.locator('#bossWords')).not.toContainText(/selected|your goal is|chose to leave/);
 await expect(page.locator('#choices')).toContainText('not resigning');
});

test('unsupported custom goals get transparent neutral openers and stay out of the spoken draft',async({page})=>{
 const goal='A very particular outcome only I understand.';await draft(page,'A different concern.',goal);
 await expect(page.locator('#coachWordsNotice')).toContainText('neutral openers');await expect(page.locator('#coachGoal')).toHaveValue(goal);
 const words=await page.locator('.coach-option textarea').evaluateAll(nodes=>nodes.map(n=>n.value));expect(words.every(w=>!w.includes(goal))).toBe(true);
 await expect(page.locator('#coachWording0')).toHaveAttribute('aria-describedby','coachWording0Difference');
});

for(const width of [320,390])test(`${width}px keyboard journey: draft, alternatives, explicit send, feedback and saved navigation`,async({page})=>{
 await page.setViewportSize({width,height:844});await page.locator('#openPractice').click();await page.locator('#expressWords').fill(cases[0][1]);
 await page.locator('#coachUnderstand').focus();await page.keyboard.press('Enter');await expect(page.locator('#coachUnderstandingTitle')).toBeFocused();
 await page.keyboard.press('Tab');await expect(page.locator('#coachPath')).toBeFocused();await page.keyboard.press('End');await page.keyboard.press('Tab');
 await page.locator('#coachGoal').fill('I want to explain what happened and find a fair solution.');await page.keyboard.press('Tab');await page.keyboard.press('Enter');
 await expect(page.locator('#coachChoicesTitle')).toBeFocused();await page.keyboard.press('Tab');await expect(page.locator('#coachWording0')).toBeFocused();
 await page.locator('#coachMore>summary').focus();await page.keyboard.press('Enter');await page.keyboard.press('Tab');await expect(page.locator('#coachWording1')).toBeFocused();
 await page.keyboard.press('Tab');await page.keyboard.press('Enter');await expect(page.locator('#yourReply')).toBeFocused();await expect(page.locator('#history .mine')).toHaveCount(0);
 await page.keyboard.press('Tab');await page.keyboard.press('Enter');await expect(page.locator('#replyHeading')).toBeFocused();
 await page.locator('#choices button').first().focus();await page.keyboard.press('Enter');await expect(page.locator('#yourReply')).toBeFocused();await page.keyboard.press('Tab');await page.keyboard.press('Enter');
 await expect(page.locator('#completionTitle')).toBeFocused();await page.locator('#reflectionReview>summary').focus();await page.keyboard.press('Enter');
 await expect(page.locator('#madeClear')).toBeVisible();await expect(page.locator('#feedbackEvidence')).toBeHidden();await page.locator('#feedbackEvidencePanel>summary').focus();await page.keyboard.press('Enter');await expect(page.locator('#feedbackEvidence')).toBeVisible();
 await page.locator('#conversationBack').focus();await page.keyboard.press('Enter');await expect(page.locator('#replyHeading')).toBeFocused();await page.locator('#conversationForward').focus();await page.keyboard.press('Enter');await expect(page.locator('#completionTitle')).toBeFocused();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});

for(const [name,literal,path,absent] of [
 ['accountability','I made a mistake.','recovery',/should have flagged|warned you|client changed/i],
 ['scope','Your deadline is ridiculous.','scope',/scope changed|added work|requirements changed/i],
 ['resignation','I am resigning.','resign',/unreasonable|unfair|willing to.*handover/i],
])test(`suggested ${name} wording does not invent a fact or reason`,async({page})=>{
 await page.locator('#openPractice').click();await page.locator('#expressWords').fill(literal);await page.locator('#coachUnderstand').click();
 await expect(page.locator('#coachPath')).toHaveValue(path);await page.locator('#coachConfirm').click();
 const words=await page.locator('.coach-option textarea').evaluateAll(nodes=>nodes.map(n=>n.value));expect(words.join(' ')).not.toMatch(absent);
 expect(words.every(w=>w.length>10&&w.length<=600)).toBe(true);
});

test('an automatically proposed uncertain goal remains uncertain when drafting',async({page})=>{
 await page.locator('#openPractice').click();await page.locator('#expressWords').fill('I might quit.');await page.locator('#coachUnderstand').click();await page.locator('#coachConfirm').click();
 await expect(page.locator('#coachWording0')).toHaveValue(/haven't decided/);await page.locator('.coach-option button').first().click();await page.locator('#send').click();
 await expect(page.locator('#bossWords')).toContainText('not assume a resignation');
});

for(const [first,expected] of [['I am resigning.',/chose to leave/],['I will not complete this work.',/earlier refusal or limit/],['I need a pause.',/asked for a pause/]])test(`later explanation does not erase the submitted decision: ${first}`,async({page})=>{
 await send(page,first);await send(page,cases[0][1]);await expect(page.locator('#bossWords')).toContainText(expected);
 await expect(page.locator('#outcome')).not.toContainText('propose a concrete next step');
});

for(const [path,goal,first,last,outcome] of [
 ['recovery','I want to discuss my part and realistic next steps.','I made a mistake.','I will not provide another update.',/refusal or limit/],
 ['resign','I want to resign rather than accept these expectations.','I need a pause. I am not resigning.','I need a pause. I am not resigning.',/pause without resigning/],
])test(`a submitted decision controls feedback even when the private goal differs: ${path}`,async({page})=>{
 await draft(page,first,goal,path);await page.locator('.coach-option button').first().click();await send(page,first);await send(page,last);
 await expect(page.locator('#outcome')).toContainText(outcome);await expect(page.locator('#madeClear')).not.toContainText('conflicting signals');
 await expect(page.locator('#reflectionBasis')).toContainText(goal);await expect(page.locator('#reflectionBasis')).toContainText('differ from this private goal');
 await expect(page.locator('#bossWords')).not.toContainText(/selected goal|script|your goal is/i);
});

test('a private resignation goal alone never becomes a stated resignation in feedback',async({page})=>{
 const goal='I want to resign rather than accept these expectations.';
 await draft(page,'What do you need from me?',goal,'resign');await page.locator('.coach-option button').first().click();
 await send(page,'What do you need from me?');await send(page,'Can you clarify the deadline?');
 await expect(page.locator('#outcome')).toContainText('clarify');await expect(page.locator('#outcome')).not.toContainText('decision to leave the job');
 await expect(page.locator('#reflectionBasis')).toContainText(goal);await expect(page.locator('#madeClear')).toContainText('asked for information');
});

for(const [name,literal,goal,path,expected] of [
 ['fair solution',cases[0][1],'I want to explain what happened and find a fair solution.','custom',['own','clarify','recovery']],
 ['no further work or updates',cases[3][1],cases[3][1],'custom',['refusal']],
 ['privacy','I will not share personal information.','I want to keep my personal information private.','boundary',['refusal']],
 ['respectful treatment','I will not be shouted at.','I want to set a limit on being shouted at.','boundary',['refusal','pause']],
 ['uncertainty','I might quit.','I might quit, but I have not decided.','custom',['uncertain']],
 ['clarification','What do you need from me?','I want to ask a question about the situation.','custom',['clarify']],
 ['recovery without invented fault','The situation needs discussion.','I want to discuss facts before committing.','recovery',['clarify']],
 ['deadline review without invented changes','Your deadline is ridiculous.','I want to clarify realistic scope and time.','scope',['clarify','scope']],
 ['resignation without invented reasons','I am resigning.','I want to resign.','resign',['resign']],
 ['neutral opener','A different concern.','A very particular outcome only I understand.','custom',['clarify']],
])test(`all three generated ${name} alternatives work in the roleplay without private-goal provenance`,async({page})=>{
 const result=await page.evaluate(({literal,goal,path})=>HumanLiteracyCoach.wordingFor({literal,goal,path}).options.map(([label,text])=>{
  const analysis=HumanLiteracyDialogue.analyze(text);return {label,text,kind:analysis.kind,manager:HumanLiteracyDialogue.manager(analysis)};
 }),{literal,goal,path});
 expect(result).toHaveLength(3);for(const option of result){expect(expected).toContain(option.kind);expect(option.manager).not.toMatch(/script|prototype|not sure how that relates/i);expect(option.text).not.toBe(goal);}
});
