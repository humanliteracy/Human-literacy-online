// Synthetic-only evidence capture. No microphone, live speech provider or user data.
const {chromium}=require('playwright');
const fs=require('node:fs');const path=require('node:path');const crypto=require('node:crypto');
const {execFileSync,spawnSync}=require('node:child_process');
const base=process.argv[2],output=process.argv[3];
if(!base||!output||!['localhost','127.0.0.1'].includes(new URL(base).hostname))throw Error('Supply a local review URL and a fresh output folder');
fs.mkdirSync(output,{recursive:false});
const repo=path.resolve(__dirname,'..');
const files=execFileSync('git',['ls-files','--cached','--others','--exclude-standard','--','index.html','lessons','simulator','support','media','LICENSE','CONTENT-LICENSE.md'],{cwd:repo,encoding:'utf8'}).trim().split('\n').sort();
const manifest=Object.fromEntries(files.map(file=>[file,crypto.createHash('sha256').update(fs.readFileSync(path.join(repo,file))).digest('hex')]));
const assetHash=crypto.createHash('sha256').update(JSON.stringify(manifest)).digest('hex');
const results=[],metrics=[];
(async()=>{const browser=await chromium.launch({executablePath:process.env.BROWSER_EXECUTABLE_PATH||'/usr/bin/chromium'});try{
for(const width of [1120,768,320,390]){
 const context=await browser.newContext({viewport:{width,height:900},permissions:[]});
 await context.addInitScript(({label})=>{addEventListener('DOMContentLoaded',()=>{const badge=document.createElement('aside');badge.textContent=label;badge.setAttribute('aria-label','Unreleased review identity');badge.style.cssText='padding:10px;background:#122c35;color:white;font:14px/1.5 system-ui;overflow-wrap:anywhere';document.body.prepend(badge);});},{label:'UNRELEASED · QUALITY REVIEW · runtime '+assetHash.slice(0,12)});
 const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 async function capture(name){await page.screenshot({path:path.join(output,`${width}-${name}.png`),fullPage:true});if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Overflow '+name);results.push({width,state:name,synthetic:true});}
 await page.goto(base+'/simulator/01/');await capture('entry');await page.locator('#replyMore>summary').click();await capture('options');
 await page.locator('#yourReply').fill("I'm not doing any more work on this project.");await capture('custom-response');await page.locator('#send').click();await capture('second-turn');await page.locator('#conversationBack').click();await capture('back-review');await page.locator('#conversationForward').click();await capture('forward-restored');
 await page.locator('#yourReply').fill('I refuse to continue working on this project, and I will not provide another update.');await page.locator('#send').click();await capture('takeaway');await page.locator('#reflectionReview>summary').click();await capture('qualitative-feedback');
 await page.locator('#replay').click();await page.locator('#openPractice').click();await page.locator('#expressWords').fill('The expectations are unreasonable. I quit');await capture('private-expression');
 await page.locator('#coachUnderstand').click();await capture('goal');await page.locator('#coachConfirm').click();await capture('wording');await page.locator('#coachMore>summary').click();await capture('alternatives');
 await page.locator('.coach-option button').first().click();await page.locator('#send').click();await page.locator('#choices button').first().click();await page.locator('#send').click();await capture('resignation-takeaway');
 await page.locator('#replay').click();await page.locator('#send').click();await capture('empty-reply-error');
 await page.locator('#yourReply').fill("Your deadline is ridiculous, and you're incompetent.");await page.locator('#send').click();await capture('hostile-response');
 await page.locator('#yourReply').fill('Purple pancakes orbit the status moon.');await page.locator('#send').click();await capture('unknown-fallback');
 await page.locator('#replay').click();await page.locator('#openPractice').click();if(!await page.locator('#expressWords').isVisible())await page.locator('#coachEditExpression').click();
 const fair='I made a mistake, but I want to explain what happened and find a fair solution.';
 await page.locator('#expressWords').fill(fair);await page.locator('#coachUnderstand').click();await page.locator('#coachPath').selectOption('custom');await page.locator('#coachGoal').fill('I want to explain what happened and find a fair solution.');await page.locator('#coachConfirm').click();await capture('fair-solution-wording');
 await page.locator('.coach-option button').first().click();await capture('fair-solution-draft');await page.locator('#send').click();await capture('fair-solution-reaction');
 await page.locator('#yourReply').fill(fair);await page.locator('#send').click();await page.locator('#replay').click();for(let t=0;t<2;t++){await page.locator('#yourReply').fill(fair);await page.locator('#send').click();}await page.locator('#reflectionReview>summary').click();await capture('fair-solution-feedback');
 metrics.push(await page.evaluate(()=>({width:innerWidth,reflectionHeight:document.getElementById('endPanel').getBoundingClientRect().height,visibleFeedbackFields:[...document.querySelectorAll('#reflectionReview dd')].filter(n=>n.checkVisibility()).length})));
 await page.locator('#replay').click();await page.locator('#yourReply').fill('My favorite color is blue, and I had pancakes for breakfast.');await page.locator('#send').click();await capture('unrelated-response');
 await page.goto(base+'/simulator/01/');await page.locator('#yourReply').fill('I want to explain my part.');await page.locator('#send').click();await capture('explanation-reaction');
 await page.locator('#yourReply').fill('I was waiting for client approval.');await page.locator('#send').click();await page.locator('#reflectionReview>summary').click();await capture('explanation-feedback');
 await page.locator('#replay').click();await page.locator('#choices button').first().click();await page.locator('#send').click();await page.locator('#replyMore>summary').click();await page.locator('#choices button').nth(1).click();await page.locator('#send').click();await capture('risks-support');
 if(errors.length)throw Error(JSON.stringify(errors));await context.close();
}
// A typed-only trace and silent walkthrough use a fresh context with no mic access.
const context=await browser.newContext({viewport:{width:1120,height:900},permissions:[]});
await context.tracing.start({screenshots:true,snapshots:true,sources:false});const page=await context.newPage();
await page.addInitScript(()=>addEventListener('DOMContentLoaded',()=>{const b=document.createElement('aside');b.textContent='UNRELEASED · SYNTHETIC WALKTHROUGH · NO AUDIO';b.style.cssText='padding:10px;background:#122c35;color:white;font:14px system-ui';document.body.prepend(b);}));
const frames=path.join(output,'walkthrough-frames');fs.mkdirSync(frames);
let frame=0;const cdp=await context.newCDPSession(page);
cdp.on('Page.screencastFrame',async event=>{fs.writeFileSync(path.join(frames,String(frame++).padStart(5,'0')+'.jpg'),Buffer.from(event.data,'base64'));await cdp.send('Page.screencastFrameAck',{sessionId:event.sessionId}).catch(()=>{});});
await cdp.send('Page.startScreencast',{format:'jpeg',quality:65,maxWidth:1120,maxHeight:900,everyNthFrame:1});
await page.goto(base+'/simulator/01/');await page.waitForTimeout(500);
await page.locator('#openPractice').click();await page.locator('#expressWords').fill('I made a mistake, but I want to explain what happened and find a fair solution.');await page.waitForTimeout(500);
await page.locator('#coachUnderstand').click();await page.waitForTimeout(500);await page.locator('#coachConfirm').click();await page.waitForTimeout(500);await page.locator('.coach-option button').first().click();await page.waitForTimeout(500);await page.locator('#send').click();await page.waitForTimeout(500);
await page.locator('#yourReply').fill('I will not send an update.');await page.waitForTimeout(500);await page.locator('#send').click();await page.waitForTimeout(500);
await page.locator('#reflectionReview>summary').click();await page.waitForTimeout(500);
await cdp.send('Page.stopScreencast');await context.tracing.stop({path:path.join(output,'synthetic-walkthrough-trace.zip')});await context.close();
let video=false;
if(frame&&spawnSync('ffmpeg',['-version'],{stdio:'ignore'}).status===0){execFileSync('ffmpeg',['-y','-framerate','4','-i',path.join(frames,'%05d.jpg'),'-an','-c:v','libx264','-pix_fmt','yuv420p','-vf','pad=ceil(iw/2)*2:ceil(ih/2)*2',path.join(output,'synthetic-walkthrough.mp4')],{stdio:'ignore'});video=true;}
fs.rmSync(frames,{recursive:true});
// Explicitly simulated failure/recovery images, never evidence of a live provider.
for(const mode of ['record-denied','dictation-no-words']){
 const context=await browser.newContext({viewport:{width:390,height:900},permissions:[]});
 await context.addInitScript(({mode})=>{
  addEventListener('DOMContentLoaded',()=>{const b=document.createElement('aside');b.textContent='UNRELEASED · SIMULATED '+mode;b.style.cssText='padding:10px;background:#122c35;color:white;font:14px system-ui';document.body.prepend(b);});
  if(mode==='record-denied')navigator.mediaDevices.getUserMedia=()=>Promise.reject(new DOMException('Synthetic denial','NotAllowedError'));
  else window.SpeechRecognition=class{start(){this.onstart?.();queueMicrotask(()=>this.onend?.());}abort(){}stop(){this.onend?.();}};
 },{mode});
 const page=await context.newPage();await page.goto(base+'/simulator/01/');await page.locator('#openPractice').click();await page.locator('#practiceTools>summary').click();
 const panel=mode==='record-denied'?'recordingPanel':'speechPanel';await page.locator('#'+panel+'>summary').click();await page.locator(mode==='record-denied'?'#recordConsent':'#speechConsent').check();await page.locator(mode==='record-denied'?'#recordStart':'#speechStart').click();
 await page.getByText(mode==='record-denied'?'Microphone permission was declined or recording is unavailable. Writing and rehearsal still work.':'No words were returned. Your writing is kept. Try a shorter phrase or type instead.',{exact:true}).waitFor();
 await page.screenshot({path:path.join(output,'390-'+mode+'.png'),fullPage:true});await page.locator('#expressWords').fill('Typing remains available.');await context.close();results.push({width:390,state:mode,simulated:true,typingRecovery:true});
}
fs.writeFileSync(path.join(output,'capture-results.json'),JSON.stringify({unreleased:true,assetHash,runtimeFiles:manifest,results,metrics,video,trace:'synthetic-walkthrough-trace.zip',limitations:['Synthetic typed input only','No live speech service or physical microphone','Video is silent and trace captures only typed flow','Screens reflect runtime hashes; final source SHA is shown by independent preview']},null,2)+'\n');
console.log(JSON.stringify({screenshots:results.length,assetHash,video,typedTrace:true}));
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
