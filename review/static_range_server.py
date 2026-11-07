#!/usr/bin/env python3
"""Local-only static test server: support MP4 byte ranges like the private preview.

Used by Playwright in CI. This serves repository files on loopback only and is
NOT an authenticated founder preview or public deployment server.
"""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlsplit
import os
import re
import sys


class Handler(SimpleHTTPRequestHandler):
    def send_head(self):
        self._range = None
        if not urlsplit(self.path).path.lower().endswith('.mp4'):
            return super().send_head()
        path = self.translate_path(self.path)
        if not os.path.isfile(path):
            return super().send_head()
        source = open(path, 'rb')
        size = os.fstat(source.fileno()).st_size
        raw = self.headers.get('Range')
        start, end = 0, size - 1
        status = 200
        if raw:
            match = re.fullmatch(r'bytes=(\d*)-(\d*)', raw)
            if not match or not any(match.groups()):
                source.close()
                return self.bad_range(size)
            start = int(match[1]) if match[1] else max(0, size - int(match[2]))
            end = min(int(match[2]), size - 1) if match[1] and match[2] else size - 1
            if start >= size or start > end:
                source.close()
                return self.bad_range(size)
            status = 206
        self._range = (start, end)
        self.send_response(status)
        self.send_header('Content-Type', 'video/mp4')
        self.send_header('Content-Length', str(end - start + 1))
        self.send_header('Accept-Ranges', 'bytes')
        if status == 206:
            self.send_header('Content-Range', f'bytes {start}-{end}/{size}')
        self.send_header('Cache-Control', 'no-store')
        self.end_headers()
        return source

    def bad_range(self, size):
        self.send_response(416)
        self.send_header('Content-Range', f'bytes */{size}')
        self.send_header('Accept-Ranges', 'bytes')
        self.send_header('Content-Length', '0')
        self.end_headers()
        return None

    def copyfile(self, source, target):
        if self._range is None:
            return super().copyfile(source, target)
        start, end = self._range
        source.seek(start)
        remaining = end - start + 1
        while remaining > 0:
            chunk = source.read(min(128 * 1024, remaining))
            if not chunk:
                break
            target.write(chunk)
            remaining -= len(chunk)


if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8765
    server = ThreadingHTTPServer(('127.0.0.1', port), Handler)
    print(f'CI static range server listening on 127.0.0.1:{port}', flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
