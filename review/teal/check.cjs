// Focused preservation and sharing-privacy checks. No browser, network, or new dependency.
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const cp = require('node:child_process');
const root = path.resolve(__dirname, '../..');
const read = name => fs.readFileSync(path.join(root,name),'utf8');
const page = read('teal/index.html');
const reading = read('teal/letter.html');
const script = read('teal/teal.js');
let passed = 0;
function check(name, action) { action(); passed++; console.log('PASS',name); }
async function asyncCheck(name, action) { await action(); passed++; console.log('PASS',name); }

function setup(navigator = {}) {
  const ids = ['share-status','share-invitation','copy-invitation','manual-copy','invitation-text','share-copy'];
  const nodes = Object.fromEntries(ids.map(id => [id,{hidden:true,textContent:'',value:'',events:{},focused:false,selected:false,addEventListener(type,fn){this.events[type]=fn;},focus(){this.focused=true;},select(){this.selected=true;}}]));
  nodes['share-copy'].textContent = "TEAL invitation. Peace • Love • Happiness.";
  const doc = { getElementById:id=>nodes[id], querySelectorAll:()=>[] };
  vm.runInNewContext(script,{document:doc,navigator},{filename:'teal.js'});
  return nodes;
}

(async()=>{
  check('All pre-existing tracked files are byte-for-byte preserved',()=>{
    const base='442e813e8ff81abe53f32e01fd4bc6210cb06b15';
    const files=cp.execFileSync('git',['ls-tree','-r','--name-only',base],{cwd:root,encoding:'utf8'}).trim().split('\n');
    for(const file of files){const original=cp.execFileSync('git',['show',base+':'+file],{cwd:root,maxBuffer:30*1024*1024});assert.deepEqual(fs.readFileSync(path.join(root,file)),original,file);}
    console.log('  Preserved',files.length,'original files.');
  });
  check('Review state prevents indexing and URL sharing',()=>{assert.match(page,/noindex, nofollow/);assert.match(reading,/noindex,nofollow/);assert.match(script,/const releaseApproved = false/);});
  check('Core entrance is a named native link with a textual alternative',()=>{assert.match(page,/<a class="symbol-entry" href="#message-title" aria-label=/);assert.match(page,/<a class="alternative-entry" href="#message-title">Read the message<\/a>/);assert.match(page,/id="message-title" tabindex="-1"/);});
  check('All image, CSS and script assets resolve locally',()=>{
    for(const match of page.matchAll(/(?:src|href)="(assets\/[^"?#]+|teal\.(?:css|js)|letter\.html)"/g)) assert.ok(fs.existsSync(path.join(root,'teal',match[1])),match[1]);
    for(const match of page.matchAll(/srcset="([^"]+)"/g)) for(const entry of match[1].split(','))assert.ok(fs.existsSync(path.join(root,'teal',entry.trim().split(' ')[0])));
  });
  check('Principles and aspirations retain the founder order',()=>{assert.match(page,/Respect for Self<\/span>.*Respect for Others<\/span>.*Respect for Everything<\/span>/);assert.ok(page.includes('Peace • Love • Happiness'));assert.doesNotMatch(page,/Peace\s*(?:→|•)\s*Happiness\s*(?:→|•)\s*Love/i);});
  check('Simple reading view carries the same letter',()=>{const article=s=>(s.match(/<article class="founding-letter"[^>]*>([\s\S]*?)<\/article>/)||[])[1].replace(/href="[^"]*"/g,'').replace(/\s+/g,' ').trim();assert.equal(article(page),article(reading));});
  check('No added collection, persistence, embedded media or third-party script',()=>{assert.doesNotMatch(script,/\b(fetch|XMLHttpRequest|WebSocket|sendBeacon|localStorage|sessionStorage|indexedDB|Audio|speechSynthesis)\b/);assert.doesNotMatch(page,/<(?:form|iframe|video|audio)\b|<script[^>]*src="https?:/i);assert.match(page,/connect-src 'none'/);assert.match(page,/name="referrer" content="no-referrer"/);});
  check('No-JavaScript sharing has visible text and no dead buttons',()=>{assert.match(page,/id="copy-invitation" hidden/);assert.match(page,/id="share-invitation" hidden/);assert.match(page,/<noscript>/);assert.match(page,/id="share-copy"/);});
  check('Motion-free and forced-colors alternatives exist',()=>{const css=read('teal/teal.css');assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);assert.match(css,/@media\(forced-colors:active\)/);assert.match(css,/overflow-wrap:anywhere/);});
  check('Optimized critical mobile payload stays below 250 KiB uncompressed',()=>{const size=['teal/index.html','teal/teal.css','teal/teal.js','teal/assets/cosmic-960.webp'].reduce((n,f)=>n+fs.statSync(path.join(root,f)).size,0);assert.ok(size<250*1024,size);console.log('  Critical mobile upper candidate:',size,'bytes (not a measured network timing).');});
  check('Loading sharing code performs no clipboard or native share action',()=>{let calls=0;const n=setup({share:()=>calls++,clipboard:{writeText:()=>calls++}});assert.equal(calls,0);assert.equal(n['share-invitation'].hidden,false);});
  await asyncCheck('Copy succeeds with invitation only and no preview/canonical address',async()=>{let copied;const n=setup({clipboard:{writeText:async text=>{copied=text;}}});await n['copy-invitation'].events.click();assert.equal(copied,n['share-copy'].textContent);assert.doesNotMatch(copied,/https?:|terminal\.local|localhost/);assert.match(n['share-status'].textContent,/No preview address/);});
  await asyncCheck('Missing clipboard exposes selectable text fallback',async()=>{const n=setup();await n['copy-invitation'].events.click();assert.equal(n['manual-copy'].hidden,false);assert.equal(n['invitation-text'].focused,true);assert.equal(n['invitation-text'].selected,true);});
  await asyncCheck('Denied clipboard exposes selectable text without retry',async()=>{let calls=0;const n=setup({clipboard:{writeText:async()=>{calls++;throw Error('denied');}}});await n['copy-invitation'].events.click();assert.equal(calls,1);assert.equal(n['manual-copy'].hidden,false);});
  await asyncCheck('Native sharing sends no preview URL',async()=>{let sent;const n=setup({share:async data=>{sent=data;}});await n['share-invitation'].events.click();assert.equal(sent.text,n['share-copy'].textContent);assert.equal(sent.url,undefined);assert.match(n['share-status'].textContent,/text only/);});
  await asyncCheck('Cancelled native share does not copy or retry',async()=>{let copies=0;const n=setup({share:async()=>{const e=Error('cancel');e.name='AbortError';throw e;},clipboard:{writeText:async()=>copies++}});await n['share-invitation'].events.click();assert.equal(copies,0);assert.equal(n['manual-copy'].hidden,true);assert.match(n['share-status'].textContent,/cancelled/);});
  await asyncCheck('Native sharing failure uses manual fallback',async()=>{const n=setup({share:async()=>{throw Error('not available');}});await n['share-invitation'].events.click();assert.equal(n['manual-copy'].hidden,false);});
  await asyncCheck('Missing native sharing falls back to a single copy',async()=>{let calls=0;const n=setup({clipboard:{writeText:async()=>calls++}});await n['share-invitation'].events.click();assert.equal(calls,1);});
  console.log('TEAL focused checks:',passed,'passed. Browser and human acceptance remain separate.');
})().catch(error=>{console.error(error);process.exitCode=1;});
