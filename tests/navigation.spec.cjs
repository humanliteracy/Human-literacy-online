const {test,expect}=require('@playwright/test');
async function send(page,text){await page.locator('#yourReply').fill(text);await page.locator('#send').click();}
test.beforeEach(async({page})=>{page.navErrors=[];page.on('pageerror',e=>page.navErrors.push(e.message));await page.goto('/simulator/01/');});
test.afterEach(async({page})=>expect(page.navErrors).toEqual([]));
for(const width of [320,390,1120])test(`Back and Forward restore replies, drafts, context and completion at ${width}px`,async({page})=>{
 await page.setViewportSize({width,height:844});
 await send(page,'I am resigning.');
 const suggestions=await page.locator('#choices').textContent();expect(suggestions).toMatch(/offboarding/i);expect(suggestions).toContain('I am resigning.');
 await page.locator('#yourReply').fill('My unfinished second reply.');
 await page.locator('#conversationBack').click();
 await expect(page.locator('#yourReply')).toHaveValue('I am resigning.');await expect(page.locator('#history .mine')).toHaveCount(0);
 await expect(page.locator('#replyHeading')).toBeFocused();
 await page.locator('#conversationForward').click();await expect(page.locator('#yourReply')).toHaveValue('My unfinished second reply.');
 await expect(page.locator('#choices')).toHaveText(suggestions);await expect(page.locator('#history .mine')).toHaveCount(1);
 await send(page,'Can you clarify the notice process?');const outcome=await page.locator('#outcome').textContent();expect(outcome).toMatch(/leave the job/i);
 await page.locator('#conversationBack').focus();await page.keyboard.press('Enter');await expect(page.locator('#yourReply')).toHaveValue('Can you clarify the notice process?');
 await page.locator('#conversationForward').focus();await page.keyboard.press('Enter');await expect(page.locator('#completionTitle')).toBeFocused();
 await expect(page.locator('#outcome')).toHaveText(outcome);await expect(page.locator('#history .mine')).toHaveCount(2);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
test('editing an earlier reply does not send until Say this, then replaces only dependent later progress',async({page})=>{
 await send(page,'I am resigning.');await send(page,'Can you clarify the notice process?');
 await page.locator('#conversationBack').click();await page.locator('#conversationBack').click();
 await page.locator('#yourReply').fill('I will not complete this work.');
 await page.locator('#conversationForward').click();await expect(page.locator('#history .mine').first()).toContainText('I am resigning.');
 await page.locator('#conversationBack').click();await expect(page.locator('#yourReply')).toHaveValue('I will not complete this work.');
 await page.locator('#send').click();await expect(page.locator('#conversationForward')).toBeDisabled();
 await expect(page.locator('#history .mine')).toHaveCount(1);await expect(page.locator('#history')).not.toContainText('I am resigning.');
 await expect(page.locator('#choices')).toContainText('My answer to this request is no.');
 await send(page,'Can you clarify the deadline?');await expect(page.locator('#bossWords')).toContainText('earlier refusal or limit');
});
test('leaving clears saved navigation and cannot resurrect submitted text',async({page})=>{
 await send(page,'I am resigning.');await page.evaluate(()=>dispatchEvent(new PageTransitionEvent('pagehide',{persisted:true})));
 await expect(page.locator('#conversationNavigation')).toBeHidden();await expect(page.locator('#yourReply')).toHaveValue('');
 await expect(page.locator('#history')).not.toContainText('I am resigning.');
});

test('retrying and sending a new reply clears the previous navigation status',async({page})=>{
 await send(page,'I am resigning.');await send(page,'Can you clarify the notice process?');
 await page.locator('#conversationBack').click();await page.locator('#conversationForward').click();
 await expect(page.locator('#navigationStatus')).toContainText('Saved progress restored');
 await page.locator('#replay').click();await expect(page.locator('#conversationNavigation')).toBeHidden();
 await send(page,'I need a break.');await expect(page.locator('#navigationStatus')).toContainText('Reply sent.');
 await expect(page.locator('#navigationStatus')).not.toContainText('restored');
});

for(const width of [320,390,1120])test(`return to all lessons reaches the lesson list and resumes keyboard navigation at ${width}px`,async({page},testInfo)=>{
 await page.setViewportSize({width,height:844});
 await page.goto('/');
 const card=page.locator('section[aria-labelledby="simulator-heading"]');
 await expect(card).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await card.screenshot({path:testInfo.outputPath('home-card.png')});
 await page.getByRole('link',{name:'Try the Life Simulator',exact:true}).click();
 await send(page,'Please leave me alone.');
 await expect(page.locator('#completionTitle')).toBeFocused();
 const back=page.getByRole('link',{name:'Back to all lessons',exact:true});
 await back.focus();await page.keyboard.press('Enter');
 await expect(page).toHaveURL(/\/#choose$/);
 const heading=page.getByRole('heading',{name:'Choose a lesson',exact:true});
 await expect(heading).toBeFocused();
 expect(await heading.evaluate(n=>{const r=n.getBoundingClientRect();return r.top>=-1&&r.bottom<=innerHeight;})).toBe(true);
 await expect(page.getByRole('link',{name:/^Start Lesson \d{2}$/})).toHaveCount(10);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.screenshot({path:testInfo.outputPath('lesson-list.png')});
 await page.keyboard.press('Tab');await expect(page.getByRole('link',{name:'Start Lesson 01',exact:true})).toBeFocused();
 await page.keyboard.press('Enter');await expect(page).toHaveURL(/\/lessons\/01\//);
 await expect(page.locator('h1')).toBeVisible();
});
