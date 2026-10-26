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
    print('Downloading the existing public PR revision (about 29 MB)...', flush=True)
    with urlopen(URL, timeout=90) as response:
        archive = response.read(40_000_001)
    if len(archive) > 40_000_000 or hashlib.sha256(archive).hexdigest() != CHECKSUM:
        raise SystemExit('Integrity check failed. Nothing was opened. Do not bypass this check.')
    files = {}
    with zipfile.ZipFile(io.BytesIO(archive)) as source:
        prefix = 'Human-literacy-online-' + SHA + '/'
        for name in source.namelist():
            if not name.startswith(prefix) or name.endswith('/'):
                continue
            path = name[len(prefix):]
            if path in ('index.html', 'LICENSE', 'CONTENT-LICENSE.md') or path.startswith(
                    ('lessons/', 'simulator/', 'support/', 'media/', 'docs/screenshots/')):
                files['/' + path] = source.read(name)
    assert all('/lessons/%02d/index.html' % n in files for n in range(1, 11))
    hashes = {path: hashlib.sha256(data).digest() for path, data in files.items()}
    del archive
    token = secrets.token_urlsafe(32)
    cookie_name = 'local_review_' + secrets.token_hex(8)
    badge = ('<aside role="note" id="__review_identity" data-source-sha="' + SHA + '" '
             'style="padding:12px;background:#122c35;color:white;font:14px/1.5 system-ui;'
             'overflow-wrap:anywhere"><strong>UNRELEASED · LOCAL REVIEW</strong><br>PR #2 · '
             + SHA + '<br><a style="color:white" href="/__review/">Review instructions</a></aside>')
    landing = ('<!doctype html><html lang="en"><meta charset="utf-8">'
               '<meta name="viewport" content="width=device-width,initial-scale=1">'
               '<title>Local Coach review</title><body style="font:18px/1.5 system-ui;'
               'max-width:700px;padding:20px;margin:auto;overflow-wrap:anywhere">' + badge +
               '<h1>Unreleased Communication Coach</h1><p><a href="/simulator/01/">Open Coach</a>'
               ' · <a href="/">All ten lessons</a></p><ol><li>Choose Help me draft.</li>'
               '<li>Type a synthetic example: The expectations are unreasonable. I quit</li>'
               '<li>Choose Next. Confirm or change your goal.</li>'
               '<li>Try More responses (2), edit wording, then Use this wording and Say this.</li>'
               '<li>Review consequences, open questions and the optional next step.</li></ol>'
               '<p>Tab/Shift+Tab navigates; Enter or Space activates controls. Chrome DevTools '
               'device toolbar can test 320px and 390px widths. Default scoring is off.</p>'
               '<p>Use synthetic examples. Browser dictation is optional and may use an external '
               'speech service; leave it off for this review. The prototype is scripted.</p>'
               '<p>Ctrl+C in Terminal stops the server and expires this session. No uploads, '
               'accounts or server-side response storage.</p></body></html>').encode()


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
