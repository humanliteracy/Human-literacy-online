#!/usr/bin/env python3
"""Exercise rejection before binding or launching, without a network request."""
import contextlib
import io
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
