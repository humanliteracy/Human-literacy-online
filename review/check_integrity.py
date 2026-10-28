#!/usr/bin/env python3
"""Exercise rejection before binding or launching, without a network request."""
import contextlib
import io
import hashlib
import json
import zipfile
from pathlib import Path
import runpy
from types import SimpleNamespace
from unittest.mock import Mock, patch

run = runpy.run_path(str(Path(__file__).with_name('local_preview.py')),
                     run_name='review_import')['run']
for revision, checksum in [('main', '0' * 64), ('e' * 40, 'bad')]:
    try:
        run(revision, checksum)
    except ValueError:
        print('PASS: invalid revision/checksum rejected')
    else:
        raise AssertionError('Invalid identity accepted')

for data in [b'not an archive', b'PK\x03\x04']:
    server = Mock(side_effect=AssertionError('Must not bind a socket'))
    browser = Mock(side_effect=AssertionError('Must not open a browser'))
    # Patch the function's imported aliases, not urllib's original attributes.
    with patch.dict(run.__globals__, {
        'urlopen': lambda *_args, **_kwargs: io.BytesIO(data),
        'ThreadingHTTPServer': server,
        'webbrowser': SimpleNamespace(open=browser),
    }), contextlib.redirect_stdout(io.StringIO()):
        try:
            run('e' * 40, '0' * 64)
        except SystemExit as error:
            assert 'Integrity check failed' in str(error)
        else:
            raise AssertionError('Corrupt archive accepted')
    server.assert_not_called()
    browser.assert_not_called()
    print('PASS: corrupt/truncated bytes rejected before server/browser start')

# A valid outer source checksum must not bypass the nested packet checks.
for mode in ['tampered', 'traversal', 'missing-manifest']:
    nested = io.BytesIO()
    with zipfile.ZipFile(nested, 'w') as packet:
        packet.writestr('index.html', 'Synthetic review')
        manifest = {'index.html': hashlib.sha256(b'Synthetic review').hexdigest()}
        if mode == 'tampered':
            manifest['index.html'] = '0' * 64
        elif mode == 'traversal':
            manifest['../outside.html'] = '0' * 64
        if mode != 'missing-manifest':
            packet.writestr('packet-integrity.json', json.dumps(manifest))
    outer = io.BytesIO()
    revision = 'e' * 40
    with zipfile.ZipFile(outer, 'w') as source:
        prefix = 'Human-literacy-online-' + revision + '/'
        for n in range(1, 11):
            source.writestr(prefix + 'lessons/%02d/index.html' % n, 'Approved placeholder')
        source.writestr(prefix + 'review/evidence.zip', nested.getvalue())
    data = outer.getvalue()
    server = Mock(side_effect=AssertionError('Must not bind a socket'))
    browser = Mock(side_effect=AssertionError('Must not open a browser'))
    with patch.dict(run.__globals__, {
        'urlopen': lambda *_args, **_kwargs: io.BytesIO(data),
        'ThreadingHTTPServer': server,
        'webbrowser': SimpleNamespace(open=browser),
    }), contextlib.redirect_stdout(io.StringIO()):
        try:
            run(revision, hashlib.sha256(data).hexdigest())
        except SystemExit as error:
            assert 'Review packet integrity check failed' in str(error)
        else:
            raise AssertionError('Invalid nested packet accepted')
    server.assert_not_called()
    browser.assert_not_called()
    print('PASS: %s packet rejected before server/browser start' % mode)
