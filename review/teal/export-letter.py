#!/usr/bin/env python3
"""Faithful plain-text export of the approved HTML letter; standard library only."""
from html.parser import HTMLParser
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[2]


class LetterText(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.active = False
        self.skip = 0
        self.parts = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'article' and 'founding-letter' in attrs.get('class', '').split():
            self.active = True
            return
        if not self.active:
            return
        if tag == 'sup':
            self.skip += 1
        if self.skip:
            return
        if tag in ('h1', 'p'):
            self.parts.append('\n\n')
        elif tag == 'br':
            self.parts.append('\n')

    def handle_endtag(self, tag):
        if not self.active:
            return
        if tag == 'sup':
            self.skip -= 1
            return
        if self.skip:
            return
        if tag in ('h1', 'p'):
            self.parts.append('\n\n')
        elif tag == 'article':
            self.active = False

    def handle_data(self, data):
        if self.active and not self.skip:
            # Source indentation is whitespace; explicit <br> boundaries are kept.
            self.parts.append(re.sub(r'\s+', ' ', data))


def extract(html):
    parser = LetterText()
    parser.feed(html)
    text = ''.join(parser.parts)
    lines = [re.sub(r'[ \t]+', ' ', line).strip() for line in text.splitlines()]
    return re.sub(r'\n{3,}', '\n\n', '\n'.join(lines)).strip() + '\n'


def main():
    expected = extract((ROOT / 'teal/index.html').read_text(encoding='utf-8'))
    target = ROOT / 'docs/teal/founding-letter.txt'
    if '--check' in sys.argv:
        if target.read_text(encoding='utf-8') != expected:
            raise SystemExit('Plain-text letter differs from the approved HTML export.')
        print('Plain-text letter matches HTML with paragraph/line breaks and no footnote digits.')
    else:
        target.write_text(expected, encoding='utf-8')
        print('Wrote docs/teal/founding-letter.txt from the unchanged HTML letter.')


if __name__ == '__main__':
    main()
