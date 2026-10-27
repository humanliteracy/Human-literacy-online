#!/usr/bin/env python3
"""Local review wrapper reused from Issue #4. Never hosts outside this computer.

Run with a full immutable source revision and its independently supplied archive
SHA-256. The founder handoff verifies this Python file too, before executing it.
Only Python 3.9+ standard library is required. No accounts or runtime dependencies.
"""
import hashlib
import hmac
from http.cookies import SimpleCookie
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import io
import json
import mimetypes
import re
import secrets
import sys
from urllib.request import urlopen
import webbrowser
import zipfile


def run(revision, expected_checksum):
    if not re.fullmatch(r'[a-f0-9]{40}', revision):
        raise ValueError('A full source revision is required')
    if not re.fullmatch(r'[a-f0-9]{64}', expected_checksum):
        raise ValueError('The independently supplied archive checksum is required')
    SHA, CHECKSUM = revision, expected_checksum
    URL = 'https://codeload.github.com/humanliteracy/Human-literacy-online/zip/' + SHA
    print('Downloading the pinned public review source and evidence...', flush=True)
    with urlopen(URL, timeout=90) as response:
        archive = response.read(67_108_865)
    if len(archive) > 67_108_864 or hashlib.sha256(archive).hexdigest() != CHECKSUM:
        raise SystemExit('Integrity check failed. Nothing was opened. Do not bypass this check.')
    files = {}
    with zipfile.ZipFile(io.BytesIO(archive)) as source:
        prefix = 'Human-literacy-online-' + SHA + '/'
        for name in source.namelist():
            if not name.startswith(prefix) or name.endswith('/'):
                continue
            path = name[len(prefix):]
            if path in ('index.html', 'LICENSE', 'CONTENT-LICENSE.md', 'review/evidence.zip') or path.startswith(
                    ('lessons/', 'simulator/', 'support/', 'media/', 'docs/screenshots/')):
                files['/' + path] = source.read(name)
    assert all('/lessons/%02d/index.html' % n in files for n in range(1, 11))
    # Serve the synthetic review packet through this same authenticated loopback
    # session. Managed Chrome can block file:// pages after a ZIP is extracted.
    if '/review/evidence.zip' in files:
        try:
            with zipfile.ZipFile(io.BytesIO(files['/review/evidence.zip'])) as packet:
                manifest_bytes = packet.read('packet-integrity.json')
                manifest = json.loads(manifest_bytes)
                if not isinstance(manifest, dict) or 'index.html' not in manifest:
                    raise ValueError('Missing packet index')
                for path, digest in manifest.items():
                    if (not isinstance(path, str) or path.startswith('/') or
                            '\\' in path or '..' in path.split('/') or
                            not isinstance(digest, str) or not re.fullmatch(r'[a-f0-9]{64}', digest)):
                        raise ValueError('Invalid packet manifest')
                    data = packet.read(path)
                    if hashlib.sha256(data).hexdigest() != digest:
                        raise ValueError('Packet payload mismatch')
                    files['/__evidence/' + path] = data
                files['/__evidence/packet-integrity.json'] = manifest_bytes
        except (ValueError, KeyError, zipfile.BadZipFile, TypeError):
            raise SystemExit('Review packet integrity check failed. Nothing was opened.')
    hashes = {path: hashlib.sha256(data).digest() for path, data in files.items()}
    del archive
    token = secrets.token_urlsafe(32)
    cookie_name = 'local_review_' + secrets.token_hex(8)
    badge = ('<aside role="note" id="__review_identity" data-source-sha="' + SHA + '" '
             'style="padding:12px;background:#122c35;color:white;font:14px/1.5 system-ui;'
             'overflow-wrap:anywhere"><strong>UNRELEASED · LOCAL REVIEW</strong><br>Life Simulator · '
             + SHA + '<br><a style="color:white" href="/__review/">Review instructions</a></aside>')
    landing = ('<!doctype html><html lang="en"><meta charset="utf-8">'
               '<meta name="viewport" content="width=device-width,initial-scale=1">'
               '<title>Unreleased Life Simulator review</title><body style="font:18px/1.5 system-ui;'
               'max-width:700px;padding:20px;margin:auto;overflow-wrap:anywhere">' + badge +
               '<h1>Unreleased Life Simulator</h1><p><a href="/simulator/01/">Open the simulator</a>'
               ' · <a href="/">All ten lessons</a></p>'
               '<p>Use the same Chromebook and Chrome session. This is local only; no website has been published.</p>'
               '<ol><li>Complete one main conversation: choose or type wording, then choose Say this for each reply. Use Back/Forward to review saved progress, then read the takeaway.</li>'
               '<li>Retry with one unexpected or hostile response. Check that Jordan asks for clarification or responds appropriately without a fake grade.</li>'
               '<li>Try one optional feature: Help me draft, or local recording and playback. Typing is always available.</li></ol>'
               '<p>Use synthetic examples. Browser dictation has separate external-service consent and may be unreliable; leave it off for private words. This is a scripted prototype, not AI.</p>'
               '<p><a href="/__evidence/">View the review packet</a> · '
               '<a href="/review/evidence.zip" download="human-literacy-review.zip">Download a ZIP copy</a> '
               '(test report, screenshots, silent synthetic walkthrough, limitations and acceptance checklist).</p>'
               '<p>Automated results do not replace your acceptance of this exact version. No screen-reader software, physical microphone or live speech provider is claimed as tested.</p>'
               '<p>Keep this launch link private. Ctrl+C in Terminal stops the server and expires the session. '
               'No uploads, accounts or server-side response storage.</p></body></html>').encode()



    class Handler(BaseHTTPRequestHandler):
        def log_message(self, *_args):
            pass

        def send(self, status, data=b'', kind='text/plain; charset=utf-8', extra=None):
            self.send_response(status)
            for name, value in {'Content-Type': kind, 'Content-Length': str(len(data)),
                                'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer',
                                'X-Content-Type-Options': 'nosniff', 'Content-Security-Policy':
                                "frame-ancestors 'none'; object-src 'none'; base-uri 'self'",
                                **(extra or {})}.items():
                self.send_header(name, value)
            self.end_headers()
            if self.command != 'HEAD':
                self.wfile.write(data)

        def do_HEAD(self):
            self.do_GET()

        def do_POST(self):
            self.send(405, b'Read-only preview', extra={'Allow': 'GET, HEAD'})

        do_PUT = do_PATCH = do_DELETE = do_OPTIONS = do_POST

        def do_GET(self):
            hosts = {'localhost:%d' % self.server.server_port,
                     '127.0.0.1:%d' % self.server.server_port}
            if (self.headers.get('Host') not in hosts or
                    self.headers.get('Sec-Fetch-Site') == 'cross-site' or
                    self.headers.get('Origin', 'http://' + self.headers['Host']) not in
                    {'http://' + host for host in hosts}):
                return self.send(403, b'Local access only')
            if hmac.compare_digest(self.path, '/__open/' + token):
                return self.send(303, extra={'Location': '/__review/', 'Set-Cookie':
                                 cookie_name + '=' + token + '; HttpOnly; SameSite=Strict; Path=/'})
            cookie = SimpleCookie()
            try:
                cookie.load(self.headers.get('Cookie', ''))
                supplied = cookie[cookie_name].value if cookie_name in cookie else ''
            except Exception:
                supplied = ''
            if not hmac.compare_digest(supplied, token):
                return self.send(401, b'Use the launch link printed in your own Terminal')
            if self.path == '/__review/':
                return self.send(200, landing, 'text/html; charset=utf-8')
            path = self.path.split('?', 1)[0]
            path = path + 'index.html' if path.endswith('/') else path
            if path not in files:
                return self.send(404, b'Not found')
            data = files[path]
            if hashlib.sha256(data).digest() != hashes[path]:
                return self.send(409, b'Integrity check failed; restart from the original launcher')
            if path.endswith('.html'):
                data = re.sub(r'(<body\b[^>]*>)', lambda m: m[1] + badge,
                              data.decode('utf-8'), count=1, flags=re.I).encode()
            status, extra = 200, {}
            if path.endswith('.mp4') and self.headers.get('Range'):
                match = re.fullmatch(r'bytes=(\d+)-(\d*)', self.headers['Range'])
                size = len(data)
                start = int(match[1]) if match else size
                end = min(int(match[2]), size - 1) if match and match[2] else size - 1
                if start > end:
                    return self.send(416, extra={'Content-Range': 'bytes */%d' % size})
                status, extra = 206, {'Content-Range': 'bytes %d-%d/%d' % (start, end, size)}
                data = data[start:end + 1]
            return self.send(status, data, mimetypes.guess_type(path)[0] or
                             'application/octet-stream', extra)


    server = ThreadingHTTPServer(('127.0.0.1', 0), Handler)
    launch = 'http://localhost:%d/__open/%s' % (server.server_port, token)
    print('Integrity verified. UNRELEASED source: ' + SHA, flush=True)
    print('Open this link in Chrome ON THIS CHROMEBOOK (keep it private):\n' + launch, flush=True)
    print('Keep Terminal running. Ctrl+C stops the preview.', flush=True)
    if '--no-browser' not in sys.argv:
        try:
            webbrowser.open(launch)
        except (webbrowser.Error, OSError):
            print('Copy the printed launch link into Chrome on this computer.', flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('revision')
    parser.add_argument('archive_sha256')
    parser.add_argument('--no-browser', action='store_true')
    args = parser.parse_args()
    run(args.revision, args.archive_sha256)
