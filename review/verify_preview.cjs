// Founder copy/paste route checks. Synthetic inputs only.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { spawn, execFileSync } = require('node:child_process');
const { chromium } = require('playwright');
const [launcher,sourceSha,output]=process.argv.slice(2);
if(!launcher||!output||!/^([a-f0-9]{40})$/.test(sourceSha||''))throw Error('Usage: node review/verify_preview.cjs LAUNCHER FULL_SHA OUTPUT');
fs.mkdirSync(output, { recursive: true });
const manifest = {source_sha:sourceSha};
const results = [];
function pass(name) { results.push({ name, outcome: 'passed' }); console.log('PASS: ' + name); }
function request(base, route, headers = {}, method = 'GET') {
  return new Promise((resolve, reject) => {
    const address = new URL(base);
    const req = http.request({ hostname: address.hostname, port: address.port, path: route, method, headers }, response => {
      const parts = [];
      response.on('data', data => parts.push(data));
      response.on('end', () => resolve({ status: response.statusCode, headers: response.headers, body: Buffer.concat(parts) }));
    });
    req.on('error', reject); req.end();
  });
}
async function start(file) {
  const child = spawn('bash', [file], { stdio: ['ignore', 'pipe', 'pipe'], detached: true });
  let stderr = '', text = '';
  child.stderr.on('data', d => { stderr += d; });
  return await new Promise((resolve, reject) => {
    const timer = setTimeout(() => { child.kill(); reject(new Error('Startup timeout')); }, 110000);
    child.stdout.on('data', d => {
      text += d;
      const match = text.match(/http:\/\/localhost:\d+\/__open\/[\w-]+/);
      if (match) { clearTimeout(timer); resolve({ child, review_url: match[0], base_url: new URL(match[0]).origin }); }
    });
    child.once('exit', code => { clearTimeout(timer); reject(new Error('Startup failed ' + code + ': ' + stderr)); });
  });
}
async function exercise(page, base, width) {
  await page.setViewportSize({ width, height: 844 });
  await page.goto(base + '/');
  assert.equal(await page.locator('#__review_identity').getAttribute('data-source-sha'), manifest.source_sha);
  assert.ok(await page.getByRole('link', { name: 'Start Lesson 10', exact: true }).isVisible());
  await page.getByRole('link', { name: 'Try the Life Simulator', exact: true }).click();
  assert.equal(await page.locator('#coachUnderstand').evaluate(n => getComputedStyle(n).backgroundColor), 'rgb(8, 125, 117)');
  await page.locator('#openPractice').click();
  await page.locator('#expressWords').fill('The expectations are unreasonable. I quit');
  await page.locator('#coachUnderstand').click();
  assert.equal(await page.locator('#coachPath').inputValue(), 'resign');
  await page.locator('#coachConfirm').click();
  // Fast native-disclosure navigation that exposed the Chrome 156 CI focus race.
  await page.locator('#coachReview > summary').focus();
  await page.keyboard.press('Enter');
  await page.keyboard.press('Tab');
  assert.equal(await page.locator('#coachPath').evaluate(n => n === document.activeElement), true);
  assert.equal(await page.locator('#coachChoices').isVisible(), false);
  await page.locator('#coachReview > summary').click();

  assert.equal(await page.locator('.coach-option:visible').count(), 1);
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  await page.locator('#coachChoicesTitle').scrollIntoViewIfNeeded();
  await page.screenshot({ path: path.join(output, `preview-${width}.png`), fullPage: true });
  await page.locator('#coachMore > summary').focus();
  await page.keyboard.press('Enter');
  await page.keyboard.press('Tab');
  assert.equal(await page.locator('#coachWording1').evaluate(n => n === document.activeElement), true);
  await page.keyboard.press('Tab');
  await page.keyboard.press('Space');
  assert.equal(await page.locator('#yourReply').evaluate(n => n === document.activeElement), true);
  assert.equal(await page.locator('#sceneProgress').innerText(), 'SCENE 1 OF 2');
  await page.locator('#send').click();
  await page.locator('#choices button').first().click();
  assert.equal(await page.locator('#sceneProgress').innerText(),'SCENE 2 OF 2');
  await page.locator('#send').click();
  await page.locator('#conversationBack').click();
  await page.locator('#conversationForward').click();
  assert.equal(await page.locator('#scoreArea').isVisible(), false);
  assert.match(await page.locator('#realWorldPractice').innerText(), /resignation statement/);
  assert.equal(await page.locator('#completionTitle').evaluate(n => n === document.activeElement), true);
  assert.deepEqual(await page.evaluate(() => [document.cookie, localStorage.length, sessionStorage.length]), ['', 0, 0]);
  await page.locator('#endPanel').screenshot({ path: path.join(output, `reflection-${width}.png`) });
}

(async () => {
  const server = await start(path.resolve(launcher));
  const browser = await chromium.launch({ executablePath:process.env.BROWSER_EXECUTABLE_PATH||'/usr/bin/chromium', headless: true });
  try {
    assert.equal((await request(server.base_url, '/')).status, 401);
    assert.equal((await request(server.base_url, '/__evidence/')).status, 401);
    assert.equal((await request(server.base_url, '/__open/wrong')).status, 401);
    assert.equal((await request(server.base_url, '/', { Host: 'evil.example' })).status, 403);
    assert.equal((await request(server.base_url, '/', { Origin: 'https://evil.example' })).status, 403);
    assert.equal((await request(server.base_url, '/', { 'Sec-Fetch-Site': 'cross-site' })).status, 403);
    assert.equal((await request(server.base_url, '/', {}, 'POST')).status, 405);
    pass('Unauthenticated, cross-origin, foreign-host and write requests rejected');
    const context = await browser.newContext();
    const page = await context.newPage();
    const errors = [], external = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('request', r => { const url=new URL(r.url()); if (url.origin !== server.base_url && !['data:','blob:'].includes(url.protocol)) external.push(r.url()); });
    await page.goto(server.review_url);
    await page.getByRole('heading', { name: 'Unreleased Life Simulator' }).waitFor();
    const cookie = (await context.cookies()).find(c => c.name.startsWith('local_review_'));
    assert.ok(cookie.httpOnly && cookie.sameSite === 'Strict');
    const headers = { Cookie: cookie.name + '=' + cookie.value };
    pass('Chrome opens actual copy/paste route and establishes HttpOnly per-launch session');
    for (const route of ['/', '/support/', '/simulator/01/', ...Array.from({length:10}, (_,i) => `/lessons/${String(i+1).padStart(2,'0')}/`)]) {
      const response = await request(server.base_url, route, headers);
      assert.equal(response.status,200);
      assert.match(response.body.toString(), new RegExp(manifest.source_sha));
      assert.match(response.body.toString(), /UNRELEASED · LOCAL REVIEW/);
      assert.equal(response.headers['cache-control'], 'no-store');
      const filename = route === '/' ? 'index.html' : route.slice(1) + 'index.html';
      const original = execFileSync('git', ['show', manifest.source_sha + ':' + filename]);
      const stripped = response.body.toString().replace(/<aside role="note" id="__review_identity"[\s\S]*?<\/aside>/, '');
      assert.equal(stripped, original.toString());
    }
    for (const name of ['coach.js','speech.js','dialogue.js']) {
      const response = await request(server.base_url, '/simulator/01/' + name, headers);
      assert.equal(response.status,200); assert.match(response.headers['content-type'], /javascript/);
      assert.deepEqual(response.body,execFileSync('git',['show', manifest.source_sha+':simulator/01/'+name]));
    }
    assert.equal((await request(server.base_url, '/.git/config', headers)).status,404);
    assert.equal((await request(server.base_url, '/preview-prototype/start_review.py', headers)).status,404);
    assert.equal((await request(server.base_url, '/%2e%2e/index.html', headers)).status,404);
    const video = await request(server.base_url, '/media/lesson02.mp4', { ...headers, Range: 'bytes=0-63' });
    assert.equal(video.status,206); assert.equal(video.body.length,64);
    pass('13 HTML routes match exact Git bytes plus response-only banner; JS, media, metadata exclusion verified');
    const packet=await request(server.base_url,'/review/evidence.zip',headers);
    assert.equal(packet.status,200);assert.deepEqual(packet.body,execFileSync('git',['show',sourceSha+':review/evidence.zip'],{maxBuffer:64*1024*1024}));
    fs.writeFileSync(path.join(output,'downloaded-evidence.zip'),packet.body);
    const evidence=JSON.parse(execFileSync('python3',['-c','import json,sys,zipfile; z=zipfile.ZipFile(sys.argv[1]); print(z.read("after/capture-results.json").decode())',path.join(output,'downloaded-evidence.zip')],{encoding:'utf8'}));
    const crypto=require('node:crypto');
    for(const [file,digest] of Object.entries(evidence.runtimeFiles)){
      const bytes=execFileSync('git',['show',sourceSha+':'+file],{maxBuffer:64*1024*1024});
      assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),digest);
    }
    pass('Review packet downloads byte-for-byte; every captured runtime asset matches the pinned revision');
    await page.getByRole('link',{name:'View the review packet',exact:true}).click();
    await page.getByRole('heading',{name:'Communication Coach review',exact:true}).waitFor();
    assert.equal(await page.locator('#__review_identity').getAttribute('data-source-sha'),sourceSha);
    const image=page.locator('details[open] img').first();await image.scrollIntoViewIfNeeded();await image.evaluate(n=>n.decode());
    assert.equal(await image.evaluate(n=>n.naturalWidth),390);
    await page.locator('a[href="report/index.html"]').click();
    await page.waitForFunction(()=>document.body.innerText.includes('190'));
    assert.match(await page.locator('body').innerText(),/Passed/);
    assert.match(await page.locator('body').innerText(),/navigation/);
    pass('Packet gallery and interactive 190-test report open directly inside the authenticated preview');
    for (const width of [1120,320,390]) {
      await exercise(page, server.base_url, width);
      pass(`${width}px Coach: CSS, alternatives, keyboard/focus, explicit submission, reflection, unscored default`);
    }
    const second = await start(path.resolve(launcher));
    try {
      const freshContext = await browser.newContext();
      const freshPage = await freshContext.newPage();
      await freshPage.goto(second.review_url);
      await exercise(freshPage, second.base_url, 390);
      await freshContext.close();
      const original = await page.goto(server.base_url + '/');
      assert.equal(original.status(), 200);
      pass('Exact founder launch block opens again in a separate process and browser session');
    } finally { try { process.kill(-second.child.pid, 'SIGTERM'); } catch {} }
    assert.deepEqual(errors,[]); assert.deepEqual(external,[]);
    pass('No JavaScript exceptions, external browser requests, or browser storage of responses');
    await context.close();
    process.kill(-server.child.pid, 'SIGTERM');
    await new Promise(resolve => server.child.once('exit',resolve));
    await assert.rejects(() => request(server.base_url,'/'));
    pass('Stopping the launcher closes the local endpoint');
    fs.writeFileSync(path.join(output,'results.json'), JSON.stringify({source_sha:manifest.source_sha,browser:browser.version(),results,passed:results.length,failed:0,skipped:0,founder_chromebook_access:'PREVIOUS REVISION CONFIRMED BY FOUNDER; UPDATED REVISION AWAITS FOUNDER CONFIRMATION'},null,2));
  } finally { try { process.kill(-server.child.pid, 'SIGTERM'); } catch {} await browser.close(); }
})().catch(e => { console.error(e); process.exitCode=1; });
