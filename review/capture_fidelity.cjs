// Reproducible synthetic resignation evidence, using the existing local capture route.
const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {execFileSync}=require('node:child_process');
const [base,output,prior]=process.argv.slice(2);
if(!base||!output||!['localhost','127.0.0.1'].includes(new URL(base).hostname)||(prior&&!/^[a-f0-9]{40}$/.test(prior)))throw Error('Local URL, fresh folder, optional prior full SHA');
fs.mkdirSync(output,{recursive:false});
const files=prior?['simulator/01/index.html','simulator/01/coach.js','simulator/01/dialogue.js','simulator/01/speech.js']:execFileSync('git',['ls-files','--','index.html','lessons','simulator','support','media','LICENSE','CONTENT-LICENSE.md'],{encoding:'utf8'}).trim().split('\n').sort();
const runtimeFiles=Object.fromEntries(files.map(file=>[file,crypto.createHash('sha256').update(prior?execFileSync('git',['show',prior+':'+file]):fs.readFileSync(file)).digest('hex')]));
const assetHash=crypto.createHash('sha256').update(JSON.stringify(runtimeFiles)).digest('hex');
const results=[],metrics=[];
const words='I am resigning effective immediately. I will not negotiate continued employment. I will not perform any further project work.';
(async()=>{const browser=await chromium.launch({executablePath:process.env.BROWSER_EXECUTABLE_PATH||'/usr/bin/chromium'});try{
 for(const width of [1120,320,390]){
  const context=await browser.newContext({viewport:{width,height:900},permissions:[]});
  await context.addInitScript(label=>addEventListener('DOMContentLoaded',()=>{
   const badge=document.createElement('aside');badge.textContent=label;badge.style.cssText='padding:10px;background:#122c35;color:white;font:14px/1.5 system-ui;overflow-wrap:anywhere';document.body.prepend(badge);
  }),(prior?'BEFORE · ':'AFTER · ')+'UNRELEASED · SYNTHETIC · '+(prior||assetHash.slice(0,12)));
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  async function capture(state){
   if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Overflow '+state);
   await page.screenshot({path:path.join(output,width+'-'+state+'.png'),fullPage:true});
   results.push({width,state,synthetic:true,replies:await page.locator('#history .mine').count(),boss:await page.locator('#bossWords').innerText()});
  }
  await page.goto(base+'/simulator/01/');await page.locator('#openPractice').click();await page.locator('#expressWords').fill(words);await page.locator('#coachUnderstand').click();
  await capture('proposed-goal');
  // Compare the same confirmed founder goal even when the old auto-proposal missed it.
  if(await page.locator('#coachPath').inputValue()!=='resign')await page.locator('#coachPath').selectOption('resign');
  await page.locator('#coachGoal').fill(words);await page.locator('#coachConfirm').click();await capture('wording');
  metrics.push({width,visibleSuggestions:await page.locator('.coach-option:visible').count(),suggestion:await page.locator('#coachWording0').inputValue(),goal:words,dropdowns:await page.locator('select').count(),requiredSubmissions:1,optionalToolsVisible:await page.locator('#recordConsent').isVisible()});
  await page.locator('.coach-option button').first().click();await capture('review-draft');await page.locator('#send').click();await capture('manager');
  await page.locator('#finishHere').click();await capture('takeaway');await page.locator('#reflectionReview>summary').click();await capture('reflection');
  if(errors.length)throw Error(JSON.stringify(errors));await context.close();
 }
 fs.writeFileSync(path.join(output,prior?'before-results.json':'capture-results.json'),JSON.stringify({unreleased:true,sourceRevision:prior||null,assetHash,runtimeFiles,results,metrics,video:false,trace:null,limitations:['Synthetic typing only; no live microphone, dictation or screen-reader validation','Bounded scripting, not general language understanding']},null,2)+'\n');
 console.log(JSON.stringify({screenshots:results.length,assetHash,metrics}));
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
