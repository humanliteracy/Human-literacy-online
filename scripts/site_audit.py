#!/usr/bin/env python3
"""Human Literacy static-site quality gate. No external dependencies."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import sys

ROOT = Path(__file__).resolve().parents[1]
SKIP = {".git", "node_modules", ".venv", "playwright-report", "test-results"}
class Audit(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.links=[]; self.title=False; self.lang=False; self.main=False; self.heading=False
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if tag=="html" and a.get("lang"): self.lang=True
        if tag=="title": self.title=True
        if tag=="main": self.main=True
        if tag=="h1": self.heading=True
        if tag in ("a","script","link","img","source"):
            key="href" if tag in ("a","link") else "src"
            if a.get(key): self.links.append((tag,a[key]))
def check():
    errors=[]; warnings=[]; pages=sorted(p for p in ROOT.rglob("*.html") if not any(x in SKIP for x in p.parts))
    for page in pages:
        relative=page.relative_to(ROOT)
        try:
            html=page.read_text(encoding="utf-8")
            parser=Audit();parser.feed(html)
        except Exception as exc:
            errors.append(f"{relative}: unreadable/invalid HTML: {exc}");continue
        for ok,name in [(parser.lang,"html lang"),(parser.title,"title"),(parser.main,"main landmark"),(parser.heading,"h1 heading")]:
            if not ok: warnings.append(f"{relative}: missing {name}")
        for tag,link in parser.links:
            if link.startswith(("#","mailto:","tel:","data:","javascript:","//")):continue
            parsed=urlsplit(link)
            if parsed.scheme:continue
            dest=unquote(parsed.path)
            if not dest:continue
            target=(ROOT / dest.lstrip("/") if dest.startswith("/") else page.parent / dest)
            if target.is_dir():target=target/"index.html"
            if not target.exists():errors.append(f"{relative}: broken local {tag} link: {link}")
    print(f"Audited {len(pages)} HTML pages")
    for w in warnings:print("WARNING:",w)
    for e in errors:print("ERROR:",e)
    print(f"Result: {len(errors)} broken links/errors, {len(warnings)} accessibility/structure warnings")
    return 1 if errors else 0
if __name__=="__main__":sys.exit(check())
