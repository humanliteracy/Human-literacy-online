"""OP-104 delivery regression: synthetic archive, real private HTTP boundary."""
import contextlib
import hashlib
import http.client
import io
from pathlib import Path
import runpy
import threading
import unittest
from unittest.mock import patch
import zipfile
from http.server import ThreadingHTTPServer


class IntegratedPreview(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.sha = 'e' * 40
        cls.payloads = {f'/lessons/{n:02d}/index.html': b'<body>Lesson</body>'
                        for n in range(1, 11)}
        cls.payloads.update({
            '/index.html': b'<body>Home</body>',
            '/one-place/index.html': b'<body>One Place</body>',
            '/one-place/money-bills.html': b'<body>Money</body>',
            '/one-place/family-handoff.html': b'<body>Handoff</body>',
            '/teal/index.html': b'<body>TEAL</body>',
            '/teal/teal.js': b'/* synthetic script */',
            '/teal/assets/test.webp': b'synthetic image',
            '/shared/lesson-record.js': b'/* record */',
            '/shared/lesson-record.css': b'/* style */',
            '/shared/lesson-video-controls.js': b'/* seek controls */',
            '/media/example.mp4': bytes(range(256)) * 4,
            '/simulator/01/index.html': b'<body>Coach</body>',
        })
        archive = io.BytesIO()
        with zipfile.ZipFile(archive, 'w') as z:
            for path, data in {**cls.payloads, '/.git/config': b'private',
                               '/private/draft.txt': b'private',
                               '/.env': b'private'}.items():
                z.writestr('Human-literacy-online-' + cls.sha + path, data)
        data = archive.getvalue()
        cls.launcher = runpy.run_path(str(Path(__file__).with_name('local_preview.py')),
                                run_name='review_import')['run']
        cls.server = None
        def serve(address, handler):
            cls.server = ThreadingHTTPServer(address, handler)
            cls.server.serve_forever = lambda: None
            cls.server.server_close = lambda: None
            return cls.server
        output = io.StringIO()
        with patch.dict(cls.launcher.__globals__, {
                'urlopen': lambda *a, **kw: io.BytesIO(data),
                'ThreadingHTTPServer': serve,
                'webbrowser': type('Browser', (), {'open': staticmethod(lambda _: None)})}), \
                contextlib.redirect_stdout(output):
            cls.launcher(cls.sha, hashlib.sha256(data).hexdigest())
        # The patched run built the production handler without starting its loop.
        cls.thread = threading.Thread(target=ThreadingHTTPServer.serve_forever,
                                      args=(cls.server,), daemon=True)
        cls.thread.start()
        cls.port = cls.server.server_port
        cls.launch = output.getvalue().split('/__open/')[1].split()[0]
        status, headers, _ = cls.request('/__open/' + cls.launch)
        assert status == 303
        cls.cookie = headers['Set-Cookie'].split(';')[0]

    @classmethod
    def tearDownClass(cls):
        cls.server.shutdown()
        ThreadingHTTPServer.server_close(cls.server)
        cls.thread.join(timeout=2)

    @classmethod
    def request(cls, path, method='GET', authenticated=False, extra=None):
        conn = http.client.HTTPConnection('127.0.0.1', cls.port, timeout=3)
        headers = {'Cookie': cls.cookie} if authenticated else {}
        headers.update(extra or {})
        conn.request(method, path, headers=headers)
        response = conn.getresponse()
        result = response.status, dict(response.getheaders()), response.read()
        conn.close()
        return result

    def test_all_integrated_roots_and_shared_assets(self):
        for path, original in self.payloads.items():
            with self.subTest(path=path):
                status, _, body = self.request(path, authenticated=True)
                self.assertEqual(status, 200)
                if path.endswith('.html'):
                    self.assertIn(self.sha.encode(), body)
                    self.assertIn(original.replace(b'<body>', b''), body)
                else:
                    self.assertEqual(body, original)

    def test_media_seek_and_direct_download_headers(self):
        path = '/media/example.mp4'
        full = self.payloads[path]
        status, headers, data = self.request(path, authenticated=True)
        self.assertEqual(status, 200)
        self.assertEqual(headers['Accept-Ranges'], 'bytes')
        self.assertEqual(data, full)
        status, headers, data = self.request(path, authenticated=True,
                                            extra={'Range': 'bytes=10-29'})
        self.assertEqual(status, 206)
        self.assertEqual(headers['Content-Range'], 'bytes 10-29/1024')
        self.assertEqual(data, full[10:30])
        status, headers, data = self.request(path, authenticated=True,
                                            extra={'Range': 'bytes=-20'})
        self.assertEqual(status, 206)
        self.assertEqual(data, full[-20:])
        status, headers, _ = self.request(path, authenticated=True,
                                          extra={'Range': 'bytes=9999-'})
        self.assertEqual(status, 416)
        self.assertEqual(headers['Content-Range'], 'bytes */1024')
        self.assertEqual(self.request(path)[0], 401)

    def test_directory_and_query_routes(self):
        for route in ['/one-place/', '/teal/', '/lessons/01/',
                      '/one-place/index.html?area=money',
                      '/one-place/index.html?service=s001']:
            self.assertEqual(self.request(route, authenticated=True)[0], 200)

    def test_landing_starts_with_one_place(self):
        status, _, body = self.request('/__review/', authenticated=True)
        self.assertEqual(status, 200)
        self.assertIn(b'href="/one-place/"', body)
        self.assertIn(b'Historical Coach evidence', body)

    def test_anonymous_requests_and_wrong_tokens_fail(self):
        self.assertEqual(self.request('/one-place/')[0], 401)
        self.assertEqual(self.request('/__open/incorrect')[0], 401)

    def test_private_paths_and_traversal_are_not_served(self):
        for path in ['/.git/config', '/.env', '/private/draft.txt',
                     '/one-place/../.env', '/%2eenv']:
            self.assertEqual(self.request(path, authenticated=True)[0], 404)

    def test_cross_site_and_host_restrictions(self):
        for headers in [{'Host': 'untrusted.example'},
                        {'Origin': 'https://untrusted.example'},
                        {'Sec-Fetch-Site': 'cross-site'}]:
            self.assertEqual(self.request('/one-place/', authenticated=True,
                                          extra=headers)[0], 403)

    def test_read_only_and_security_headers(self):
        for method in ['POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']:
            self.assertEqual(self.request('/one-place/', method,
                                          authenticated=True)[0], 405)
        _, headers, _ = self.request('/one-place/', authenticated=True)
        self.assertEqual(headers['Cache-Control'], 'no-store')
        self.assertEqual(headers['Referrer-Policy'], 'no-referrer')
        self.assertIn("frame-ancestors 'none'", headers['Content-Security-Policy'])


if __name__ == '__main__':
    unittest.main()
