#!/usr/bin/env python3
"""Package synthetic review evidence; no hosting, uploads or dependencies.

Example: python3 review/build_packet.py --before DIR --after DIR --run RUN1.json
 --run RUN2.json --html-report DIR --output review/evidence.zip
"""
import argparse
import hashlib
import html
import json
from pathlib import Path
import subprocess
import tempfile
import zipfile

parser = argparse.ArgumentParser(description=__doc__)
for name in ['before', 'after', 'html-report', 'output']:
    parser.add_argument('--' + name, type=Path, required=True)
parser.add_argument('--run', action='append', type=Path, default=[])
parser.add_argument('--ci-cases', type=Path, help='Verified per-case results derived from an official CI log, not a local run')
parser.add_argument('--history', type=Path)
parser.add_argument('--ci-proof', type=Path)
args = parser.parse_args()
repo = Path(__file__).resolve().parent.parent
ci = json.loads(args.ci_proof.read_text()) if args.ci_proof else None
runs = [json.loads(p.read_text()) for p in args.run]
ci_cases = json.loads(args.ci_cases.read_text()) if args.ci_cases else None
assert runs or (ci and ci_cases), 'Use actual local results or verified CI cases'
count = sum(runs[0]['stats'][k] for k in ['expected','unexpected','skipped']) if runs else ci['runs'][0]['passed']
assert count >= 318, 'Retain the existing suite'
if ci_cases:
    assert ci_cases['sourceRevision'] == ci['sourceRevision']
    assert len(ci_cases['cases']) == count and all(c['status']=='passed' for c in ci_cases['cases'])
    assert ci_cases['logSHA256'] in [r['logSHA256'] for r in ci['runs']]
assert runs or ci, 'Require an actual complete run or verified CI evidence'
if ci:
    assert ci['sourceRevision'] == subprocess.check_output(['git','rev-parse','HEAD'],cwd=repo,text=True).strip()
    assert ci['runs'] and all(r['conclusion']=='success' and r['passed']==count and r['failed']==r['skipped']==0 for r in ci['runs'])
for run in runs:
    stats = run['stats']
    assert sum(stats[k] for k in ['expected','unexpected','skipped']) == count and stats['skipped'] == stats['flaky'] == 0
    if not ci:
        assert stats['unexpected'] == 0
after = json.loads((args.after / 'capture-results.json').read_text())
for file, digest in after['runtimeFiles'].items():
    assert hashlib.sha256((repo / file).read_bytes()).hexdigest() == digest, file
assert subprocess.run(['git', 'diff', '--quiet', 'HEAD', '--', 'simulator', 'lessons', 'media', 'index.html', 'support'], cwd=repo).returncode == 0, 'Commit the tested runtime before packaging'
runtime = subprocess.check_output(['git', 'log', '-1', '--format=%H', '--', 'simulator'], cwd=repo, text=True).strip()
summary = {
    'unreleased': True, 'testCount': count, 'reviewedRuntimeRevision': runtime,
    'runtimeHash': after['assetHash'],
    'sourceIdentity': 'Full delivery SHA is supplied by the verified launcher and local preview banner; captured runtime hashes must match it.',
    'runs': [r['stats'] for r in runs], 'retries': 0,
    'reportKind': 'native-playwright' if runs else 'ci-log-derived',
    'testedSourceRevision': ci['sourceRevision'] if ci else subprocess.check_output(['git','rev-parse','HEAD'],cwd=repo,text=True).strip(),
    'localResultLabel': ('Complete local pass' if runs[-1]['stats']['unexpected'] == 0 else 'Diagnostic result; not counted as a complete pass') if runs else 'Local full run interrupted by environment loss; no complete local result claimed',
    'limits': ['Bounded scripted language, not general language understanding.',
               'Synthetic media/provider tests; no live microphone, live dictation or screen-reader certification.',
               'Founder acceptance of this exact updated Chromebook revision is pending.'],
}

if ci:
    summary['independentCI'] = ci
if args.history:
    summary['earlierValidation'] = json.loads(args.history.read_text())

def test_rows(suite, prefix=''):
    title = (prefix + ' / ' + suite.get('title', '')).strip(' /')
    for spec in suite.get('specs', []):
        for test in spec['tests']:
            yield {'name': title + ' / ' + spec['title'], 'ok': spec['ok'],
                   'results': [{k: r.get(k) for k in ['status', 'duration', 'retry']} for r in test['results']]}
    for child in suite.get('suites', []):
        yield from test_rows(child, title)

if ci:
    for run in runs:
        for suite in run['suites']:
            for row in test_rows(suite):
                assert all(r['status'] in {'passed','timedOut'} for r in row['results']), 'Do not label assertion failures as timing diagnostics'

payload = {
    'results.json': (json.dumps(summary, indent=2) + '\n').encode(),
    'test-cases.json': (json.dumps([[row for s in r['suites'] for row in test_rows(s)] for r in runs] if runs else ci_cases, indent=2) + '\n').encode(),
    'engineering-review.md': (repo / 'docs/issue-1-review.md').read_bytes(),
}
for name, folder in [('before', args.before), ('after', args.after), ('report', args.html_report)]:
    for file in sorted(folder.rglob('*')):
        if file.is_file():
            relative = file.relative_to(folder)
            # Capture tools create synthetic PNGs, a silent video, a typed trace
            # and JSON metadata. Do not accidentally package raw microphone audio.
            assert file.suffix.lower() in {'.png', '.mp4', '.zip', '.json', '.html', '.css', '.js', '.svg', '.ttf', '.webmanifest', '.md'}, file
            payload[name + '/' + relative.as_posix()] = file.read_bytes()

readme = f'''UNRELEASED HUMAN LITERACY REVIEW — {count} full-suite cases
Actual test results and their source identity are in results.json.

In the local preview choose View the review packet. It opens through the same
private authenticated loopback session; no extraction or extra software needed.
The ZIP is an optional copy. If Chrome blocks file:// HTML, serve the extracted
folder with: python3 -m http.server 8000 --bind 127.0.0.1
Then open http://localhost:8000/ on that computer. No public hosting is involved.

Founder checks (three only):
1. Help me draft: enter an immediate, final resignation with no further project work. Check all conditions stay in the goal and wording.
2. Use this wording, review/edit, then Say this. Check Jordan acknowledges resignation and its conditions; choose Finish here and read the takeaway.
3. Back/Forward should restore progress without sending. Editing your reply to a pause should produce a pause, not resignation.

reviewedRuntimeRevision: {runtime}
runtimeHash: {after['assetHash']}
The final source SHA appears in the pinned launch block and preview banner.
The archive cannot contain the hash of its own containing commit. The launcher
verifies the entire final source archive; verify_preview.cjs checks all captured
runtime hashes against that exact revision, the actual pages and assets, two
fresh launches and the rendered packet/report. It tests the simulator's zero
storage of answers separately from the report's harmless UI theme preference.

All screenshots and traces use fictional typed inputs. Any video is silent;
there is no microphone recording, private founder response or private register.
Language remains scripted. Hardware audio, live speech-provider behavior and
screen-reader output have not been manually validated. Typing remains available.
No merge, public release, deployment or spending is authorized.
'''
payload['README.txt'] = readme.encode()

def figure(file, label=None):
    escaped = html.escape(file, quote=True)
    return f'<figure><a href="{escaped}"><img loading="lazy" src="{escaped}" alt="{html.escape(label or file, quote=True)}"></a><figcaption>{html.escape(label or file)}</figcaption></figure>'

featured = ''.join(figure(file, label) for file, label in [
    ('before/390-wording.png', 'BEFORE: generic resignation wording omitted the confirmed conditions'),
    ('after/390-wording.png', 'AFTER: confirmed timing, finality and work limits stay in the editable draft'),
    ('after/390-manager.png', 'AFTER: Jordan acknowledges resignation and its stated conditions'),
    ('after/390-takeaway.png', 'AFTER: one relevant takeaway and optional action'),
    ('before/390-stop-request.png', 'BEFORE: a clear stop request received a clarification question'),
    ('after/390-stop-request.png', 'AFTER: the interaction ends without another required reply'),
    ('after/390-offboarding.png', 'AFTER: definitive resignation leads to formal offboarding'),
    ('after/390-stop-feedback.png', 'AFTER: a concise ending with optional relevant feedback'),
] if file in payload)
galleries = []
for folder in ['before', 'after']:
    for width in [1120, 768, 320, 390]:
        files = [f for f in payload if f.startswith(folder + '/' + str(width) + '-') and f.endswith('.png')]
        if files:
            galleries.append(f'<details><summary>{folder.upper()} — {width}px — {len(files)} screenshots</summary><div class="grid">' + ''.join(figure(f) for f in files) + '</div></details>')
page = f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Unreleased Human Literacy review</title>
<style>body{{font:18px/1.5 system-ui;max-width:1100px;margin:auto;padding:20px;color:#14363a}}aside{{background:#122c35;color:white;padding:16px}}a{{color:#075e58}}summary{{padding:16px;cursor:pointer;border:1px solid #597e77;margin-top:16px}}.grid{{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr));gap:16px}}figure{{margin:10px 0}}img{{width:100%;max-height:500px;object-fit:contain;object-position:top;border:1px solid #597e77}}figcaption{{overflow-wrap:anywhere}}video{{max-width:100%}}:focus-visible{{outline:3px solid #855600}}</style></head><body>
<aside>UNRELEASED · SYNTHETIC REVIEW EVIDENCE</aside><h1>Communication Coach review</h1>
<p><strong>{'Verified CI' if ci else 'Local full suite'}: {count} passed, 0 failed, 0 skipped</strong>. {'Official CI and the separate local status appear in results.json.' if ci else 'One complete native Playwright run; no retries or skipped cases.'} Full delivery SHA appears in the preview banner; runtime hashes connect these captures to that exact source.</p>
<p>Tested Coach source: <code>{summary['testedSourceRevision']}</code>. The final delivery preserves these tested runtime files.</p>
<p><a href="README.txt">Viewing and founder checks</a> · <a href="engineering-review.md">Engineering review</a> · <a href="report/index.html">{'Local Playwright report' if runs else 'Verified CI case report'}</a> · <a href="results.json">Results</a> · <a href="after/capture-results.json">Runtime integrity manifest</a></p>
<h2>Three founder checks</h2><ol><li>Help me draft: enter an immediate, final resignation with no further project work. Check all conditions stay in the goal and editable wording.</li><li>Use this wording, review/edit, then Say this. Check Jordan acknowledges resignation and the stated conditions. Choose Finish here and read the takeaway.</li><li>Use Back/Forward to review without sending. Edit your reply to a pause and check it stays a pause.</li></ol>
<p>Before: generic resignation suggestions dropped timing, finality and work limits. After: suggestions preserve confirmed wording and conditions, Jordan acknowledges the employment decision, and feedback distinguishes stated conditions from unresolved obligations. One goal selector, one visible suggestion and explicit submission remain; recording and detailed reflection stay optional. All ten lessons, media, privacy and the no-grade approach are preserved.</p>
<p>Scripted language coverage is limited. Synthetic tests do not establish physical microphone quality, live dictation reliability or screen-reader compatibility. Founder acceptance of this exact revision is pending.</p>
<details open><summary>Four useful review images</summary><div class="grid">{featured}</div></details>
{'<details><summary>Typed-only synthetic walkthrough</summary><p><a href="after/synthetic-walkthrough-trace.zip">Typed-only trace ZIP</a>; no microphone recording.</p></details>' if 'after/synthetic-walkthrough-trace.zip' in payload else ''}
<h2>All screenshots</h2>{''.join(galleries)}</body></html>'''
payload['index.html'] = page.encode()
payload['packet-integrity.json'] = (json.dumps({name: hashlib.sha256(data).hexdigest() for name, data in payload.items()}, indent=2) + '\n').encode()
args.output.parent.mkdir(parents=True, exist_ok=True)
# Replace only after the complete archive has been written and validated.
with tempfile.NamedTemporaryFile(dir=args.output.parent, suffix='.zip', delete=False) as temporary:
    temp = Path(temporary.name)
try:
    with zipfile.ZipFile(temp, 'w', zipfile.ZIP_DEFLATED, compresslevel=6) as packet:
        for name, data in sorted(payload.items()):
            packet.writestr(name, data)
    with zipfile.ZipFile(temp) as packet:
        assert packet.testzip() is None
    temp.replace(args.output)
finally:
    temp.unlink(missing_ok=True)
print(json.dumps({'testsPerRun': count, 'files': len(payload), 'screenshots': sum(f.endswith('.png') for f in payload), 'bytes': args.output.stat().st_size}))
