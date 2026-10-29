/* TEAL release candidate. Progressive enhancement only. No network requests or persistence. */
(() => {
  'use strict';
  const status = document.getElementById('share-status');
  const share = document.getElementById('share-invitation');
  const copy = document.getElementById('copy-invitation');
  const manual = document.getElementById('manual-copy');
  const textField = document.getElementById('invitation-text');
  const invitation = document.getElementById('share-copy')?.textContent.trim();
  if (!status || !share || !copy || !manual || !textField || !invitation) return;

  // Only the actual HTTPS public route shares the fixed canonical address.
  // This prepares release behavior without asserting publication approval.
  const canonicalUrl = 'https://humanliteracy.github.io/Human-literacy-online/teal/';
  const atCanonicalLocation = location.origin === 'https://humanliteracy.github.io'
    && ['/Human-literacy-online/teal/', '/Human-literacy-online/teal/index.html'].includes(location.pathname);
  const shareText = atCanonicalLocation ? `${invitation}\n${canonicalUrl}` : invitation;
  textField.value = shareText;
  share.hidden = false;
  copy.hidden = false;

  function manualCopy() {
    manual.hidden = false;
    textField.focus();
    textField.select();
    status.textContent = 'Automatic copying is unavailable. Select and copy the invitation below.'
      + (atCanonicalLocation ? '' : ' No preview address is included.');
  }

  async function copyInvitation() {
    try {
      if (!navigator.clipboard?.writeText) { manualCopy(); return; }
      await navigator.clipboard.writeText(shareText);
      manual.hidden = true;
      status.textContent = atCanonicalLocation ? 'Invitation and public address copied.' : 'Invitation copied. No preview address was included.';
    } catch { manualCopy(); }
  }

  copy.addEventListener('click', copyInvitation);
  share.addEventListener('click', async () => {
    if (!navigator.share) { await copyInvitation(); return; }
    try {
      const data = { title: 'TEAL — A World Worth Building', text: invitation };
      if (atCanonicalLocation) data.url = canonicalUrl;
      await navigator.share(data);
      status.textContent = atCanonicalLocation ? 'Sharing window closed.' : 'Sharing window closed. This preview shared text only, without a preview address.';
    } catch (error) {
      if (error.name === 'AbortError') { status.textContent = 'Sharing cancelled. Nothing else was sent by this page.'; return; }
      manualCopy();
    }
  });

  // Let ordinary links and browser history work; add reliable focus after entry.
  for (const link of document.querySelectorAll('a[href="#message-title"]')) {
    link.addEventListener('click', () => {
      const heading = document.getElementById('message-title');
      heading?.focus({ preventScroll: true });
    });
  }
})();
