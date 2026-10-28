// Synthetic before evidence from an immutable, separately served checkout.
const {chromium} = require('playwright');
const fs = require('node:fs');
const path = require('node:path');
const {execFileSync} = require('node:child_process');
const crypto = require('node:crypto');
const [base, output, revision] = process.argv.slice(2);
if (!base || !output || !/^[a-f0-9]{40}$/.test(revision || '') || !['127.0.0.1','localhost'].includes(new URL(base).hostname)) throw Error('Use local URL, new output directory and full source SHA');
fs.mkdirSync(output, {recursive:false});
const runtimeFiles = Object.fromEntries(['index.html','coach.js','dialogue.js','speech.js'].map(name => {
  const file = 'simulator/01/' + name;
  return [file, crypto.createHash('sha256').update(execFileSync('git',['show',revision+':'+file])).digest('hex')];
}));
(async () => {
  const browser = await chromium.launch({executablePath:process.env.BROWSER_EXECUTABLE_PATH || '/usr/bin/chromium'});
  const results = [];
  try {
    for (const width of [1120,320,390]) {
      const context = await browser.newContext({viewport:{width,height:900},permissions:[]});
      await context.addInitScript(rev => addEventListener('DOMContentLoaded', () => {
        const b = document.createElement('aside'); b.textContent='BEFORE · UNRELEASED · SYNTHETIC INPUT · '+rev;
        b.style.cssText='padding:10px;background:#122c35;color:white;font:14px/1.5 system-ui;overflow-wrap:anywhere';document.body.prepend(b);
      }), revision);
      const page = await context.newPage();
      const errors=[];page.on('pageerror',e=>errors.push(e.message));
      async function capture(name) {
        if (await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)) throw Error('Overflow '+name);
        await page.screenshot({path:path.join(output,width+'-'+name+'.png'),fullPage:true});
        results.push({width,state:name,synthetic:true,boss:await page.locator('#bossWords').innerText()});
      }
      await page.goto(base+'/simulator/01/');
      await page.locator('#yourReply').fill('I want to explain my part.'); await page.locator('#send').click(); await capture('explanation-reaction');
      await page.locator('#yourReply').fill('I was waiting for client approval.');await page.locator('#send').click();
      await page.locator('#reflectionReview>summary').click();await capture('explanation-feedback');
      await page.locator('#replay').click();await page.locator('#choices button').first().click();await page.locator('#send').click();
      await page.locator('#replyMore>summary').click();await page.locator('#choices button').nth(1).click();await page.locator('#send').click();await capture('risks-support');
      if(errors.length)throw Error(JSON.stringify(errors));
      await context.close();
    }
    fs.writeFileSync(path.join(output,'before-results.json'),JSON.stringify({unreleased:true,sourceRevision:revision,runtimeFiles,results},null,2)+'\n');
    console.log(JSON.stringify({screenshots:results.length,sourceRevision:revision}));
  } finally { await browser.close(); }
})().catch(e=>{console.error(e);process.exitCode=1});
