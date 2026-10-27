// Synthetic review only. --before reads the immutable prior revision.
const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {execFileSync}=require('node:child_process');
const [base,output,mode,prior]=process.argv.slice(2);
const before=mode==='--before';
if(!base||!output||!['localhost','127.0.0.1'].includes(new URL(base).hostname)||(before&&!/^[a-f0-9]{40}$/.test(prior||'')))throw Error('Local URL, fresh output folder, optional --before FULL_SHA');
fs.mkdirSync(output,{recursive:false});
const files=before?['simulator/01/index.html','simulator/01/coach.js','simulator/01/dialogue.js','simulator/01/speech.js']:execFileSync('git',['ls-files','--','index.html','lessons','simulator','support','media','LICENSE','CONTENT-LICENSE.md'],{encoding:'utf8'}).trim().split('\n').sort();
const runtimeFiles=Object.fromEntries(files.map(file=>[file,crypto.createHash('sha256').update(before?execFileSync('git',['show',prior+':'+file]):fs.readFileSync(file)).digest('hex')]));
const assetHash=crypto.createHash('sha256').update(JSON.stringify(runtimeFiles)).digest('hex');
const results=[],metrics=[];
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.BROWSER_EXECUTABLE_PATH||'/usr/bin/chromium'});
 try{
  for(const width of [1120,320,390]){
   const context=await browser.newContext({viewport:{width,height:900},permissions:[]});
   await context.addInitScript(label=>addEventListener('DOMContentLoaded',()=>{
    const badge=document.createElement('aside');badge.textContent=label;
    badge.style.cssText='padding:10px;background:#122c35;color:white;font:14px/1.5 system-ui;overflow-wrap:anywhere';document.body.prepend(badge);
   }),(before?'BEFORE · ':'AFTER · ')+'UNRELEASED · SYNTHETIC · '+(before?prior:assetHash.slice(0,12)));
   if(!before&&width===1120)await context.tracing.start({screenshots:true,snapshots:true,sources:false});
   const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
   async function capture(state){
    if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Overflow '+state);
    await page.screenshot({path:path.join(output,width+'-'+state+'.png'),fullPage:true});
    results.push({width,state,synthetic:true,replies:await page.locator('#history .mine').count(),boss:await page.locator('#bossWords').innerText()});
   }
   async function say(words){await page.locator('#yourReply').fill(words);await page.locator('#send').click();}
   async function complete(words){
    if(before)await say(words);else if(await page.locator('#finishHere').isVisible())await page.locator('#finishHere').click();
    await page.locator('#reflectionReview>summary').click();
   }
   await page.goto(base+'/simulator/01/');await capture('entry');
   metrics.push(await page.evaluate(()=>({width:innerWidth,heroWords:document.querySelector('.sub').innerText.split(/\s+/).length,heroHeight:document.querySelector('.intro').getBoundingClientRect().height,replyTop:document.getElementById('yourReply').getBoundingClientRect().top,suggestionTop:document.querySelector('#choices button').getBoundingClientRect().top,dropdowns:document.querySelectorAll('select').length,visiblePracticeTools:document.getElementById('recordConsent').checkVisibility(),optionalDetails:document.querySelectorAll('details').length})));
   await say('Please leave me alone.');await capture('stop-request');await complete('Please leave me alone.');await capture('stop-feedback');
   await page.goto(base+'/simulator/01/');await say('Please accept this as my resignation.');await capture('offboarding');await complete('Please accept this as my resignation.');await capture('offboarding-feedback');
   await page.goto(base+'/simulator/01/');await say('I decline this assignment.');await capture('firm-refusal');
   if(!before){
    await page.goto(base+'/simulator/01/');await page.locator('#openPractice').click();await page.locator('#expressWords').fill('Please leave me alone.');
    await page.locator('#coachUnderstand').click();await page.locator('#coachConfirm').click();await capture('stop-wording');
   }
   if(errors.length)throw Error(JSON.stringify(errors));
   if(!before&&width===1120)await context.tracing.stop({path:path.join(output,'synthetic-walkthrough-trace.zip')});
   await context.close();
  }
  fs.writeFileSync(path.join(output,before?'before-results.json':'capture-results.json'),JSON.stringify({unreleased:true,sourceRevision:before?prior:null,assetHash,runtimeFiles,results,metrics,video:false,trace:before?null:'synthetic-walkthrough-trace.zip',limitations:['Synthetic typed messages only','No physical microphone, live dictation or real screen-reader session','Exact delivery source is verified separately by the pinned preview']},null,2)+'\n');
  console.log(JSON.stringify({screenshots:results.length,assetHash,metrics}));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
