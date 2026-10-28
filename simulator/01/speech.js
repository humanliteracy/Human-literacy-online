/* Optional browser dictation has separate, prominent external-service consent. */
(function () {
  'use strict';
  window.createBrowserDictation = function ({ beforeStart }) {
    const $ = id => document.getElementById(id);
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition = null, generation = 0, stopping = false, applyingResult = false;
    let sessionTimer = null, stopTimer = null;
    $('speechConsent').checked = false;
    function clearTimers() {
      clearTimeout(sessionTimer); clearTimeout(stopTimer);
      sessionTimer = stopTimer = null;
    }
    function controls() {
      $('speechStart').disabled = !Recognition || !$('speechConsent').checked || Boolean(recognition);
      $('speechStop').disabled = !recognition || stopping;
    }
    function cancel(message = 'Speech-to-text off. You can type instead.') {
      generation++;
      clearTimers(); stopping = false;
      const previous = recognition; recognition = null;
      if (previous) { try { previous.abort(); } catch (_) {} }
      controls(); $('speechStatus').textContent = message;
    }
    function reset() {
      $('speechConsent').checked = false;
      cancel();
    }
    // Typing is the dependable fallback. Never append a delayed provider result
    // after a visitor has edited or deleted the field while dictation was active.
    $('expressWords').addEventListener('input', () => {
      if (recognition && !applyingResult) cancel('Dictation stopped because you edited the text. Your writing is kept. You can type or explicitly start another phrase.');
    });
    $('speechConsent').addEventListener('change', () => {
      if (!$('speechConsent').checked) cancel('Speech consent withdrawn. Dictation stopped.');
      else { controls(); $('speechStatus').textContent = Recognition ? 'Press Dictate expression only if you choose the external browser speech service.' : 'Browser speech-to-text is unavailable. You can type or record locally.'; }
    });
    $('speechStart').addEventListener('click', () => {
      if (!Recognition || recognition || !$('speechConsent').checked || $('speechStart').closest('details:not([open])') || document.hidden) return;
      const request = ++generation;
      try {
        beforeStart();
        const current = new Recognition(); recognition = current;
        stopping = false;
        const received = new Set();
        let addedWords = false;
        current.lang = 'en-US'; current.interimResults = false; current.continuous = false;
        const active = () => request === generation && recognition === current && $('speechConsent').checked;
        current.onstart = () => {
          if (active() && !stopping) $('speechStatus').textContent = 'Listening through your browser speech service. It may stop after a pause. Stop or type anytime; each session lasts at most 60 seconds.';
        };
        current.onresult = event => {
          if (!active() || $('speechStart').closest('details:not([open])') || document.hidden) return;
          try {
            // Web Speech results are cumulative. resultIndex identifies the first
            // changed result; a final index is appended exactly once per session.
            // Identical words at DIFFERENT indices remain legitimate repetition.
            const first = Number.isInteger(event.resultIndex) ? Math.max(0, event.resultIndex) : 0;
            for (let index = first; index < event.results.length; index++) {
              const result = event.results[index];
              if (!result.isFinal || received.has(index)) continue;
              received.add(index);
              const text = typeof result[0]?.transcript === 'string' ? result[0].transcript.trim() : '';
              if (!text) continue;
              const field = $('expressWords'), separator = field.value && !/\s$/.test(field.value) ? ' ' : '';
              const combined = field.value + separator + text;
              if (field.value.length + separator.length >= field.maxLength) {
                cancel('The expression field is full. Your writing is kept. Edit or clear some text before dictating again.'); return;
              }
              field.value = combined.slice(0, field.maxLength);
              addedWords = true; applyingResult = true;
              try { field.dispatchEvent(new Event('input', { bubbles: true })); }
              finally { applyingResult = false; }
              if (combined.length > field.maxLength) {
                cancel('The expression reached its text limit. Review the last words; you can edit them by typing.'); return;
              }
              $('speechStatus').textContent = 'Dictation received. Review or edit your words. Nothing was sent to the manager or coach automatically.';
            }
          } catch (_) {
            cancel('The browser returned unreadable dictation. Your writing is kept. Try again or type instead.');
          }
        };
        current.onerror = event => {
          if (!active()) return;
          const errors = {
            'not-allowed': 'Speech input was declined or unavailable. Check browser microphone permission if you want to try again, or type instead.',
            'service-not-allowed': 'Speech input was declined or unavailable. The browser speech service may be restricted. You can type or record locally.',
            'audio-capture': 'No microphone was available for dictation. Check your device, then choose Dictate expression again or type instead.',
            'no-speech': 'No speech was recognized. Your writing is kept. Try a shorter phrase or type instead.',
            'network': 'The browser speech service could not be reached. Your writing is kept. Try again later or type instead.',
            'aborted': 'Browser dictation stopped before finishing. Your writing is kept. Choose Dictate expression again or type instead.',
            'language-not-supported': 'The browser speech service does not support the selected English language. You can type instead.',
          };
          cancel(errors[event?.error] || 'Speech input was declined or unavailable. Your writing is kept. Try again or type instead.');
        };
        current.onend = () => {
          if (!active()) return;
          generation++; clearTimers(); stopping = false;
          recognition = null; controls();
          $('speechStatus').textContent = addedWords
            ? 'Dictation ended. Review or edit the words. You can explicitly dictate another phrase or type.'
            : 'No words were returned. Your writing is kept. Try a shorter phrase or type instead.';
        };
        controls(); $('speechStatus').textContent = 'Starting browser dictation. If no words appear, stop and type instead.';
        sessionTimer = setTimeout(() => {
          if (active()) cancel('The 60-second dictation limit was reached. Your writing is kept. Review it, then start another phrase or type.');
        }, 60000);
        current.start();
      } catch (_) { cancel('Unable to start browser dictation. Your writing is kept. Check browser permission or type instead.'); }
    });
    $('speechStop').addEventListener('click', () => {
      if (!recognition || stopping) return;
      stopping = true; controls();
      $('speechStatus').textContent = 'Finishing dictation. Words received so far remain editable.';
      const current = recognition;
      stopTimer = setTimeout(() => {
        if (recognition === current) cancel('The browser did not finish dictation. Your writing is kept. You can start another phrase or type.');
      }, 2000);
      try { current.stop(); } catch (_) { cancel('Unable to finish browser dictation. Your writing is kept. You can type instead.'); }
    });
    $('speechPanel').addEventListener('toggle', () => { if (!$('speechPanel').open) reset(); });
    if (!Recognition) $('speechStatus').textContent = 'Browser speech-to-text is unavailable. You can type or record locally.';
    controls();
    return { cancel, reset };
  };
})();
