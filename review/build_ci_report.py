#!/usr/bin/env python3
"""Build a labelled case report from a checksum-verified official CI log.

This is deliberately not a fabricated native Playwright report or a local run.
"""
import argparse
import hashlib
import html
import json
from pathlib import Path
import re

p = argparse.ArgumentParser(description=__doc__)
p.add_argument('--proof', type=Path, required=True)
p.add_argument('--log', type=Path, required=True)
p.add_argument('--output', type=Path, required=True)
a = p.parse_args()
proof = json.loads(a.proof.read_text())
raw = a.log.read_bytes()
digest = hashlib.sha256(raw).hexdigest()
run = next(r for r in proof['runs'] if r['logSHA256'] == digest)
assert run['conclusion'] == 'success' and run['failed'] == run['skipped'] == 0
log = re.sub(r'\x1b\[[0-9;]*m', '', raw.decode())
cases = []
for line in log.splitlines():
    m = re.search(r'✓\s+(\d+)\s+(tests/.*)\s+\(([^()]*)\)\s*$', line)
    if m:
        cases.append({'id': int(m[1]), 'name': m[2], 'duration': m[3], 'status': 'passed'})
cases.sort(key=lambda c: c['id'])
assert [c['id'] for c in cases] == list(range(1, run['passed'] + 1))
assert re.search(r'\b' + str(len(cases)) + r' passed\b', log)
summary = {'source': 'official GitHub CI log; not a local run',
           'sourceRevision': proof['sourceRevision'], 'runUrl': run['url'],
           'logSHA256': digest, 'passed': len(cases), 'failed': 0, 'skipped': 0,
           'localStatus': 'Interrupted by environment loss; no complete local result claimed',
           'cases': cases}
a.output.mkdir(parents=True, exist_ok=False)
(a.output / 'cases.json').write_text(json.dumps(summary, indent=2) + '\n')
rows = ''.join('<tr><td>' + str(c['id']) + '</td><td>' + html.escape(c['name']) +
               '</td><td>Passed</td><td>' + html.escape(c['duration']) + '</td></tr>' for c in cases)
page = '''<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Verified CI case report</title>
<style>body{font:17px/1.5 system-ui;max-width:1100px;margin:auto;padding:20px;color:#14363a}
code,td{overflow-wrap:anywhere}td,th{padding:10px;text-align:left;border-bottom:1px solid #597e77}
table{width:100%;table-layout:fixed}th:first-child{width:3em}th:nth-child(3),th:nth-child(4){width:5em}
input{font:inherit;max-width:90%;padding:12px;border:2px solid #597e77}:focus-visible{outline:3px solid #855600}
@media(max-width:500px){td,th{padding:5px}th:nth-child(4),td:nth-child(4){display:none}}</style></head><body>
<h1>Verified CI case report</h1>
<p><strong>Passed COUNT · Failed 0 · Skipped 0</strong></p>
<p>Observed results from the official GitHub CI log. This is not a native local Playwright report.
The local full run was interrupted by the cloud environment becoming unavailable.</p>
<p>Tested source: <code id="testedSource">REV</code></p>
<p><a href="RUN">Official CI run</a> · <a href="cases.json">Case results and log checksum</a></p>
<label for="filter">Find a test</label> <input id="filter" type="search" autocomplete="off">
<p id="shown" role="status">COUNT tests shown</p>
<table><thead><tr><th scope="col">#</th><th scope="col">Test</th><th scope="col">Result</th><th scope="col">Time</th></tr></thead><tbody>ROWS</tbody></table>
<script>const rows=[...document.querySelectorAll('tbody tr')];document.getElementById('filter').addEventListener('input',e=>{
let visible=0;for(const row of rows){row.hidden=!row.innerText.toLowerCase().includes(e.target.value.toLowerCase());if(!row.hidden)visible++;}
document.getElementById('shown').textContent=visible+' tests shown';});</script></body></html>'''
page = page.replace('COUNT', str(len(cases))).replace('REV', html.escape(proof['sourceRevision']))
page = page.replace('RUN', html.escape(run['url'], quote=True)).replace('ROWS', rows)
(a.output / 'index.html').write_text(page)
print(json.dumps({'cases': len(cases), 'sourceRevision': proof['sourceRevision'], 'logSHA256': digest}))
