/* Optional browser dictation has separate, prominent external-service consent. */
(function () {
  'use strict';
  window.createBrowserDictation = function ({ beforeStart }) {
    const $ = id => document.getElementById(id);
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition = null, generation = 0;
    $('speechConsent').checked = false;
    function controls() {
      $('speechStart').disabled = !Recognition || !$('speechConsent').checked || Boolean(recognition);
      $('speechStop').disabled = !recognition;
    }
    function cancel(message = 'Speech-to-text off. You can type instead.') {
      generation++;
      const previous = recognition; recognition = null;
      if (previous) { try { previous.abort(); } catch (_) {} }
      controls(); $('speechStatus').textContent = message;
    }
    function reset() {
      $('speechConsent').checked = false;
      cancel();
    }
    $('speechConsent').addEventListener('change', () => {
      if (!$('speechConsent').checked) cancel('Speech consent withdrawn. Dictation stopped.');
      else { controls(); $('speechStatus').textContent = Recognition ? 'Press Dictate expression only if you choose the external browser speech service.' : 'Browser speech-to-text is unavailable. You can type or record locally.'; }
    });
    $('speechStart').addEventListener('click', () => {
      if (!Recognition || recognition || !$('speechConsent').checked || !$('speechPanel').open || !$('expressStudio').open) return;
      beforeStart();
      const request = ++generation;
      try {
        const current = new Recognition(); recognition = current;
        current.lang = 'en-US'; current.interimResults = false; current.continuous = false;
        current.onresult = event => {
          if (request !== generation || !$('speechConsent').checked) return;
          const text = event.results[0][0].transcript;
          $('expressWords').value = ($('expressWords').value + ($('expressWords').value ? ' ' : '') + text).slice(0, 2000);
          $('expressWords').dispatchEvent(new Event('input', { bubbles: true }));
          $('speechStatus').textContent = 'Dictation received. Review or edit your words. Nothing was sent to the manager or coach automatically.';
        };
        current.onerror = () => {
          if (request === generation) cancel('Speech input was declined or unavailable. You can type or record locally.');
        };
        current.onend = () => {
          if (request !== generation) return;
          generation++;
          recognition = null; controls();
          if ($('speechStatus').textContent.startsWith('Listening')) $('speechStatus').textContent = 'Dictation stopped. Review any words entered, or type instead.';
        };
        controls(); $('speechStatus').textContent = 'Listening through your browser speech service. Stop or withdraw consent anytime.';
        current.start();
      } catch (_) { cancel('Unable to start browser dictation. You can type or record locally.'); }
    });
    $('speechStop').addEventListener('click', () => {
      try { recognition?.stop(); } catch (_) { cancel(); }
    });
    $('speechPanel').addEventListener('toggle', () => { if (!$('speechPanel').open) reset(); });
    if (!Recognition) $('speechStatus').textContent = 'Browser speech-to-text is unavailable. You can type or record locally.';
    controls();
    return { cancel, reset };
  };
})();
