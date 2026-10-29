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
const canonical = 'https://humanliteracy.github.io/Human-literacy-online/teal/';
const publicLocation = {origin:'https://humanliteracy.github.io',pathname:'/Human-literacy-online/teal/',search:'?private=never-share',hash:'#never-share'};
const approved = '9bcdda0934c76a44477560865c161794c585be49';
const gitRead = (ref,file) => cp.execFileSync('git',['show',ref+':'+file],{cwd:root,maxBuffer:30*1024*1024});
const article = s => (s.match(/<article class="founding-letter"[^>]*>([\s\S]*?)<\/article>/)||[])[1];
const entry = '<!-- TEAL entry: one additive release-candidate link. -->\n<p style="font-size:16px;margin:0"><a href="teal/" style="color:#087f77;display:inline-flex;align-items:center;min-height:44px">TEAL — A World Worth Building: read the founding invitation</a></p>\n';
let passed = 0;
function check(name, action) { action(); passed++; console.log('PASS',name); }
async function asyncCheck(name, action) { await action(); passed++; console.log('PASS',name); }

function setup(navigator = {}, location = {origin:'http://terminal.local:4173',pathname:'/teal/'}) {
  const ids = ['share-status','share-invitation','copy-invitation','manual-copy','invitation-text','share-copy'];
  const nodes = Object.fromEntries(ids.map(id => [id,{hidden:true,textContent:'',value:'',events:{},focused:false,selected:false,addEventListener(type,fn){this.events[type]=fn;},focus(){this.focused=true;},select(){this.selected=true;}}]));
  nodes['share-copy'].textContent = "TEAL invitation. Peace • Love • Happiness.";
  const doc = { getElementById:id=>nodes[id], querySelectorAll:()=>[] };
  vm.runInNewContext(script,{document:doc,navigator,location},{filename:'teal.js'});
  return nodes;
}

(async()=>{
  check('87 original files preserved; homepage has only the single approved entry',()=>{
    const base='442e813e8ff81abe53f32e01fd4bc6210cb06b15';
    const files=cp.execFileSync('git',['ls-tree','-r','--name-only',base],{cwd:root,encoding:'utf8'}).trim().split('\n');
    for(const file of files.filter(f=>f!=='index.html'))assert.deepEqual(fs.readFileSync(path.join(root,file)),gitRead(base,file),file);
    const home=read('index.html');assert.equal(home.split(entry).length-1,1);assert.equal(home.replace(entry,''),gitRead(base,'index.html').toString());assert.equal((home.match(/href="teal\/"/g)||[]).length,1);
    console.log('  Preserved',files.length-1,'original files; one additive homepage link.');
  });
  check('Public page source is free of shipping draft/noindex labels',()=>{for(const source of [page,reading])assert.doesNotMatch(source,/noindex|Not published|Proposed letter|Proposed founding experience|class="review-strip"/);assert.doesNotMatch(script,/releaseApproved/);});
  check('Approved letter and artwork remain byte-for-byte unchanged',()=>{assert.equal(article(page),article(gitRead(approved,'teal/index.html').toString()));assert.equal(article(reading),article(gitRead(approved,'teal/letter.html').toString()));for(const file of fs.readdirSync(path.join(root,'teal/assets')))assert.deepEqual(fs.readFileSync(path.join(root,'teal/assets',file)),gitRead(approved,'teal/assets/'+file),file);});
  check('Approved humanitarian goal articles remain unchanged',()=>{const goals=s=>s.match(/<article class="goal-row"[\s\S]*?<\/article>/g);assert.deepEqual(goals(page),goals(gitRead(approved,'teal/index.html').toString()));});
  check('Both reading routes and social metadata use the fixed canonical destination',()=>{for(const source of [page,reading])assert.ok(source.includes('<link rel="canonical" href="'+canonical+'">'));assert.ok(page.includes('property="og:url" content="'+canonical+'"'));assert.ok(page.includes(canonical+'assets/teal-social.jpg'));assert.ok(page.includes('property="og:image:width" content="1200"'));assert.ok(page.includes('property="og:image:height" content="630"'));});
  check('Plain-text letter is a faithful export without merged boundaries/footnote digits',()=>{cp.execFileSync('python3',['review/teal/export-letter.py','--check'],{cwd:root});const text=read('docs/teal/founding-letter.txt');assert.ok(text.startsWith('To humanity,\nfrom one of us.\n\nWe have learned to fly.\n'));assert.doesNotMatch(text,/fly\.We|Self\.Respect|TEALto|\b[12]\b/);});
  check('Four resource entries have a named accountable owner and retained scope',()=>{const data=JSON.parse(read('docs/teal/sources.json'));const before=JSON.parse(gitRead(approved,'docs/teal/sources.json'));assert.equal(data.resources.length,4);assert.equal(data.ownership.accountable_editor,'Shawn — TEAL founder');data.resources.forEach((r,i)=>{assert.equal(r.maintenance_owner,'Shawn — TEAL founder (accountable editor)');for(const key of ['id','url','provider','geography','limit'])assert.equal(r[key],before.resources[i][key]);assert.equal(r.external_intake_tested,false);});});
  check('Core entrance is a named native link with a textual alternative',()=>{assert.match(page,/<a class="symbol-entry" href="#message-title" aria-label=/);assert.match(page,/<a class="alternative-entry" href="#message-title">Read the message<\/a>/);assert.match(page,/id="message-title" tabindex="-1"/);});
  check('All image, CSS and script assets resolve locally',()=>{
    for(const match of page.matchAll(/(?:src|href)="(assets\/[^"?#]+|teal\.(?:css|js)|letter\.html)"/g)) assert.ok(fs.existsSync(path.join(root,'teal',match[1])),match[1]);
    for(const match of page.matchAll(/srcset="([^"]+)"/g)) for(const entry of match[1].split(','))assert.ok(fs.existsSync(path.join(root,'teal',entry.trim().split(' ')[0])));
  });
  check('Principles and aspirations retain the founder order',()=>{assert.match(page,/Respect for Self<\/span>.*Respect for Others<\/span>.*Respect for Everything<\/span>/);assert.ok(page.includes('Peace • Love • Happiness'));assert.doesNotMatch(page,/Peace\s*(?:→|•)\s*Happiness\s*(?:→|•)\s*Love/i);});
  check('Simple reading view carries the same letter',()=>{const normalized=s=>article(s).replace(/href="[^"]*"/g,'').replace(/\s+/g,' ').trim();assert.equal(normalized(page),normalized(reading));});
  check('No added collection, persistence, embedded media or third-party script',()=>{assert.doesNotMatch(script,/\b(fetch|XMLHttpRequest|WebSocket|sendBeacon|localStorage|sessionStorage|indexedDB|Audio|speechSynthesis)\b/);assert.doesNotMatch(page,/<(?:form|iframe|video|audio)\b|<script[^>]*src="https?:/i);assert.match(page,/connect-src 'none'/);assert.match(page,/name="referrer" content="no-referrer"/);});
  check('No-JavaScript sharing has visible text and no dead buttons',()=>{assert.match(page,/id="copy-invitation" hidden/);assert.match(page,/id="share-invitation" hidden/);assert.match(page,/<noscript>/);assert.match(page,/id="share-copy"/);});
  check('Motion-free and forced-colors alternatives exist',()=>{const css=read('teal/teal.css');assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);assert.match(css,/@media\(forced-colors:active\)/);assert.match(css,/overflow-wrap:anywhere/);});
  check('Optimized critical mobile payload stays below 250 KiB uncompressed',()=>{const size=['teal/index.html','teal/teal.css','teal/teal.js','teal/assets/cosmic-960.webp'].reduce((n,f)=>n+fs.statSync(path.join(root,f)).size,0);assert.ok(size<250*1024,size);console.log('  Critical mobile upper candidate:',size,'bytes (not a measured network timing).');});
  check('Loading sharing code performs no clipboard or native share action',()=>{let calls=0;const n=setup({share:()=>calls++,clipboard:{writeText:()=>calls++}});assert.equal(calls,0);assert.equal(n['share-invitation'].hidden,false);});
  await asyncCheck('Preview copy includes invitation only and no address',async()=>{let copied;const n=setup({clipboard:{writeText:async text=>{copied=text;}}});await n['copy-invitation'].events.click();assert.equal(copied,n['share-copy'].textContent);assert.doesNotMatch(copied,/https?:|terminal\.local|localhost/);assert.match(n['share-status'].textContent,/No preview address/);});
  await asyncCheck('Actual HTTPS public route copies only fixed canonical URL, never query/hash',async()=>{let copied;const n=setup({clipboard:{writeText:async text=>{copied=text;}}},publicLocation);await n['copy-invitation'].events.click();assert.equal(copied,n['share-copy'].textContent+'\n'+canonical);assert.doesNotMatch(copied,/private=|never-share/);assert.match(n['share-status'].textContent,/public address/);});
  await asyncCheck('Public index.html route shares the same canonical URL',async()=>{let sent;const n=setup({share:async data=>{sent=data;}},{...publicLocation,pathname:'/Human-literacy-online/teal/index.html'});await n['share-invitation'].events.click();assert.equal(sent.url,canonical);assert.equal(sent.text,n['share-copy'].textContent);});
  await asyncCheck('Spoofed host, wrong path, HTTP and file URLs never share an address',async()=>{for(const location of [{origin:'https://humanliteracy.github.io.evil.example',pathname:publicLocation.pathname},{origin:'http://humanliteracy.github.io',pathname:publicLocation.pathname},{origin:publicLocation.origin,pathname:'/other/teal/'},{origin:'null',pathname:'/TEAL-preview.html'}]){let sent;const n=setup({share:async data=>{sent=data;}},location);await n['share-invitation'].events.click();assert.equal(sent.url,undefined);assert.equal(n['invitation-text'].value,n['share-copy'].textContent);}});
  await asyncCheck('Public clipboard denial fallback retains the canonical URL',async()=>{const n=setup({clipboard:{writeText:async()=>{throw Error('denied');}}},publicLocation);await n['copy-invitation'].events.click();assert.equal(n['manual-copy'].hidden,false);assert.equal(n['invitation-text'].value,n['share-copy'].textContent+'\n'+canonical);});
  await asyncCheck('Missing clipboard exposes selectable text fallback',async()=>{const n=setup();await n['copy-invitation'].events.click();assert.equal(n['manual-copy'].hidden,false);assert.equal(n['invitation-text'].focused,true);assert.equal(n['invitation-text'].selected,true);});
  await asyncCheck('Denied clipboard exposes selectable text without retry',async()=>{let calls=0;const n=setup({clipboard:{writeText:async()=>{calls++;throw Error('denied');}}});await n['copy-invitation'].events.click();assert.equal(calls,1);assert.equal(n['manual-copy'].hidden,false);});
  await asyncCheck('Native sharing sends no preview URL',async()=>{let sent;const n=setup({share:async data=>{sent=data;}});await n['share-invitation'].events.click();assert.equal(sent.text,n['share-copy'].textContent);assert.equal(sent.url,undefined);assert.match(n['share-status'].textContent,/text only/);});
  await asyncCheck('Cancelled native share does not copy or retry',async()=>{let copies=0;const n=setup({share:async()=>{const e=Error('cancel');e.name='AbortError';throw e;},clipboard:{writeText:async()=>copies++}});await n['share-invitation'].events.click();assert.equal(copies,0);assert.equal(n['manual-copy'].hidden,true);assert.match(n['share-status'].textContent,/cancelled/);});
  await asyncCheck('Native sharing failure uses manual fallback',async()=>{const n=setup({share:async()=>{throw Error('not available');}});await n['share-invitation'].events.click();assert.equal(n['manual-copy'].hidden,false);});
  await asyncCheck('Missing native sharing falls back to a single copy',async()=>{let calls=0;const n=setup({clipboard:{writeText:async()=>calls++}});await n['share-invitation'].events.click();assert.equal(calls,1);});
  console.log('TEAL focused checks:',passed,'passed. Browser and human acceptance remain separate.');
})().catch(error=>{console.error(error);process.exitCode=1;});
