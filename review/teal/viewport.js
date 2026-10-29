(() => {
  'use strict';
  const frame = document.getElementById('preview');
  const size = document.getElementById('size');
  const zoom = document.getElementById('text-zoom');
  const noJs = document.getElementById('disable-js');
  const motion = document.getElementById('motion-off');
  const results = document.getElementById('results');
  function apply() {
    const [width, height] = size.value.split('x');
    frame.style.width = width + 'px'; frame.style.height = height + 'px';
    const doc = frame.contentDocument;
    if (!doc?.documentElement) return;
    // Compensate for this browser's classic scrollbar and the frame border.
    frame.style.width = (Number(width) + frame.offsetWidth - doc.documentElement.clientWidth) + 'px';
    doc.documentElement.style.fontSize = zoom.checked ? '200%' : '';
    const existing = doc.getElementById('qa-motion-override');
    if (motion.checked && !existing) {
      const link = doc.createElement('link'); link.id = 'qa-motion-override'; link.rel = 'stylesheet'; link.href = '../review/teal/motion-off.css'; doc.head.append(link);
    } else if (!motion.checked) existing?.remove();
    measure();
  }
  function measure() {
    const doc = frame.contentDocument;
    if (!doc?.documentElement) { results.textContent = 'Frame not ready.'; return; }
    const root = doc.documentElement;
    const nodes = [...doc.querySelectorAll('h1,h2,h3,p,summary,a,button,textarea')];
    const overflow = nodes.filter(el => { const r = el.getBoundingClientRect(); return r.width && (r.right > root.clientWidth + 1 || r.left < -1) && !el.classList.contains('skip-link') && !el.classList.contains('sr-only'); });
    const image = doc.querySelector('.cosmic-scene img');
    results.textContent = JSON.stringify({ viewport: root.clientWidth, document: root.scrollWidth, text200: zoom.checked, noJs: noJs.checked, overflow: overflow.map(x => x.tagName + ':' + x.textContent.trim().slice(0,45)), imageLoaded: !!image?.naturalWidth, selectedArtwork: image?.currentSrc.split('/').pop() }, null, 2);
  }
  frame.addEventListener('load', apply);
  size.addEventListener('change', apply); zoom.addEventListener('change', apply); motion.addEventListener('change', apply);
  noJs.addEventListener('change', () => { if (noJs.checked) frame.setAttribute('sandbox', 'allow-same-origin'); else frame.removeAttribute('sandbox'); frame.src = '../../teal/'; });
  document.getElementById('measure').addEventListener('click', measure);
})();
