# Independent local review

This reuses the approved Issue #4 loopback approach and the founder's already-tested Chromebook Linux/Python route. No Codex widget, GitHub login, npm, cloud host or paid dependency is needed to open it.

The founder handoff provides a short copy/paste Terminal block for one **full immutable candidate SHA**, its archive SHA-256 and this wrapper's SHA-256. It anonymously fetches `review/local_preview.py` from that exact public revision, verifies it, then calls `run(revision, archive_sha256)`. The wrapper verifies a fresh public archive download before opening any listener. Each launch needs internet for roughly 40 MB. It writes no extracted site files or learner responses to disk.

For maintainers with the wrapper already present:

```sh
python3 review/local_preview.py FULL_CANDIDATE_SHA ARCHIVE_SHA256
# Automated negative integrity checks (no network/listener/browser):
python3 review/check_integrity.py
```

Python 3.9+ standard library only. Keep Terminal running, open the printed private launch link in Chrome on the same computer, choose Open the simulator, then Help me draft. Confirm the unreleased banner and full source SHA. Use synthetic wording. Ctrl+C stops the listener and expires its session. No LAN/public bind option exists. Browser dictation remains separate opt-in and may contact a browser speech provider; leave it off for this review.

If the automatic browser launch fails, copy the current printed launch link into Chrome. If the checksum fails, stop and report it; never remove or replace a checksum to bypass an error. If ChromeOS cannot reach its Linux loopback listener, report that rather than opening router ports or changing the bind address.

The source is already public; this delivery route requires no new repository permissions, workflow, artifact upload, service account or billing change. The private Master Project Register, personal answers, raw audio, `.git`, credentials and dependency trees are not served. This local review mechanism is separate from public release. Founder acceptance of PR #2 has now been granted; the [release checklist](../docs/release-checklist.md) records the accepted code and the still-required operational merge/publication authorization. Existing packets and pinned launcher blocks retain their historical source revisions; they must not be relabelled as a newer candidate. Nothing here merges or deploys.

## OP-104 integrated founder preview

The same authenticated, read-only loopback launcher also serves the committed
`one-place/`, `teal/` and `shared/` directories. The last is required for the
ten lessons’ optional local learning records. The landing page starts at One Place
and shows the full immutable source SHA on every HTML page. Query-string routes
remain on the same private origin. No public staging or deployment is involved.

Use the launcher file, archive and checksums from **one identical revision**.
Do not reuse an old pinned Coach launcher for this integrated build. The nested
Coach evidence packet remains historical evidence; it is not an OP-104 test report.
Trinity RC2 remains a separate private artifact and is not included here.

Maintainer checks: `python3 review/check_integrity.py` and
`python3 -m unittest discover -s review -p 'test_local_preview.py'`. The latter
uses a synthetic archive and a real loopback listener to check all integrated
roots, shared assets, query routes and access restrictions, without network calls.
Physical Chromebook, phone, screen reader, print/export/privacy acceptance and
final founder signoff remain separate gates. Never publish a local launch token.
