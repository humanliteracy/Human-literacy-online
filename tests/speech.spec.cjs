const { reveal } = require('./review-helpers.cjs');
const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  page.errors = [];
  page.on('pageerror', e => page.errors.push(e.message));
  // No real browser provider is contacted. These tests exercise API lifecycle only.
  await page.addInitScript(() => {
    window.speechInstances = [];
    window.speechStarts = 0;
    window.speechAborts = 0;
    window.SpeechRecognition = class {
      constructor() { speechInstances.push(this); }
      start() {
        speechStarts++;
        if (window.throwSpeechStart) throw new Error('Synthetic start failure');
        if (window.denySpeech) this.onerror({ error: 'not-allowed' });
        else this.onstart?.();
      }
      stop() { if (!window.hangSpeechStop) this.onend?.(); }
      abort() { speechAborts++; }
    };
    window.speechResults = (entries, resultIndex = 0, instance = speechInstances.at(-1)) => {
      const results = entries.map(entry => {
        const result = [{ transcript: typeof entry === 'string' ? entry : entry.text }];
        result.isFinal = typeof entry === 'string' || entry.final;
        return result;
      });
      instance.onresult({ resultIndex, results });
    };
    window.emitSpeech = text => speechResults([text]);
  });
  await page.goto('/simulator/01/');
  await page.locator('#openPractice').click();
  await reveal(page, 'speechPanel');
});
test.afterEach(async ({ page }) => { expect(page.errors).toEqual([]); });

test('browser dictation has prominent separate consent and cannot start just by opening it', async ({ page }) => {
  await expect(page.locator('#speechPrivacy')).toContainText('send live speech');
  await expect(page.locator('#speechConsent')).not.toBeChecked();
  await expect(page.locator('#speechStart')).toBeDisabled();
  await reveal(page, 'recordingPanel');
  await page.locator('#recordConsent').check();
  await expect(page.locator('#speechStart')).toBeDisabled();
  expect(await page.evaluate(() => speechStarts)).toBe(0);
  await page.locator('#speechConsent').check();
  expect(await page.evaluate(() => speechInstances.length)).toBe(0);
  await expect(page.locator('#speechStart')).toBeEnabled();
});

test('dictation appends reviewable expression and never starts coaching or sends a reply', async ({ page }) => {
  await page.locator('#expressWords').fill('My first words.');
  await page.locator('#speechConsent').check();
  await page.locator('#speechStart').click();
  await page.evaluate(() => emitSpeech('The expectations are unreasonable. I quit'));
  await expect(page.locator('#expressWords')).toHaveValue('My first words. The expectations are unreasonable. I quit');
  await expect(page.locator('#coachUnderstanding')).toBeHidden();
  await expect(page.locator('#yourReply')).toHaveValue('');
  await expect(page.locator('#sceneProgress')).toHaveText('SCENE 1 OF 2');
  await expect(page.locator('#recordConsent')).not.toBeChecked();
  await page.locator('#speechStop').click();
  await page.evaluate(() => emitSpeech('A result after the session ended'));
  await expect(page.locator('#expressWords')).toHaveValue('My first words. The expectations are unreasonable. I quit');
  await expect(page.locator('#speechStart')).toBeEnabled();
  await expect(page.locator('#speechStop')).toBeDisabled();
});

for (const action of ['withdraw consent', 'close speech option', 'close tools', 'review goal', 'close private practice', 'clear private practice', 'hide page']) {
  test(`${action} cancels browser dictation and ignores late results`, async ({ page }) => {
    await page.locator('#speechConsent').check();
    await page.locator('#speechStart').click();
    if (action === 'withdraw consent') await page.locator('#speechConsent').uncheck();
    if (action === 'close speech option') await page.locator('#speechPanel > summary').click();
    if (action === 'close tools') await page.locator('#practiceTools > summary').click();
    if (action === 'review goal') {
      await page.locator('#expressWords').fill('The expectations are unreasonable. I quit');
      await page.locator('#coachUnderstand').click();
    }
    if (action === 'close private practice') await page.locator('#expressStudio > summary').click();
    if (action === 'clear private practice') await page.locator('#practiceClear').click();
    if (action === 'hide page') await page.evaluate(() => {
      Object.defineProperty(document, 'hidden', { configurable: true, value: true });
      document.dispatchEvent(new Event('visibilitychange'));
    });
    await expect.poll(() => page.evaluate(() => speechAborts)).toBe(1);
    await page.evaluate(() => emitSpeech('A stale private transcription'));
    await expect(page.locator('#expressWords')).toHaveValue(action === 'review goal' ? 'The expectations are unreasonable. I quit' : '');
    await expect(page.locator('#speechStop')).toBeDisabled();
  });
}

test('speech permission or service denial leaves the text workflow usable', async ({ page }) => {
  await page.evaluate(() => { window.denySpeech = true; });
  await page.locator('#speechConsent').check();
  await page.locator('#speechStart').click();
  await expect(page.locator('#speechStatus')).toContainText('declined or unavailable');
  await page.locator('#expressWords').fill('I need more time because the scope changed');
  await page.locator('#coachUnderstand').click();
  await expect(page.locator('#coachPath')).toHaveValue('scope');
});

test('unsupported speech recognition keeps writing and local recording available', async ({ page }) => {
  await page.addInitScript(() => { window.SpeechRecognition = undefined; window.webkitSpeechRecognition = undefined; });
  await page.reload();
  await page.locator('#openPractice').click();
  await reveal(page, 'speechPanel');
  await page.locator('#speechConsent').check();
  await expect(page.locator('#speechStart')).toBeDisabled();
  await expect(page.locator('#speechStatus')).toContainText('unavailable');
  await reveal(page, 'recordingPanel');
  await page.locator('#recordConsent').check();
  await expect(page.locator('#recordStart')).toBeEnabled();
  await page.locator('#expressWords').fill('Written fallback');
  await expect(page.locator('#expressWords')).toHaveValue('Written fallback');
});

test('starting local recording cancels browser dictation', async ({ page, context }) => {
  await context.grantPermissions(['microphone']);
  await page.locator('#speechConsent').check();
  await page.locator('#speechStart').click();
  await reveal(page, 'recordingPanel');
  await page.locator('#recordConsent').check();
  await page.locator('#recordStart').click();
  await expect(page.locator('#recordStatus')).toContainText('Recording…');
  expect(await page.evaluate(() => speechAborts)).toBe(1);
  await page.evaluate(() => emitSpeech('Late browser transcript'));
  await expect(page.locator('#expressWords')).toHaveValue('');
  await page.locator('#recordDelete').click();
});

test('final result indices are appended once; cumulative events and interim results never duplicate words', async ({ page }) => {
  await page.locator('#speechConsent').check();
  await page.locator('#speechStart').click();
  await page.evaluate(() => speechResults([{ text: 'An unfinished phrase', final: false }]));
  await expect(page.locator('#expressWords')).toHaveValue('');
  await page.evaluate(() => speechResults(['First clause.']));
  await expect(page.locator('#expressWords')).toHaveValue('First clause.');
  await page.evaluate(() => speechResults(['First clause.', 'Second clause.'], 0));
  await page.evaluate(() => speechResults(['First clause.', 'Second clause.'], 1));
  await expect(page.locator('#expressWords')).toHaveValue('First clause. Second clause.');
  // Repeated words at a new final index can be intentional: do not remove them.
  await page.evaluate(() => speechResults(['First clause.', 'Second clause.', 'Second clause.'], 2));
  await expect(page.locator('#expressWords')).toHaveValue('First clause. Second clause. Second clause.');
  await page.evaluate(() => speechInstances.at(-1).onend());
  await expect(page.locator('#speechStatus')).toContainText('Dictation ended');
  await page.evaluate(() => speechResults(['Late results'], 0));
  await expect(page.locator('#expressWords')).toHaveValue('First clause. Second clause. Second clause.');
  expect(await page.evaluate(() => speechStarts)).toBe(1);
});

test('one event can contain several final results, with empty results safely ignored', async ({ page }) => {
  await page.locator('#speechConsent').check();
  await page.locator('#speechStart').click();
  await page.evaluate(() => speechResults(['I need support.', '  ', 'I want to discuss options.']));
  await expect(page.locator('#expressWords')).toHaveValue('I need support. I want to discuss options.');
  await expect(page.locator('#coachUnderstanding')).toBeHidden();
  await expect(page.locator('#yourReply')).toHaveValue('');
});

for (const edit of ['My edited wording.', '']) {
  test(`typing or deleting during recognition preserves the edited field (${edit ? 'edit' : 'delete'})`, async ({ page }) => {
    await page.locator('#speechConsent').check();
    await page.locator('#speechStart').click();
    await page.evaluate(() => emitSpeech('First provider words.'));
    await page.locator('#expressWords').fill(edit);
    await expect(page.locator('#speechStatus')).toContainText('because you edited the text');
    await expect(page.locator('#speechStart')).toBeEnabled();
    await page.evaluate(() => speechResults(['First provider words.', 'A delayed addition.'], 1));
    await expect(page.locator('#expressWords')).toHaveValue(edit);
    expect(await page.evaluate(() => speechAborts)).toBe(1);
    await page.locator('#speechStart').click();
    await page.evaluate(() => emitSpeech('New explicit phrase.'));
    await expect(page.locator('#expressWords')).toHaveValue(edit + (edit ? ' ' : '') + 'New explicit phrase.');
  });
}

for (const interim of [false, true]) {
  test(`provider ending without final words offers an honest typing fallback (${interim ? 'interim only' : 'no results'})`, async ({ page }) => {
    await page.locator('#expressWords').fill('My existing writing.');
    await page.locator('#speechConsent').check();
    await page.locator('#speechStart').click();
    if (interim) await page.evaluate(() => speechResults([{ text: 'Not final', final: false }]));
    await page.evaluate(() => speechInstances.at(-1).onend());
    await expect(page.locator('#speechStatus')).toContainText('No words were returned');
    await expect(page.locator('#speechStatus')).toContainText('type instead');
    await expect(page.locator('#expressWords')).toHaveValue('My existing writing.');
    await expect(page.locator('#speechStart')).toBeEnabled();
    await expect(page.locator('#speechStop')).toBeDisabled();
    expect(await page.evaluate(() => speechStarts)).toBe(1);
  });
}

for (const [code, explanation] of [
  ['no-speech', 'No speech was recognized'],
  ['network', 'could not be reached'],
  ['not-allowed', 'declined or unavailable'],
  ['service-not-allowed', 'may be restricted'],
  ['audio-capture', 'No microphone was available'],
  ['aborted', 'stopped before finishing'],
  ['language-not-supported', 'does not support'],
]) {
  test(`provider error ${code} keeps writing and allows explicit retry without automatic restart`, async ({ page }) => {
    await page.locator('#expressWords').fill('Writing to keep.');
    await page.locator('#speechConsent').check();
    await page.locator('#speechStart').click();
    await page.evaluate(code => speechInstances.at(-1).onerror({ error: code }), code);
    await expect(page.locator('#speechStatus')).toContainText(explanation);
    await page.evaluate(() => { speechInstances.at(-1).onend(); emitSpeech('Stale after error'); });
    await expect(page.locator('#speechStatus')).toContainText(explanation);
    await expect(page.locator('#expressWords')).toHaveValue('Writing to keep.');
    await expect(page.locator('#speechStart')).toBeEnabled();
    await expect(page.locator('#speechStop')).toBeDisabled();
    expect(await page.evaluate(() => speechStarts)).toBe(1);
    await page.locator('#speechStart').click();
    await page.evaluate(() => emitSpeech('A retried phrase.'));
    await expect(page.locator('#expressWords')).toHaveValue('Writing to keep. A retried phrase.');
    expect(await page.evaluate(() => speechStarts)).toBe(2);
  });
}

test('a thrown startup failure can recover without stale callbacks appending old text', async ({ page }) => {
  await page.evaluate(() => { window.throwSpeechStart = true; });
  await page.locator('#speechConsent').check();
  await page.locator('#speechStart').click();
  await expect(page.locator('#speechStatus')).toContainText('Unable to start');
  await expect(page.locator('#speechStart')).toBeEnabled();
  await page.evaluate(() => { window.throwSpeechStart = false; });
  await page.locator('#speechStart').click();
  await page.evaluate(() => speechResults(['Old failed session'], 0, speechInstances[0]));
  await expect(page.locator('#expressWords')).toHaveValue('');
  await page.evaluate(() => emitSpeech('Current session'));
  await expect(page.locator('#expressWords')).toHaveValue('Current session');
});

test('a browser that never finishes Stop is canceled after a bounded wait', async ({ page }) => {
  await page.clock.install();
  await page.evaluate(() => { window.hangSpeechStop = true; });
  await page.locator('#speechConsent').check();
  await page.locator('#speechStart').click();
  await page.evaluate(() => emitSpeech('Keep these words.'));
  await page.locator('#speechStop').click();
  await expect(page.locator('#speechStart')).toBeDisabled();
  await expect(page.locator('#speechStop')).toBeDisabled();
  await page.clock.fastForward(2000);
  await expect(page.locator('#speechStatus')).toContainText('did not finish');
  await expect(page.locator('#speechStart')).toBeEnabled();
  await page.evaluate(() => { emitSpeech('Late words'); speechInstances.at(-1).onend(); });
  await expect(page.locator('#expressWords')).toHaveValue('Keep these words.');
  expect(await page.evaluate(() => speechAborts)).toBe(1);
});

test('a hung active dictation is canceled at 60 seconds with no automatic restart', async ({ page }) => {
  await page.clock.install();
  await page.locator('#speechConsent').check();
  await page.locator('#speechStart').click();
  await page.clock.fastForward(60000);
  await expect(page.locator('#speechStatus')).toContainText('60-second');
  await expect(page.locator('#speechStart')).toBeEnabled();
  await page.evaluate(() => emitSpeech('Late after limit'));
  await expect(page.locator('#expressWords')).toHaveValue('');
  expect(await page.evaluate(() => [speechStarts, speechAborts])).toEqual([1, 1]);
});

test('rapid duplicate starts produce only one recognition session', async ({ page }) => {
  await page.locator('#speechConsent').check();
  await page.evaluate(() => {
    document.querySelector('#speechStart').dispatchEvent(new MouseEvent('click'));
    document.querySelector('#speechStart').dispatchEvent(new MouseEvent('click'));
  });
  expect(await page.evaluate(() => [speechStarts, speechInstances.length])).toEqual([1, 1]);
  await page.evaluate(() => emitSpeech('One session.'));
  await expect(page.locator('#expressWords')).toHaveValue('One session.');
});

test('unreadable provider events preserve writing and recover to typing', async ({ page }) => {
  await page.locator('#expressWords').fill('Keep this writing.');
  await page.locator('#speechConsent').check();
  await page.locator('#speechStart').click();
  await page.evaluate(() => speechInstances.at(-1).onresult({ resultIndex: 0 }));
  await expect(page.locator('#speechStatus')).toContainText('unreadable');
  await expect(page.locator('#expressWords')).toHaveValue('Keep this writing.');
  await expect(page.locator('#speechStart')).toBeEnabled();
});

test('a late start event cannot replace the status while Stop is finalizing', async ({ page }) => {
  await page.clock.install();
  await page.evaluate(() => { window.hangSpeechStop = true; });
  await page.locator('#speechConsent').check();
  await page.locator('#speechStart').click();
  await page.locator('#speechStop').click();
  await page.evaluate(() => speechInstances.at(-1).onstart());
  await expect(page.locator('#speechStatus')).toContainText('Finishing dictation');
  await expect(page.locator('#speechStop')).toBeDisabled();
  await page.clock.fastForward(2000);
  await expect(page.locator('#speechStart')).toBeEnabled();
});

test('the text limit preserves existing writing without adding empty padding or late speech', async ({ page }) => {
  const limit = await page.locator('#expressWords').evaluate(n => n.maxLength);
  const original = 'x'.repeat(limit - 1);
  await page.locator('#expressWords').fill(original);
  await page.locator('#speechConsent').check();
  await page.locator('#speechStart').click();
  await page.evaluate(() => emitSpeech('Words with no remaining space'));
  await expect(page.locator('#speechStatus')).toContainText('field is full');
  await expect(page.locator('#expressWords')).toHaveValue(original);
  await page.evaluate(() => speechResults(['Words with no remaining space', 'Late result'], 1));
  await expect(page.locator('#expressWords')).toHaveValue(original);
  await expect(page.locator('#speechStart')).toBeEnabled();
});

test('advancing from dictated words cancels the active service before goal review', async ({ page }) => {
  await page.locator('#speechConsent').check();
  await page.locator('#speechStart').click();
  await page.evaluate(() => emitSpeech('The expectations are unreasonable. I quit'));
  expect(await page.evaluate(() => speechAborts)).toBe(0);
  await page.locator('#coachUnderstand').click();
  await expect(page.locator('#coachPath')).toHaveValue('resign');
  expect(await page.evaluate(() => speechAborts)).toBe(1);
  await page.evaluate(() => speechResults(['The expectations are unreasonable. I quit', 'Late hidden words'], 1));
  await expect(page.locator('#expressWords')).toHaveValue('The expectations are unreasonable. I quit');
  await expect(page.locator('#speechStop')).toBeDisabled();
});
